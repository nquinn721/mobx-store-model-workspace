# Overview

This is the best model/store library for mobx.

All your crud and lifecycle events managed for a store and for a model

# Setup

## You need to setup your base url before anything fires

### will default to local server and port

```javascript
import { Service } from 'mobx-store-model';

Service.setBaseUrl('https://jsonplaceholder.typicode.com');
```

## In your store.ts

```javascript
import { Store, Model, Loader } from 'mobx-store-model';
class Todo extends Model {
  route = 'todos';
}

class Post extends Model {
  route = 'posts';
}

class HomeStore {
  todos = new Store(Todo);
  posts = new Store(Post);
  constructor() {
    // LIFECYCLE EVENTS
    // Fires on load from api call
    this.todos.on('after load', () => console.log('AFTER TODOS ARE LOADED'));

    // This method requries you calling store.setHydrated() after hydrating from mobx-persist
    this.todos.on('after hydrate', () => console.log('AFTER TODOS ARE hydrated'));

    // This method is fired if hydration is setup
    // Fires after hydrate and load are complete
    this.todos.on('ready', () => console.log('AFTER TODOS ARE ready'));

    // Alternatively you can check flags
    /*
      ### load flags

      - hydrated: boolean;
      - initLoaded: boolean;
      - ready: boolean;

      ### fetch flags

      - fetchingData: boolean;
      - fetchFailed: boolean;
      - fetchSuccess: boolean;
      - defaultFetchFailedMessage: string;

      ### save flags

      - savingData: boolean;
      - saveSuccess: boolean;
      - saveFailed: boolean;

      ### delete flags

      - deleteSuccess: boolean;
      - deleteFailed: boolean;
      - deleteFailedMessage: string;
    */

    setTimeout(() => this.start(), 0);
  }

  async start() {
    await this.todos.refreshData(); // Calls getData() and adds data to this.objects
    await this.posts.refreshData();

    console.log(this.todos.objects);
    // [{title: '...'}, ...]
    console.log(this.posts.objects);
    // [{title: '...'}, ...]

    // METHODS
    await this.todos.getData(); // GET /todos -- you can pass a custom url if you want (DOES NOT PUT DATA ON this.objects, ONLY RETURNS DATA)
    await this.todos.create({ title: '...' }); // POST /todos
    await this.todos.delete(this.todos[0].id); // DELETE /todos/{id}  -- removes from this.objects
    await this.todos.udpate(this.todos[0]); // PATCH /todos/{todo.id}

    // Dealing with current
    // Current is a concept when you have multiple pages or parts of app dealing/modifying a single model
    this.todos.setCurrent(this.todos[0]);
    await this.todos.saveCurrent(); // if current has id, it will call create else it will call update
    await this.todos.createCurrent(); // .create(this.current)
    await this.todos.updateCurrent(); // .update(this.current)
    await this.todos.deleteCurrent(); // .delete(this.current.id)
    this.todos.resetCurrent(); // resets current data (if modified) and resets current to blank model

    // E.X.
    // This is how you modify current
    // this.todos.current.title = 'new title';
    // this.todos.saveCurent();

    await this.todos.getById(1); // Will check objects for todo and hit end point if it can't find
    this.todos.getByIdSync(1); // Will ONLY check objects for todo
    this.todos.getMultipleById([1, 2]); // Will ONLY check objects for todos
    this.todos.search({ username: 'bob' }); // Will ONLY work with NESTJS CRUD

    // MODEL METHODS
    const todo = this.todos.objects[0];
    todo.reset(); // if it's been modified but not saved
    await todo.save(); // if id exists will do update, otherwise will create
    await todo.create(); // POST /todos
    await todo.udpate(); // PATCH /todos/{this.id}
    await todo.delete(); // DELETE /todos/{this.id}
    await todo.refresh(); // GET /todos/{this.id}  --- overrides object with latest from db
  }
}

export const Home = new HomeStore();
Loader.registerStore(Home.todos, 'todos');
Loader.registerStore(Home.posts, 'posts');
Loader.init(); // this will fire refreshData
```

## You can use mobx class as store as well

```javascript
import { Store, Model, Loader } from 'mobx-store-model';
class Todo extends Model {
  route: string = 'todos';
}

class HomeStore extends Store {
  name: string = 'home';
  constructor() {
    super(Todo);
  }

  start() {
    console.log(this.objects); // [{title: '...'}]
    // All the same methods from above are available here as well
    // I.E.
    this.setCurrent(this.objects[0]);
    this.saveCurrent();
  }
}
export const TodoStore = new Todo();
Loader.registerStore(TodoStore);
Loader.init();
```

# Store

### loaded data from server

objects: any[];

### load flags

- hydrated: boolean;
- initLoaded: boolean;
- ready: boolean;

### fetch flags

- fetchingData: boolean;
- fetchFailed: boolean;
- fetchSuccess: boolean;
- defaultFetchFailedMessage: string;

### save flags

- savingData: boolean;
- saveSuccess: boolean;
- saveFailed: boolean;

### delete flags

- deletingData: boolean;
- deleteSuccess: boolean;
- deleteFailed: boolean;
- deleteFailedMessage: string;

### requires a class (it gets instantiated)

constructor(model: any);

### calls get data and puts data on this.objects

refreshData(): Promise<void>;

### called after loaded from endpoint

afterLoad(): void;

### called after hydrated and loaded

isReady(): {};

### called after hydrate from localstorage

### this is called if you regester the store in loader

afterHydrate(): {};

### calls get endpoint

getData(url?: string): Promise<any>;

### calls create endpoint

create(data: any): Promise<any>;

### calls update endpoint

update(data: any): Promise<any>;

### calls delete endpoint

delete(id: number): Promise<void>;

### checks if id exists, if so calls updateCurrent else createCurrent

### if passed false does not call resetCurrent

saveCurrent(dontReset?: boolean): Promise<any>;

### sends post to create, calls resetCurrent, add

### if passed false does not call resetCurrent

createCurrent(dontReset?: boolean): Promise<any>;

### sends post to update, calls resetCurrent, add

### if passed false does not call resetCurrent

updateCurrent(dontReset?: boolean): Promise<any>;

### sends post to delete, calls resetCurrent

deleteCurrent(): Promise<void>;

### resets current to empty model

resetCurrent(): void;

### sets current with new model and object passed to it

setCurrent(item?: any): void;

### searches objects and calls getData for id

### useful incase the object isn't in objects

getById(id: number): Promise<any>;

### searches objects by id

getByIdSync(id: number): any;

### searches objects by list of ids

getMultipleById(ids: any[]): any[];

### takes object and hits get endpoint

### {name: 'bob'}

#### calls getData

search(obj: any): Promise<any>;

### deletes any null or undefined properties on an object

cleanObject(obj: any): any;

### adds object to objects

### if object exists in this.objects it will mix with it (searched by id or model.objectKey)

add(obj: any): void;

### removes object from objects based off id or if model has objectKey set, will search by that

remove(obj: any): void;

# Model

### fetch flags

- fetchingData: boolean;
- fetchFailed: boolean;
- fetchSuccess: boolean;

### save flags

- savingData: boolean;
- saveSuccess: boolean;
- saveFailed: boolean;

### delete flags

- deletingData: boolean;
- deleteSuccess: boolean;
- deleteFailed: boolean;

### api endpoint (posts, users/posts)

route: string;

### query params for requests ({join: ['user', 'post']})

getParams: any;

### used to clean up data for saving (['metadata'])

propsToDeleteForSave: string[];

### used for forms to show if the object is being edited

editable: boolean;

### lifecycle flag

saved: boolean;

### this method mixes data with current class Object.assign(this, data);

init(data: any): void;

### method used to convert any data prior to save @override

convertForSave(data?: any): object;

### method used to convert data after loaded from endpoint @override

convertFromLoad(): void;

### resets any changes

reset(): void;

### checks if there is an id and if so fires create else update

save(): Promise<void>;

### POST => endpoint from route

create(): Promise<void>;

### PATCH => endpoint from route

update(): Promise<void>;

### DELETE => endpoint from route

delete(): Promise<void>;

### GET => endpoint from route

refresh(): Promise<void>;

### takes an object and returns query string

### {s: {name: 'bob'}}

### ?s={"name":"bob"}

constructGetParams(obj: any): string;

### if you have any other stores you want data from use this method, it should be ran after all stores are ready @override

### this is called automatically if you use the loader

getDataFromStores(): void;

# Loader

## this is managed with mobx-persist using localForage for storing local data

### Adds the store to loader

### name either has to be passed in here or as a property on the store

registerStore(Store, name?)

### This will fire refreshData on all the stores,

### call getDataFromStores from all objects downloaded

init()
