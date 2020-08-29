import axios from 'axios';

export class Service {
  static isLoggedIn: boolean = false;
  static baseUrl: string = '';
  static ajax = axios.create();

  static async get(url: string, headers = {}): Promise<any> {
    let d;
    try {
      d = await this.ajax.get(url, { headers });
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async post(url: string, data = {}, headers = {}, many = false): Promise<any> {
    let d;
    try {
      d = await this.ajax.post(url + (many ? '/bulk' : ''), data, { headers });
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async update(url: string, data: any, headers = {}) {
    let d;
    try {
      d = await this.ajax.patch(`${url}/${data.id}`, data, { headers });
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async delete(url: string, id: number, headers = {}) {
    let d;
    try {
      d = await this.ajax.delete(`${url}/${id}`, { headers });
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
