<!--
 * @Description: 这是权限页面（组件）
 * @Date: 2020-08-25 14:22:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:31:04
-->
<template>
    <div class="power_box">
        <div class="power_conter">
            <div class="power_left">
                <div class="left_top">
                    <div class="left_top_1">
                         <el-table
                            :data="departmentArr"
                            highlight-current-row
                            @row-click="departmentClick"
                             ref="multipleTable2"
                            height="100%"
                            style="width: 100%">
                            <el-table-column
                                prop="DepartmentFullName"
                                label="角色组名称">
                                 <template slot="header">
                                    <span>部门名称</span>
                                   <div @click="addFun('部门')" class="header_icon addimg"></div>
                                </template>
                                <template slot-scope="scope">
                                   <span>{{scope.row.DepartmentFullName}}</span>
                                   <div @click="editFun(scope.row,'部门')" class="edit_icon editimg"></div>
                                   <div  @click="deleteFun(scope.row,'部门')" class="delete_icon deleteimg"></div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="left_top_2">
                         <el-table
                            :data="postArr"
                             height="100%"
                             highlight-current-row
                             @row-click="handleCurrentClick"
                             ref="multipleTable"
                            style="width: 100%">
                            <el-table-column
                                prop="date"
                                label="角色名称">
                                 <template slot="header">
                                    <span>岗位名称</span>
                                    <div @click="addFun('岗位')" class="header_icon addimg"></div>
                                </template>
                                 <template slot-scope="scope">
                                   <span>{{scope.row.PostName}}</span>
                                   <div @click="editFun(scope.row,'岗位')" class="edit_icon editimg"></div>
                                   <div @click="deleteFun(scope.row,'岗位')" class="delete_icon deleteimg"></div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="left_bottom">
                    <el-table
                            :data="userArr"
                             highlight-current-row
                             @row-click="userClickFun"
                            height="100%"
                            border
                            style="width: 100%">
                            <el-table-column
                                prop="EnCode"
                                width="280px"
                                label="用户工号">
                            </el-table-column>
                             <el-table-column
                                prop="RealName"
                                label="用户名称">
                            </el-table-column>
                        </el-table>
                </div>
            </div>
            <div class="power_right">
                <div class="right_top">
                    <div class="right_top_title">
                        <div class="top_title_line"></div>
                        <div class="top_title_text">{{powerName}}-权限管理</div>
                    </div>
                    <div class="right_top_conter">
                        <div class="powerTitle">
                            <span class="powerTitle_1">目录</span>
                            <span class="powerTitle_2">查看权限</span>
                            <span class="powerTitle_3">按钮授权</span>
                        </div>
                        <div class="powerHtml">
                           <el-tree 
                                :data="data" 
                                :props="defaultProps" 
                                @node-click="handleNodeClick"
                                >
                                <span class="custom-tree-node" slot-scope="{ node, data }">
                                    <span>{{ node.label }}</span>
                                    <div @click="treeNode1(node,data,$event)" class="treeDiv">
                                        <img :src="data.IsBrowse=='Y'?img2:img1">
                                    </div>
                                    <div @click="treeNode2(data,$event)" class="treeDiv2" 
                                    :class="data.IsAuthorized=='Y'?'active':'default'">{{data.IsAuthorized=='Y'?'已授权':'未授权'}}</div>
                                </span>
                            </el-tree>
                        </div>
                        <div @click="pageSaveFun()" class="save">保存</div>
                    </div>
                </div>
                <div class="right_bottom">
                    <div class="right_bottom_title">
                        <div class="bottom_title_line"></div>
                        <div class="bottom_title_text">{{powerName}}-权限管理</div>
                        <div class="title_all">
                            <el-checkbox label="全选" @change="allCheckFun()" v-model="allshow" name="type"></el-checkbox>
                        </div>
                         <div @click="BtnSaveFun()" class="save">保存</div>
                    </div>
                    <div class="right_bottom_conter">
                        <div v-for="(item,index) in btnarr" :key="index" class="powerBtn">
                            <el-checkbox :label="item.Btn_Text" v-model="item.isauthorized" name="type"></el-checkbox>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <tisPop :data="userdata" :text="deleteText" :type="tiseType" v-if="isTisPop"></tisPop>
        <addPop :text="deleteText" :data="popData" :id="departmentId" :type="tiseType" v-if="isAddPop"></addPop>
        <div class="mask_box" v-if="isTisPop || isAddPop"></div>
    </div>
</template>
<script>

import tisPop from '../../components/common/tisPop'
import addPop from './common/addPop'

export default {
       components:{
           tisPop,
           addPop
        },
    data(){
        return{
                powerName:'岗位',
                data:[], //树形页面数据
                AllData:[], //树形总数据
                saveDataArr:[], //修改的树形页面数据
                defaultProps: {
                    children: 'ChildrenPage',
                    label: 'PageText',
                },
                img1:require('../../assets/img/Lock on.png'),
                img2:require('../../assets/img/Unlock.png'),
                allshow:false,
                isTisPop:false,
                isAddPop:false,
                deleteText:'',
                tiseType:'',
                userdata:[], //删除单个岗位部门数据
                btnarr:[],  //按钮数据
                btnarrAll:[],//按钮总数据
                saveBtnDataArr:[],//修改的按钮数据
                departmentArr:[],  //初始页面数据
                popData:[],  //编辑单个岗位部门数据
                postArr:[],  //岗位数据
                userArr:[],  //用户数据
                handleNode:[], //单个树形页面数据
                departmentId:'',
                postId:'',
                useObj:''//按钮id
        }
    },
    created(){
        this.init()   
    },
    mounted(){
        //默认激活岗位
            setTimeout(()=>{
                this.$refs.multipleTable.setCurrentRow(this.$refs.multipleTable.data[0]);
                this.$refs.multipleTable2.setCurrentRow(this.$refs.multipleTable2.data[0]);
            },100)
            this.stopF5Refresh()
    },
    methods:{
        //初始化权限页面数据
        init(){
            this.id = this.$route.query.name
            var url = `${this.$store.state.dailog.url1}AuthorizeManage/Base_Authorize/GetDeptAndPostData`
              this.$axios({              //初始化部门岗位信息
                    method: 'post',
                    url: url,
                }).then(res => {
                    this.departmentArr = res.data.resultdata
                    this.postArr = this.departmentArr[0].PostList
                    this.departmentId = this.departmentArr[0].DepartmentId
                    this.postId = this.departmentArr[0].PostList[0].PostId
                     
                    var v = {
                        PostId:this.postId
                    }
                    this.handleCurrentClick(v)
                    this.useObj = this.departmentArr[0].PostList[0].PostId
                    this.userAxios(this.departmentId,this.postId).then(val=>{
                        this.PageDataAxios('1',this.postId)
                    })
                     setTimeout(()=>{
                        this.$refs.multipleTable.setCurrentRow(this.$refs.multipleTable.data[0]);
                        this.$refs.multipleTable2.setCurrentRow(this.$refs.multipleTable2.data[0]);
                     },100)
                }).catch(function(error) {
                        console.log(error);
                });
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
        //按钮权限数据
        btnAxios(id1,id2){
            var pageid = id1
            var userobj = id2
            var url = `${this.$store.state.dailog.url1}AuthorizeManage/Base_Authorize/GetButtonData?Page_ID=${pageid}&&useObj=${userobj}`
                this.$axios({
                    method:"post",
                    url:url,
                }).then((res)=>{
                    for(let i=0;i<res.data.resultdata.length;i++){
                        res.data.resultdata[i].isauthorized = res.data.resultdata[i].IsAuthorized=='N'?false:true
                    }
                    this.btnarr = res.data.resultdata
                    this.btnarrAll =JSON.parse(JSON.stringify(res.data.resultdata))
                }).catch(function(error) {
                        console.log(error);
                });

        },
        //用户数据
        userAxios(id1,id2){
             return new Promise((resolve, reject) => {
                    var DeptmentId = id1
                    var PostId = id2
                    var url = `${this.$store.state.dailog.url1}AuthorizeManage/Base_Authorize/GetUserList?DeptmentId=${DeptmentId}&&PostId=${PostId}`
                    this.$axios({        //初始化用户数据
                        method:"post",
                        url:url,
                    }).then((res)=>{
                        this.userArr = res.data.resultdata
                        resolve('成功了')
                    })
             })
        },
        //GetPageData权限树形数据
        PageDataAxios(text,id1){
            var htt = this.$store.state.dailog.url1
            var PostId = id1
            var url = `${htt}AuthorizeManage/Base_Authorize/GetPageData?useObj=${PostId}`
            // var url = `${htt}api/wms/page/menu?useObj=${PostId}`
            console.log('useObj',PostId)
             this.$axios({
                        method:"post",            //触发树形数据
                        url:url,
                    }).then((res)=>{
                         this.data = JSON.parse(JSON.stringify(res.data.resultdata))
                         this.AllData = res.data.resultdata
                    })
        },
        //全选
        allCheckFun(){
            if(this.allshow == true){
                for(let i=0;i<this.btnarr.length;i++){
                    this.btnarr[i].isauthorized = true
                }
            }else if(this.allshow == false){
                for(let i=0;i<this.btnarr.length;i++){
                    this.btnarr[i].isauthorized = false
                }
            }
        },
        //全选页面
        nodeAllImg(data,text){
                if(data.ChildrenPage.length != 0){
                    for(let i=0;i<this.data.length;i++){
                        if(this.data[i].Page_ID == data.Page_ID){
                            var dataNode = this.data[i].ChildrenPage
                            for(let j=0;j<dataNode.length;j++){
                                if(text == '0'){
                                    if(data.IsBrowse == 'Y'){
                                        dataNode[j].IsBrowse = 'N'
                                    }else{
                                        dataNode[j].IsBrowse = 'Y'
                                    }
                                }else{
                                     if(data.IsAuthorized == 'Y'){
                                        dataNode[j].IsAuthorized = 'N'
                                    }else{
                                        dataNode[j].IsAuthorized = 'Y'
                                    }
                                }
                                this.nodeAllImg(dataNode[j])
                            }
                        }
                    }
                }
        },
        //单选页面
        nodeNoeImg(data,alldata,text){
            for(let i=0;i<alldata.length;i++){
                if(alldata[i].Page_ID == data.parentID){
                    var dataNode = alldata[i].ChildrenPage
                    for(let j=0;j<dataNode.length;j++){
                        if(text == '0'){
                            if(dataNode[j].IsBrowse == 'Y'){
                                alldata[i].IsBrowse = 'Y'
                                break
                            }else{
                                alldata[i].IsBrowse = 'N'
                            }
                        }else{
                            if(dataNode[j].IsAuthorized == 'Y'){
                                alldata[i].IsAuthorized = 'Y'
                                break
                            }else{
                                alldata[i].IsAuthorized = 'N'
                            }
                        }
                    }
                }else{
                    if(alldata[i].ChildrenPage.length != 0 ){
                        this.nodeNoeImg(data,alldata[i].ChildrenPage)
                    }
                }
            }
        },
        //查看
        treeNode1(node,data,e){
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else if (window.event) {//IE
                window.event.cancelBubble = true;//IE
            }
            if(data.IsBrowse == 'Y'){
                if(data.type == 0){
                    this.nodeAllImg(data,'0')
                }else{
                     data.IsBrowse = 'N'
                    this.nodeNoeImg(data,this.data,'0')
                }
               e.target.src = this.img1
               data.IsBrowse = 'N'

            }else{
                e.target.src = this.img2
                 if(data.type == 0){
                     this.nodeAllImg(data,'0')
                 }else{
                      data.IsBrowse = 'Y'
                     this.nodeNoeImg(data,this.data,'0')
                 }
                data.IsBrowse = 'Y'
            }
        },
        //授权
        treeNode2(data,e){
        this.$nextTick(function(){
            if(data && e){
                if (e.stopPropagation) {
                      e.stopPropagation();
                  }
                  else if (window.event) {//IE
                      window.event.cancelBubble = true;//IE
                  }
                    if(data.IsAuthorized == 'Y'){
                          e.target.className = 'treeDiv2 default'
                          if(data.type == 0){
                              this.nodeAllImg(data,'1')
                          }else{
                              data.IsAuthorized = 'N'
                              this.nodeNoeImg(data,this.data,'1')
                          }
                          data.IsAuthorized = "N"
                      }
                      else{
                        e.target.className = 'treeDiv2 active'
                        if(data.type == 0){
                           this.nodeAllImg(data,'1')
                       }else{
                            data.IsAuthorized = 'Y'
                           this.nodeNoeImg(data,this.data,'1')
                       }
                       data.IsAuthorized = 'Y'
                  }
            }
        })
        },
        //更改的页面权限内容
        saveData(data,alldata){
             for(let i=0;i<data.length;i++){
                if(data[i].IsAuthorized != alldata[i].IsAuthorized || data[i].IsBrowse != alldata[i].IsBrowse){
                    var value = {
                        PageId:data[i].Page_ID,
                        UseObj:'',
                        ItemType:data[i].type,
                        State:data[i].IsAuthorized=='N'?0:1,
                        IsBorwse:data[i].IsBrowse=='N'?0:1,
                        UserType:''
                    }
                    if(this.powerName == '岗位'){ //岗位/角色
                       value.UseObj = this.postId
                       value.UserType = '1'
                    }else{
                       value.UseObj = this.useObj
                       value.UserType = '2'
                    }
                    this.saveDataArr.push(value)
                    if(data[i].ChildrenPage.length != 0){
                        this.saveData(data[i].ChildrenPage,alldata[i].ChildrenPage)
                    }
                }else{
                     if(data[i].ChildrenPage.length != 0){
                        this.saveData(data[i].ChildrenPage,alldata[i].ChildrenPage)
                    }
                }
            }
          

        },
        //更改的按钮权限内容
        btnsaveData(data,alldata){
             for(let i=0;i<data.length;i++){
                 if(data[i].isauthorized != alldata[i].isauthorized){
                     var value = {
                         PageId:this.handleNode.Page_ID,
                         ItemType:this.handleNode.type,
                         UseObj:'',
                         UserType:'',
                         State:data[i].isauthorized == true ? 1 : 0,
                         ButtonId:data[i].btn_id
                     }
                    if(this.powerName == '岗位'){ //岗位/角色
                       value.UseObj = this.postId
                       value.UserType = '1'
                    }else{
                       value.UseObj = this.useObj
                       value.UserType = '2'
                    }
                   this.saveBtnDataArr.push(value)
                 }
             }
        },
           //按钮权限保存
        BtnSaveFun(){
            this.saveBtnDataArr = []
            this.btnsaveData(this.btnarr,this.btnarrAll)
            var value = JSON.stringify(this.saveBtnDataArr)
            var url = `${this.$store.state.dailog.url1}AuthorizeManage/Base_Authorize/SaveButtonAuthorize`
            console.log('saveBtnDataArr',this.saveBtnDataArr)
            this.$axios({
                method:"post",
                url:url,
                data:this.saveBtnDataArr
            }).then((res)=>{
                this.deleteText = '修改成功'
                this.tiseType = '7'
                this.isTisPop = true
            })
        },
        //页面权限保存
        pageSaveFun(e){
           
            this.saveDataArr = []
            this.saveData(this.data,this.AllData)
            var value = JSON.stringify(this.saveDataArr)
            var url = `${this.$store.state.dailog.url1}AuthorizeManage/Base_Authorize/SavePageAuthorize`
             console.log('页面内容',this.saveDataArr)
               this.$axios({
                    method:"post",
                    url:url,
                    data:this.saveDataArr
                }).then((res)=>{
                    this.deleteText = '修改成功'
                    this.tiseType = '7'
                    this.isTisPop = true
                }).catch(err=>{
                })
        },
    
          //树形结构点击
         handleNodeClick(data) {
             this.handleNode = data
            if(data.type == 1){
                this.btnAxios(data.Page_ID,this.useObj)
            }
        },
         //部门组点击
        departmentClick(val){
            this.btnarr = []
            this.btnarrAll = []
            this.AllData = []
            this.data = []
            this.powerName = '岗位'
            if(val!=null){
                this.departmentId = val.DepartmentId
            }
            if(val!=null && val.PostList.length != 0){
                this.postArr = val.PostList
                this.postId = val.PostList[0].PostId
                  var v = {
                        PostId:this.postId
                    }
                    this.handleCurrentClick(v)
                this.useObj = this.postId
                //激活岗位
                setTimeout(()=>{
                    this.$refs.multipleTable.setCurrentRow(this.$refs.multipleTable.data[0]);
                },100)
            }else{
                this.userArr = []
                this.postArr = []
                this.data = []
                this.AllData = []
            }

        },
      
         //岗位组点击
        handleCurrentClick(val,column,e){
            this.AllData = []
            this.data = []
            this.btnarr = []
            this.btnarrAll = []
            this.powerName = '岗位'
            if(val != null){
                this.postId = val.PostId
                this.PageDataAxios('1',this.postId)
                this.useObj = this.postId
                this.userAxios(this.departmentId,this.postId)
            }
        },
      
       //用户姓名点击
        userClickFun(val){
             this.btnarr = []
             this.btnarrAll = []
             this.AllData = []
             this.data = []
             console.log('用户',val)
             if(val != null){
                this.powerName = '用户'
                this.useObj = val.UserId
                var id = val.UserId
                this.PageDataAxios('2',id)
             }
        },
       
        //删除
        deleteFun(data,name){
            this.deleteText = `您确定要删除该${name}信息吗?                                         【该${name}所有信息将被清空】`
            this.userdata = data
            if(name == '岗位'){
                this.tiseType = '5'
            }else{
                this.tiseType = '6'
            }
            this.isTisPop = true
        },
        //编辑
        editFun(data,name){
            this.deleteText = `编辑${name}`
             if(name == '岗位'){
                this.tiseType = '7'
                this.popData = data
            }else{
                this.popData = data
                this.tiseType = '8'
            }
             this.isAddPop = true
        },
        //添加
        addFun(name){
            this.deleteText = `添加${name}`
            if(name == '岗位'){
                this.tiseType = '5'
            }else{
                this.tiseType = '6'
            }
            this.isAddPop = true

        },
        //关闭弹窗
        closeFun(){
             this.isTisPop = false
             this.isAddPop = false
        }
    }
}
</script>
<style lang="less">
.power_box{
    .el-table th{
        background: #009688;
        color:#fff;
        text-align: left;
    }
    .el-table tr{
        text-align: left;
    }
    .el-checkbox__inner{
        width:25px;
        height: 25px;
    }
    .el-checkbox__inner::after{
        width:6px;
        height:14px;
        top:2px;
        left:8px;
    }
    .el-tree-node__content{
        margin-bottom:8px;
    }
}
</style>
<style lang="less" scoped>
.power_box{
    width:100%;
    height: 97%;
    background: #fff;
    padding-top:20px;
    .mask_box{
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        z-index: 9;
    }
    .header_icon{
        position: absolute;
        right: 12px;
        top: 0;
        width:24px;
        height: 24px;
        cursor: pointer;
    }
    .edit_icon{
        position: absolute;
        right: 36px;
        top: 10px;
        width:20px;
        height: 20px;
        cursor: pointer;
    }
    .delete_icon{
        position: absolute;
        right: 6px;
        top: 10px;
        width:20px;
        height: 20px;
        cursor: pointer;
    }
    .addimg{
        background: url('../../assets/img/Add.png');
        background-size:cover ;
    }
   .editimg{
        background: url('../../assets/img/Editor.png');
        background-size:cover ;
    }
    .deleteimg{
        background: url('../../assets/img/Delete.png');
        background-size:cover ;
    }
    .power_btn{
        width:96%;
        height:36px;
        margin: auto;
        overflow: hidden;
    }
    .power_conter{
        width:96%;
        height: 97%;
        margin: auto;
        overflow: hidden;
        .power_left{
            float: left;
            width:50%;
            height: 100%;
            .left_top{
                width:100%;
                height:63%;
                overflow: hidden;
                .left_top_1{
                    width:48%;
                    height: 100%;
                    border:1px solid rgba(219,219,219,1);
                    box-sizing: border-box;
                    float: left;
                }
                .left_top_2{
                    width:48%;
                    height: 100%;
                    float: right;
                    border:1px solid rgba(219,219,219,1);
                    box-sizing: border-box;
                }
            }
            .left_bottom{
                width:100%;
                height:31%;
                margin-top:2%;
                border:1px solid rgba(219,219,219,1);
                box-sizing: border-box;
            }
        }
        .power_right{
            float: left;
            width:46%;
            margin-left:2%;
            height: 100%;
            .right_top{
              width:100%;
              height:63%;
              .right_top_title{
                  width:100%;
                  height:9%;
                  overflow: hidden;
                  .top_title_line{
                      width:2px;
                      height:17px;
                      background:rgba(0,150,136,1);
                      float: left;
                      margin-top:14px;
                      margin:12px 10px 0 10px; 
                  }
                  .top_title_text{
                      font-size:18px;
                      font-family:Alibaba PuHuiTi;
                      font-weight:600;
                      color:rgba(0,150,136,1);
                      line-height: 42px;
                      float: left;
                  }
              }
              .right_top_conter{
                  width:100%;
                  height:91%;
                  border:1px solid rgba(222,222,222,1);
                  box-sizing: border-box;
                  position: relative;
                  .powerHtml{
                      width:100%;
                      height:80%;
                      overflow: auto;
                  }
                  .treeDiv{
                      display: inline-block;
                      position: absolute;
                      left: 41%;
                      width:18px;
                      height:18px;
                      cursor: pointer;
                      .img{
                          width:100%;
                          height:100%;
                          margin: auto;
                      }
                  }
                  .treeDiv2{
                        display: inline-block;
                        width:72px;
                        height:24px;
                        position: absolute;
                        left: 75%;
                        border-radius:12px;
                        font-size:14px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:400;
                        
                        text-align: center;
                        line-height: 24px;
                        cursor: pointer;
                        user-select: none;
                  }
                  .default{
                      color:rgba(74,74,74,1);
                      background:rgba(215,215,215,1);
                  }
                  .active{
                      color:rgba(0,150,136,1);
                      background:rgba(205,234,231,1);
                  }
                  .powerTitle{
                      width:100%;
                      height:40px;
                      background:rgba(238,238,238,1);
                      font-size:16px;
                      font-family:Source Han Sans CN;
                      font-weight:bold;
                      color:rgba(52,52,52,1);
                      line-height: 40px;
                      .powerTitle_1{
                         margin-left:7%;
                      }
                      .powerTitle_2{
                          margin-left:25%;
                      }
                      .powerTitle_3{
                          margin-left:28%;
                      }
                  }
                  .custom-tree-node{
                      width:100%;
                  }
                  .save{
                      position: absolute;
                      right: 36px;
                      bottom:1%;
                      width:115px;
                      height:36px;
                      border:1px solid rgba(0,150,136,1);
                      border-radius:5px;
                      font-size:14px;
                      font-family:Alibaba PuHuiTi;
                      font-weight:400;
                      color:rgba(0,150,136,1);
                      line-height: 36px;
                      text-align: center;
                      cursor: pointer;
                      user-select: none;
                  }
                  .save:hover{
                      background:  rgba(0,150,136,1);
                      color:#fff;
                  }
              }
            }
            .right_bottom{
                width:100%;
                height:31%;
                margin-top:2%;
                .right_bottom_title{
                    width:100%;
                    height: 17%;
                    position: relative;
                    .bottom_title_line{
                        width:2px;
                        height:17px;
                        background:rgba(0,150,136,1);
                        float: left;
                        margin-top:14px;
                        margin:12px 10px 0 10px; 
                    }
                    .bottom_title_text{
                        font-size:18px;
                        font-family:Alibaba PuHuiTi;
                        font-weight:600;
                        color:rgba(0,150,136,1);
                        line-height: 42px;
                        float: left;
                    }
                    .title_all{
                        position: absolute;
                        right: 15px;
                        bottom:0px;
                    }
                     .save{
                      position: absolute;
                      right: 36px;
                      top: 182px;
                      width:115px;
                      height:36px;
                      border:1px solid rgba(0,150,136,1);
                      border-radius:5px;
                      font-size:14px;
                      font-family:Alibaba PuHuiTi;
                      font-weight:400;
                      color:rgba(0,150,136,1);
                      line-height: 36px;
                      text-align: center;
                      cursor: pointer;
                      user-select: none;
                  }
                   .save:hover{
                      background:  rgba(0,150,136,1);
                      color:#fff;
                  }
                }
                .right_bottom_conter{
                    width:100%;
                    height:83%;
                    border:1px solid rgba(222,222,222,1);
                    box-sizing: border-box;
                    overflow: auto;
                    padding-right:130px ;
                    .powerBtn{
                        float: left;
                        margin-top:20px;
                        margin-left: 20px;
                        width: 140px;
                        height: 40px;
                    }
                   
                }
            }
        }
    }

}
.left{
    float: left;
}
.right{
    float: right;
}
 .button{
    width:80px;
    height:32px;
    border-radius:4px;
    font-size:14px;
    font-family:Source Han Sans CN;
    font-weight:400;
    color:rgba(248,248,248,1);
    line-height: 32px;
    overflow: hidden;
    margin-right:10px;
    text-align: center;
    user-select: none;
    cursor: pointer;
}
.botton1{
    width:115px;
}

.green{
    background:rgba(44,160,147,1);
}
.green:hover{
    background: #33DAC1;
}
.blue{
    background:rgba(50,141,234,1);
}
.blue:hover{
    background: #6FB4FA;
}
.red{
    background:rgba(230,98,98,1);
}

</style>