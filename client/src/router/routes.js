import VueRouter from 'vue-router'

import AddFurnitComponent from './../components/Furnit/AddFurnitComponent';
import FurnitComponent from './../components/Furnit/FurnitComponent';
import MyFurnitComponent from './../components/Furnit/MyFurnitComponent';

import AdComponent from './../components/Advertisement/AdComponent';
import MyAdsComponent from './../components/Advertisement/MyAdsComponent';




import MyRentalsComponent from './../components/Rental/MyRentalsComponent';
import RentalComponent from './../components/Rental/RentalComponent';

import SearchComponent from './../components/Intro/SearchComponent';
import HomeComponent from './../components/Intro/HomeComponent';
import IntroComponent from './../components/Intro/IntroComponent';

import HelpComponent from './../components/Information/HelpComponent';
import ConditionComponent from './../components/Information/ConditionComponent';

import ChatComponent from './../components/Chat/ChatComponent';

import ProfileComponent from './../components/Account/ProfileComponent';

import LogInComponent from './../components/Authentication/LogInComponent';
import SignUpComponent from './../components/Authentication/SignUpComponent';
import ReSendMailValidationComponent from './../components/Authentication/ReSendMailValidationComponent';
import PasswordForgottenComponent from './../components/Authentication/PasswordForgottenComponent';
import ReinitializePasswordComponent from './../components/Authentication/ReinitializePasswordComponent';

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