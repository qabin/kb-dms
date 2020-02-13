// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Quasar from './plugins/quasar'
import Validate from './plugins/vuelidate'
import ThemeCtl from './plugins/theme_ctl'
import store from './store/index'
import PpDialog from './plugins/PpDialog'
import PpNotify from './plugins/PpNotify'
import Clipboard from './plugins/clipboard'
import VTouch from './plugins/vuetouch'

Vue.config.productionTip = false

const app = {
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
};


[Quasar, Validate, ThemeCtl, PpDialog, PpNotify, Clipboard, VTouch].forEach(plugin => plugin({
  app,
  router,
  store,
  Vue
}));

export const vm = new Vue(app);
