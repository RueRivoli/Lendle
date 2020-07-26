import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import createPersistedState from 'vuex-persistedstate'
// import * as Cookies from 'js-cookie'

Vue.use(Vuex)


const state = {
    // User store
    authentificated: false,
    username: '',
    id: '',
    loaner: true,
    avatar: '../assets/twitter.svg',
    token: '',
    isConnectedToChat: false,
    socketMessage: ''
  }
  
  export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    plugins: [
        createPersistedState({
            storage: window.sessionStorage,
        })
      ]
  })