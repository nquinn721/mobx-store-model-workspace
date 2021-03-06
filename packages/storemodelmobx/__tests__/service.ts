import { Service } from 'mobx-store-model';
import mockAxios from 'jest-mock-axios';

const access_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im5hdGVAbmF0ZS5jb20iLCJpYXQiOjE1NzY1MTAwNzMsImV4cCI6MTU3NzUxMDA3Mn0.08G6JnFoFhfnukwJhnYOwEvQaCDJOrSgGbMLDyDYgWQ';

describe('Service class', () => {
  afterEach(() => mockAxios.reset());

  it('should do a get', async (done) => {
    const data = Service.get('/user');
    mockAxios.mockResponse({ data: { results: [{ id: 1, name: 'bob' }] } });
    const d = await data;
    expect(d.results.length).toBe(1);
    done();
  });

  it('should do a post', async (done) => {
    const data = Service.post('/user', { id: 2, name: 'jeff' });
    mockAxios.mockResponse({ data: { results: [{ id: 1, name: 'bob' }] } });
    const d = await data;
    expect(d.results.length).toBe(1);
    done();
  });
});
