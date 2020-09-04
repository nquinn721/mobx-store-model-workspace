import { Store, Model } from '../src';
import mockAxios from '../__mocks__/axios';
class M extends Model {
  route: string = 'api-endpoint';
}
describe('Base Mobx', () => {
  let store: any;

  beforeEach(() => {
    store = new Store(M);
    store.clearFlagTime = 100;
  });

  it('should have save to objects', async (done) => {
    expect(store.fetchingData).toEqual(false);
    expect(store.fetchFailed).toEqual(false);
    expect(store.fetchSuccess).toEqual(false);

    const d = store.refreshData();
    expect(store.fetchingData).toEqual(true);
    mockAxios.mockResponse({ data: [{ name: 'bob' }, { name: 'jeff' }] });
    await d;

    expect(store.fetchingData).toEqual(false);
    expect(store.fetchFailed).toEqual(false);
    expect(store.fetchSuccess).toEqual(true);
    expect(store.objects.length).toEqual(2);
    expect(store.objects[0].name).toEqual('bob');

    setTimeout(() => {
      expect(store.fetchingData).toEqual(false);
      expect(store.fetchFailed).toEqual(false);
      expect(store.fetchSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should have create new model', async (done) => {
    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(false);

    const d = store.create({ name: 'bob' });
    expect(store.savingData).toEqual(true);
    mockAxios.mockResponse({ data: { name: 'bob' } });

    await d;

    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(true);

    expect(store.objects.length).toEqual(1);
    expect(store.objects[0].name).toEqual('bob');

    setTimeout(() => {
      expect(store.savingData).toEqual(false);
      expect(store.saveFailed).toEqual(false);
      expect(store.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should create new model', async (done) => {
    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(false);

    const d = store.create({ name: 'bob' });
    expect(store.savingData).toEqual(true);
    mockAxios.mockResponse({ data: { name: 'bob' } });

    await d;

    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(true);

    expect(store.objects.length).toEqual(1);
    expect(store.objects[0].name).toEqual('bob');

    setTimeout(() => {
      expect(store.savingData).toEqual(false);
      expect(store.saveFailed).toEqual(false);
      expect(store.saveSuccess).toEqual(false);
      done();
    }, 200);
  });
  it('should FAIL create new model', async (done) => {
    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(false);

    const d = store.create({ name: 'bob' });
    expect(store.savingData).toEqual(true);
    mockAxios.mockError({ error: 1 });

    await d;

    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(true);
    expect(store.saveSuccess).toEqual(false);

    expect(store.objects.length).toEqual(0);

    setTimeout(() => {
      expect(store.savingData).toEqual(false);
      expect(store.saveFailed).toEqual(false);
      expect(store.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should update model', async (done) => {
    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(false);

    store.objects = [{ name: 'bob', id: 1 }];
    expect(store.objects.length).toEqual(1);
    const d = store.update({ id: 1, name: 'jeff' });
    expect(store.savingData).toEqual(true);
    mockAxios.mockResponse({ data: { name: 'jeff', id: 1 } });

    await d;

    expect(store.savingData).toEqual(false);
    expect(store.saveFailed).toEqual(false);
    expect(store.saveSuccess).toEqual(true);

    expect(store.objects.length).toEqual(1);
    expect(store.objects[0].name).toEqual('jeff');

    setTimeout(() => {
      expect(store.savingData).toEqual(false);
      expect(store.saveFailed).toEqual(false);
      expect(store.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should have delete model', async (done) => {
    expect(store.deletingData).toEqual(false);
    expect(store.deleteFailed).toEqual(false);
    expect(store.deleteSuccess).toEqual(false);

    store.objects = [{ name: 'bob', id: 1 }];
    expect(store.objects.length).toEqual(1);
    const d = store.delete(1);
    expect(store.deletingData).toEqual(true);
    mockAxios.mockResponse();

    await d;

    expect(store.deletingData).toEqual(false);
    expect(store.deleteFailed).toEqual(false);
    expect(store.deleteSuccess).toEqual(true);

    expect(store.objects.length).toEqual(0);

    setTimeout(() => {
      expect(store.deletingData).toEqual(false);
      expect(store.deleteFailed).toEqual(false);
      expect(store.deleteSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should set current based off id', () => {
    store.add({ name: 'jeff', id: 2 });
    store.add({ name: 'bob', id: 1 });
    store.setCurrent(2);
    expect(store.current.name).toEqual('jeff');
    expect(store.current).toBeInstanceOf(M);
    store.setCurrent(1);
    expect(store.current.name).toEqual('bob');
    expect(store.current).toBeInstanceOf(M);
  });
  it('should set current with model', () => {
    store.add({ name: 'jeff', id: 1 });
    store.add({ name: 'bob', id: 2 });

    store.setCurrent(store.objects[0]);
    expect(store.current.name).toEqual('jeff');
    expect(store.current).toBeInstanceOf(M);
    store.setCurrent(store.objects[1]);
    expect(store.current.name).toEqual('bob');
    expect(store.current).toBeInstanceOf(M);
  });
  it('should set current with plain object and convert to model', () => {
    store.setCurrent({ name: 'jeff', id: 1 });
    expect(store.current.name).toEqual('jeff');
    expect(store.current).toBeInstanceOf(M);
    store.setCurrent({ name: 'bob', id: 2 });
    expect(store.current.name).toEqual('bob');
    expect(store.current).toBeInstanceOf(M);
  });
});
