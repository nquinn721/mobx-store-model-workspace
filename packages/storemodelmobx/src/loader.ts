import { create } from 'mobx-persist';
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
    this.stores.forEach(this.hydrateStores);
  }

  public static registerStore(name: string, store: any) {
    // @ts-ignore
    this.stores.push({ store, name, complete: false });
  }

  @action.bound
  public static hydrateStores({ name, store }: { name: string; store: Store }) {
    store.refreshData && store.refreshData();
    this.hydrate(name, store).then(store.setHydrated);
    store.on('after load', () => {
      let t: any = this.stores.find((v) => v.name === name);
      t.complete = true;

      if (this.stores.filter((v) => v.complete !== true).length === 1) {
        this.stores.forEach((v) => v.store.objects.forEach((v: Model) => v.getDataFromStores()));
      }
    });
  }
}
