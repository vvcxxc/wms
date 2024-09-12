import axios from '@/libs/api.request'

//获取首页图表接口
export const getPageChart = (id) => {
  return axios.request({
    // url: 'Common/Base_Chart/GetPageChart?page_ID=' + id,
    url: 'api/wms/chart/config?groupId=' + id,
    method: 'get'
  })
}

//获取表格页面数据
export const getPageInfo = (id) => {
  return axios.request({
    // url: 'COMmon/Base_Page/GetPageInfo?page_ID=' + id,
    url: 'api/wms/page?id=' + id,
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
    // url: 'WMSBusinessManage/Base_Quote/GetListJson?Page_ID=' + id,
    url: 'api/wms/option?id=' + id,
    method: 'get'
  })
}

//获取编辑或添加,排版内容
export const tableSettingContent = (id, windowType) => {
  return axios.request({
    url: '/api/wms/page/render-field?id=' + id + '&windowType=' + windowType,
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
    url: 'api/wms/map',
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
    // url: `/api/wms/page/menu?useObj=${PostId}`,
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
    // url: `WMSBusinessManage/WH_ContainerInfo/GetContainerMapInfo`,
    url: `api/wms/map/config`,
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

//创建仓库
export const CreateAsync = (data) => {
  return axios.request({
    url: 'WmsWarehouse/WmsWarehouse/CreateAsync',
    method: 'post',
    data: data
  })
}

//编辑仓库
export const UpdateAsync = (data) => {
  return axios.request({
    url: 'WmsWarehouse/WmsWarehouse/UpdateAsync',
    method: 'post',
    data: data
  })
}

//删除仓库
export const DeleteAsync = (data) => {
  return axios.request({
    url: 'WmsWarehouse/WmsWarehouse/DeleteAsync',
    method: 'post',
    data: data
  })
}

//创建库位
export const CreateLocationAsync = (data) => {
  return axios.request({
    url: 'WmsLocation/WmsLocation/CreateLocationAsync',
    method: 'post',
    data: data
  })
}

//编辑库位
export const UpdateLocationAsync = (data) => {
  return axios.request({
    url: 'WmsLocation/WmsLocation/UpdateLocationAsync',
    method: 'post',
    data: data
  })
}

//删除库位
export const DeleteLocationAsync = (data) => {
  return axios.request({
    url: 'WmsLocation/WmsLocation/DeleteLocationAsync',
    method: 'post',
    data: data
  })
}

//获取排
export const GetRowOptionsAsync = () => {
  return axios.request({
    url: '/WmsLocation/WmsLocation/GetRowOptionsAsync',
    method: 'get',
  })
}

//获取列
export const GetColumnOptionsAsync = (row) => {
  return axios.request({
    url: `/WmsLocation/WmsLocation/GetColumnOptionsAsync?rowIndex=${row}`,
    method: 'get',
  })
}

//获取层
export const GetTierOptionsAsync = (row, col) => {
  return axios.request({
    url: `/WmsLocation/WmsLocation/GetTierOptionsAsync?rowIndex=${row}&columnIndex=${col}`,
    method: 'get',
  })
}

//
export const GetSelectTion = (type) => {
  return axios.request({
    url: `/api/wms/option/items?id=${type}`,
    method: 'get',
  })
}
//检查夹具码
export const CheckEquipmentCode = (code) => {
  return axios.request({
    url: `/api/wms/product/equipment-no-${code}`,
    method: 'get',
  })
}


//新建入库
export const CreateInbound = (data) => {
  return axios.request({
    url: `/api/wms/task-queue/create-inbound`,
    method: 'post',
    data: data
  })
}

//修改入库
export const UpdateInbound = (data) => {
  return axios.request({
    url: `/api/wms/task-queue/update-inbound?id=${data.id}`,
    method: 'post',
    data: data
  })
}

//新建出库
export const CreateOutbound = (data) => {
  return axios.request({
    url: `/api/wms/task-queue/create-outbound`,
    method: 'post',
    data: data
  })
}

//修改出库
export const UpdateOutbound = (data) => {
  return axios.request({
    url: `/api/wms/task-queue/update-outbound?id=${data.id}`,
    method: 'post',
    data: data
  })
}

//部门列表
export const organizationUnitAll = () => {
  return axios.request({
    url: `/api/wms/organization-unit/all`,
    method: 'GET',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//角色列表
export const identityRolesAll = () => {
  return axios.request({
    url: `/api/identity/roles/all`,
    method: 'GET',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//add部门
export const organizationUnitPost = (data) => {
  return axios.request({
    url: `/api/wms/organization-unit`,
    method: 'post',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

export const organizationUnitDel = (id) => {
  return axios.request({
    url: `/api/wms/organization-unit/${id}`,
    method: 'DELETE',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//edit部门
export const organizationUnitPut = (data) => {
  return axios.request({
    url: `/api/wms/organization-unit/${data.id}`,
    method: 'PUT',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//add角色
export const identityRolesPost = (data) => {
  return axios.request({
    url: `/api/identity/roles`,
    method: 'post',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

export const identityRolesDelete = (id) => {
  return axios.request({
    url: `/api/identity/roles/${id}`,
    method: 'DELETE',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//edit角色
export const identityRolesPut = (data) => {
  return axios.request({
    url: `/api/identity/roles/${data.id}`,
    method: 'PUT',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//用户列表
export const wmsUserList = () => {
  return axios.request({
    url: `/api/wms/user?Sorting=&SkipCount=0&MaxResultCount=9999`,
    method: 'GET',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

export const wmsUserItem = (id) => {
  return axios.request({
    url: `/api/wms/user/${id}`,
    method: 'GET',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

//add列表
export const addWmsUser = (data) => {
  return axios.request({
    url: `/api/wms/user`,
    method: 'post',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

export const delWmsUser = (id) => {
  return axios.request({
    url: `/api/wms/user/${id}`,
    method: 'DELETE',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}


//edit列表
export const editWmsUser = (data) => {
  return axios.request({
    url: `/api/wms/user/${data.id}`,
    method: 'put',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}

export const searchPermissions = (providerName, providerKey) => {
  return axios.request({
    url: `/api/permission-management/permissions/tree?providerName=${providerName}&providerKey=${providerKey}`,
    method: 'GET',
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}
export const editPermissions = (providerName, providerKey, data) => {
  return axios.request({
    url: `/api/permission-management/permissions?providerName=${providerName}&providerKey=${providerKey}`,
    method: 'PUT',
    data: data,
    headers: {
      'Accept-Language': 'zh-Hans'
    }
  })
}
