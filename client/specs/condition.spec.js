import Vue from 'vue'
import SearchComponent from '@/Intro/SearchComponent.vue'
import NavComponent from '@/Navigation/NavComponent.vue'
import BreadcrumpComponent from '@/Utils/BreadcrumpComponent.vue'
import FooterComponent from '@/Footer/FooterComponent.vue'
import ConditionComponent from '@/Information/ConditionComponent.vue'
// import SearchComponent from '../src/components/Intro/SearchComponent'
import { mount, shallowMount } from '@vue/test-utils'
// import SearchComponent from './SearchComponent'

// const factory = (values = {}) => {
//   return mount(SearchComponent, {
//     data () {
//       return {
//         ...values
//       }
//     }
//   })
// }

const NavComponentTest = Vue.component("NavComponentTest", {
  name: "NavComponentTest",
  template: "<div>Nav Component</div>"
});

const FooterComponentTest = Vue.component("NavComponentTest", {
  name: "NavComponentTest",
  template: "<div>Footer Component</div>"
});

let wrapper = null;

// beforeEach(() => {
//   wrapper = shallowMount(ConditionComponent,
//     {
//       stubs: {
//         // stub with a specific implementation
//         'nav-component': NavComponent,
//         'footer-component': FooterComponent
//       }
//      });
// })

describe(' Test SearchComponent', () => {

  it('print component', () => {
    // const wrapper = factory();
    // const wrapper = mount(ConditionComponent);
    // const select = wrapper.find(".el-select");
    // expect(div.exists()).toBe(true);
    wrapper = shallowMount(ConditionComponent, {
      stubs: {
        // stub with a specific implementation
        'nav-component': NavComponentTest,
        'footer-component': FooterComponentTest,
        }
      });
      console.log(wrapper.html());
  })
});