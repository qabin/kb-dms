import Quasar, * as All from 'quasar-framework/dist/quasar.mat.esm'
import 'quasar-framework/dist/umd/quasar.mat.min.css'
import 'quasar-extras/material-icons'
import 'quasar-extras/mdi'
import icon_btn from '../components/elements/icon_btn'
import clear_btn from '../components/elements/clear_btn'

export default ({Vue}) => {
  Vue.component('pp-icon-btn', icon_btn);
  Vue.component('pp-clear', clear_btn);

  Vue.use(Quasar, {
    components: {...All},
    directives: All,
    plugins: All,
  });


  Vue.prototype.$q.err = (message, err) => {
    Vue.prototype.$q.notify({
      message: message,
      timeout: 1000,
      type: 'negative',
      position: 'top'
    })
  };
  Vue.prototype.$q.ok = (message) => {
    Vue.prototype.$q.notify({
      message: message,
      timeout: 1000,
      type: 'positive',
      color: 'secondary',
      position: 'top'
    })
  };

  Vue.prototype.$q.icon.input.dropdown = 'keyboard_arrow_down'
}

export const filter = All.filter;
export const date = All.date;
