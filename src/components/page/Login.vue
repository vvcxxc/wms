<!--
 * @Description: 这是登录页面（组件）
 * @Date: 2020-08-13 10:00:02
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-12-10 13:42:12
-->
<template>
  <div v-loading="loading" class="login-wrap">
    <div class="login_conter">
      <img src="../../assets/img/形状 262 拷贝.png" />
      <div class="login_text">WMS仓储管理系统</div>
      <div class="login_input username">
        <div class="name">账号：</div>
        <div class="line"></div>
        <el-input
          class="input"
          @keyup.enter.native="submitForm"
          placeholder="请输入账号名"
          v-model="username"
          clearable
        ></el-input>
      </div>
      <div class="login_input password">
        <div class="name">密码：</div>
        <div class="line"></div>
        <el-input
          class="input"
          @keyup.enter.native="submitForm"
          placeholder="请输入密码"
          v-model="password"
          show-password
        ></el-input>
      </div>
      <div @click="submitForm" class="login_btn">登录</div>
    </div>
  </div>
</template>

<script>
import md5 from "js-md5";
import crypto from "crypto";
export default {
  data: function () {
    return {
      username: "",
      password: "",
      loading: false,
    };
  },
  created() {
    var bb = md5("holle");
  },
  methods: {
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

        var url = `${this.$store.state.dailog.url1}Login/CheckLog2?usercode=${this.username}&&password=${this.password}`;
        this.$axios({
          method: "post",
          url: url,
        })
          .then((res) => {
            console.log(res);
            this.loading = false;
            var time = new Date().getTime();
            if (res.data.isLogin) {
              localStorage.setItem("ms_username", this.username);
              localStorage.setItem("ms_userid", res.data.resultdata.UserId);
              this.$router.push("/");
            } else {
              this.$message({
                showClose: true,
                message: res.data.message,
                type: "error",
              });
            }
          })
          .catch((err) => {
            this.loading = false;
            this.$message({
              showClose: true,
              message: err,
              type: "error",
            });
          });
      }
    },
  },
};
</script>
<style lang="less">

.login-wrap {
  .el-input--small .el-input__inner {
    height: 60px;
    border: none;
  }
  .el-loading-mask {
    background-color: rgba(255, 255, 255, 0.3);
  }
}
.login-wrap .el-input--small .el-input__inner {
  box-shadow: 0 0 0 1000px inset #fff;
  font-size: 16px;
  font-family: Alibaba PuHuiTi;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
}
</style>
<style lang="less" scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  // min-width: 1280px;
  background-image: url("../../assets/img/形状 4.png");
  background-size: cover;
  .login_conter {
    width: 80%;
    height: 70%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    img {
      width: 100%;
      height: 100%;
      margin: auto;
    }
    .login_text {
      position: absolute;
      top: 19%;
      left: 68%;
      font-size: 24px;
      font-family: HYLingXinJ;
      font-weight: 800;
      color: rgba(35, 38, 46, 1);
    }

    .login_input {
      position: absolute;
      width: 33%;
      height: 12%;
      border: 1px solid rgba(138, 168, 247, 1);
      border-radius: 2px;
    }
    .password {
      left: 58.5%;
      top: 50%;
      overflow: hidden;
      .name {
        float: left;
        width: 17%;
        height: 80px;
        text-align: center;
        line-height: 80px;
        font-size: 16px;
        font-family: Alibaba PuHuiTi;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      .input {
        float: left;
        width: 83%;
        height: 60px;
        margin-top: 10px;
      }
      .line {
        position: absolute;
        top: 19px;
        left: 14%;
        width: 1px;
        height: 50px;
        background: rgba(137, 168, 247, 1);
      }
    }
    .username {
      left: 58.5%;
      top: 36%;
      overflow: hidden;
      .name {
        float: left;
        width: 17%;
        height: 80px;
        text-align: center;
        line-height: 80px;
        font-size: 16px;
        font-family: Alibaba PuHuiTi;
        font-weight: bold;
        color: rgba(51, 51, 51, 1);
      }
      .input {
        float: left;
        width: 83%;
        height: 60px;
        line-height: 60px;
        margin-top: 10px;
      }
      .line {
        position: absolute;
        top: 19px;
        left: 14%;
        width: 1px;
        height: 50px;
        background: rgba(137, 168, 247, 1);
      }
    }
    .login_btn {
      position: absolute;
      top: 69%;
      left: 58.5%;
      width: 33%;
      height: 12%;
      background: #23262e;
      box-shadow: 0px 7px 27px 0px rgba(109, 132, 219, 0.5);
      border-radius: 4px;
      font-size: 16px;
      font-family: Alibaba PuHuiTi;
      font-weight: bold;
      color: rgba(255, 255, 255, 1);
      line-height: 80px;
      text-align: center;
      cursor: pointer;
      user-select: none;
    }
    .login_btn:hover {
      background: #27345a;
    }
  }
}
</style>