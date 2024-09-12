<!--
 * @Description: 这是主页面头部（组件）
 * @Date: 2020-08-12 15:35:43
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-11-05 15:46:33
-->
<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse_bb" @click="collapseChage">
      <div class="tubiao">
        <img :src="tubiao" />
      </div>
    </div>
    <div @click="clickLogoFun()" class="logo"><span>WMS仓储管理系统</span></div>
    <div class="header-right">
      
      <div class="header-user-con">
        <!-- 皮肤选择 -->
        <skin></skin>
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <div @click="alerFun()" class="btn-bell">
          <el-badge :value="1" :max="99" class="item">
            <i class="el-icon-bell"></i>
          </el-badge>
        </div>
        <!-- 用户头像 -->
        <!-- <div class="user-avator">
          <img src="../../assets/img/img.jpg">
        </div> -->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ username }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <router-link to="/admin">
              <el-dropdown-item>用户信息</el-dropdown-item>
            </router-link> -->
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import bus from "../common/bus";
import { mapGetters } from "vuex";
import { mapActions } from "vuex";
import Skin from '@/components/main/components/skin/skin.vue'//li-add,引用皮肤图标
export default {
  components: {
    Skin
  },
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "linxin",
      message: 2,
      tubiao: require("../../assets/img/UNFURLS.png"),
      isTitle: false,
    };
  },
  computed: {
    username() {
      let username = localStorage.getItem("ms_username");
      return username ? username : this.name;
    },
    ...mapGetters("dailog", {
      isShow: "isShow",
    }),
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        var url = `${this.$store.state.dailog.url1}Login/OutLogin`;
        this.$axios({
          method: "post",
          url: url,
        }).then((res) => {
          localStorage.removeItem("ms_username");
          this.$router.push("/login");
        });
      } else if (command == "user") {
        this.$store.dispatch("dailog/showDailog");
      }
    },
    ...mapActions("dailog", ["hideDailog", "showDailog"]),
    //跳转报警页面
    alerFun() {
      this.$router.push({
        path: `/alert`,
        query: { id: `报警信息`, name: `111`, type: "1" },
      });
    },
    //筛选激活的父模块
    pagelistName(data, text) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].PageText == text) {
          this.isTitle = true;
        }
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      if (this.collapse) {
        document.querySelector(".collapse_bb").style.left = "63px";
        this.tubiao = require("../../assets/img/UNFURLS.png");
      } else {
        document.querySelector(".collapse_bb").style.left = "248px";
        this.tubiao = require("../../assets/img/Put It away.png");
        //激活对应的模块
        this.isTitle = false;
        var title = this.$route.query.id;
        var aa = this.$store.state.dailog.AutorizedPageList;
        for (let i = 0; i < aa.length; i++) {
          if (aa[i].PageText == title) {
            break;
          } else if (aa[i].ChildrenPage.length != 0) {
            this.pagelistName(aa[i].ChildrenPage, title);
            if (this.isTitle) {
              title = aa[i].PageText;
              break;
            }
          }
        }
        //高亮对应的模块
        setTimeout(() => {
          var dom = document.querySelectorAll(".el-submenu__title");
          for (let i = 0; i < dom.length; i++) {
            var name = dom[i].getElementsByClassName("iName")[0].innerHTML;
            if (name == title) {
              dom[i].classList.add("is-active");
              if (dom[i].childNodes[2].getAttribute("class") == "is-ac2") {
                dom[i].childNodes[2].classList.add("is-active2");
                dom[i].childNodes[0].classList.add("icontext");
              } else {
                dom[i].childNodes[1].classList.add("is-active2");
              }
            }
          }
        }, 500);
      }
      bus.$emit("collapse", this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    },
    showDailog1() {
      alert(12);
    },
    //点击logo
    clickLogoFun() {
      if (this.$route.query.id != this.$store.state.dailog.rouerName) {
        this.$router.push({
          path: `/HomePage`,
          query: {
            id: `${this.$store.state.dailog.rouerName}`,
            name: `${this.$store.state.dailog.rouerId}`,
            type: "1",
          },
        });
      }
    },
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage();
    }
  },
};
</script>
<style lang="less" scoped>
.header {
  background-color: #23262e !important;
  position: relative;
  box-sizing: border-box;
  width: 100%;
  // min-width: 1280px;
  // height: 70px;
  height: 7.2%;
  font-size: 22px;
  color: #fff;
}
.collapse_bb {
  position: absolute;
  top: 440px;
  left: 248px;
  z-index: 999;
  transition: all 0.4s;
  .tubiao {
    width: 18px;
    height: 60px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
      margin: auto;
    }
  }
}
.header .logo {
  position: absolute;
  height: 100%;
  // margin-top:20%;
  // float: left;
  // width: 250px;
  // line-height: 70px;
  // margin-left:24px;
  left: 24px;
  color: #009688;
  font-weight: 800;
  font-size: 24px;
  user-select: none;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  cursor: pointer;
}
.header-right {
  float: right;
  margin-right: 50px;
}
.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
  margin-right: 15px;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
</style>
