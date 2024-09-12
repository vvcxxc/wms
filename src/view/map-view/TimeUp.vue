<template>
  <div>{{ time }}</div>
</template>
<script>
export default {
  props: ["itemtime"],
  data() {
    return {
      time: "--",
      timer: 0,
    };
  },
  watch: {
    itemtime(n, o) {
      console.log("n", n);
      clearInterval(this.timer);
      if (n) {
        this.setTime(n);
      } else {
        this.time = "";
      }
    },
  },
  methods: {
    countDown(time) {
      var nowTime = +new Date();
      var inTime = +new Date(time); //返回的是用户输入时间总的毫秒数
      var secondTime = (nowTime - inTime) / 1000; //时间总的秒数
      var d = parseInt(secondTime / 60 / 60 / 24); //计算天数
      //   d = d < 10 ? "0" + d : d; //当天数小于10时补0
      var h = Number(d) * 24 + parseInt((secondTime / 60 / 60) % 24); //计算小时
      h = h < 10 ? "0" + h : h;
      var m = parseInt((secondTime / 60) % 60); //计算分
      m = m < 10 ? "0" + m : m;
      var s = parseInt(secondTime % 60); //计算秒
      s = s < 10 ? "0" + s : s;
      return h + ":" + m + ":" + s;
    },
    setTime(time) {
      this.timer = setInterval(() => {
        this.time = this.countDown(time);
      }, 1000);
    },
  },
  destroyed() {
    clearInterval(this.timer);
  },
  mounted() {
    clearInterval(this.timer);
    if (this.itemtime) {
      this.setTime(this.itemtime);
    }
  },
};
</script>