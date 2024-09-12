<!--
 * @Description: 这是用户信息页面（组件）
 * @Date: 2020-08-28 10:13:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:39:33
-->
<template>
    <div class="user_box" v-loading="loading">
       <div class="user_head">
           <div class="user_head_box left">
                <el-select clearable @change="departFun()" v-model="DepartmentV" placeholder="请选择">
                    <el-option
                    v-for="item in DepartmentArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
           </div>
           <div class="user_head_box left">
                <el-select clearable v-model="PostV" placeholder="请选择">
                    <el-option
                    v-for="item in PostArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
           </div>
           <div class="user_head_box left">
               <el-input v-model="encodeOruserName" placeholder="请输入内容"></el-input>
           </div>
           <div @click="queryFun()" class="button left blue">查询</div>
       </div>
       <div style="margin-top:10px" class="user_head">
            <div @click="getexcel()" class="button right orange">导出</div>
            <div @click="selfReset()" class="button right blue">重置个人密码</div>
            <div @click="allReset()" class="button right blue">重置账号密码</div>
            <div @click="addFun()" class="button right blue">新增</div>
       </div>
 
       <div class="user_conter">
             <el-table
                :data="tableData"
                stripe
                height="636px"
                highlight-current-row
                v-loading="loading2"
                border
                 @current-change="handleCurrentChange"
                style="width: 100%">
                <el-table-column
                prop="RealName"
                label="姓名"
                :show-overflow-tooltip="true"
                width="120">
                </el-table-column>
                <el-table-column
                prop="EnCode"
                label="账号"
                :show-overflow-tooltip="true"
                width="180">
                </el-table-column>
                <el-table-column
                prop="DepartmentFullName"
                :show-overflow-tooltip="true"
                 width="180"
                label="部门">
                </el-table-column>
                 <el-table-column
                prop="PostName"
                 width="180"
                 :show-overflow-tooltip="true"
                label="岗位">
                </el-table-column>
                 <el-table-column
                prop="Telephone"
                 width="180"
                 :show-overflow-tooltip="true"
                label="联系方式">
                </el-table-column>
                 <el-table-column
                prop="Remark"
                 width="220"
                 :show-overflow-tooltip="true"
                label="备注">
                </el-table-column>
                <el-table-column
                 min-width="180px"
                 label="操作">
                    <template slot-scope="scope">
                        <div @click="editFun(scope.row)" class="edit left"></div>
                        <div @click="deleteFun(scope.row)" class="delete left"></div>
                    </template>
                </el-table-column>
            </el-table>
       </div>
         <!-- 分页组件 -->
            <page :allpage="allpage" ref="page"></page>
            
        <!-- 弹窗组件 -->
        <tisPop :data="resetArr" :text="deleteText" :type="tiseType" ref="tispop" v-if="isTisPop"></tisPop>
        <userPop :data="userData" :DepartmentArr="DepartmentArr" :PostAllArr="PostAllArr" :type="popType" v-if="isUserPop"></userPop>
        <div class="mask_box" v-if="isTisPop || isUserPop"></div>
    </div>
</template>
<script>
import tisPop from '../../components/common/tisPop'
import page from '../../components/common/page'
import userPop from './common/userPop'
export default {
    components:{
        page,
        userPop,
        tisPop
    },
    data(){
        return{
            isTisPop:false,
            isUserPop:false,
            resetArr:[],
            allpage:0,//分页总数
            popType:'',
            tiseType:'',
            deleteText:'',
            DepartmentArr: [],
            DepartmentV:'',
            PostArr:[],
            PostAllArr:[],
            PostV: '',
            encodeOruserName:'',
            tableData: [],
            data:[],
            userData:[],
            DepartmentId:'',
            loading2:false,
            loading:false
        }
    },
    created(){
        this.init()
    },
    mounted(){
        this.stopF5Refresh()
    },
    methods:{
        init(){
            //初始化列表信息
            this.loading = true
            this.allpage = 0
            this.allAxiosFun()
            var url1 =  `${this.$store.state.dailog.url1}/BaseManage/Base_Department/GetList`
            this.DepartmentFun(url1).then(()=>{
                 var url =  `${this.$store.state.dailog.url1}/BaseManage/Base_Post/GetList`
                 this.$axios({           //初始化岗位数据
                    method: 'post',
                    url: url,
                 }).then(res => {
                    this.loading =false
                    let data = res.data
                    this.PostAllArr = []
                    let cfarr = []
                    for(let i=0;i<data.length;i++){
                            let index = cfarr.indexOf(data[i].PostName)
                            if(index == -1){   //防重复
                                cfarr.push(data[i].PostName)
                                var value = {
                                    value:data[i].PostName,
                                    label:data[i].PostName,
                                    id:data[i].PostId,
                                    ParentId:data[i].DepartmentId
                                }
                                this.PostAllArr.push(value)
                            }
                    }
                 }).catch((err)=>{
                     this.loading =false
                 })
            })           
        },
        //阻止F5事件并页面刷新
        stopF5Refresh() {
            document.onkeydown =  (e) => {
                var evt = window.event || e;
                var code = evt.keyCode || evt.which;
                if (code == 116) {
                    this.init()
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    } else {
                        evt.keyCode = 0;
                        evt.returnValue = false
                    }
                
                }
            }
        },
        //筛选部门-岗位（DepartmentId可能有变）
        departFun(){
            this.PostArr = []
            for(let i=0;i<this.DepartmentArr.length;i++){
                if(this.DepartmentArr[i].value == this.DepartmentV){
                    for(let j=0;j<this.PostAllArr.length;j++){
                        if(this.PostAllArr[j].ParentId == this.DepartmentArr[i].id){
                            this.PostArr.push(this.PostAllArr[j])
                        }
                    }

                }
            }
            if(this.PostArr.length != 0){
                this.PostV = this.PostArr[0].value
            }else{
                this.PostV = ''
            }
        },
        //部门请求
        DepartmentFun(url){
             return new Promise((resolve, reject) => {
                  this.$axios({
                    method: 'get',
                    url:url
                  }).then((res)=>{
                         let data = res.data
                        this.DepartmentArr = []
                        let cfarr = []
                        for(let i=0;i<data.length;i++){
                            let index = cfarr.indexOf(data[i].DepartmentFullName)
                            if(index == -1){   //防重复
                                cfarr.push(data[i].DepartmentFullName)
                                var value = {
                                    value:data[i].DepartmentFullName,
                                    label:data[i].DepartmentFullName,
                                    id:data[i].DepartmentId
                                }
                                this.DepartmentArr.push(value)
                            }
                        }
                    resolve('成功了')
                  })
             })
        },
        //默认查询全部
        allAxiosFun(){
            var url2 = `${this.$store.state.dailog.url1}/BaseManage/Base_User/GetAllList`
            this.$axios({         //列表信息    
                method: 'post',
                url: url2,
            }).then(res => {
                this.data = res.data.resultdata
                if(this.data != null){
                    if(this.data.length != 0){
                        this.tableData =  this.data.slice(0,50)
                        this.allpage = this.data.length
                    }
                }
            })
        },
         //部门岗位数据
        dataFun3(data,text){
            for(let i=0;i<data.length;i++){
                if(text == data[i].value){
                   return data[i].id
                }
            }
        },
        //查询
        queryFun(){
              var DepartmentId
              var PostId
              var encodeOruserName = this.encodeOruserName
              if(this.DepartmentV != ''){
                  DepartmentId = this.dataFun3(this.DepartmentArr,this.DepartmentV)
              }else{
                  DepartmentId = ''
              }
              if(this.PostV != ''){
                  PostId = this.dataFun3(this.PostArr,this.PostV)
              }else{
                  PostId = ''
              }
              this.loading2 = true
                var url3 = `${this.$store.state.dailog.url1}/BaseManage/Base_User/GetList?DepartmentId=${DepartmentId}&PostId=${PostId}&encodeOruserName=${encodeOruserName}`
                this.$axios({          //查询信息
                    method: 'post',
                    url: url3,
                }).then(res => {
                    this.loading2 = false
                     this.data = res.data.resultdata
                    if(this.data.length != 0 ){
                        this.tableData =  this.data.slice(0,50)
                    }else{
                        this.tableData = []
                    }
                    this.allpage = this.data.length
                }).catch(()=>{
                    this.loading2 = false
                })
        },
        //重置密码接口
        setPassWordFun(data){
            var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/ResetPassword`
              this.$axios({          //重置密码
                    method: 'post',
                    url: url,
                    data:data
                }).then(res => {
                       this.$refs.tispop.tispsrcc()
                }).catch((err)=>{
                    console.log('err',err)
                })
        },
        //重置个人密码
        setPasswordFun2(data){
            return new Promise((resolve, reject) => {
                 var id = localStorage.getItem('ms_userid')
                 data.UserId = id
                 var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/ResetPassword`
                 this.$axios({          //重置密码
                    method: 'post',
                    url: url,
                    data:data
                 }).then(res => {
                        resolve('成功了')
                 }).catch((err)=>{
                    console.log('err',err)
                 })
         
             })
        },
        //新增
        addFun(){
            this.popType = '1'
           this.isUserPop = true
        },
        //删除方法
        deletAxiosFun(id){
            var value = {
                UserId:id
            }
            var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/RemoveForm`
             this.$axios({          //重置密码
                method: 'post',
                url: url,
                data:value
            }).then(res => {
                this.allAxiosFun()
                this.closeFun()
            }).catch((err)=>{
                console.log('err',err)
            })
        },
        //删除
        deleteFun(data){
            this.tiseType = '1'
            this.deleteText = '您确定要删除该条用户信息吗？'
            this.isTisPop = true
            this.userData = data
        },
        //编辑
        editFun(data){
            this.popType = '2'
            this.isUserPop = true
            this.userData = data
        },
        //重置个人密码
        selfReset(){
            this.tiseType = '2'
            this.isTisPop = true
        },
        //重置账号密码
        allReset(){
            if(this.resetArr.length == 0){
                 this.tiseType = '4'
                 this.isTisPop = true
                 this.deleteText = '请选择用户'
            }else{
                 this.tiseType = '3'
                 this.isTisPop = true
            }
        },
        //关闭弹窗
        closeFun(text){
            if(text == '1'){
                this.isTisPop = false
            }else{
                this.isTisPop = false
                this.isUserPop = false
            }
        },
        //表单选择
        handleCurrentChange(val){
           this.resetArr = val
        },
         //分页数据
        dataFun2(num){
             if(this.data.length != 0 ){
                 this.tableData = this.data.slice(0,num)
             }
        },
         //分页数据
       dataFun(index,num){
         if(index == 1){
              if(this.data.length != 0 ){
                  this.tableData = this.data.slice(0,num)
              }
         }else{
           var ind = (index-1) * num
           var zn = num+ind
            if(this.data.length != 0 ){
                this.tableData = this.data.slice(ind,zn)
            }
         }
       },
        //提示
        tipsFun(text){
            this.tiseType = '7'
            this.deleteText = text
            this.isTisPop = true
        },
           //导出
        formatJson(filterVal, jsonData) {
        　　　　return jsonData.map(v => filterVal.map(j => v[j]))
        　　},
        getexcel() {
        　　　　 require.ensure([], () => {
        　　　　　　 const { export_json_to_excel } = require('../../vendor/Export2Excel.js');
                    const tHeader =  ['姓名','账号','部门','岗位','联系方式','备注']
                    const filterVal = ['RealName','encode','departmentfullname','postname','telephone','remark']
                    const list = this.data;
                　　const data = this.formatJson(filterVal, list);
        　　　　　　export_json_to_excel(tHeader, data, '用户信息列表');
        　　　　})
        　 }


    }
    
}
</script>
<style lang="less">
.user_box{
   .el-table th{
        background: #009688;
        color:#fff;
        text-align: center;
    }
    .el-table--enable-row-transition .el-table__body td{
        text-align: center;
    }
     .user_conter{
        .el-loading-mask{
            top:56px;
        }
    }
}
</style>
<style lang="less" scoped>
.user_box{
    width:100%;
    height: 97%;
    background: #fff;
    padding-top:23px;
    .left{
        float: left;
    }
    .right{
        float: right;
    }
    .user_head{
        width:96%;
        height:36px;
        margin: auto;
        overflow: hidden;
        .user_head_box{
            width:160px;
            height: 34px;
            margin-top:1px;
            margin-right: 12px;
        }
         .button{
            width:115px;
            height:36px;
            border-radius:5px;
            font-size:14px;
            font-family:Source Han Sans CN;
            font-weight:400;
            color:rgba(248,248,248,1);
            cursor: pointer;
            line-height: 36px;
            overflow: hidden;
            margin-right:10px;
            text-align: center;
            user-select: none;
        }
        .btn_MW{
             width:65px;     
        }
        .blue{
            background: #00A0E9;
        }
        .blue:hover{
            background: #6FB4FA;
        }
        .orange{
            background: #E6A23C;
        }
        .orange:hover{
            background: #F7C16C;
        }
    }
    .user_conter{
        width:96%;
        margin: auto;
        height: 646px;
        margin-top:20px;
        .edit{
            margin-left:40%;
            margin-right: 10px;
            width: 20px;
            height: 20px;
             background: url("../../assets/img/Editor.png");
            background-size: cover;
            cursor: pointer;
        }
        .delete{
            width: 20px;
            height: 20px;
            background:url('../../assets/img/Delete.png');
            background-size: cover;
            cursor: pointer;
        }
    }
     .mask_box{
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        z-index: 10;
    }
}
</style>