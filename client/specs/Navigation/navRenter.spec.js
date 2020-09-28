import Vue from 'vue'
import Vuex from 'vuex'
import NavRenterComponent from '@/Navigation/NavRenterComponent.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import index from './../../src/router/store/index.js'
import VueRouter from 'vue-router'
import AvatarComponent from './../Utils/AvatarComponent';
import { Dropdown, DropdownItem, DropdownMenu } from 'element-ui'
// import ElementUI from 'element-ui';

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.component(Dropdown.name, Dropdown)
localVue.component(DropdownItem.name, DropdownItem)
localVue.component(DropdownItem.name, DropdownItem)
localVue.component(DropdownItem.name, DropdownItem)
// localVue.use(ElementUI);

const router = new VueRouter()

let wrapper = null;

describe('Tests Navigation as a renter', () => {
    const store = new Vuex.store(index);
    store.state.username.push('François Ferdinant');
    store.state.avatar.push('');
    wrapper = mount(NavVisitorComponent, {
        propsData: {
            'displayTitles': true,
         },
        localVue,
        router,
        store
      })
  test('Number of divs', () => {

      let allDivs = wrapper.findAll('div');
      expect(allDivs).toHaveLength(7);
      console.log(wrapper.html());
      wrapper.destroy();
  })


  test('Avatar exists', () => {

      let allDivs = wrapper.findAll('div');
      expect(allDivs).toHaveLength(1);
      wrapper.destroy();
  })



});