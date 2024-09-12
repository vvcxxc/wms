<!--
 * @Description: 这是用户信息页面（组件）
 * @Date: 2020-08-28 10:13:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:39:33
-->
<template>
  <div class="user_box1" v-loading="loading" ref="userBox1">
    <div class="user_head" ref="userHeader">
      <div class="user_head_box left">
        <el-select popper-class="select-dropdown-class-li" clearable @change="departFun()" v-model="DepartmentV" placeholder="请选择">
          <el-option v-for="item in DepartmentArr" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="user_head_box left">
        <el-select popper-class="select-dropdown-class-li" clearable v-model="PostV" placeholder="请选择">
          <el-option v-for="item in PostArr" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="user_head_box left">
        <el-input v-model="encodeOruserName" placeholder="请输入内容"></el-input>
      </div>
      <el-button @click="queryFun()" class="btn-style1"><img :src="chaxun"/>查询</el-button>
      <el-button @click="refresh()" class="btn-style1"><img :src="shuaxin"/>刷新</el-button>
      <div class="right">
        <el-button @click="getexcel()" class="btn-style3">导出</el-button>
        <el-button @click="selfReset()" class="btn-style4">重置个人密码</el-button>
        <el-button @click="allReset()" class="btn-style4">重置账号密码</el-button>
        <el-button @click="addFun()" class="btn-style3">新增</el-button>
      </div>
    </div>

    <div class="user_conter">
      <el-table :data="tableData" stripe :height="tableHeight" highlight-current-row v-loading="loading2" border @current-change="handleCurrentChange" style="width: 100%; height: 100%">
        <el-table-column prop="RealName" label="姓名" :show-overflow-tooltip="true" width="150">
        </el-table-column>
        <el-table-column prop="EnCode" label="账号" :show-overflow-tooltip="true" width="200">
        </el-table-column>
        <el-table-column prop="DepartmentFullName" :show-overflow-tooltip="true" width="200" label="部门">
        </el-table-column>
        <el-table-column prop="PostName" width="200" :show-overflow-tooltip="true" label="岗位">
        </el-table-column>
        <el-table-column prop="Telephone" width="200" :show-overflow-tooltip="true" label="联系方式">
        </el-table-column>
        <el-table-column prop="Remark" width="220" :show-overflow-tooltip="true" label="备注">
        </el-table-column>
        <el-table-column min-width="180px" label="操作">
          <template slot-scope="scope">
            <div @click="editFun(scope.row)" class="edit">
              <i class="el-icon-edit-outline"></i>
            </div>
            <div @click="deleteFun(scope.row)" class="delete">
              <i class="el-icon-delete"></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页组件 -->
    <div class="page-style">
      <paginate :allpage="allpage" ref="page"></paginate>
    </div>

    <!-- 弹窗组件 -->
    <tit-pop :data="resetArr" :text="deleteText" :type="tiseType" ref="tispop" v-if="isTisPop"></tit-pop>
    <user-poptip :data="userData" :DepartmentArr="DepartmentArr" :PostAllArr="PostAllArr" :type="popType" v-if="isUserPop"></user-poptip>
    <!-- 遮罩层 -->
    <div v-if=" isTisPop || isUserPop " class="mask-box-li"></div>
  </div>
</template>
<script>
import TitPop from "@/components/main/components/tips/tit-pop.vue";
import Paginate from "@/components/paginate/paginate.vue";
import UserPoptip from "./user-pop/user-poptip.vue";
import chaxun from '@/assets/img1/chaxun.png'
import shuaxin from '@/assets/img1/shuaxin.png'
import {
  getBaseDeparment,
  getBasePost,
  getBaseUser,
  getBaseConditionUser,
  resetPassword,
  removeFormUser,
} from "@/api/user.js";
import "./user-managent.less";
export default {
  components: {
    UserPoptip,
    Paginate,
    TitPop,
  },
  data() {
    return {
      shuaxin:shuaxin,
      chaxun:chaxun,
      isTisPop: false,
      isUserPop: false,
      resetArr: [],
      allpage: 0, //分页总数
      popType: "",
      tiseType: "",
      deleteText: "",
      DepartmentArr: [],//部门信息
      DepartmentV: "",
      PostArr: [],
      PostAllArr: [],
      PostV: "",
      encodeOruserName: "",
      tableData: [],
      data: [],
      userData: [],
      DepartmentId: "",
      loading2: false,
      loading: false,
      tableHeight:700,
       screenWidth:null,
      screenHeight:null
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.stopF5Refresh();
    this.screenWidth = document.body.clientWidth;
      this.screenHeight = document.body.clientHeight;
      window.onresize = () => {
        return (() => {
          this.screenWidth = document.body.clientWidth;
          this.screenHeight = document.body.clientHeight;
          
        })();
      }
  },
  watch: {
     screenHeight(n,o){
      this.getHeight()

    },
     screenWidth(n,o){
      this.getHeight()

    },
  },
  methods: {
    //获取高度
    getHeight(){
       this.$nextTick(()=>{
        //  console.log(333)
            // console.log(this.$parent.$refs.listPage.offsetHeight)
          this.tableHeight = this.$refs.userBox1.offsetHeight - this.$refs.userHeader.offsetHeight - 50;

          })
    },
    init() {
      //初始化列表信息
      this.loading = true;
      this.allpage = 0;
      this.allAxiosFun();
      // var url1 = `${this.$store.state.dailog.url1}/BaseManage/Base_Department/GetList`;
      this.DepartmentFun().then(() => {
        // var url = `${this.$store.state.dailog.url1}/BaseManage/Base_Post/GetList`;
        //初始化岗位数据
        getBasePost()
          .then((res) => {
            this.loading = false;
            let data = res.data;
            this.PostAllArr = [];
            let cfarr = [];
            for (let i = 0; i < data.length; i++) {
              let index = cfarr.indexOf(data[i].PostName);
              if (index == -1) {
                //防重复
                cfarr.push(data[i].PostName);
                var value = {
                  value: data[i].PostName,
                  label: data[i].PostName,
                  id: data[i].PostId,
                  ParentId: data[i].DepartmentId,
                };
                this.PostAllArr.push(value);
              }
            }
          })
          .catch((error) => {
            this.loading = false;
          });
      });
      this.$nextTick(()=>{
        this.tableHeight = this.$refs.userBox1.offsetHeight-100
      })
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
    //筛选部门-岗位（DepartmentId可能有变）
    departFun() {
      this.PostArr = [];
      for (let i = 0; i < this.DepartmentArr.length; i++) {
        if (this.DepartmentArr[i].value == this.DepartmentV) {
          for (let j = 0; j < this.PostAllArr.length; j++) {
            if (this.PostAllArr[j].ParentId == this.DepartmentArr[i].id) {
              this.PostArr.push(this.PostAllArr[j]);
            }
          }
        }
      }
      if (this.PostArr.length != 0) {
        this.PostV = this.PostArr[0].value;
      } else {
        this.PostV = "";
      }
    },
    //部门请求
    DepartmentFun() {
      return new Promise((resolve, reject) => {
        getBaseDeparment()
          .then((res) => {
            let data = res.data;
            this.DepartmentArr = [];
            let cfarr = [];
            for (let i = 0; i < data.length; i++) {
              let index = cfarr.indexOf(data[i].DepartmentFullName);
              if (index == -1) {
                //防重复
                cfarr.push(data[i].DepartmentFullName);
                var value = {
                  value: data[i].DepartmentFullName,
                  label: data[i].DepartmentFullName,
                  id: data[i].DepartmentId,
                };
                this.DepartmentArr.push(value);
              }
            }
            resolve("成功了");
          })
          .catch((error) => {});
      });
    },
    //默认查询全部
    allAxiosFun() {
      // var url2 = `${this.$store.state.dailog.url1}/BaseManage/Base_User/GetAllList`;
      getBaseUser()
        .then((res) => {
          this.data = res.data.resultdata;
          if (this.data != null) {
            if (this.data.length != 0) {
              this.tableData = this.data.slice(0, 50);
              this.allpage = this.data.length;
            }
          }
        })
        .catch((error) => {});
    },
    //部门岗位数据
    dataFun3(data, text) {
      for (let i = 0; i < data.length; i++) {
        if (text == data[i].value) {
          return data[i].id;
        }
      }
    },
    refresh(){
      this.init()
    },
    //查询
    queryFun() {
      var DepartmentId;
      var PostId;
      var encodeOruserName = this.encodeOruserName;
      if (this.DepartmentV != "") {
        DepartmentId = this.dataFun3(this.DepartmentArr, this.DepartmentV);
      } else {
        DepartmentId = "";
      }
      if (this.PostV != "") {
        PostId = this.dataFun3(this.PostArr, this.PostV);
      } else {
        PostId = "";
      }
      this.loading2 = true;
      // var url3 = `${this.$store.state.dailog.url1}/BaseManage/Base_User/GetList?DepartmentId=${DepartmentId}&PostId=${PostId}&encodeOruserName=${encodeOruserName}`;
      getBaseConditionUser(DepartmentId, PostId, encodeOruserName)
        .then((res) => {
          this.loading2 = false;
          this.data = res.data.resultdata;
          if (this.data.length != 0) {
            this.tableData = this.data.slice(0, 50);
          } else {
            this.tableData = [];
          }
          this.allpage = this.data.length;
        })
        .catch((error) => {
          this.loading2 = false;
        });
    },
    //重置密码接口
    setPassWordFun(data) {
      resetPassword(data)
        .then((res) => {
          this.$refs.tispop.tispsrcc();
        })
        .catch((error) => {
          console.log("err", error);
        });
    },
    //重置个人密码
    setPasswordFun2(data) {
      return new Promise((resolve, reject) => {
        var id = localStorage.getItem("ms_userid");
        data.UserId = id;
        // var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/ResetPassword`;
        resetPassword(data)
          .then((res) => {
            resolve("成功了");
          })
          .catch((error) => {
            console.log("err", error);
          });
      });
    },
    //新增
    addFun() {
      this.popType = "1";
      this.isUserPop = true;
    },
    //删除方法
    deletAxiosFun(id) {
      var value = {
        UserId: id,
      };
      // var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/RemoveForm`;
      removeFormUser(value)
        .then((res) => {
          this.allAxiosFun();
          this.closeFun();
        })
        .catch((error) => {
          console.log("err", error);
        });
    },
    //删除
    deleteFun(data) {
      this.tiseType = "1";
      this.deleteText = "您确定要删除该条用户信息吗？";
      this.isTisPop = true;
      this.userData = data;
    },
    //编辑
    editFun(data) {
      this.popType = "2";
      this.isUserPop = true;
      this.userData = data;
    },
    //重置个人密码
    selfReset() {
      this.tiseType = "2";
      this.isTisPop = true;
    },
    //重置账号密码
    allReset() {
      console.log(this.resetArr)
      if (this.resetArr.length == 0) {
        this.tiseType = "4";
        this.isTisPop = true;
        this.deleteText = "请选择用户";
      } else {
        this.tiseType = "3";
        this.isTisPop = true;
      }
    },
    //关闭弹窗
    closeFun(text) {
      if (text == "1") {
        this.isTisPop = false;
      } else {
        this.isTisPop = false;
        this.isUserPop = false;
      }
    },
    //表单选择
    handleCurrentChange(val) {
      this.resetArr = val;
    },
    //分页数据
    dataFun2(num) {
      if (this.data.length != 0) {
        this.tableData = this.data.slice(0, num);
      }
    },
    //分页数据
    dataFun(index, num) {
      if (index == 1) {
        if (this.data.length != 0) {
          this.tableData = this.data.slice(0, num);
        }
      } else {
        var ind = (index - 1) * num;
        var zn = num + ind;
        if (this.data.length != 0) {
          this.tableData = this.data.slice(ind, zn);
        }
      }
    },
    //提示
    tipsFun(text) {
      this.tiseType = "7";
      this.deleteText = text;
      this.isTisPop = true;
    },
    //导出
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    getexcel() {
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../vendor/Export2Excel.js");
        const tHeader = ["姓名", "账号", "部门", "岗位", "联系方式", "备注"];
        const filterVal = [
          "RealName",
          "encode",
          "departmentfullname",
          "postname",
          "telephone",
          "remark",
        ];
        const list = this.data;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "用户信息列表");
      });
    },
  },
};
</script>
<style lang="less">
</style>
<style lang="less" scoped>
</style>