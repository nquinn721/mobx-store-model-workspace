<template>
  <div class="home">
    <div v-for="(todo, index) in Home.todos.objects" :key="index">
      - {{ todo.title }}
    </div>
  </div>
</template>

<script>
import { Home } from "../store/home.mobx";
export default {
  name: "Home",
  data() {
    return {
      Home,
    };
  },
};
</script>
