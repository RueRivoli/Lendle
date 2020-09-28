import Vue from 'vue'
import Vuex from 'vuex'
import Avatar from 'vue-avatar'
import AvatarComponent from '@/utils/AvatarComponent.vue'
import indexStore from '@/store/index'
import { mount, createLocalVue } from '@vue/test-utils'

const localVue = createLocalVue()
localVue.use(Vuex)

let wrapper = null;

describe('Test AvatarComponent', () => {
    test('avatar print correct initials', () => {
        // const store = new Vuex.Store(indexStore);
        indexStore.state.username = 'François Ferdinant';
        indexStore.state.avatar = '';
        wrapper = mount(AvatarComponent,
            {
                propsData: {
                    size: 30,
                    name: 'Filip Morris'
                }
            },
            localVue, 
            indexStore
        );
        const avat = wrapper.find('.vue-avatar--wrapper');
       expect(avat.exists()).toBe(true);
       expect(avat.html()).toMatch('/*<span>FM</span>/');
       console.log(avat.html());
    //    expect(avat.html().contains('<span>FM</span>')).toBe(true);
    //     console.log(wrapper.html());
  })
});