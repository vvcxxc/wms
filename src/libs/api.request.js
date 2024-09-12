import HttpRequest from './axios.js'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro
// console.log('baseUrl'+config.baseUrl.dev)
const axios = new HttpRequest(baseUrl)
export default axios
