import { logout,login } from '@/api/user.js'
export default {
	state: {
		//
		userInfo:'',//用户信息
	},
	mutations: {
		//
		setUserInfo(state,userInfo){
			state.userInfo = userInfo
		},
	},
	actions: {
		// 登录
		handleLogin({
			commit
		}, {
			userName,
			password
		}) {
			userName = userName.trim()
			return new Promise((resolve, reject) => {
				login(
					userName,
					password
				).then(res => {
					// console.log(res)
					
					const data = res.data
					if(data.isLogin){
						sessionStorage.tagList = JSON.stringify([])
						commit('setUserInfo',data.resultdata)
					}
					
					// commit('setToken', data.token)
					resolve(res)
				}).catch(err => {
					reject(err)
				})
			})
		},
		// 退出登录
		handleLogOut ({ state, commit }) {
			return new Promise((resolve, reject) => {
			  logout().then(() => {
			  localStorage.removeItem("ms_username");
				resolve()
			  }).catch(err => {
				reject(err)
			  })
			})
		  },
	},
	modules: {
		
	}
}