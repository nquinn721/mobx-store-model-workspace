import { Store, Model } from "mobx-store-model";
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
    setTimeout(() => this.start(), 0);
  }

  async start() {
    await this.todos.refreshData();
    await this.posts.refreshData();
  }
}

export const Home = new HomeStore();
