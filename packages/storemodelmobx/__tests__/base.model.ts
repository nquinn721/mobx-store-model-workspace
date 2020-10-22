import { Model } from '../src/base.model';
import mockAxios from '../__mocks__/axios';

class M extends Model {
  route: string = 'api-endpoint';
  name: string = '';
}

describe('Base model', () => {
  let model: any;

  beforeEach(() => {
    model = new M();
    model.init({ name: 'nate' });
    model.clearFlagTime = 200;
  });

  it('should create a model', () => {
    expect(model.id).toStrictEqual(0);
    expect(model.route).toEqual('api-endpoint');
    expect(model.getParams).toEqual(undefined);
    expect(model.original).toEqual({ name: 'nate' });
    expect(model.originalPropsToDeleteForSave).toEqual([
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
    ]);
    expect(typeof model.init).toEqual('function');
    expect(typeof model.convertForSave).toEqual('function');
    expect(typeof model.convertFromLoad).toEqual('function');
    expect(typeof model.reset).toEqual('function');
    expect(typeof model.save).toEqual('function');
    expect(typeof model.create).toEqual('function');
    expect(typeof model.update).toEqual('function');
    expect(typeof model.delete).toEqual('function');
    expect(typeof model.refresh).toEqual('function');
    expect(typeof model.getDataFromStores).toEqual('function');

    // CRUD FLAGS
    expect(model.editable).toEqual(false);
    expect(model.fetchingData).toEqual(false);
    expect(model.fetchFailed).toEqual(false);
    expect(model.fetchSuccess).toEqual(false);
    expect(model.savingData).toEqual(false);
    expect(model.saveSuccess).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.deletingData).toEqual(false);
    expect(model.deleteSuccess).toEqual(false);
    expect(model.deleteFailed).toEqual(false);
  });

  it('should reset model if changed', () => {
    model.name = 'bob';
    expect(model.name).toEqual('bob');
    model.reset();
    expect(model.name).toEqual('nate');
  });

  it('should call create on save if id doesnt exist', () => {
    model.create = jest.fn();
    model.update = jest.fn();
    model.save();
    expect(model.create).toHaveBeenCalled();
    expect(model.update).not.toHaveBeenCalled();
  });

  it('should call create on save if id exists', () => {
    model = new Model();
    model.init({ id: 2, name: 'bob' });
    model.create = jest.fn();
    model.update = jest.fn();
    model.save();
    expect(model.create).not.toHaveBeenCalled();
    expect(model.update).toHaveBeenCalled();
  });

  it('should create', async (done) => {
    model.convertForSave = jest.fn(() => ({}));
    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.saveSuccess).toEqual(false);

    const d = model.create();

    expect(model.savingData).toEqual(true);
    mockAxios.mockResponse();
    await d;

    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.saveSuccess).toEqual(true);
    expect(model.convertForSave).toHaveBeenCalled();

    setTimeout(() => {
      expect(model.savingData).toEqual(false);
      expect(model.saveFailed).toEqual(false);
      expect(model.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should fail create', async (done) => {
    model.convertForSave = jest.fn(() => ({}));
    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.saveSuccess).toEqual(false);

    const d = model.create();

    expect(model.savingData).toEqual(true);
    mockAxios.mockError();
    await d;

    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(true);
    expect(model.saveSuccess).toEqual(false);
    expect(model.convertForSave).toHaveBeenCalled();

    setTimeout(() => {
      expect(model.savingData).toEqual(false);
      expect(model.saveFailed).toEqual(false);
      expect(model.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should update', async (done) => {
    model.convertForSave = jest.fn(() => ({}));
    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.saveSuccess).toEqual(false);

    const d = model.update();

    expect(model.savingData).toEqual(true);
    mockAxios.mockResponse();
    await d;

    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.saveSuccess).toEqual(true);
    expect(model.convertForSave).toHaveBeenCalled();

    setTimeout(() => {
      expect(model.savingData).toEqual(false);
      expect(model.saveFailed).toEqual(false);
      expect(model.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should fail update', async (done) => {
    model.convertForSave = jest.fn(() => ({}));
    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(false);
    expect(model.saveSuccess).toEqual(false);

    const d = model.update();

    expect(model.savingData).toEqual(true);
    mockAxios.mockError();
    await d;

    expect(model.savingData).toEqual(false);
    expect(model.saveFailed).toEqual(true);
    expect(model.saveSuccess).toEqual(false);
    expect(model.convertForSave).toHaveBeenCalled();

    setTimeout(() => {
      expect(model.savingData).toEqual(false);
      expect(model.saveFailed).toEqual(false);
      expect(model.saveSuccess).toEqual(false);
      done();
    }, 200);
  });

  it('should refresh data', async (done) => {
    model.convertFromLoad = jest.fn(() => model.getDataFromStores());
    model.getDataFromStores = jest.fn();
    expect(model.fetchSuccess).toEqual(false);
    expect(model.fetchFailed).toEqual(false);
    expect(model.fetchingData).toEqual(false);

    const d = model.refresh();

    expect(model.fetchingData).toEqual(true);
    mockAxios.mockResponse();
    await d;

    expect(model.fetchSuccess).toEqual(true);
    expect(model.fetchFailed).toEqual(false);
    expect(model.fetchingData).toEqual(false);
    expect(model.convertFromLoad).toHaveBeenCalled();
    expect(model.getDataFromStores).toHaveBeenCalled();
    setTimeout(() => {
      expect(model.fetchSuccess).toEqual(false);
      expect(model.fetchFailed).toEqual(false);
      expect(model.fetchingData).toEqual(false);
      done();
    }, 200);
  });

  it('should fail refresh data', async (done) => {
    model.convertFromLoad = jest.fn(() => model.getDataFromStores());
    model.getDataFromStores = jest.fn();
    expect(model.fetchSuccess).toEqual(false);
    expect(model.fetchFailed).toEqual(false);
    expect(model.fetchingData).toEqual(false);

    const d = model.refresh();

    expect(model.fetchingData).toEqual(true);
    mockAxios.mockError();
    await d;

    expect(model.fetchSuccess).toEqual(false);
    expect(model.fetchFailed).toEqual(true);
    expect(model.fetchingData).toEqual(false);
    expect(model.convertFromLoad).not.toHaveBeenCalled();
    expect(model.getDataFromStores).not.toHaveBeenCalled();
    setTimeout(() => {
      expect(model.fetchSuccess).toEqual(false);
      expect(model.fetchFailed).toEqual(false);
      expect(model.fetchingData).toEqual(false);
      done();
    }, 200);
  });

  it('should delete', async (done) => {
    expect(model.deletingData).toEqual(false);
    expect(model.deleteFailed).toEqual(false);
    expect(model.deleteSuccess).toEqual(false);

    const d = model.delete();

    expect(model.deletingData).toEqual(true);
    mockAxios.mockResponse(model.id);
    await d;

    expect(model.deletingData).toEqual(false);
    expect(model.deleteSuccess).toEqual(true);
    expect(model.deleteFailed).toEqual(false);

    setTimeout(() => {
      expect(model.deleteSuccess).toEqual(false);
      expect(model.deletingData).toEqual(false);
      expect(model.deleteFailed).toEqual(false);
      done();
    }, 200);
  });

  it('should fail delete', async (done) => {
    expect(model.deletingData).toEqual(false);
    expect(model.deleteFailed).toEqual(false);
    expect(model.deleteSuccess).toEqual(false);

    const d = model.delete();

    expect(model.deletingData).toEqual(true);
    mockAxios.mockError();
    await d;

    expect(model.deletingData).toEqual(false);
    expect(model.deleteSuccess).toEqual(false);
    expect(model.deleteFailed).toEqual(true);

    setTimeout(() => {
      expect(model.deleteSuccess).toEqual(false);
      expect(model.deletingData).toEqual(false);
      expect(model.deleteFailed).toEqual(false);
      done();
    }, 200);
  });
});
