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
  propsToDeleteForSave: string[] = ['original', 'getParams', 'route'];
  @observable editable: boolean = false;
  @observable saved: boolean = false;

  constructor(data: any = {}) {
    this.init(data);
  }

  init(data: any) {
    Object.assign(this, data);
    this.original = Object.assign({}, toJS(this));
  }
  convertForSave(data: any = {}): object {
    if (!data) data = {};
    const obj = Object.assign({}, this, data);

    // clean up obj for server
    for (const i in obj) if (typeof obj[i] === 'undefined' || this.propsToDeleteForSave.includes(i)) delete obj[i];
    delete obj.propsToDeleteForSave;
    this.original = Object.assign({}, toJS(this, { recurseEverything: true }));

    return obj;
  }
  convertFromLoad() {
    this.getDataFromStores();
  }
  reset() {
    const model: any = this;
    for (const i in this.original) if (i !== 'original') model[i] = this.original[i];
  }

  async save() {
    if (this.id) this.update();
    else this.create();
  }

  async create() {
    if (!this.route) throw new Error('no route defined for model');
    const d = await Service.post(this.route, this.convertForSave());
    this.init(d);
    this.convertFromLoad();
  }

  async update() {
    if (!this.route) throw new Error('no route defined for model');
    const d = await Service.update(this.route, this.convertForSave());
    this.init(d);
    this.convertFromLoad();
  }

  async delete() {
    if (!this.route) throw new Error('no route defined for model');
    await Service.delete(this.route, this.id);
  }

  async refresh() {
    await Service.get(`${this.route}/${this.id}${this.constructGetParams(this.getParams)}`);
    this.convertFromLoad();
  }

  constructGetParams(obj: any) {
    let str = '';

    for (const i in obj) str += ParamConstructor[i](obj[i]) + '&';
    str = str.substr(0, str.length - 1);

    return str ? `?${str}` : '';
  }

  getDataFromStores(): void {
    return undefined;
  }
}
