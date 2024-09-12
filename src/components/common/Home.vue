<!--
 * @Description: 这是主页面修改密码面（组件）
 * @Date: 2020-08-13 10:00:02
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 10:51:51
 暂时没用的
-->
<template>
  <div class="wrapper">
    <v-head></v-head>
    <div class="wnsConter">
      <v-sidebar ref="sidebar"></v-sidebar>
      <div class="content-box" :class="{'content-collapse':collapse}">
        <v-tags></v-tags>
        <div class="content">
          <transition name="move" mode="out-in">
            <keep-alive :include="tagsList">
              <router-view></router-view>
            </keep-alive>
          </transition>
        </div>
      </div>
    </div>

    <el-dialog title="密码修改" :visible.sync="isShow" v-dialogDrag :before-close="handleClose">
      <el-form :model="form">
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" :label-width="formLabelWidth">
          <el-input show-password v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDailog()">取 消</el-button>
        <el-button type="primary" @click="hideDailog()">确 定</el-button>
      </div>

    </el-dialog>

    <tipsPop :type="tipsType" :textInfo='textInfo' v-if="tipsPopShow"></tipsPop>
    <div v-if="tipsPopShow" class="mask_box"></div>

  </div>
</template>

<script>
import vHead from "./Header.vue";
import vSidebar from "./Sidebar.vue";
import vTags from "./Tags.vue";
import bus from "./bus";
import tipsPop from "./tipsPop"

import { mapGetters } from "vuex";
import { mapActions } from "vuex";
export default {
  components: {
    vHead,
    vSidebar,
    vTags,
    tipsPop
  },
  data() {
    return {
      tagsList: [],
      collapse: false,
      tipsPopShow: false,
      tipsType: '',
      textInfo: '',
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
      formLabelWidth: '120px'
    };
  },
  computed: {
    ...mapGetters("dailog", {
      isShow: "isShow"
    })
  },
  methods: {
    // NumFun(num){
    //    this.$refs.sidebar
    // },
    ...mapActions("dailog", ["hideDailog", "showDailog"]),
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.hideDailog();
          //this.$store.dispatch('dailog/hideDailog')
        }).bind(this)
        .catch(_ => { });
    },
    //关闭权限提示
    cancelFun() {
      this.tipsPopShow = false
    },
    //开启权限提示
    openFun(text) {
      this.tipsPopShow = true
      this.textInfo = text
      this.tipsType = '7'
    },
  },

  created() {
    localStorage.systemType = '2'//Li-add

    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on("tags", msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    });
  },
};
</script>
<style lang="less">
.content {
  height: 92%;
}
.wrapper {
  // min-width: 1280px;
  .wnsConter {
    position: relative;
    width: 100%;
    height: 100%;
    // min-width: 1280px;
  }
}
.mask_box {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 100%;
  height: 100%;
  z-index: 9;
}


</style>
