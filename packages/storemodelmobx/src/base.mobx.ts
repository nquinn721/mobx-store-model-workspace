import { Service } from './service';
import { action, observable, toJS, runInAction } from 'mobx';
import pluralize from 'pluralize';
import { EventEmitter } from './EventEmitter';
import { ParamConstructor, SearchParams } from './paramConstructor';

interface WaitingToSave {
  type: string;
  data: object;
}

interface Model {
  id: number;
}

export class Store extends EventEmitter {
  route: string = '';
  getParams: any;
  waitingToSave: WaitingToSave[] = [];
  logging: boolean = false;

  // DATA
  @observable objects: any[] = [];
  @observable current: any;

  // LIFECYCLE
  @observable hydrated: boolean = false; // Hydrate from localstorage
  @observable initLoaded: boolean = false; // Load from server
  @observable ready: boolean = false; // Load and Hydrate are done

  // CRUD
  @observable fetchingData: boolean = false;
  @observable fetchFailed: boolean = false;
  @observable fetchSuccess: boolean = false;
  defaultFetchFailedMessage: string = 'Failed to load ';

  @observable savingData: boolean = false;
  @observable saveSuccess: boolean = false;
  @observable saveFailed: boolean = false;

  @observable deletingData: boolean = false;
  @observable deleteSuccess: boolean = false;
  @observable deleteFailed: boolean = false;
  deleteFailedMessage: string = '';
  private deleteTimer: any = false;

  constructor(public readonly model: any) {
    super();
    this.current = new model({});
    if (this.current.route) {
      this.route = this.current.route;
      this.defaultFetchFailedMessage += pluralize(this.route.replace(/\W/g, ' '));
    } else throw new Error(`No route defined for model '${model.name}'`);
    if (this.current.getParams) this.getParams = this.current.getParams;
  }

  @action
  async refreshData() {
    await this.initLoad();
  }

  @action
  async retrySave() {
    this.waitingToSave.forEach((v: WaitingToSave, i: number) => {
      if (v.type === 'create') this.create(v.data);
      else this.update(v.data);
    });
    this.waitingToSave = [];
  }

  @action.bound
  async initLoad() {
    const o = await this.getData();
    if (!o.error) this.objects = o;
    this.initLoaded = true;
    this.afterLoad();
    this.checkIsLoaded();
  }
  @action.bound
  setHydrated() {
    this.hydrated = true;
    this.afterHydrate();
    this.checkIsLoaded();
  }
  @action checkIsLoaded() {
    if (this.hydrated && this.initLoaded) {
      this.ready = true;
      this.isReady();
    }
  }

  afterLoad() {
    this.emit('after load');
  }
  isReady(): void {
    this.emit('ready');
  }
  afterHydrate(): void {
    this.emit('after hydrate');
  }

  @action
  async getData(url = '') {
    this.fetchFailed = false;
    this.fetchingData = true;
    this.fetchSuccess = false;
    let data = await Service.get(url || this.route + this.constructGetParams(this.getParams));

    runInAction(() => {
      if (!data.error) {
        data = data.map((v: object) => {
          const m = new this.model(this.cleanObject(v));
          m.convertFromLoad();
          return m;
        });
        this.fetchSuccess = true;
      } else this.fetchFailed = true;
      this.fetchingData = false;
    });
    return data;
  }

  @action
  async create(data: any) {
    let m;

    this.savingData = true;
    if (!this.waitingToSave.length) this.saveFailed = false;
    if (data.convertForSave) data = data.convertForSave();

    const d = await Service.post(this.route, data);
    if (!d.error) {
      m = new this.model(d);
      m.convertFromLoad();
      this.addObject(m);
      this.setSaveSuccess();
    } else this.setSaveFailed({ type: 'create', data });

    this.savingData = false;
    return m || d;
  }

  @action
  async update(data: any) {
    this.savingData = true;
    if (!this.waitingToSave.length) this.saveFailed = false;

    data = data.convertForSave();

    const d = await Service.update(this.route, toJS(data, { recurseEverything: true }));

    if (!d.error) this.setSaveSuccess();
    else this.setSaveFailed({ type: 'update', data });

    this.savingData = false;
    return d;
  }

  @action
  async delete(id: number) {
    this.deleteFailed = false;
    this.deleteSuccess = false;
    this.deletingData = true;
    this.deleteFailedMessage = '';
    clearInterval(this.deleteTimer);

    const d = await Service.delete(this.route, id);
    this.deletingData = false;

    if (!d.error) {
      this.deleteSuccess = true;
      this.deleteTimer = setTimeout(() => {
        this.deleteSuccess = false;
      }, 3000);
      this.removeObject(d);
    } else {
      this.deleteFailed = true;
      this.deleteFailedMessage = 'Failed to delete';
    }
  }

  // ACTIONS ON THE CURRENT OBJECT
  @action.bound
  async saveCurrent(dontReset?: boolean) {
    if (this.current.id) return await this.updateCurrent(dontReset);
    else return await this.createCurrent(dontReset);
  }
  @action.bound
  async createCurrent(dontReset?: boolean) {
    const d = await this.create(this.current);
    if (!d.error) {
      this.addObject(d);
      if (dontReset !== false) this.resetCurrent();
    }
    return d;
  }
  @action.bound
  async updateCurrent(dontReset?: boolean) {
    const d = await this.update(this.current);
    if (!d.error) {
      this.addObject(d);
      if (dontReset !== false) this.resetCurrent();
    }
    return d;
  }
  @action.bound
  async deleteCurrent() {
    const d = await this.delete(this.current.id);
    this.resetCurrent();
    return d;
  }
  @action.bound
  resetCurrent() {
    this.current.reset();
    this.current = new this.model();
  }
  @action.bound
  setCurrent(item: any = {}) {
    this.current = new this.model(item);
    this.current.convertFromLoad();
  }
  // END ACTIONS ON CURRENT

  @action
  setSaveSuccess() {
    this.saveSuccess = true;
    setTimeout(() => (this.saveSuccess = false), 3000);
  }

  @action
  setSaveFailed(obj: WaitingToSave) {
    this.waitingToSave.push(obj);
    this.saveFailed = true;
    setTimeout(() => (this.saveFailed = false), 3000);
  }

  // GETTERS
  find(obj: any) {
    return this.objects.filter((v) => Object.keys(obj).filter((a) => v[a] === obj[a]).length);
  }
  @action.bound
  async getById(id: number) {
    let p = this.objects.find((v) => v.id === id);
    if (!p) {
      p = await this.getData(this.route + `?s={"id": ${id}}`);
      p = p[0];
      if (p && !this.objects.find((v) => v.id === p.id)) this.objects.push(p);
    }
    return p;
  }
  getByIdSync(id: number) {
    return this.objects.find((v) => v.id === id);
  }
  getMultipleById(ids: any[]) {
    ids = typeof ids[0] === 'number' ? ids : ids.map((v: any) => v.id);
    return this.objects.filter((v) => ids.includes(v.id));
  }
  @action
  async search(obj: any) {
    let str = `?s=`;
    const searchParams: SearchParams = {};
    const ids = this.objects.map((v) => v.id);

    for (const i in obj) searchParams[i] = { $contL: obj[i] };

    searchParams.id = { $notin: ids };

    str += JSON.stringify(searchParams);

    return await this.getData(this.route + str);
  }
  // END GETTERS

  // UTILS
  constructGetParams(obj: any) {
    let str = '';

    for (const i in obj) str += ParamConstructor[i] ? ParamConstructor[i](obj[i]) + '&' : `${i}=${obj[i]}`;
    str = str.substr(0, str.length - 1);

    return str ? `?${str}` : '';
  }

  cleanObject(obj: any) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
  @action.bound
  addObject(obj: any) {
    if (this.objects.map((v) => v.id).indexOf(obj.id) < 0) this.objects.push(obj);
    else {
      const o = this.objects.find((a) => a.id === obj.id);
      Object.assign(o, obj);
    }
  }
  @action.bound
  removeObject(obj: any) {
    this.objects = this.objects.filter((v) => v.id !== obj.id);
  }
}
