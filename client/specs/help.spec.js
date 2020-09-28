import Vue from 'vue'
import HelpComponent from '@/Information/HelpComponent.vue'
import { shallowMount } from '@vue/test-utils'

let wrapper = null;

const NavComponent = Vue.component("NavComponent", {
  name: "NavComponent",
  template: "<div class=\"nav\"></div>"
});

const FooterComponent = Vue.component("FooterComponent", {
  name: "FooterComponent",
  template: "<div class=\"footer\"></div>"
});

describe('Test HelpComponent', () => {
    it('print component', () => {
      wrapper = shallowMount(HelpComponent,
        {
            stubs: {
                   'nav-component': NavComponent,
                   'footer-component': FooterComponent
            }
        });
      console.log(wrapper.html());
  })
});