import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { Service } from "mobx-store-model";

Service.setBaseUrl("https://jsonplaceholder.typicode.com");

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
