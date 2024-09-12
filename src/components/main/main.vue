<template>
  <el-container class="main">
    <el-header class="main-header">
      <div class="main-header-logo" :title="headerTitle">
        <div class="hor-left-title">
          {{ headerTitle }}
          <!-- <img :src="logo" /> -->
        </div>
        <div class="hor-left-icon">
          <el-button type="text" @click="handleScroll(240)">
            <!-- <i class="el-icon-arrow-left icon-size" ></i> -->
            <img :src="headerLicon" />
          </el-button>
        </div>
      </div>

      <div class="el-menu-demo" ref="scrollOuter1">
        <div
          class="hor-menu"
          ref="scrollBody1"
          :style="{ left: tagBodyLeft + 'px' }"
        >
          <horizontal-menu
            :menu-list="menuList"
            :active-index="activeIndex"
            @handle-select="handleSelect"
          ></horizontal-menu>
        </div>
      </div>
      <div class="header-right">
        <div class="hor-right-icon">
          <el-button type="text" @click="handleScroll(-240)">
            <!-- <i class="el-icon-arrow-right icon-size"></i> -->
            <img :src="headerRicon" />
          </el-button>
        </div>
        <user :user-name="userName" :user-img-url="userImgUrl"></user>
        <!-- <massage></massage> -->
        <!-- <skin></skin> -->
        <fullscreen></fullscreen>
      </div>
    </el-header>
    <div class="tag-nav-wrapper">
      <tags-nav
        :tag-list="tagList"
        @skip-tag="handleSelect"
        @close-tag-list="closeTagList"
      ></tags-nav>
    </div>
    <el-main class="main-content">
      <!-- <keep-alive> -->
      <router-view></router-view>
      <!-- </keep-alive> -->
    </el-main>
  </el-container>
</template>

<script>
import User from "./components/user/user.vue";
import TagsNav from "./components/tags-nav/tags-nav.vue";
import HorizontalMenu from "./components/horizontal-menu/horizontal-menu.vue";
import Fullscreen from "./components/fullscreen/fullscreen.vue";
import Skin from "./components/skin/skin.vue";
import Massage from "./components/massage/massage.vue";
import "./main.less";
import { getMenuList, getSystemInfo } from "@/api/user.js";
import logo from "@/assets/img1/wnsLogo.jpg";
import { addTagNavList } from "@/libs/util.js";
import headerLicon from "@/assets/img1/headerLicon.png";
import headerRicon from "@/assets/img1/headerRicon.png";
export default {
  name: "Main",
  components: {
    User,
    HorizontalMenu,
    TagsNav,
    Fullscreen,
    Skin,
    Massage,
  },

  data() {
    return {
      headerRicon: headerRicon,
      headerLicon: headerLicon,
      tagBodyLeft: 0,
      logo: logo,
      userName: "",
      userImgUrl: "",
      menuList: [],
      activeIndex: "/home",
      headerTitle: "WMS仓储管理系统",
    };
  },
  computed: {
    tagList: {
      get() {
        return this.$store.state.app.tagNavList;
      },
      set(v) {
        this.tagList = v;
      },
    },
  },

  methods: {
    //获取首页信息
    getSystemInfoFun() {
      getSystemInfo()
        .then((res) => {
          const data = res.data;
          // console.log(data)
          if (!data) return;
          this.headerTitle = data.SystemName;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //获取按钮信息
    getBtnList(data, index) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].ChildrenPage != []) {
          this.getBtnList(data[i].ChildrenPage, index);
        }
        if (data[i].Page_ID == index) {
          this.$store.state.dailog.AutorizedBtnList = data[i].ButtonList;
        }
      }
    },
    //关闭标签列表
    closeTagList(val) {
      if (val == "all") {
        this.$store.state.app.tagNavList = [];
        this.activeIndex = "/HomePage1";
        this.$router.push({
          path: "/HomePage1",
        });
      } else {
        let list = this.$store.state.app.tagNavList;
        this.$store.state.app.tagNavList = list.filter((item, index, arr) => {
          return item.isActive;
        });
      }
    },
    //菜单点击跳转
    handleSelect(index, indexPath) {
      if (index != "") {
        let url = index.split("/");
        let query = {
          id: url[1],
          name: url[2],
          type: url[3] ? url[3] : 1,
        };
        this.$router.push({
          path: "/" + url[0],
          query: query,
        });
        this.getBtnList(this.menuList, url[2]);
        this.activeIndex = index;
        // this.addTagList(index, query);
        addTagNavList(index, query);
      } else {
        this.closeTagList("all");
      }
    },
    //添加标签
    addTagList(index, query) {
      addTagNavList(index, query);
    },

    //处理数据
    ChildrenPage(data) {
      data.forEach((item) => {
        var index = item.RouteIndex == null ? item.PageText : item.RouteIndex;
        item.index = index + "1/" + item.PageText + "/" + item.Page_ID;
        item.icon = "el-icon-star-off";
        item.name = item.PageText;
        if (item.ChildrenPage.length != 0) {
          this.ChildrenPage(item.ChildrenPage);
        }
      });
      return data;
    },
    //数据筛选要展示的数据
    powerFun(data) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].ChildrenPage.length != 0) {
          if (data[i].IsBrowse == "N") {
            data.splice(i, 1);
            i--;
          } else {
            this.powerFun(data[i].ChildrenPage);
          }
        } else {
          if (data[i].IsBrowse == "N") {
            data.splice(i, 1);
            i--;
          }
        }
      }
    },
    //获取后端菜单
    getMenu() {
      getMenuList()
        .then((res) => {
          var resultdata = res.data.resultdata;
          // console.log(resultdata)
          this.ChildrenPage(resultdata);
          this.powerFun(resultdata);
          if (resultdata != 0) {
            this.menuList = resultdata;
            let list = this.menuList;
            this.$nextTick(() => {
              this.getMenuLen(list);
            });
            for (let i = 0; i < list.length; i++) {
              if (list[i].name == "工作空间") {
                //
                var list1 = JSON.parse(sessionStorage.getItem("tagList"));
                if (list1 != "") {
                  // console.log(list[i].index)
                  this.$store.state.app.tagNavList = list1;
                  for (var j in list1) {
                    if (list1[j].isActive) {
                      // this.activeIndex = list1[j].index;
                      // this.$router.push
                      this.handleSelect(list1[j].index);
                    }
                  }
                } else {
                  this.handleSelect(list[i].index);
                }
              }
            }
          } else {
            this.$router.push({ path: "/4041" });
          }
        })
        .catch((error) => {});
    },
    //获取导航菜单长度并居中
    getMenuLen(list) {
      let myWidth = 0;
      list.forEach((val) => {
        myWidth = myWidth + 14 * val.name.length + 60;
      });
      this.$refs.scrollBody1.style.width = myWidth + "px"; //获取导航栏长度
      // this.$refs.scrollBody1.style.width = "fit-content"; //获取导航栏长度
      // console.log(this.$refs.scrollBody1.offsetWidth)
      // console.log(this.$refs.scrollOuter1.offsetWidth)
      let scrollBodyLen = this.$refs.scrollBody1.offsetWidth;
      let scrollOuterLen = this.$refs.scrollOuter1.offsetWidth;
      if (scrollBodyLen < scrollOuterLen) {
        this.tagBodyLeft = (scrollOuterLen - scrollBodyLen) / 2;
      }
    },
    //导航栏左右移动
    handleScroll(offset) {
      const outerWidth = this.$refs.scrollOuter1.offsetWidth;
      const bodyWidth = this.$refs.scrollBody1.offsetWidth;
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(
              this.tagBodyLeft + offset,
              outerWidth - bodyWidth
            );
          }
        } else {
          this.tagBodyLeft = (outerWidth - bodyWidth) / 2;
        }
      }
    },
  },
  created() {
    localStorage.systemType = "1";
    this.userName = localStorage.getItem("ms_username");
    this.activeIndex = this.$route.path;
    this.getMenu();
    this.getSystemInfoFun();
  },
  mounted() {
    // console.log(this.$refs.scrollBody1.offsetWidth = 200)
    // this.$refs.scrollBody1.w = 130*11+'px'
  },
};
</script>
<style lang="less" scoped>
.main /deep/ .el-input__inner {
  border: 1px solid #e4e4e4;
  border-radius: 2px;
  padding: 0 8px;
  // color: #606266;
}
.main /deep/ .el-input__inner:hover {
  border-color: #bfbfbf;
}
.main /deep/ .el-select .el-input.is-focus .el-input__inner {
  border-color: #3399ff;
}
.main /deep/ .el-input--small .el-input__inner {
  height: 30px;
}
.main /deep/ .el-input.is-active .el-input__inner,
.main /deep/ .el-input__inner:focus,
.main /deep/ .el-select .el-input__inner:focus {
  border-color: #3399ff;
  // color:red;
}
</style>
<style lang="less">
</style>
