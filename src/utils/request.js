import axios from "axios";

console.log(process.env);
import config from '@/config'
const service = axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
	timeout: 50000,
	async: true,
	//允许跨域
	crossDomain: true,
	retry: 4,
	retryDelay: 1000,
});

service.interceptors.request.use(
	(config) => {
		let url = config.url;
		let index = url.lastIndexOf('/') + 1
		let dx = url.indexOf("?")
		let name = url.substring(index, dx < 0 ? url.length : dx)
		if (["Login", 'GetPageData', 'GetSystemInfo', 'GetPageChart'].includes(name)) {
			return config;
		} else {
			let warehouseId = sessionStorage.getItem('warehouseId')
			if (warehouseId) {
				console.log("config",config, config.data)
				if (Array.isArray(config.data)) {
					config.data = {
						warehouseId: warehouseId,
						data: config.data
					}
				} else if (typeof (config.data) == 'string') {
					let _obj = JSON.parse(config.data)
					_obj.warehouseId = warehouseId;
					config.data = JSON.stringify(_obj)
				} else {
					config.data = Object.assign(config.data || {}, {
						warehouseId: warehouseId
					})
				}
			}
			return config
		}
	},
	(error) => {
		return Promise.reject(error);
	}
);

service.interceptors.response.use(
	(response) => {
		const res = response.data;
		if (res.Code === 4002) {
			// setCookie('login', '', -1)
			return [];
		} else {
			return response;
		}
	},
	(error) => {
		const { config, code, msg } = error;
		//请求超时
		if (code === "ECONNABORTED" || msg === "Network Error") {
			console.error(`请求超时，将在${config.retryDelay / 1000}秒后重试`);
			return new Promise((resolve) => {
				setTimeout(async (_) => {
					resolve(await service.request(config));
				}, config.retryDelay); // 设置发送间隔
			});
		} else if (error.response) {
			switch (error.response.status) {
				case 401:
					// setCookie('login', '', -1)
					break;
				case 504:
					console.error("服务器未响应");
					break;
				default:
					break;
			}
			return Promise.reject(error.response.data);
		}

		return Promise.reject(error);
	}
);

export default service;
