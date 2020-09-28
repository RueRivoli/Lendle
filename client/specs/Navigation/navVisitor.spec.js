import Vue from 'vue'
import NavVisitorComponent from '@/Navigation/NavVisitorComponent.vue'
import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import { Button } from 'element-ui'
// import ElementUI from 'element-ui';

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.component(Button.name, Button)
// localVue.use(ElementUI);

const router = new VueRouter()

let wrapper = null;

describe('Tests Navigation as a visitor', () => {
  
  test('When displayTitles true, number of divs', () => {
    wrapper = shallowMount(NavVisitorComponent, {
        propsData: {
            'displayTitles': true,
         },
        localVue,
        router
      })
      let allDivs = wrapper.findAll('div');
      expect(allDivs).toHaveLength(4);
      console.log(wrapper.html());
      wrapper.destroy();
  })


  test('When displayTitles false, number of divs', () => {
    wrapper = shallowMount(NavVisitorComponent, {
        propsData: {
            'displayTitles': false,
         },
        localVue,
        router
      })
      let allDivs = wrapper.findAll('div');
      expect(allDivs).toHaveLength(1);
      wrapper.destroy();
  })



});