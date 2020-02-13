import Vue from 'vue'
import Vuex from 'vuex'

import main from './main'
import user from './user'
import home from './home'

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    main,
    user,
    home,
  }
});

export default store
