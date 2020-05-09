import Vue from 'vue'
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

Vue.use(VueRouter)
Vue.use(ElementUI, { locale })
Vue.use(moment);
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
  router
}).$mount('#app')
