/*
 * @Description: 这是vueX属性页面（组件）
 * @Date: 2020-08-13 10:00:03
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 11:35:48
 */
const state={
    showUser:false,
    url1: 'https://' + window.location.host +'/',      //调用地址
    url3:'/api/',                                     //自己调试地址
    url4:'http://' + window.location.host + '/',      //后台调试地址
    AutorizedBtnList:[],     //按钮权限
    AutorizedPageList:[],    //页面数据
    routerArr:[],        //跳转页面信息
    rouerName:'',  //首页名字
    rouerId:''     //首页id
};
const getters={
    isShow(state){
       return state.showUser;
    },
}
const mutations={
    hide(state){
        state.showUser=false;
    },
    show(state){
        state.showUser=true;
    },

}
const actions={
    showDailog({commit}){
        commit('show');
    },
    hideDailog({commit}){
        commit('hide');
    },

  
}
export default{
    namespaced:true,
    getters,
    mutations,
    actions,
    state
}