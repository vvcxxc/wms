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
      <div class="head">{{popTitle}}
        <div @click="cancelFun()" class="headImg">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="add_conter">
        <div>
          <div class="add_name">{{addName}}：</div>
          <div class="add_input">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
          </div>
        </div>
      </div>
      <div class="user_conter_box3">
        <el-button @click="saveFun()" class="btn-style21">保存</el-button>
        <el-button @click="closeFun()" class="btn-style22 btn-close">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import "./add-pop.less";
import {
 baseManageSaveForm,baseDepartmentSaveForm
} from "@/api/home.js";
export default {
  data() {
    return {
      popTitle: "",
      input: "",
      addName: "",
    };
  },
  props: ["text", "type", "data", "id"],
  created() {
    //5为删除、添加岗位 6为删除、添加部门 7为编辑岗位 8为编辑部门
    this.init();
  },
  methods: {
    init() {
      if (this.type == 5) {
        this.popTitle = this.text;
        this.addName = "岗位名称";
      } else if (this.type == 6) {
        this.popTitle = this.text;
        this.addName = "部门名称";
      } else if (this.type == 7) {
        this.addName = "岗位名称";
        this.popTitle = this.text;
        this.input = this.data.PostName;
      } else if (this.type == 8) {
        this.addName = "部门名称";
        this.popTitle = this.text;
        this.input = this.data.DepartmentFullName;
      }
    },
    //取消
    closeFun() {
      this.$parent.closeFun();
    },
    //添加编辑岗位方法
    postAxios(text, type, id) {
      var value = {
        DepartmentId: id,
        PostCode: "",
        PostName: text,
        ParentId: 0,
      };
      if (type == "编辑") {
        value.PostId = this.data.PostId;
      }
      // var url = `${this.$store.state.dailog.url1}BaseManage/Base_Post/SaveForm`;
      // this.$axios({
      //   method: "post",
      //   url: url,
      //   data: value,
      // }).then((res) => {
      //   this.$parent.init();
      // });
      baseManageSaveForm(value).then(res=>{
         this.$message({
          message:'保存成功',
          type:'success'
        })
        this.$parent.init();
        
      }).catch(res=>{
        console.log(res)
        this.$message({
          message:'保存失败',
          type:'error'
        })
      })

    },
    //添加编辑部门方法
    DepartmentAxios(text, type) {
      var value = {
        DepartmentSortNam: text,
        DepartmentFullName: text,
        ParentId: 0,
      };
      if (type == "编辑") {
        value.DepartmentId = this.data.DepartmentId;
      }
      // var url = `${this.$store.state.dailog.url1}BaseManage/Base_Department/SaveForm`;
      // this.$axios({
      //   method: "post",
      //   url: url,
      //   data: value,
      // }).then((res) => {
      //   this.$parent.init();
      // });
      baseDepartmentSaveForm(value).then(res=>{
        this.$message({
          message:'保存成功',
          type:'success'
        })
        this.$parent.init();
      }).catch(err=>{
        console.log(err)
         this.$message({
          message:'保存失败',
          type:'error'
        })
      })
    },

    //保存
    saveFun() {
      if (this.type == "5") {
        // 添加岗位
        if (this.input == "") {
          this.$message.error("请填写岗位名称");
          return;
        }
        this.postAxios(this.input, "添加", this.id);
      } else if (this.type == "6") {
        // 添加部门
        if (this.input == "") {
          this.$message.error("请填写部门名称");
          return;
        }
        this.DepartmentAxios(this.input, "添加");
      } else if (this.type == "7") {
        // 编辑岗位
        if (this.input == "") {
          this.$message.error("请填写岗位名称");
          return;
        }
        this.postAxios(this.input, "编辑", this.id);
      } else if (this.type == "8") {
        // 编辑部门
        if (this.input == "") {
          this.$message.error("请填写部门名称");
          return;
        }
        this.DepartmentAxios(this.input, "编辑");
      }
      this.$parent.closeFun();
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