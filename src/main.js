import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import axios from "axios";
import VueAxios from "vue-axios";
import MetaInfo from "vue-meta-info";
import VueCookies from "vue-cookies";
import VueClipboard from "vue-clipboard2";

import "./assets/firebase.js";
import "./registerServiceWorker";

setViewerHieght(window.innerHeight);

onElementHeightChange(document.body, function (h) {
  setViewerHieght(h);
});

function setViewerHieght(h) {
  // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
  let vh = h * 0.01;
  // Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  const bodyElem = document.getElementsByTagName('body')[0];
  const htmlElem = document.getElementsByTagName('html')[0];
  htmlElem.style['overflow-y'] = 'hidden';
  htmlElem.style['height'] = '100%';
  bodyElem.style['overflow-y'] = 'hidden';
  bodyElem.style['height'] = '100%';
}

function onElementHeightChange(elm, callback) {
  var lastHeight = elm.clientHeight,
    newHeight;
  (function run() {
    newHeight = elm.clientHeight;
    if (lastHeight != newHeight) {
      callback(newHeight);
      lastHeight = newHeight;
    }
    if (elm.onElementHeightChangeTimer) {
      clearTimeout(elm.onElementHeightChangeTimer);
    }
    elm.onElementHeightChangeTimer = setTimeout(run, 200);
  })();
}

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(MetaInfo);
Vue.use(VueCookies);
Vue.use(VueClipboard);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
