// import Vue from 'vue'
// import FooterComponent from '@/Footer/FooterComponent.vue'
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

// const ElRow = Vue.component("ElRow", {
//   name: "ElRow",
//   template: "<div class=\"row\"></div>"
// });

// const ElMain = Vue.component("ElMain", {
//   name: "ElMain",
//   template: "<div class=\"main\"></div>"
// });

// const ElCol = Vue.component("ElCol", {
//   name: "ElCol",
//   template: "<div class=\"col\"></div>"
// });

// // const FooterComponentTest = Vue.component("NavComponentTest", {
// //   name: "NavComponentTest",
// //   template: "<div>Footer Component</div>"
// // });

// beforeEach(() => {
//   wrapper = shallowMount(FooterComponent,
//     {
//       stubs: {
//         // stub with a specific implementation
//         'el-row': ElRow,
//         'el-main': ElMain,
//         'el-col': ElCol
//       }
//      });
// })

// afterEach(() => {
//     wrapper.destroy();
// })

// describe(' Test SearchComponent', () => {
//     it('print component', () => {
//     // const wrapper = factory();
//     // const wrapper = mount(ConditionComponent);
//     // const select = wrapper.find(".el-select");
//     // expect(div.exists()).toBe(true);
//     // wrapper = shallowMount(ConditionComponent, {
//     //   stubs: {
//     //     // stub with a specific implementation
//     //     'nav-component': NavComponentTest,
//     //     'footer-component': FooterComponentTest,
//     //     }
//     //   });
//       console.log(wrapper.html());
//   })
// });