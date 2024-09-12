/*
 * @Description: 这是***页面（组件）
 * @Date: 2020-08-13 09:40:53
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-12-07 10:50:57
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';
import config from '@/config';
import ElementUI from 'element-ui';
//import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/theme-green/index.css';       // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import "babel-polyfill";
import './store/index.js'
import store from './store'
import Moment from 'moment';
import echarts from 'echarts'
import moment from 'moment'//导入文件 
import '@/libs/directives.js'
import Blob from './vendor/Blob.js'
import Export2Excel from './vendor/Export2Excel.js'
import request from '@/utils/request'

Vue.config.devtools = true;
Vue.prototype.$moment = moment;//赋值使用
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.use(ElementUI, {
    size: 'small'
});
Vue.prototype.$axios = axios;
Vue.prototype.$request = request;

/**
 * @description 全局注册应用配置
 */
 Vue.prototype.$config = config
// //使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     if (!role && to.path !== '/login') {
//         if(to.path == '/kanban1' || to.path == '/kanban2' || to.path == '/kanban3' ||to.path == '/customTable' || to.path == '/shanhe'){
//             next()
//         }else{
//             next('/login');
//         }
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// })


new Vue({
    router,
    render: h => h(App),
    store: store
}).$mount('#app')