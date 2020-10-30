import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import './style/style.css';
import "./style/element-variables.scss";
import locale from 'element-ui/lib/locale/lang/en'
import moment from 'moment'
import VueRouter from 'vue-router'
import VueAuthenticate from 'vue-authenticate'
import router from './router/routes.js'
import VueCookie from 'vue-cookie'
import store from './store/'
import VueMq from 'vue-mq'
import VueLodash from 'vue-lodash'
import lodash from 'lodash'
// import VueSocketIO from 'vue-socket.io'
// import io from 'socket.io-client'

// const options = { path: 'components/ChatComponent' };

// var socket = io('http://localhost:3000');
// console.log(socket);
// Vue.use(new VueSocketIO({
//   debug: true,
//   connection: SocketIO('http://localhost:3000', options),
//   vuex: {
//       store,
//       actionPrefix: 'SOCKET_',
//       mutationPrefix: 'SOCKET_'
//   }
// }));
Vue.use(VueRouter);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
Vue.use(moment);
Vue.use(VueCookie);
Vue.use(VueLodash, { name: 'custom' , lodash: lodash })
// Vue.Prototype.$cookie = VueCookies;

Vue.use(VueMq, {
  breakpoints: {
    mobile: 450,
    tablet: 900,
    laptop: 1250,
    desktop: Infinity,
  }
})

Vue.use(VueAuthenticate, {
  baseUrl: 'http://localhost:5000', // Your API domain
  
  providers: {
    github: {
      clientId: '',
      redirectUri: 'http://localhost:8080/auth/callback' // Your client app URL
    }
  }
})

Vue.config.productionTip = false


new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
