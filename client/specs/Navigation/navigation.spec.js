// import Vue from 'vue'
// import NavComponent from '@/Navigation/NavComponent.vue'
// import NavVisitorComponent from '@/Navigation/NavVisitorComponent';
// import NavLoanerComponent from '@/Navigation/NavLoanerComponent';
// import NavRenterComponent from '@/Navigation/NavRenterComponent';

// const localVue = createLocalVue()

// localVue.use(Vuex)


// import { mount, shallowMount } from '@vue/test-utils'
// // import SearchComponent from './SearchComponent'

// // const factory = (values = {}) => {
// //   return mount(SearchComponent, {
// //     data () {
// //       return {
// //         ...values
// //       }
// //     }
// //   })
// // }

// let wrapper = null;

// beforeEach(() => {
//   wrapper = mount(NavComponent,
//     {
//       stubs: {
//         // stub with a specific implementation
//         'nav-component': NavComponent,
//         'footer-component': FooterComponent
//       }
//      });
// })

// describe(' Test SearchComponent', () => {

//   it('print component', () => {
//     // const wrapper = factory();
//     // const wrapper = mount(ConditionComponent);
//     // const select = wrapper.find(".el-select");
//     // expect(div.exists()).toBe(true);
//     wrapper = shallowMount(ConditionComponent, {
//       stubs: {
//         // stub with a specific implementation
//         'nav-component': NavComponentTest,
//         'footer-component': FooterComponentTest,
//         }
//       });
//       console.log(wrapper.html());
//   })
// });