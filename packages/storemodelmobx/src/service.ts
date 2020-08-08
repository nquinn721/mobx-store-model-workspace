import axios from 'axios';

export class Service {
  static isLoggedIn: boolean = false;
  static baseUrl: string = '';
  static ajax = axios.create();

  static async get(url: string): Promise<any> {
    let d;
    try {
      d = await this.ajax.get(url);
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async post(url: string, data = {}, many = false): Promise<any> {
    let d;
    try {
      d = await this.ajax.post(url + (many ? '/bulk' : ''), data);
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async update(url: string, data: any) {
    let d;
    try {
      d = await this.ajax.patch(`${url}/${data.id}`, data);
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async delete(url: string, id: number) {
    let d;
    try {
      d = await this.ajax.delete(`${url}/${id}`);
      d = { id };
    } catch (e) {
      d = { error: e };
    }

    return d;
  }

  static setBaseUrl(url: string) {
    this.ajax.defaults.baseURL = url;
    this.baseUrl = url;
  }

  static setBearerToken(token: string) {
    this.ajax.defaults.headers.common.Authorization = 'Bearer ' + token;
  }
}

Service.ajax.defaults.timeout = 2500;
