import axios from 'axios';

const ajax = axios.create();

export class Service {
  static isLoggedIn: boolean = false;
  static baseUrl: string =
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3000'
      : 'https://bolt-schedular-backend.azurewebsites.net';

  static async get(url: string): Promise<any> {
    let d;
    try {
      d = await ajax.get(url);
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async post(url: string, data = {}, many = false): Promise<any> {
    let d;
    try {
      d = await ajax.post(url + (many ? '/bulk' : ''), data);
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async update(url: string, data: any) {
    let d;
    try {
      d = await ajax.patch(`${url}/${data.id}`, data);
      d = d.data;
    } catch (e) {
      d = { error: e };
    }
    return d;
  }

  static async delete(url: string, id: number) {
    let d;
    try {
      d = await ajax.delete(`${url}/${id}`);
      d = { id };
    } catch (e) {
      d = { error: e };
    }

    return d;
  }

  static async login(creds: object) {
    const data = await this.post('/auth/login', creds);
    ajax.defaults.headers.common.Authorization = 'Bearer ' + data.access_token;
    localStorage.setItem('Authorization', data.access_token);
    localStorage.setItem('user', data.user);
    this.isLoggedIn = true;
    return data;
  }

  static async logout() {
    localStorage.removeItem('Authorization');
    localStorage.removeItem('user');
  }

  static setBaseUrl(url: string) {
    ajax.defaults.baseURL = url;
    this.baseUrl = url;
  }
}

ajax.defaults.baseURL = 'https://bolt-schedular-backend.azurewebsites.net';
ajax.defaults.baseURL = Service.baseUrl;

ajax.defaults.timeout = 2500;

// ajax.defaults.headers.common["Content-Type"] = "application/json";

// If token is stored in localstorage
const authToken = localStorage.getItem('Authorization');
if (authToken) {
  ajax.defaults.headers.common.Authorization = `Bearer ${authToken}`;
  Service.isLoggedIn = true;
}
