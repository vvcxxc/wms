<!--
 * @Description: 这是权限页面（组件）
 * @Date: 2020-08-25 14:22:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:31:04
-->
<template>
  <div class="authority-box" v-loading="loading">


    <div class="power_conter">
      <div class="power_left">
        <div class="left_top">
          <div class="left-top-header">
            <el-button class="btn-style1" @click="shuaxinFun"><img :src="shuaxin" />刷新</el-button>
          </div>
          <div class="left_top_1">
            <el-table :data="departmentArr" highlight-current-row ref="multipleTable2" height="100%"
              style="width: 100%">
              <el-table-column prop="displayName" label="角色组名称">
                <template slot="header">
                  <span>部门名称</span>
                  <div @click="addFun('部门')" class="header_icon">
                    <!-- <img src="../../assets/img/Add.png" class="addimg" /> -->
                    <i class="el-icon-circle-plus-outline"></i>
                    添加
                  </div>
                </template>
                <template slot-scope="scope">
                  <span>{{ scope.row.displayName }}</span>
                  <div @click="editFun(scope.row, '部门')" class="edit_icon">
                    <i class="el-icon-edit-outline"></i>
                  </div>
                  <div @click="deleteFun(scope.row, '部门')" class="delete_icon">
                    <i class="el-icon-delete"></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="left_top_2">
            <el-table :data="postArr" height="100%" highlight-current-row @row-click="handleCurrentClick"
              ref="multipleTable" style="width: 100%">
              <el-table-column prop="name" label="角色名称">
                <template slot="header">
                  <span>角色名称</span>
                  <div @click="addFun('角色')" class="header_icon">
                    <!-- <img src="../../assets/img/Add.png" class="addimg" /> -->
                    <i class="el-icon-circle-plus-outline"></i>
                    添加
                  </div>
                </template>
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                  <div @click="editFun(scope.row, '角色')" class="edit_icon">
                    <i class="el-icon-edit-outline"></i>
                  </div>
                  <div @click="deleteFun(scope.row, '角色')" class="delete_icon">
                    <i class="el-icon-delete"></i>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>


      <div class="power_right">
        <div class="right_top">
          <div class="right_top_title">

            <div class="top_title_text">
              <img src="../../assets/img1/65.png" />{{ powerName }}-权限管理
            </div>
          </div>
          <div class="right_top_conter">
            <div class="powerTitle">
              <span class="powerTitle_1">目录</span>
              <!-- <span class="powerTitle_2">查看权限</span>
              <span class="powerTitle_3">按钮授权</span> -->
            </div>
            <div class="powerHtml">
              <el-tree :data="powerTreeData" :props="defaultProps" node-key="name" show-checkbox default-expand-all
                @check="handleNodeClic2"
                :default-checked-keys="argRightIDList.filter(_ => _.isGranted).map(_ => _.name)">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>

                </span>
              </el-tree>
            </div>
            <div @click="pageSaveFun()" class="save">
              <el-button class="btn-style1"><img :src="baocun" />保存</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="left_bottom">
      <el-table :data="userArr" highlight-current-row height="100%" border style="width: 100%">
        <el-table-column prop="userName" label="用户账号">
        </el-table-column>
        <el-table-column prop="name" label="用户名称">
        </el-table-column>
        <el-table-column prop="jobNumber" label="用户工号">
        </el-table-column>
        <el-table-column prop="organizationUnits" label="部门">
          <template slot-scope="scope">
            {{ scope.row.organizationUnitsDisplayName.join(',') }}
          </template>
        </el-table-column>
        <el-table-column prop="roleNames" label="角色">
          <template slot-scope="scope">
            {{ scope.row.roleNames.join(',') }}
          </template>
        </el-table-column>
        <el-table-column prop="phoneNumber" label="电话">
        </el-table-column>

        <el-table-column prop="email" label="邮箱">
          <template slot="header">
            <span>邮箱</span>
            <div @click="addUserFun" class="header_icon">
              <i class="el-icon-circle-plus-outline"></i>
              添加
            </div>
          </template>
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
            <div @click="editUserFun(scope.row)" class="edit_icon">
              <i class="el-icon-edit-outline"></i>
            </div>
            <div @click="deleteFun(scope.row, '用户')" class="delete_icon">
              <i class="el-icon-delete"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>


    <div class="mask_box" v-if="isAddPop"></div>
    <add-pop ref="userAddPop" :text="deleteText" :data="popData" :id="departmentId" :type="tiseType" v-if="isAddPop">
    </add-pop>
    <div class="mask_box" v-if="isTisPop"></div>
    <!-- 不要合并两个mask_box，只用一个遮罩的话，第二个遮罩出现（层级提高）并关闭后（实际并没关），先出来的弹窗会按不了（被挡住了） -->
    <tit-pop :data="userdata" :text="deleteText" :type="tiseType" v-if="isTisPop" :text1="delText"></tit-pop>
    <user-poptip :DepartmentArr="departmentArr1" :data="userData" :PostAllArr="postArr1" :type="popType" ref="userPop"
      v-if="isUserPop" :authorityType="0"></user-poptip>


  </div>
</template>
<script>
import TitPop from "@/components/main/components/tips/tit-pop.vue";
import AddPop from "./components/add-pop.vue";
import "./authority.less";
// import TitPop from '../../components/main/components/tips/tit-pop.vue'
import baocun from "@/assets/img1/baocun.png";
import shuaxin from "@/assets/img1/shuaxin.png";
import UserPoptip from "@/view/user-managent/user-pop/user-poptip.vue";
import {
  organizationUnitAll, identityRolesAll, wmsUserList, searchPermissions, editPermissions
} from "@/api/home.js";
export default {
  components: {
    TitPop,
    AddPop,
    UserPoptip
  },
  data() {
    return {
      shuaxin: shuaxin,
      baocun: baocun,
      loading: false,
      delText: "",
      powerName: "角色",
      data: [], //树形页面数据
      AllData: [], //树形总数据
      saveDataArr: [], //修改的树形页面数据
      defaultProps: {
        children: "items",
        label: "displayName",
      },
      img1: require("../../assets/img1/lockon.png"),
      img2: require("../../assets/img1/unLock.png"),
      allshow: false,
      isTisPop: false,
      isAddPop: false,
      deleteText: "",
      tiseType: "",
      userdata: [], //删除单个角色部门数据
      btnarr: [], //按钮数据
      btnarrAll: [], //按钮总数据
      saveBtnDataArr: [], //修改的按钮数据
      departmentArr: [], //初始页面数据
      popData: [], //编辑单个角色部门数据
      postArr: [], //角色数据
      userArr: [], //用户数据
      handleNode: [], //单个树形页面数据
      departmentId: "",
      postId: "",
      useObj: "", //按钮id
      popType: "1",
      isUserPop: false,
      departmentArr1: [],
      postArr1: [],
      userData: {},
      powerTreeData: [],
      argRightIDList: [],//初始选中
      checkedNodesList: [],//当前选中
      haveSelect: false,
      curProviderName: '',
    };
  },
  created() {
    this.init();
  },
  mounted() {
    //默认激活角色
    setTimeout(() => {
      this.$refs.multipleTable.setCurrentRow(this.$refs.multipleTable.data[0]);
      this.$refs.multipleTable2.setCurrentRow(
        this.$refs.multipleTable2.data[0]
      );
    }, 100);
    this.stopF5Refresh();
  },
  methods: {
    usersave() {
      console.log('ggggggg');
      this.$refs.userPop.addAxios();
    },
    sureAddFn(text) {
      this.tiseType = "14";
      this.deleteText = text;
      this.isTisPop = true;
    },
    handleNodeClic2(item, listObj) {
      if (!this.haveSelect) {
        this.haveSelect = true;
      }
      this.checkedNodesList = listObj.checkedNodes;
    },
    //初始化权限页面数据
    init() {
      organizationUnitAll().then(res => {
        this.departmentArr = JSON.parse(res.data.resultdata).items.map(_ => ({
          ..._,
          DepartmentFullName: _.displayName,
          departmentId: _.id
        }));
        this.departmentId = this.departmentArr[0].id;
        this.departmentArr1 = this.departmentArr.map(item => ({
          value: item.id,//部门是传id
          label: item.displayName,
          id: item.id,
        }))

      })
      identityRolesAll().then(res2 => {
        this.postArr = JSON.parse(res2.data.resultdata).items.map(_ => ({
          ..._,
          PostName: _.name,
          PostId: _.id
        }));
        this.postId = this.postArr[0].id;
        this.postArr1 = this.postArr.map(item => ({
          value: item.name,//角色是传name
          label: item.name,
          id: item.id,
        }))
        this.searchPermissionsFn(this.postArr[0].name)
      })
      wmsUserList().then(res2 => {
        this.userArr = JSON.parse(res2.data.resultdata).items;
      })
    },
    shuaxinFun() {
      this.init();
    },
    //提示
    tipsFun(text) {
      setTimeout(() => {
        this.tiseType = "4";
        this.deleteText = text;
        this.isTisPop = true;
        console.log('121213');
      })
    },
    beforeEditFun(type, text) {
      this.tiseType = type;
      this.deleteText = text;
      this.isTisPop = true;
    },
    //阻止F5事件并页面刷新
    stopF5Refresh() {
      document.onkeydown = (e) => {
        var evt = window.event || e;
        var code = evt.keyCode || evt.which;
        if (code == 116) {
          this.init();
          if (evt.preventDefault) {
            evt.preventDefault();
          } else {
            evt.keyCode = 0;
            evt.returnValue = false;
          }
        }
      };
    },

    //新增用户
    addUserFun() {
      this.popType = "1";
      this.isUserPop = true;
    },
    //编辑用户
    editUserFun(row) {
      this.popType = "2";
      this.userData = { ...row };
      this.isUserPop = true;
    },
    //更改的页面权限内容
    saveData(data, alldata) {
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].IsAuthorized != alldata[i].IsAuthorized ||
          data[i].IsBrowse != alldata[i].IsBrowse
        ) {
          var value = {
            PageId: data[i].Page_ID,
            UseObj: "",
            ItemType: data[i].type,
            State: data[i].IsAuthorized == "N" ? 0 : 1,
            IsBorwse: data[i].IsBrowse == "N" ? 0 : 1,
            UserType: "",
          };
          if (this.powerName == "角色") {
            //角色/角色
            value.UseObj = this.postId;
            value.UserType = "1";
          } else {
            value.UseObj = this.useObj;
            value.UserType = "2";
          }
          this.saveDataArr.push(value);
          if (data[i].ChildrenPage.length != 0) {
            this.saveData(data[i].ChildrenPage, alldata[i].ChildrenPage);
          }
        } else {
          if (data[i].ChildrenPage.length != 0) {
            this.saveData(data[i].ChildrenPage, alldata[i].ChildrenPage);
          }
        }
      }
    },
    //页面权限保存
    pageSaveFun(e) {
      if (!this.haveSelect) {
        //未有任何改动，checkedNodesList为空，未获取到正确的checkedNodesList
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        return
      }
      let initSelect = this.argRightIDList.filter(_ => !_.isFirst).map(_ => ({ name: _.name, isGranted: false }));//不晓得选没选中的项
      let nowSelect = this.checkedNodesList.filter(_ => !_.isFirst).map(_ => ({ name: _.name, isGranted: true }));//选中项
      console.log('nowSelect', nowSelect);
      let list = [];
      initSelect.map(_ => {
        let b = false;
        nowSelect.map(_2 => {
          if (_.name == _2.name) {//选中了
            b = true;
            list.push(_2);//isGranted为true代表添加权限
          }
        })
        if (!b) {
          list.push(_);//isGranted为false代表删除权限
        }
      })
      editPermissions(
        'R', this.curProviderName, { permissions: list }
      ).then(res => {
        if (res.data.type == 1) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          })
        }

      }).catch(err => {
        this.$message({
          message: '修改失败',
          type: 'error'
        })
      });
    },
    //角色组点击
    handleCurrentClick(val, column, e) {
      if (val != null) {
        this.searchPermissionsFn(val.name)
      }
    },
    searchPermissionsFn(name) {
      searchPermissions('R', name).then(res => {
        this.curProviderName = name;
        this.powerTreeData = JSON.parse(res.data.resultdata).map(_ => ({ ..._, isFirst: true }));//后端收到第一层的东西会报错
        this.argRightIDList = [];
        this.initCheck(this.powerTreeData);
      })
    },
    initCheck(list) {
      if (list && list.length) {
        list.map(obj => {
          this.argRightIDList.push(obj);
          if (obj.items && obj.items.length) {
            this.initCheck(obj.items)
          }
        })
      }
    },
    //删除
    deleteFun(data, name) {
      this.deleteText = `您确定要删除该${name}信息吗?`;
      this.delText = `【该${name}所有信息将被清空】`;
      this.userdata = data;
      if (name == "角色") {
        this.tiseType = "5";
      } else if (name == "部门") {
        this.tiseType = "6";
      } else if (name == "用户") {
        this.tiseType = "11";
      }
      this.isTisPop = true;
    },
    //编辑
    editFun(data, name) {
      this.deleteText = `编辑${name}`;
      if (name == "角色") {
        this.tiseType = "7";
        this.popData = data;
      } else if (name == "部门") {
        this.popData = data;
        this.tiseType = "8";
      }
      this.isAddPop = true;
    },
    //添加
    addFun(name) {
      this.deleteText = `添加${name}`;
      if (name == "角色") {
        this.tiseType = "5";
      } else if (name == "部门") {
        this.tiseType = "6";
      }
      this.isAddPop = true;
    },
    //关闭弹窗
    closeFun() {
      this.isTisPop = false;
      this.isAddPop = false;
      this.isUserPop = false
    },
    closeTips() {
      this.isTisPop = false;
    },
  },
};
</script>
