import axios from '@/libs/api.request'

//登录接口
export const login = (userName, password) => {
  // const data = {
  //   userName,
  //   password
  // }
  return axios.request({
    url: 'Login/CheckLog2?usercode=' + userName + '&&password=' + password,
    emulateJSON: true,
    method: 'post'
  })
}

//获取菜单接口
export const getMenuList = () => {
  return axios.request({
    url: 'AuthorizeManage/Base_Authorize/GetPageData',
    method: 'get'
  })
}

//退出登录
export const logout = () => {
  return axios.request({
    url: 'Login/OutLogin',
    method: 'post'
  })
}

//获取用户初始化信息
export const getBaseDeparment = () => {
  return axios.request({
    url: '/BaseManage/Base_Department/GetList',
    method: 'get'
  })
}

//获取用户岗位信息
export const getBasePost = () => {
  return axios.request({
    url: '/BaseManage/Base_Post/GetList',
    method: 'post'
  })
}

//获取所有用户信息
export const getBaseUser = () => {
  return axios.request({
    url: '/BaseManage/Base_User/GetAllList',
    method: 'post'
  })
}

//查询条件用户信息
export const getBaseConditionUser = (deId, postId, na) => {
  return axios.request({
    url: '/BaseManage/Base_User/GetList?DepartmentId=' + deId + '&PostId=' + postId + '&encodeOruserName=' + na,
    method: 'post'
  })
}

//重置密码
export const resetPassword = (data) => {
  return axios.request({
    url: '/BaseManage/Base_User/ResetPassword',
    data: data,
    method: 'post',
  })
}

//删除用户
export const removeFormUser = (data) => {
  return axios.request({
    url: '/BaseManage/Base_User/RemoveForm',
    data: data,
    method: 'post',
  })
}

//保存用户
export const saveFormUser = (data) => {
  return axios.request({
    url: '/BaseManage/Base_User/SaveForm',
    data: data,
    method: 'post',
  })
}

//删除部门
export const delDepartment = (data) => {
  return axios.request({
    url: 'BaseManage/Base_Department/RemoveForm',
    data: data,
    method: 'post',
  })
}
//删除岗位
export const delPost = (data) => {
  return axios.request({
    url: 'BaseManage/Base_Post/RemoveForm',
    data: data,
    method: 'post',
  })
}
//获取首页内容
export const getSystemInfo = () => {
  return axios.request({
    url: `/Common/Common/GetSystemInfo`,
    method: 'post',
  })
}

//获取boxs内容
export const getSystemBoxsInfo = (url) => {
  return axios.request({
    url: url,
    method: 'post',
  })
}

// 全局弹窗接口
export const GetiOpenWindowsInfo = () => {
  return axios.request({
    url: `/Common/Common/GetiOpenWindowsInfo`,
    method: 'post',
  })
}