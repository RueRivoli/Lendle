import VueRouter from 'vue-router'
import FurnitComponent from './../components/FurnitComponent';
import MyFurnitComponent from './../components/MyFurnitComponent';
import ChatComponent from './../components/ChatComponent';
import HomeComponent from './../components/HomeComponent';
import SignUpComponent from './../components/SignUpComponent';
import SearchComponent from './../components/SearchComponent';
import LogInComponent from './../components/LogInComponent';
import IntroComponent from './../components/IntroComponent';
import ProfileComponent from './../components/ProfileComponent';
import HelpComponent from './../components/HelpComponent';
import ReSendMailValidationComponent from './../components/ReSendMailValidationComponent';

const routes = [
  { path: '/', name:'Home', component: HomeComponent },
  { path: '/intro/beARenter', name: 'Intro', component: IntroComponent, props: {displayLendle: true } },
  { path: '/login', name:'LogIn', component: LogInComponent },
  { path: '/search', name:'Search', component: SearchComponent },
  { path: '/signup', name:'SignUp', component: SignUpComponent },
  { path: '/profile', name:'ProfileComponent', component: ProfileComponent },
  { path: '/myfurnitures', name:'MyFurnit', component: MyFurnitComponent },
  { path: '/addfurnit', name:'Addafurnit', component: FurnitComponent },
  { path: '/help', name:'Help', component: HelpComponent },
  { path: '/validation', name:'ReSendMailValidationComponent', component: ReSendMailValidationComponent },
  { path: '/chat', name:'Chat', component: ChatComponent }
]
  const router = new VueRouter({
    routes
  })

export default router;