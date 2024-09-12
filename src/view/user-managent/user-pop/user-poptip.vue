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
          <div class="conter_box_name left"><span>*</span>账号：</div>
          <div class="conter_box_input ml left">
            <el-input v-model="number" placeholder="请输入内容" :disabled="type == '2'"></el-input>
          </div>
          <div class="conter_box_input right">
            <el-input v-model="name" placeholder="请输入内容"></el-input>
          </div>
          <div class="conter_box_name right"><span>*</span>姓名：</div>
        </div>

        <div class="user_conter_box">
          <div class="conter_box_name left"><span>*</span>工号：</div>
          <div class="conter_box_input ml left">
            <el-input v-model="workNum" placeholder="请输入内容">
            </el-input>
          </div>
          <div class="conter_box_input right">
            <el-input type="password" v-model="password" placeholder="请输入内容" show-password>
            </el-input>
          </div>
          <div class="conter_box_name right"><span v-if="type == 1">*</span>密码：</div>
        </div>

        <div class="user_conter_box">
          <div class="conter_box_name left"><span v-if="type == 1">*</span>确认密码：</div>
          <div class="conter_box_input ml left">
            <el-input type="password" v-model="password2" placeholder="请输入内容" show-password>
            </el-input>
          </div>
          <div class="conter_box_input right">
            <el-select popper-class="select-dropdown-class-li" v-model="department" placeholder="请选择">
              <el-option v-for="item in DepartmentArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="conter_box_name right"><span>*</span>部门：</div>
        </div>

        <div class="user_conter_box">
          <div class="conter_box_name left"><span>*</span>角色：</div>
          <div class="conter_box_input ml left">
            <el-select popper-class="select-dropdown-class-li" v-model="post" placeholder="请选择">
              <el-option v-for="item in PostAllArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </div>

          <div class="conter_box_input right">
            <el-input v-model="phone" @input="phoneVeriFun()" placeholder="请输入内容">
            </el-input>
          </div>
          <div class="conter_box_name right">电话：</div>
        </div>
        <div class="user_conter_box">
          <div class="conter_box_name left">邮箱：</div>
          <div class="conter_box_input2 left">
            <el-input v-model="email" placeholder="请输入内容"></el-input>
          </div>
        </div>

        <div class="user_conter_box2">
          <div class="conter_box_name left">是否禁用:</div>
          <div class="conter_box_input3 left">
            <el-radio-group v-model="isDisable">
              <el-radio :label="1" size="large">禁用</el-radio>
              <el-radio :label="2" size="large">不禁用</el-radio>
            </el-radio-group>
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
import { wmsUserItem, addWmsUser, editWmsUser } from '@/api/home.js'
export default {
  data() {
    return {
      id: "",
      name: "",
      number: "",
      password2: "",
      password: "",
      post: "",
      department: "",
      phone: "",
      phonegs: true,
      popTitle: "",
      workNum: "",
      email: "",
      isDisable: 1,
      saveUser: false,
      concurrencyStamp: ''
    };
  },
  props: ["type", "PostAllArr", "DepartmentArr", "data", "authorityType"],

  created() {
    this.init();
  },

  methods: {

    //1 添加用户  2为编辑
    init() {
      if (this.type == "1") {
        this.popTitle = "添加用户";
      } else if (this.type == "2") {
        wmsUserItem(this.data.id).then(res => {
          if (res.data.type == 1) {
            const data = JSON.parse(res.data.resultdata)
            this.popTitle = "编辑用户";
            this.id = data.id;
            this.name = data.name;
            this.number = data.userName;
            this.post = data.roleNames[0];
            this.department = data.organizationUnits[0];
            this.phone = data.phoneNumber;
            this.workNum = data.jobNumber;
            this.email = data.email;
            this.isDisable = data.isActive ? 2 : 1;
            this.concurrencyStamp = data.concurrencyStamp;
          } else {
            this.$parent.tipsFun(res.data.message);
          }
        })

      }
    },


    //保存接口
    addAxios() {
      let data;
      if (this.type == '1') {
        data = {
          userName: this.number,
          name: this.name,
          jobNumber: this.workNum,
          phoneNumber: this.phone,
          email: this.email,
          isActive: this.isDisable == 2,
          roleNames: [this.post],
          organizationUnits: [this.department],
          password: this.password,
        }
      } else {
        data = {
          id: this.id,
          userName: this.number,
          name: this.name,
          jobNumber: this.workNum,
          phoneNumber: this.phone,
          email: this.email,
          isActive: this.isDisable == 2,
          roleNames: [this.post],
          organizationUnits: [this.department],
          password: this.password,
          concurrencyStamp: this.concurrencyStamp
        }
      }
      this.saveUser = true
      if (this.type == "1") {
        addWmsUser(data).then(res => {
          this.saveUser = false
          if (res.data.type == 1) {
            this.$parent.tipsFun(`添加${this.number}成功`);
            this.$parent.closeFun();
            this.$parent.init()
          } else {
            this.$parent.tipsFun(res.data.message);
          }
        }).catch((err) => {
          this.saveUser = false
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        });
      } else if (this.type == "2") {
        editWmsUser(data).then(res => {
          this.saveUser = false
          if (res.data.type == 1) {
            this.$parent.tipsFun(`保存${this.number}成功`);
            this.$parent.closeFun();
            this.$parent.init()
          } else {
            this.$parent.tipsFun(res.data.message);
          }
        }).catch((err) => {
          this.saveUser = false
          this.$message({
            message: '保存失败',
            type: 'error'
          })
        });
      }

    },
    saveFun() {
      if (this.name == "") {
        this.$message.error("请填写姓名");
        return;
      } else if (this.number == "") {
        this.$message.error("请填写账号");
        return;
      } else if (this.department == "") {
        this.$message.error("请选择部门");
        return;
      } else if (this.workNum == "") {
        this.$message.error("请输入工号");
        return;
      } else if (this.post == "") {
        this.$message.error("请选择角色");
        return;
      } else if (this.password == "") {
        if (this.type == "1") {
          this.$message.error("请输入密码");
          return;
        }
      } else if (this.password2 == "") {
        if (this.type == "1") {
          this.$message.error("请再次确认密码");
          return;
        }
      } else if (this.password != this.password2) {
        if (this.type == "1") {
          this.$message.error("两次密码不一致");
          return;
        }
      } else if (this.number.length > 19) {
        this.$message.error("用户账号长度不能超过19");
        return;
      } else if (this.workNum.length > 19) {
        this.$message.error("工号长度不能超过19");
        return;
      } else if (this.password.length > 19) {
        this.$message.error("密码长度不能超过19");
        return;
      } else if (this.phone && this.phonegs == false) {
        this.$message.error("请输入正确的手机或座机格式");
        return;
      }
      // this.addAxios(value);
      this.$parent.sureAddFn(this.type == "1" ? `是否确认添加${this.number}?` : `是否确认修改${this.number}?`);
    },
    phoneVeriFun() {
      var RegExpa = /^1[3-9]\d{9}$/;
      var aa = RegExpa.test(this.phone);
      if (aa == false) {
        this.phonegs = false;
      } else {
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