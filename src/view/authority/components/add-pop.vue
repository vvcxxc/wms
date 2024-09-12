<!--
 * @Description: 这是用户信息新增页面（组件）
 * @Date: 2020-08-28 17:44:03
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:31:21
-->
<template>
  <div class="add_box2">
    <div v-drag1 class="add-box-style">
      <div class="head">{{ popTitle }}
        <div @click="cancelFun()" class="headImg">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="add_conter">
        <div>
          <div class="add_name">{{ addName }}：</div>
          <div class="add_input">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div class="user_conter_box3">
        <el-button @click="beforeEditFun()" class="btn-style21">保存</el-button>
        <el-button @click="closeFun()" class="btn-style22 btn-close">取消</el-button>
      </div>
    </div>







  </div>
</template>
<script>
import "./add-pop.less";
import {
  organizationUnitPost, organizationUnitPut, identityRolesPost, identityRolesPut
} from "@/api/home.js";
import { runInThisContext } from "vm";
export default {
  data() {
    return {
      popTitle: "",
      input: "",
      addName: "",
      initType:"",
    };
  },
  props: ["text", "type", "data", "id"],
  created() {
    //5为删除、添加角色 6为删除、添加部门 7为编辑角色 8为编辑部门
    this.init();
  },
  methods: {
    init() {
      this.initType=this.type ;
      if (this.type == '5') {
        this.popTitle = this.text;
        this.addName = "角色名称";
      } else if (this.type == '6') {
        this.popTitle = this.text;
        this.addName = "部门名称";
      } else if (this.type == '7') {
        this.addName = "角色名称";
        this.popTitle = this.text;
        this.input = this.data.PostName;
      } else if (this.type == '8') {
        this.addName = "部门名称";
        this.popTitle = this.text;
        this.input = this.data.DepartmentFullName;
      }
    },
    //取消
    closeFun() {
      this.$parent.closeFun();
    },
    //添加编辑角色方法
    postAxios(text, type) {
      var value = {
        name: text,
        isDefault: false,
        isPublic: true
      };
      if (type == "编辑") {
        value.id = this.data.PostId;
        identityRolesPut(value).then(res => {
          if (res.data.type == 1) {
            this.$parent.tipsFun(`编辑${text}成功`)
            this.$parent.init();
            this.closeFun();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
          this.$parent.init();
        })
      } else {
        identityRolesPost(value).then(res => {
          if (res.data.type == 1) {
            this.$parent.tipsFun(`添加${text}成功`)
            this.$parent.init();
            this.closeFun();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
        })
      }
    },
    //添加编辑部门方法
    DepartmentAxios(text, type) {
      var value = {
        displayName: text
      };

      if (type == "编辑") {
        value.id = this.data.departmentId;
        organizationUnitPut(value).then(res => {
          if (res.data.type == 1) {
            this.$parent.tipsFun(`编辑${text}成功`)
            this.$parent.init();
            this.closeFun();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
        })
      } else {
        organizationUnitPost(value).then(res => {
          if (res.data.type == 1) {
            this.$parent.tipsFun(`添加${text}成功`)
            this.$parent.init();
            this.closeFun();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
        })
      }
    },
    beforeEditFun() {
      if (this.initType == "5") {
        // 添加角色
        if (this.input == "") {
          this.$parent.tipsFun('请填写角色名称')
          return;
        }
        this.$parent.beforeEditFun('5', `是否确认添加${this.input}？`);
      } else if (this.initType == "6") {
        // 添加部门
        if (this.input == "") {
          this.$parent.tipsFun("请填写部门名称");
          return;
        }
        this.$parent.beforeEditFun('6', `是否确认添加${this.input}？`);
      } else if (this.initType == "7") {
        // 编辑角色
        if (this.input == "") {
          this.$parent.tipsFun("请填写角色名称");
          return;
        }
        this.$parent.beforeEditFun('7', `是否确认修改${this.input}？`);
      } else if (this.initType == "8") {
        // 编辑部门
        if (this.input == "") {
          this.$parent.tipsFun("请填写部门名称");
          return;
        }
        this.$parent.beforeEditFun('8', `是否确认修改${this.input}？`);
      }
    },
    //保存
    saveFun() {
      console.log('nnn');
      if (this.initType == "5") {
        this.postAxios(this.input, "添加");
      } else if (this.initType == "6") {
        this.DepartmentAxios(this.input, "添加");
      } else if (this.initType == "7") {
        this.postAxios(this.input, "编辑");
      } else if (this.initType == "8") {
        this.DepartmentAxios(this.input, "编辑");
      }
    },
    //关闭弹窗
    cancelFun() {
      this.$parent.closeFun();
    },
  },
};
</script>
<style lang="less" scoped>

</style>