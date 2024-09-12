<template>
  <div class="error-page">
    <div class="error-list">
      <div class="error-img">
        <img :src="errorImg" />
        <div class="error-text">
          <div>啊哦~~您所访问的页面不存在</div>
          <div class="error-btn">
            <router-link to="/HomePage1">
              <el-button class="btn-style21 btn-style8">返回首页</el-button>
            </router-link>
            <el-button class="btn-style4 btn-style8" @click="goBack">返回上一页</el-button>
          </div>
        </div>
      </div>
    </div>

  </div>

</template>
<script>
import errorImg from '@/assets/img1/404.png'
export default {
  data() {
    return {
      errorImg: errorImg

    }
  },
  methods: {
       goBack(){
          this.$router.go(-1);
      }
  }
}
</script>
<style lang="less">
.error-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: #ffffff;
  .error-list {
    position: absolute;
    top: 10%;
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-family: "Microsoft YaHei";
    font-weight: 400;
    color: #939292;
    line-height: 20px;
  }
  .error-img {
    position: relative;
    width: 100%;
    height: 100%;
  }
  .error-text{
      position: absolute;
      width: 100%;
      bottom:-80px;
  }
  .error-btn {
    margin-top: 55px;
  }
  .btn-style21 {
    margin-right: 40px;
  }
  .btn-style8 {
    width: 100px;
    height: 36px;
    // background: #3399ff;
    border-radius: 2px;
  }
}
</style>