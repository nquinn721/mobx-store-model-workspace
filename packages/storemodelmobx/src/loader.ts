import { create, persist } from 'mobx-persist';
import localForage from 'localforage';
import { action } from 'mobx';
import { Model, Store } from '.';

export class Loader {
  static hydrate: any = create({
    storage: localForage,
    jsonify: true,
  });
  static stores: any[] = [];
  public static async init() {
    for (const store of this.stores) {
      await this.hydrateStore(store);
      await this.refreshStore(store);
      await this.loadDataFromStores(store);
    }
  }

  public static registerStores(stores: any[]) {
    stores.forEach((v) => {
      if (!v.name) {
        new Error(
          'Must have a name set on store to use register stores multi loader (you can pass a name to the store as a second param or use `registerStore(store, name)`)',
        );
      }
      this.registerStore(v);
    });
  }
  public static registerStore(store: any, name?: string) {
    if (!store.name && !name)
      throw new Error(
        'Must have a name for the store, either put name as a property of store or pass name as a string for second value into register store',
      );

    this.stores.push({
      store,
      name: store.name || name,
      complete: false,
    });
  }

  public static getStore(storeName: string): Store {
    return this.stores.find((v) => v.name === storeName)?.store;
  }

  @action.bound
  public static async hydrateStore({ name, store }: { name: string; store: Store }) {
    await this.hydrate(name, store);
    if (store.setHydrated) store.setHydrated();
  }

  @action.bound
  public static async refreshStore({ name, store }: { name: string; store: Store }) {
    if (store.refreshData) await store.refreshData();
  }
  @action.bound
  public static async loadDataFromStores({ name, store }: { name: string; store: Store }) {
    store.objects?.forEach((a: Model) => a.getDataFromStores());
    if (store.isReady) store.isReady();
  }
}
