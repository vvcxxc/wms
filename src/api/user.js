import axios from '@/libs/api.request'
import request from '@/utils/request'

//登录接口s
export const login = (userName, password) => {
  // const data = {
  //   userName,
  //   password
  // }
  return request({
    url: 'Login/CheckLog2?usercode=' + userName + '&&password=' + password,
    emulateJSON: true,
    method: 'post'
  })
}

//获取菜单接口
export const getMenuList = () => {
  return request({
    url: '/AuthorizeManage/Base_Authorize/GetPageData',
    method: 'get'
  })
}

//退出登录
export const logout = () => {
  return request({
    url: '/Login/OutLogin',
    method: 'post'
  })
}

//获取用户初始化信息
export const getBaseDeparment = () => {
  return request({
    url: '/BaseManage/Base_Department/GetList',
    method: 'get'
  })
}

//获取用户岗位信息
export const getBasePost = () => {
  return request({
    url: '/BaseManage/Base_Post/GetList',
    method: 'post'
  })
}

//获取所有用户信息
export const getBaseUser = () => {
  return request({
    url: '/BaseManage/Base_User/GetAllList',
    method: 'post'
  })
}

//查询条件用户信息
export const getBaseConditionUser = (deId, postId, na) => {
  return request({
    url: '/BaseManage/Base_User/GetList?DepartmentId=' + deId + '&PostId=' + postId + '&encodeOruserName=' + na,
    method: 'post'
  })
}

//重置密码
export const resetPassword = (data) => {
  return request({
    url: '/BaseManage/Base_User/ResetPassword',
    data: data,
    method: 'post',
  })
}

//删除用户
export const removeFormUser = (data) => {
  return request({
    url: '/BaseManage/Base_User/RemoveForm',
    data: data,
    method: 'post',
  })
}

//保存用户
export const saveFormUser = (data) => {
  return request({
    url: '/BaseManage/Base_User/SaveForm',
    data: data,
    method: 'post',
  })
}

//删除部门
export const delDepartment = (data) => {
  return request({
    url: '/BaseManage/Base_Department/RemoveForm',
    data: data,
    method: 'post',
  })
}
//删除岗位
export const delPost = (data) => {
  return request({
    url: '/BaseManage/Base_Post/RemoveForm',
    data: data,
    method: 'post',
  })
}
//获取首页内容
export const getSystemInfo = () => {
  return request({
    url: `/Common/Common/GetSystemInfo`,
    method: 'post',
  })
}

//获取boxs内容
export const getSystemBoxsInfo = (url) => {
  console.log("++++++++", url)
  return request({
    url: url,
    method: 'post',
  })
}

// 全局弹窗接口
export const GetiOpenWindowsInfo = () => {
  return request({
    url: `/Common/Common/GetiOpenWindowsInfo`,
    method: 'post',
  })
}