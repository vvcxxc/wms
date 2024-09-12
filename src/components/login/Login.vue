<!--
 * @Description: 这是登录页面（组件）
 * @Date: 2021-03-18 10:00:02
 * @Author: Tao
 * @LastEditors: Cui
 * @LastEditTime: 2020-12-10 13:42:12
-->
<template>
  <div v-loading="loading" class="login-wrap1">
    <div class="login-title">
      <span> WMS仓储管理系统 </span>
    </div>
    <div class="login-conter1">
      <div class="login-text1">
        <span>欢迎登录</span>
      </div>

      <div class="login-input1">
        <div class="username">
          <el-input @keyup.enter.native="submitForm" placeholder="请输入账号名" v-model="username" clearable @focus="changUserImg(1)" @blur="changUserImg(0)">
            <template slot="prefix">
              <img :src="userImg" />
            </template>
          </el-input>
        </div>
        <div class="password">
          <el-input ref="passInput" :type="passType" @keyup.enter.native="submitForm" placeholder="请输入密码" v-model="password" @focus="changPassImg(1)" @blur="changPassImg(0)">
            <template slot="prefix">
              <img :src="passImg" />
            </template>
            <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
            <template slot="suffix">
              <img class="passward-suffix" :src="yangjing" @click="isShowPassword" />
            </template>
          </el-input>
        </div>
        <div @click="submitForm" class="login-btn">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import crypto from "crypto";
import userImg from "@/assets/img1/zhanghao.png";
import passImg from "@/assets/img1/mima.png";
import userImg1 from "@/assets/img1/zhanghao1.png";
import passImg1 from "@/assets/img1/mima1.png";
import yangjing from "@/assets/img1/yangjing.png"
import xianshi from '@/assets/img1/xianshi.png'
import { mapActions } from "vuex";
import "./login.less";
export default {
  data: function () {
    return {
      userImg: userImg,
      passImg: passImg,
      username: "",
      password: "",
      loading: false,
      yangjing: yangjing,
      passType: 'password'
    };
  },
  created() {
    var bb = md5("holle");
  },
  methods: {
    ...mapActions(["handleLogin"]),
    changPassImg(val) {
      if (val == 1) {
        this.passImg = passImg1;
      } else {
        this.passImg = passImg;
      }
    },
    isShowPassword() {
      if (this.passType == 'password') {
        this.passType = 'text'
        this.yangjing = xianshi

      } else {
        this.passType = 'password'
        this.yangjing = yangjing
      }

      console.log(this.$refs.passInput.type)

    },
    changUserImg(val) {
      if (val == 1) {
        this.userImg = userImg1;
      } else {
        this.userImg = userImg;
      }
    },
    aa() {
      var md5 = crypto.createHash("md5");
      md5.update(this.password); //需要加密的密码
      var password = md5.digest("hex"); //password 加密完的密码
    },
    submitForm() {
      if (this.username == "") {
        this.$message({
          showClose: true,
          message: "请输入账号名",
          type: "error",
        });
      } else if (this.password == "") {
        this.$message({
          showClose: true,
          message: "请输入密码",
          type: "error",
        });
      } else {
        this.loading = true;
        //登录接口
        var userForm = {
          userName: this.username,
          password: this.password,
        };
        // console.log(userForm);
        this.$store.state.app.tagNavList = []
        this.handleLogin(userForm)
          .then((res) => {
            // console.log(res);
            this.loading = false;
            var time = new Date().getTime();
            // console.log(this.$store.state.user.userInfo);
            if (res.data.isLogin) {
              localStorage.setItem("ms_username", this.username);
              localStorage.setItem("ms_userid", res.data.resultdata.UserId);

              this.$router.push("/home");
              // this.$router.push("/");
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error",
              });
            }
          })
          .catch((error) => {
            this.loading = false;
            this.$message({
              showClose: true,
              message: error,
              type: "error",
            });
            // alert(error);
          });
      }
    },
  },
};
</script>
