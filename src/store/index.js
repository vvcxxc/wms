import Vue from 'vue'
import Vuex from 'vuex'
import dailog from './modules/dailog'
import user from './modules/user'
import app from './modules/app'
Vue.use(Vuex);
const store = new Vuex.Store({
    modules:{
        dailog,
        user,
        app
    }
});
export default store;