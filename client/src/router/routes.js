import VueRouter from 'vue-router'
import FurnitComponent from './../components/FurnitComponent';
import MyFurnitComponent from './../components/MyFurnitComponent';
import ChatComponent from './../components/ChatComponent';
import HomeComponent from './../components/HomeComponent';
import SignUpComponent from './../components/SignUpComponent';

const routes = [
    { path: '/myfurnitures', name:'MyFurnit', component: MyFurnitComponent },
    { path: '/addfurnit', name:'Addafurnit', component: FurnitComponent },
    { path: '/signup', name:'SignUp', component: SignUpComponent },
    { path: '/', name:'Home', component: HomeComponent },
    { path: '/chat', name:'Chat', component: ChatComponent }
  ]
  
  const router = new VueRouter({
    routes
  })

export default router;