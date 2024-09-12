<!--
 * @Description: 这是提示弹窗页面（组件）
 * @Date: 2020-08-28 11:16:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 09:59:25
-->
<template>
  <div class="tit-pop-li">
    <div v-drag1 class="tit-pop-style">

      <div class="title">
        <span class="text">{{ title }}</span>
        <div @click="cancelFun()" class="headImg">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div
        v-if="type == '1' || type == '4' || islast || type == '5' || type == '6' || type == '7' || type == '8' || type == '11' || type == '14'"
        class="tisText_box">
        <div class="tisText">{{ titleText }}<br /><span class="tisText1"
            v-if="type == '5' || type == '6' || type == '11'">{{ text1
            }}</span></div>
      </div>

      <div v-if="(type == '2' && !islast) || (type == '3' && !islast)" class="tisText_box">
        <div class="tisText_row">
          <div class="row_name">请输入新密码：</div>
          <div class="row_input">
            <el-input placeholder="请输入密码" v-model="newPassword" show-password></el-input>
          </div>
        </div>
        <div class="tisText_row">
          <div class="row_name">请确认新密码：</div>
          <div class="row_input">
            <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
          </div>
        </div>
      </div>

      <div class="user_conter_box3">
        <span v-if="type != '4' && !islast" @click="saveFun()">
          <el-button class="btn-style2">确认</el-button>
          <!-- 确认 -->
        </span>
        <span v-if="type != '4' && !islast" @click="closeFun('1')">
          <el-button class="btn-style22 no">取消</el-button>
          <!-- 取消 -->
        </span>

        <div v-if="islast || type == '4'" @click="cancelFun()">
          <el-button class="btn-style2 btn-width-style">{{ btntext }}</el-button>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import {
  organizationUnitDel,
  identityRolesDelete,
  delWmsUser,
} from '@/api/home.js'
export default {
  data() {
    return {
      title: "",
      islast: false,
      titleText: "修改成功！点击确认按钮产线登陆系统",
      btntext: "确认",
      num: 3,
      set: "",
      newPassword: "",
      password: "",
    };
  },

  props: ["type", "text", "data", "text1"],
  created() {
    //1为用户删除 2为个人重置密码 3为账号重置密码 4为用户提示信息 5为权限角色删除 6为权限部门删除 7为提示信息 11用户
    this.init();
  },
  watch: {
    text() {
      this.titleText = this.text;
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    init() {
      console.log(' this.type', this.type);
      if (this.type == "1") {
        this.title = "删除";
        this.titleText = this.text;
      } else if (this.type == "2" || this.type == "3") {
        this.title = "重置密码";
      } else if (
        this.type == "4" ||
        this.type == "5" ||
        this.type == "6" ||
        this.type == "7" ||
        this.type == "8" ||
        this.type == "11" ||
        this.type == "12" ||
        this.type == '14'
      ) {
        console.log('lllll');
        this.title = "提示";
        this.titleText = this.text;
      }
    },
    //关闭弹窗
    cancelFun() {
      this.$parent.closeTips();
    },
    //确认
    saveFun() {
      if (this.type == "14") {
        this.cancelFun()
        this.$parent.usersave()
        return;
      }
      //2为重置个 //3为账号
      if (this.type == "2" || this.type == "3") {
        if (this.newPassword == "" || this.passoword == "") {
          this.$message({
            message: "请填写完整",
            type: "warning",
          });
        } else if (this.newPassword != this.password) {
          this.$message({
            message: "两次密码输入不一致",
            type: "warning",
          });
        } else {
          if (this.type == "2") {
            var pass1 = {
              UserId: "",
              Password: this.password,
            }; //重置个账号要重新登录
            this.$parent.setPasswordFun2(pass1).then((val) => {
              this.btntext = "即将退出请重新登录！" + this.num;
              this.islast = true;
              this.titleText = "修改成功！点击确认按钮产线登陆系统";
              this.title = "提示";
              this.set = setInterval(() => {
                this.num = this.num - 1;
                this.btntext = "即将退出请重新登录！" + this.num + "s";
                if (this.num == 0) {
                  this.handleLogOut().then(() => {
                    this.$router.push({
                      path: '/login'
                    })
                  })
                  clearInterval(this.set);
                }
              }, 1000);
            });
          } else {
            var pass = {
              UserId: this.data.UserId,
              Password: this.password,
            };
            this.$parent.setPassWordFun(pass);
          }
        }
      } else if (this.type == '5' || this.type == '6' || this.type == '7' || this.type == '8' || this.type == '11') {
        if (this.titleText.indexOf('确定要删除') == -1) {
          this.$parent.$refs.userAddPop.saveFun();
          this.cancelFun();
          return
        }
        console.log(this.type);
        if (this.type == "5") {
          this.DepartmentDelete("角色");
        } else if (this.type == "6") {
          this.DepartmentDelete("部门");
        } else if (this.type == "11") {
          this.DepartmentDelete("用户");
        } else if (this.type == "1") {
          this.$parent.deletAxiosFun(this.data.UserId);
        }
      }
    },
    //提示成功
    tispsrcc() {
      this.islast = true;
      this.titleText = "修改成功！";
      this.title = "提示";
    },
    //提示成功
    tispsrcc2(msg) {
      this.islast = true;
      this.titleText = msg;
      this.title = "提示";
    },
    //删除
    DepartmentDelete(text) {
      if (text == "部门") {
        organizationUnitDel(this.data.departmentId).then(res => {
          if (res.data.type == 1) {
            this.$parent.tipsFun('删除成功')
            this.$parent.closeFun();
            this.$parent.init();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
        }).catch(err => {
          this.$parent.tipsFun(err)
        })

      } else if (text == "角色") {
        identityRolesDelete(this.data.PostId).then(res => {
          if (res.data.type == 1) {
            this.$parent.tipsFun('删除成功')
            this.$parent.closeFun();
            this.$parent.init();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
        }).catch(err => {
          this.$parent.tipsFun(err)
        })
      } else if (text == "用户") {
        delWmsUser(this.data.id).then(res => {
          console.log("res.data.message", res.data.message);
          if (res.data.type == 1) {
            this.$parent.tipsFun('删除成功')
            this.$parent.closeFun();
            this.$parent.init();
          } else {
            this.$parent.tipsFun(res.data.message)
          }
        }).catch(err => {
          this.$parent.tipsFun(err)
        })
      }
    },

    //取消
    closeFun(text) {
      console.log(this.type );
      if (this.type == "7") {
        this.$parent.closeFun("1");
      } else {
        this.$parent.closeTips();
        if (this.type == "2") {
          if (text != "1") {
            localStorage.removeItem("ms_username");
            this.$router.push("/login");
          }
        }
      }
    },
  },
};
</script>
<style>

</style>
<style lang="less" scoped>
.tit-pop-li {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  margin: auto;
  width: 480px;
  height: 250px;

  z-index: 12;

  .tit-pop-style {
    position: relative;
    height: 100%;
    width: 100%;
    background: #fff;
    box-shadow: 0px 1px 42px 9px rgba(7, 8, 26, 0.23);
  }

  .title {
    width: 100%;
    height: 50px;
    font-size: 16px;
    font-family: "Microsoft YaHei";
    font-weight: bold;
    color: #ffffff;
    background: #fd9a4c;
    text-align: center;
    line-height: 50px;

    .title_i {
      color: #fff;
      margin-right: 5px;
    }

    .headImg {
      position: absolute;
      right: 12px;
      top: 0px;
      height: 100%;
      background-size: cover;
      cursor: pointer;

      i {
        font-size: 28px;
        vertical-align: middle;
      }
    }
  }

  .tisText_box {
    width: 100%;
    height: 150px;
    font-size: 14px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    color: #333333;
    text-align: center;
    display: table;
    overflow: hidden;

    .tisText_row {
      width: 100%;
      height: 36px;
      margin-top: 10px;
    }

    .tisText_row:first-child {
      margin-top: 35px;
    }

    .tisText {
      font-size: 14px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      color: #333333;
      line-height: 24px;
      vertical-align: middle;
      display: table-cell;
    }

    .tisText1 {
      color: #f13d3d;
      font-size: 16px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
    }

    .row_name {
      width: 120px;
      height: 34px;
      line-height: 34px;
      font-size: 14px;
      font-family: "Microsoft YaHei";
      font-weight: 400;
      color: #666666;
      float: left;
      margin-left: 45px;
    }

    .row_input {
      width: 250px;
      height: 34px;
      float: left;
    }
  }

  .user_conter_box3 {
    overflow: hidden;
    width: 100%;
    height: 36px;
    // position: absolute;
    bottom: 25px;
    text-align: center;

    .no {
      height: 33px;
      margin-left: 14px;
    }
  }

  .btn-width-style {
    width: auto;
    min-width: 100px;
  }
}
</style>