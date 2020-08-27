import { toJS, observable } from 'mobx';
import { Service } from './service';
import { ParamConstructor } from './paramConstructor';

interface Test {
  [key: string]: any;
}

export class Model implements Test {
  id: number = 0;
  route: string = '';
  getParams: any;
  original: any = {};
  originalPropsToDeleteForSave: string[] = [
    'original',
    'getParams',
    'route',
    'fetchingData',
    'fetchFailed',
    'fetchSuccess',
    'savingData',
    'saveSuccess',
    'saveFailed',
    'deletingData',
    'deleteSuccess',
    'deleteFailed',
    'clearFlagTime',
    'editable',
  ];
  propsToDeleteForSave: string[] = [];
  clearFlagTime: number = 3000;
  @observable editable: boolean = false;

  // CRUD
  @observable fetchingData: boolean = false;
  @observable fetchFailed: boolean = false;
  @observable fetchSuccess: boolean = false;

  @observable savingData: boolean = false;
  @observable saveSuccess: boolean = false;
  @observable saveFailed: boolean = false;

  @observable deletingData: boolean = false;
  @observable deleteSuccess: boolean = false;
  @observable deleteFailed: boolean = false;

  constructor(data: any = {}) {
    this.init(data);
  }

  init(data: any) {
    Object.assign(this, data);
    this.original = Object.assign({}, toJS(data));
  }
  convertForSave(data: any = {}): object {
    if (!data) data = {};
    const obj = Object.assign({}, this, data);

    // clean up obj for server
    for (const i in obj) {
      if (
        typeof obj[i] === 'undefined' ||
        this.propsToDeleteForSave.includes(i) ||
        this.originalPropsToDeleteForSave.includes(i)
      )
        delete obj[i];
    }
    delete obj.propsToDeleteForSave;
    this.original = Object.assign({}, toJS(this, { recurseEverything: true }));

    return obj;
  }
  convertFromLoad() {
    this.getDataFromStores();
  }
  reset() {
    Object.assign(this, this.original);
  }

  async save() {
    if (this.id) this.update();
    else this.create();
  }

  async create() {
    this.savingData = true;
    this.saveSuccess = false;
    this.saveFailed = false;

    if (!this.route) throw new Error('no route defined for model');
    const d = await Service.post(this.route, this.convertForSave());
    this.savingData = false;

    if (d.error) this.saveFailed = true;
    else {
      this.saveSuccess = true;
      this.init(d);
      this.convertFromLoad();
    }

    this.clearFlags();
  }

  async update() {
    this.savingData = true;
    this.saveSuccess = false;
    this.saveFailed = false;

    if (!this.route) throw new Error('no route defined for model');
    const d = await Service.update(this.route + this.constructGetParams(this.getParams), this.convertForSave());
    this.savingData = false;

    if (d.error) this.saveFailed = true;
    else {
      this.saveSuccess = true;
      this.init(d);
      this.convertFromLoad();
    }

    this.clearFlags();
  }

  async delete() {
    this.deleteSuccess = false;
    this.deleteFailed = false;
    this.deletingData = true;

    if (!this.route) throw new Error('no route defined for model');
    const d = await Service.delete(this.route, this.id);
    this.deletingData = false;

    if (d.error) this.deleteFailed = true;
    else this.deleteSuccess = true;

    this.clearFlags();
  }

  async refresh() {
    this.fetchSuccess = false;
    this.fetchFailed = false;
    this.fetchingData = true;

    const d = await Service.get(`${this.route}/${this.id}${this.constructGetParams(this.getParams)}`);
    this.fetchingData = false;

    if (d.error) this.fetchFailed = true;
    else {
      this.fetchSuccess = true;
      this.convertFromLoad();
    }
    this.clearFlags();
  }

  clearFlags() {
    setTimeout(() => {
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

  constructGetParams(obj?: any) {
    let str = '';

    for (const i in obj) str += ParamConstructor[i](obj[i]) + '&';
    str = str.substr(0, str.length - 1);

    return str ? `?${str}` : '';
  }

  getDataFromStores(): void {
    return;
  }
}
