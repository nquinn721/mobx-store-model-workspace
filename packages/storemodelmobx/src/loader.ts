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

  public static registerStore(store: any) {
    // @ts-ignore
    this.stores.push({ store, name: 'store-' + Date.now(), complete: false });
  }

  @action.bound
  public static hydrateStores({ name, store }: { name: string; store: Store }) {
    this.hydrate(name, store).then(() => store.setHydrated && store.setHydrated());
    if (store.refreshData) store.refreshData();
    store.on &&
      store.on('after load', () => {
        const t: any = this.stores.find((v: Store) => v.name === name);
        const total = this.stores.filter((v: any) => v.complete !== true).length;
        t.complete = true;

        if (total === 1) {
          this.stores.forEach((v: any) => v.store.objects.forEach((a: Model) => a.getDataFromStores()));
        }
      });
  }
}
