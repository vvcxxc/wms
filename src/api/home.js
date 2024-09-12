import axios from '@/libs/api.request'

//获取首页图表接口
export const getPageChart = (id) => {
  return axios.request({
    url: 'Common/Base_Chart/GetPageChart?page_ID=' + id,
    method: 'get'
  })
}

//获取表格页面数据
export const getPageInfo = (id) => {
  return axios.request({
    url: 'COMmon/Base_Page/GetPageInfo?page_ID=' + id,
    method: 'get'
  })
}

//获取页面表格数据
export const getPageTableData = (url, queryArr) => {
  return axios.request({
    url: url,
    data: queryArr,
    method: 'post'
  })
}

//获取列表状态文本
export const getTableCondition = (id) => {
  return axios.request({
    url: 'WMSBusinessManage/Base_Quote/GetListJson?Page_ID=' + id,
    method: 'get'
  })
}

//获取编辑或添加,排版内容
export const tableSettingContent = (id, windowType) => {
  return axios.request({
    url: '/COMmon/Common/RenderEditWindows?Page_ID=' + id + '&WindowType=' + windowType,
    method: 'get'
  })
}

//请求编辑内容
export const popupEditorData = (url, data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}
//添加/编辑listPage保存接口
export const saveCommonData = (url, data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}

//获取地图数据
export const getMap = () => {
  return axios.request({
    url: 'WMSBusinessManage/WH_ContainerInfo/GetListJson',
    method: 'post'
  })
}

//权限管理
export const getDeptAndPostData = () => {
  return axios.request({
    url: 'AuthorizeManage/Base_Authorize/GetDeptAndPostData',
    method: 'post'
  })
}

//岗位权限信息保存
export const baseManageSaveForm = (data) => {
  return axios.request({
    url: 'BaseManage/Base_Post/SaveForm',
    method: 'post',
    data: data,
  })
}
//部门权限信息保存
export const baseDepartmentSaveForm = (data) => {
  return axios.request({
    url: 'BaseManage/Base_Department/SaveForm',
    method: 'post',
    data: data,
  })
}

//按钮权限数据
export const getButtonData = (pageid, userobj) => {
  return axios.request({
    url: `AuthorizeManage/Base_Authorize/GetButtonData?Page_ID=${pageid}&&useObj=${userobj}`,
    method: 'post',
  })
}

//用户数据
export const getUserList = (DeptmentId, PostId) => {
  return axios.request({
    url: `AuthorizeManage/Base_Authorize/GetUserList?DeptmentId=${DeptmentId}&&PostId=${PostId}`,
    method: 'post',
  })
}

//GetPageData权限树形数据
export const getPageData = (PostId) => {
  return axios.request({
    url: `AuthorizeManage/Base_Authorize/GetPageData?useObj=${PostId}`,
    method: 'post',
  })
}

//页面权限修改
export const savePageAuthorize = (data) => {
  return axios.request({
    url: `AuthorizeManage/Base_Authorize/SavePageAuthorize`,
    method: 'post',
    data: data
  })
}
//按钮权限修改
export const saveButtonAuthorize = (data) => {
  return axios.request({
    url: `AuthorizeManage/Base_Authorize/SaveButtonAuthorize`,
    method: 'post',
    data: data
  })
}

//列表删除
export const delListData = (url, data) => {
  return axios.request({
    url: url,
    method: 'post',
    data: data
  })
}

//表格录入
export const importExcel = (filename, Page_ID) => {
  return axios.request({
    url: `Common/Common/ImportExcel?Filedata=${Filedata}&&Page_ID=${Page_ID}`,
    method: 'post',
  })
}

//库位地图配置
export const getContainerMapInfo = () => {
  return axios.request({
    url: `WMSBusinessManage/WH_ContainerInfo/GetContainerMapInfo`,
    method: 'post',
  })
}

//获取图表数据
export const getEchartInfo = (url) => {
  return axios.request({
    url: url,
    method: 'get',
  })
}

//获取报警信息
export const getAlarmInfo = () => {
  return axios.request({
    url: 'Common/Common/GetAlarmInfo',
    method: 'post',
  })
}

//下拉查询
export const dropownQuery = (url) => {
  return axios.request({
    url: url,
    method: 'post',
  })
}

//多个下拉联动
export const dropownListQuery = (FieldID) => {
  return axios.request({
    url: `Common/Base_Field/GetGroupSelect?FieldID=${FieldID}`,
    method: 'post',
  })
}

//获取热力图数据
export const GetContainerHeatMap = (datas) => {
  return axios.request({
    url: `WH_ContainerInfo/GetContainerHeatMap?BeginDate=${datas.BeginDate}&EndDate=${datas.EndDate}&SpecQty=${datas.SpecQty}`,
    method: 'get',
  })
}

//按色次数
export const GetChangeColorList = (id) => {
  return axios.request({
    url: `Query/GetChangeColorList?page_ID=${id}`,
    method: 'get',
  })
}
