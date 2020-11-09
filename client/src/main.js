import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import VCalendar from 'v-calendar';
import './style/style.css';
import "./style/element-variables.scss";
import locale from 'element-ui/lib/locale/lang/en'
import moment from 'moment'
import VueRouter from 'vue-router'
import router from './router/routes.js'
import store from './store/'
import VueMq from 'vue-mq'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
// import Materials from 'vue-material'
// import 'vue-material/dist/vue-material.min.css'
// import 'vue-material/dist/theme/default.css'
// import 'vuetify/dist/vuetify.min.css'


Vue.use(VueRouter);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
Vue.use(moment);
Vue.use(VCalendar, {
  componentPrefix: 'vc',  // Use <vc-calendar /> instead of <v-calendar />
  screens: {
    tablet: '450px',
    laptop: '900px',
    desktop: '1250px',
  },
});
// Vue.use(Materials);
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })

Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity,
  }
})

Vue.config.silent = true
Vue.config.productionTip = false
// const opts = {}

// export default new Vuetify(opts)

new Vue({
  render: h => h(App),
  // vuetify: new Vuetify(),
  store,
  router
}).$mount('#app')
