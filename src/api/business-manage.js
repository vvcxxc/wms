import request from '@/utils/request'

//获取customTable页面搜索头接口
export const getSearchHeader = (id) => {
    return request({
      url: '/WMSBusinessManage/Base_Page/GetPageInfo?page_ID='+ id,
      method: 'get'
    })
  }