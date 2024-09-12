<!--
 * @Description: 这是用户信息页弹窗提示页面（组件）
 * @Date: 2020-08-28 11:16:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:40:05
-->
<template>
  <div class="userPop1">
    <div v-drag1 ref="userPopStyle" class="user-pop-style">
      <div class="head1">
        {{ popTitle }}
        <div @click="cancelFun()" class="headImg">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="user_conter1" v-stopdrag>
        
        <div class="user_conter_box">
          <div class="conter_box_name left">姓名：</div>
          <div class="conter_box_input ml left">
            <el-input v-model="name" autocomplete="off" placeholder="请输入内容"></el-input>
          </div>
          <div class="conter_box_input right">
            <el-input v-model="number" autocomplete="off" placeholder="请输入内容"></el-input>
          </div>
          <div class="conter_box_name right">账号：</div>
        </div>
        <div class="user_conter_box">
          <div class="conter_box_name left">部门：</div>
          <div class="conter_box_input ml left">
            <el-select popper-class="select-dropdown-class-li" @change="departFun()" v-model="department" placeholder="请选择">
              <el-option v-for="item in DepartmentArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="conter_box_input right">
            <el-select popper-class="select-dropdown-class-li" v-model="post" placeholder="请选择">
              <el-option v-for="item in PostArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="conter_box_name right">岗位：</div>
        </div>
        <div class="user_conter_box" v-if="type == '1'">
          <div class="conter_box_name left">登录密码：</div>
          <div class="conter_box_input ml left">
            <el-input autocomplete="off" type="password" v-model="password" placeholder="请输入内容" show-password></el-input>
          </div>

          <div class="conter_box_input right">
            <el-input autocomplete="off" type="password" v-model="password2" placeholder="请输入内容" show-password></el-input>
          </div>
          <div class="conter_box_name right">确认密码：</div>
        </div>

        <div class="user_conter_box">
          <div class="conter_box_name left">联系方式：</div>
          <div class="conter_box_input2 left">
            <el-input v-model="phone" @input="phoneVeriFun()" autocomplete="off" placeholder="请输入内容"></el-input>
          </div>
          <div ref="tips" class="tips">请输入正确的手机或座机格式</div>
        </div> 

        <div class="user_conter_box2">
          <div class="conter_box_name left">备注:</div>
          <div class="conter_box_input3 left">
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="remarksV">
            </el-input>
          </div>
        </div>

      </div>
      <div class="user_conter_box3">
        <el-button class="btn-style21" @click="saveFun()" :loading="saveUser">确认</el-button>
        <el-button class="btn-style22 no" @click="cancelFun()">取消</el-button>
      </div>
    </div>

  </div>
</template>
<script>
import "./user-poptip.less";
import { saveFormUser } from '@/api/user.js'
export default {
  data() {
    return {
      rules:{},
      ruleForm: {
        name: "",
        number: "",
        password2: "",
        password: "",
        post: "",
        department: "",
        phone: "",
        phonegs: false,
        remarksV: "",
        popTitle: "",
        PostArr: "",
      },
      name: "",
      number: "",
      password2: "",
      password: "",
      post: "",
      department: "",
      phone: "",
      phonegs: false,
      remarksV: "",
      popTitle: "",
      PostArr: "",
      saveUser:false
    };
  },
  props: ["type", "PostAllArr", "DepartmentArr", "data", "authorityType"],

  created() {
    this.init();
  },

  methods: {

    //1 添加用户  2为编辑
    init() {
      // console.log(this.authorityType);
      if (this.type == "1") {
        this.popTitle = "添加用户";
      } else if (this.type == "2") {
        this.popTitle = "编辑用户";
        this.name = this.data.RealName;
        this.number = this.data.EnCode;
        this.post = this.data.PostName;
        this.department = this.data.DepartmentFullName;
        this.phone = this.data.Telephone;
        this.remarksV = this.data.Remark;
      }
    },
    //部门岗位数据
    dataFun(data, text) {
      for (let i = 0; i < data.length; i++) {
        if (text == data[i].value) {
          return data[i].id;
        }
      }
    },
    //筛选部门-岗位（DepartmentId可能有变）
    departFun() {
      this.PostArr = [];
      for (let i = 0; i < this.DepartmentArr.length; i++) {
        if (this.DepartmentArr[i].value == this.department) {
          for (let j = 0; j < this.PostAllArr.length; j++) {
            if (this.PostAllArr[j].ParentId == this.DepartmentArr[i].id) {
              this.PostArr.push(this.PostAllArr[j]);
            }
          }
        }
      }
      if (this.PostArr.length != 0) {
        this.post = this.PostArr[0].value;
      } else {
        this.post = "";
      }
    },
    //保存接口
    addAxios(data) {
      // var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/SaveForm`;
      // this.$axios({
      //   //查询信息
      //   method: "post",
      //   url: url,
      //   data: data,
      // }).then((res) => {
        this.saveUser = true
        saveFormUser(data).then(res=>{
           this.saveUser = false
          if (res.data.isLogin) {
            this.$message({
              message:'保存成功',
              type:'success'
            })
            this.$parent.closeFun();
            if (this.authorityType == 0) {
              this.$parent.init()
            } else {
              this.$parent.allAxiosFun();

            }

          } else {
            this.$parent.tipsFun(res.data.message);
          }
        }) .catch((err) => {
          this.saveUser = false
          // console.log("err", err);
           this.$message({
              message:'保存失败',
              type:'error'
            })
        });
    },
    saveFun() {
      var value;
      var DepartmentId = this.dataFun(this.DepartmentArr, this.department);
      var PostId = this.dataFun(this.PostArr, this.post);

      if (this.type == 1) {
        value = {
          RealName: this.name,
          EnCode: this.number,
          Telephone: this.phone,
          Password: this.password,
          Account: this.number,
          PostId: PostId,
          DepartmentId: DepartmentId,
          Remark: this.remarksV,
        };
      } else {
        value = {
          UserId: this.data.UserId,
          RealName: this.name,
          EnCode: this.number,
          Account: this.number,
          Telephone: this.phone,
          PostId: PostId,
          DepartmentId: DepartmentId,
          Remark: this.remarksV,
        };
      }
      if (this.name == "") {
        this.$parent.tipsFun("请填写姓名");
        return;
      } else if (this.number == "") {
        this.$parent.tipsFun("请填写账号");
        return;
      } else if (this.department == "") {
        this.$parent.tipsFun("请选择部门");
        return;
      } else if (this.post == "") {
        // this.$parent.tipsFun("请选择岗位");
        // return;
      } else if (this.password == "") {
        if (this.type == "1") {
          this.$parent.tipsFun("请输入密码");
          return;
        }
      } else if (this.password2 == "") {
        if (this.type == "1") {
          this.$parent.tipsFun("请再次确认密码");
          return;
        }
      } else if (this.password != this.password2) {
        if (this.type == "1") {
          this.$parent.tipsFun("两次密码不一致");
          return;
        }
      } else if (this.phone == "") {
        this.$parent.tipsFun("联系方式不能为空");
        return;
      } else if (this.phonegs == false) {
        this.$parent.tipsFun("请输入正确的手机或座机格式");
        return;
      }
      this.addAxios(value);
    },
    phoneVeriFun() {
      var RegExpa = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
      var aa = RegExpa.test(this.phone);
      if (aa == false) {
        this.$refs.tips.style.display = "block";
        this.phonegs = false;
      } else {
        this.$refs.tips.style.display = "none";
        this.phonegs = true;
      }
    },
    //关闭弹窗
    cancelFun() {
      this.$parent.closeFun();
    },
  },
};
</script>
<style>
</style>
<style lang="less" scoped>
</style>