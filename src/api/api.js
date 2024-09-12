/*
 * @Description: 这是***页面（组件）
 * @Date: 2020-09-11 12:59:09
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 11:38:34
 * 没有用的，api都写在各自页面
 */

import request from '@/utils/request'
let baseUrl = '';
export const getUserList = params=>{
    return request.get(`${baseUrl}/user/list`,{params:params})
}
export const getSysmenu = ()=>{
    return request.get('../../menu.json')
}
export const getDeleUser = params=>{
    return request.get('user/deletUsers',{params:params});
}
export const getEditUser = params=>{
    return request.get(`${baseUrl}/user/editUser`,{
        params:params
    })
}
export const getAddUser = params=>{
    return request.get(`${baseUrl}/user/addUser`,{
        params:params
    })
}
export const getDeleteOne = params=>{
    return request.get(`${baseUrl}/user/DeleteOne`,{params:params})
}
export const testApi = ()=>{
    return request.get("/testApi/getkeywhereisddata?CITY_NAME=全省&S_id=B08I00136&callback=")
}
