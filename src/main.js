import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import axios from "axios";
import VueAxios from "vue-axios";
import VueCookies from 'vue-cookies'

import "./assets/firebase.js";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueCookies)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
