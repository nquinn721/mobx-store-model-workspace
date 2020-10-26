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
  public static init() {
    this.stores.forEach(this.hydrateStores.bind(this));
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

  public static getStore(storeName: string) {
    return this.stores.find((v) => v.name === storeName);
  }

  @action.bound
  public static hydrateStores({ name, store }: { name: string; store: Store }) {
    this.hydrate(name, store).then(() => {
      store.setHydrated && store.setHydrated();
      store.refreshData && store.refreshData();
    });

    if (store.on) {
      store.on('after load', () => {
        const t: any = this.stores.find((v: any) => v.name === name);
        t.complete = true;
        const total = this.stores.filter((v: any) => v.complete !== true).length;

        if (total === 1) {
          this.stores.forEach((v: any) => {
            v.store.objects?.forEach((a: Model) => a.getDataFromStores());
          });
        }
      });
    }
  }
}
