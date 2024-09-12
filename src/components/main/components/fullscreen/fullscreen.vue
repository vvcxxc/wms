<template>
  <div class="fullscreen" @mouseenter="enter()" @mouseleave="leave()" @click="handleFullscreen()">
    <el-tooltip effect="dark" :content="value ? `取消全屏` : `全屏`" placement="bottom">
      <img :src="quanping" />
    </el-tooltip>
  </div>
</template>
<script>
import quanping from "@/assets/img1/quanping.png";
import quanping1 from "@/assets/img1/quangping.png";
export default {
  data() {
    return {
      quanping: quanping,
      value: false,
    };
  },
  methods: {
    enter() {
      this.quanping = quanping1;
    },
    leave() {
      this.quanping = quanping;
    },

    handleFullscreen() {
      let main = document.body;
      if (this.value) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (main.requestFullscreen) {
          main.requestFullscreen();
        } else if (main.mozRequestFullScreen) {
          main.mozRequestFullScreen();
        } else if (main.webkitRequestFullScreen) {
          main.webkitRequestFullScreen();
        } else if (main.msRequestFullscreen) {
          main.msRequestFullscreen();
        }
      }
      this.value = !this.value;
    },
  },
};
</script>
<style lang="less">
.fullscreen {
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
  margin-right: 10px;
  img {
    // margin-top: 19px;
    vertical-align: middle;
  }
}
</style>