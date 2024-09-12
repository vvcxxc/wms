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
					console.log('555',res)
					
					
					if (res.data.type==1) {
						const data= JSON.parse(res.data.resultdata)
						sessionStorage.tagList = JSON.stringify([])
						// commit('setUserInfo',data)
						resolve(res)
					}else{
						reject(res.data.message)
					}
					// commit('setToken', data.token)	
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