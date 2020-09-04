import { Service } from './service';
import { action, observable, toJS, runInAction } from 'mobx';
import pluralize from 'pluralize';
import { EventEmitter } from './EventEmitter';
import { ParamConstructor, SearchParams } from './paramConstructor';
import { persist } from 'mobx-persist';

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
  model: any;
  originalModel: any;
  @persist name: string = '';
  clearFlagTime: number = 3000;
  private clearFlagTimer: any;

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

  constructor(model: any, name: string = '') {
    super();
    this.originalModel = model;
    this.model = new model({});
    this.current = new model({});
    this.name = name;
    if (this.model.route) {
      this.route = this.model.route;
      this.defaultFetchFailedMessage += pluralize(this.route.replace(/\W/g, ' '));
    } else throw new Error(`No route defined for model '${model.name}'`);
    if (this.model.getParams) this.getParams = this.model.getParams;
  }

  @action
  async refreshData() {
    const o = await this.getData();
    if (!o.error) this.objects = o;
    this.initLoaded = true;
    this.afterLoad();
    this.checkIsLoaded();
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
    clearInterval(this.clearFlagTimer);
    this.fetchFailed = false;
    this.fetchingData = true;
    this.fetchSuccess = false;
    let data = await Service.get(url || this.route + this.model.constructGetParams(this.getParams));

    runInAction(() => {
      if (!data.error) {
        data = data.map((v: object) => {
          const m = new this.originalModel();
          m.init(this.cleanObject(v));
          m.convertFromLoad();
          return m;
        });
        this.fetchSuccess = true;
      } else this.fetchFailed = true;
      this.fetchingData = false;
    });
    this.clearFlags();
    return data;
  }

  async create(data: any) {
    return await this.postData('post', data);
  }

  async update(data: any) {
    return await this.postData('update', data);
  }

  @action
  async postData(method: string, data: any) {
    this.saveSuccess = false;
    this.savingData = true;
    this.saveFailed = false;
    clearInterval(this.clearFlagTimer);
    let m;
    let d;

    if (data.convertForSave) data = data.convertForSave();

    if (method === 'post') d = await Service.post(this.route, toJS(data, { recurseEverything: true }));
    else d = await Service.update(this.route, toJS(data, { recurseEverything: true }));

    this.savingData = false;
    if (!d.error) {
      m = new this.originalModel();
      m.init(Object.assign(data, d));
      m.convertFromLoad();
      this.add(m);
      this.saveSuccess = true;
    } else this.saveFailed = true;

    this.clearFlags();
    return m || d;
  }

  @action
  async delete(id: number) {
    clearInterval(this.clearFlagTimer);
    this.deleteFailed = false;
    this.deleteSuccess = false;
    this.deletingData = true;
    this.deleteFailedMessage = '';

    const d = await Service.delete(this.route, id);
    this.deletingData = false;

    if (!d.error) {
      this.deleteSuccess = true;
      this.remove(d);
    } else {
      this.deleteFailed = true;
      this.deleteFailedMessage = 'Failed to delete';
    }
    this.clearFlags();
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
      this.add(d);
      if (dontReset !== false) this.resetCurrent();
    }
    return d;
  }
  @action.bound
  async updateCurrent(dontReset?: boolean) {
    const d = await this.update(this.current);
    if (!d.error) {
      this.add(d);
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
    this.current = new this.originalModel();
    this.current.init({});
    this.current.convertFromLoad();
  }
  @action.bound
  setCurrent(item: any) {
    if (typeof item !== 'object') this.current = this.getByIdSync(Number(item));
    else if (!(item instanceof this.originalModel)) {
      this.current = new this.originalModel();
      this.current.init(item);
      this.current.convertFromLoad();
    } else this.current = item;
  }
  // END ACTIONS ON CURRENT

  // GETTERS
  find(obj: any) {
    return this.objects.filter((v) => Object.keys(obj).filter((a) => v[a] === obj[a]).length);
  }
  @action.bound
  async getById(obj: any) {
    const id = typeof obj === 'object' ? Number(obj.id) : Number(obj);
    let p = this.getByIdSync(obj);
    if (!p) {
      p = await this.getData(this.route + `?s={"id": ${id}}`);
      p = p[0];
      if (p && !this.getByIdSync(p)) this.objects.push(p);
    }
    return p;
  }
  getByIdSync(obj: any) {
    const id = typeof obj === 'number' ? obj : obj.id;
    return this.objects.find((v) => v.id === Number(id));
  }
  getMultipleById(ids: any[]) {
    ids = typeof ids[0] === 'object' ? ids.map((v: any) => v.id) : ids;
    ids = ids.map((v) => Number(v));
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

  cleanObject(obj: any) {
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }
  @action.bound
  add(obj: any) {
    const o = this.objects.find((a) => a[this.model.objectKey] === obj[this.model.objectKey]);
    if (o) Object.assign(o, obj);
    else if (!(obj instanceof this.originalModel)) {
      const a = new this.originalModel();
      a.init(obj);
      a.convertFromLoad();
      this.objects = this.objects.concat([a]);
    } else this.objects = this.objects.concat([obj]);
  }
  @action.bound
  remove(obj: any) {
    this.objects = this.objects.filter((v) => v.id !== obj.id);
  }

  clearFlags() {
    this.clearFlagTimer = setTimeout(() => {
      this.fetchSuccess = false;
      this.fetchFailed = false;
      this.fetchingData = false;
      this.deleteSuccess = false;
      this.deleteFailed = false;
      this.deletingData = false;
      this.savingData = false;
      this.saveSuccess = false;
      this.saveFailed = false;
    }, this.clearFlagTime);
  }
}
