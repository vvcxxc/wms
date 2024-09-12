export default {
	state: {
		//
		menuList:[],//菜单列表
		tagNavList:[],//标签列表
		pageBtnList:[],     //按钮权限
		systemType:localStorage.getItem('systemType')?localStorage.getItem('systemType'):'1' //系统皮肤，1-皮肤1，2-皮肤2
	},
	getters: {
		
	},
	mutations: {
		//
		setTagNavList(state,list){
			// localStorage.setItem('tagNavList',list)
			state.tagNavList = list
		}
	},
	actions: {
		//
	},
	modules: {
		
	}
}