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
    this.stores.forEach(this.hydrateStores.bind(this));
  }

  public static registerStore(store: any, name?: string) {
    if (!store.name && !name)
      throw new Error(
        'Must have a name for the store, either put name as a property of store or pass name as a string for second value into register store',
      );
    // @ts-ignore
    this.stores.push({ store, name: store.name || name, complete: false });
  }

  @action.bound
  public static hydrateStores({ name, store }: { name: string; store: Store }) {
    // this.hydrate(name, store).then(() => store.setHydrated && store.setHydrated());
    if (store.refreshData) store.refreshData();
    if (store.on)
      store.on('after load', () => {
        // @ts-nocheck
        console.log('after load', store.name);

        const t: any = this.stores.find((v: Store) => v.name === name);
        const total = this.stores.filter((v: any) => v.complete !== true).length;
        t.complete = true;

        if (total === 1) {
          // @ts-nocheck
          console.log(this.stores);

          this.stores.forEach((v: any) => {
            // @ts-nocheck
            console.log('loopping over stores', v);

            v.store.objects?.forEach((a: Model) => a.getDataFromStores());
          });
        }
      });
  }
}
