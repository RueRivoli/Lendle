import VueRouter from 'vue-router'
import AddFurnitComponent from './../components/AddFurnitComponent';
import FurnitComponent from './../components/FurnitComponent';
import RentalComponent from './../components/RentalComponent';
import MyFurnitComponent from './../components/MyFurnitComponent';
import MyRentalsComponent from './../components/MyRentalsComponent';
import AdComponent from './../components/AdComponent';
import MyAdsComponent from './../components/MyAdsComponent';
import ChatComponent from './../components/ChatComponent';
import HomeComponent from './../components/HomeComponent';
import SignUpComponent from './../components/SignUpComponent';
import SearchComponent from './../components/SearchComponent';
import LogInComponent from './../components/LogInComponent';
import IntroComponent from './../components/IntroComponent';
import ProfileComponent from './../components/ProfileComponent';
import HelpComponent from './../components/HelpComponent';
import ConditionComponent from './../components/ConditionComponent';
import ReSendMailValidationComponent from './../components/ReSendMailValidationComponent';
import PasswordForgottenComponent from './../components/PasswordForgottenComponent';
import ReinitializePasswordComponent from './../components/ReinitializePasswordComponent';

const routes = [
  { path: '/', name:'Home', component: HomeComponent },
  { path: '/intro/beARenter', name: 'Intro', component: IntroComponent, props: {displayLendle: true } },
  { path: '/login', name:'LogIn', component: LogInComponent },
  { path: '/passwordForgotten', name:'passwordForgotten', component: PasswordForgottenComponent },
  { path: '/reinitializepassword', name:'reinitializePassword', component: ReinitializePasswordComponent },
  { path: '/search', name:'Search', component: SearchComponent },
  { path: '/signup/:as', name:'SignUp', component: SignUpComponent },
  { path: '/profile', name:'ProfileComponent', component: ProfileComponent },
  { path: '/myfurnitures', name:'MyFurnit', component: MyFurnitComponent },
  { path: '/myrentals', name:'MyRentals', component: MyRentalsComponent },
  { path: '/myads', name:'MyAds', component: MyAdsComponent },
  { path: '/ad', name:'Ad', component: AdComponent },
  { path: '/furniture/:id', name:'Furnit', component: FurnitComponent },
  { path: '/rental/:id', name:'Rental', component: RentalComponent },
  { path: '/addfurnit', name:'Addafurnit', component: AddFurnitComponent },
  { path: '/help', name:'Help', component: HelpComponent },
  { path: '/conditionsutilisation', name:'Conditions', component: ConditionComponent },
  { path: '/validation', name:'ReSendMailValidationComponent', component: ReSendMailValidationComponent },
  { path: '/chat', name:'Chat', component: ChatComponent }
]
  const router = new VueRouter({
    mode: 'history',
    routes
  })

export default router;