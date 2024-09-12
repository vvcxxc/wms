import axios from 'axios'

class HttpRequest {
	//构造器
	constructor (baseUrl = baseURL) {
		this.baseUrl = baseUrl
		this.queue = {}
	  }
	//统一请求头
	getInsideConfig() {
		const config = {
			baseURL: this.baseUrl,
			headers: {
				//
			}
		}
		return config
	}
	//拦截器
	interceptors(instance, url) {
		//请求拦截
		instance.interceptors.request.use(config => {
			
			return config
		}, error => {
			
			return Promise.reject(error)

		})

		//响应拦截
		instance.interceptors.response.use(response => {
			
			return response;
		}, error => {
			
			return Promise.reject(error);
		})
	}

	//axios请求
	request(options) {
		//创建自定义axios
		const instance = axios.create()
		options = Object.assign(this.getInsideConfig(), options)
		this.interceptors(instance, options.url)
		return instance(options)
	}
}

export default HttpRequest
