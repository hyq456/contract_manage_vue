import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import qs from 'qs'
import md5 from 'js-md5';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui-progress/dist/muse-ui-progress.css';
import NProgress from 'muse-ui-progress';
import Toast from 'muse-ui-toast';
import 'muse-ui-message/dist/muse-ui-message.css';
//VANT

import 'vant/lib/button/style';
import 'vant/lib/uploader/style';
import 'vant/lib/search/style'
//VUE-Echart
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/bar' //柱状图
import 'echarts/lib/chart/pie' // 饼图
import 'echarts/lib/component/tooltip' //提示框
import 'echarts/lib/component/legend' // 图例
import "echarts/lib/component/graphic" //
import "echarts/lib/component/title" //


import Uploader from 'vant';
import Button from 'vant';
import Search from 'vant'
import global_ from './utils/Global.js'

//vant
// Vue.use(Button);
// Vue.use(Uploader);
// Vue.use(Search);
const vant = require('vant')
Vue.use(vant);

Vue.use(Toast);
Vue.use(NProgress);
Vue.use(MuseUI);
// Vue.config.productionTip = false

Vue.config.devtools = true
Vue.component('v-chart', ECharts)

Vue.prototype.$axios = axios;
Vue.prototype.qs = qs;
Vue.prototype.GLOBAL = global_//常量
Vue.prototype.$md5 = md5;

Vue.prototype.echartsResize = function (ref) { //传参为echarts 的ref
  setInterval(() => {
    window.onresize = function () {
      ref.resize()
    }
  }, 100)
}


axios.defaults.baseURL = "http://" + global_.baseURL + ":" + global_.post + "/";
axios.defaults.withCredentials = true

router.beforeEach((to, from, next) => {
  NProgress.start();
  if (to.meta.requireAuth) {
    if (sessionStorage.getItem(`token`)) {
      next();
      NProgress.done();
    }
    else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
      NProgress.done();
    }
  }
  else {
    next();
    NProgress.done();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
