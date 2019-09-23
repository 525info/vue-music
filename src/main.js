import Vue from "vue";
import App from "./App";
import router from "./router";
import store from '@/store/index';

import fastclick from "fastclick";
import VueLazyload from "vue-lazyload";
import def_lazy_img from './common/images/default.png'
Vue.use(VueLazyload,{
  loading: def_lazy_img,
});

Vue.config.productionTip = false;

// 去除body下面元素的点击延迟
fastclick.attach(document.body);

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
