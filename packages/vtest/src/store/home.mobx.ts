import { Store, Model } from "storemodelmobx";
class Todo extends Model {
  route = "todos";
}

class Post extends Model {
  route = "posts";
}

class HomeStore {
  todos = new Store(Todo);
  posts = new Store(Post);
  constructor() {
    // Fires on load from api call
    this.todos.on("after load", () => console.log("AFTER TODOS ARE LOADED"));

    // This method requries you calling store.setHydrated() after hydrating from mobx-persist
    this.todos.on("after hydrate", () =>
      console.log("AFTER TODOS ARE hydrated")
    );

    // This method is fired if hydration is setup
    // Fires after hydrate and load are complete
    this.todos.on("ready", () => console.log("AFTER TODOS ARE ready"));

    setTimeout(() => this.start(), 0);
  }

  async start() {
    await this.todos.refreshData();
    await this.posts.refreshData();
  }
}

export const Home = new HomeStore();
