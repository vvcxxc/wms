<template>
  <div class="deletePop">
    <div class="title">
      <span class="title_i el-icon-warning"></span>
      <span class="text">提示</span>
    </div>

    <div class="delete_text">{{ text }}</div>

    <div v-if="deleteShow" class="delete_btn">
      <div @click="deleteBtn('1')" class="no">否（NO）</div>
      <div @click="deleteBtn('2')" class="yes">是（YES）</div>
    </div>

    <div v-if="!deleteShow" class="delete_btn">
      <div @click="deleteBtn('1')" class="deleteConfig">确认</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: ["text", "deleteShow"],
  methods: {
    deleteBtn(num) {
      this.$emit("deleteBtn", num);
    },
  },
};
</script>
<style lang="less" scoped>
.deletePop {
  position: absolute;
  left: 0;
  right: 0;
  // bottom:0;
  top: 200px;
  margin: auto;
  width: 385px;
  min-height: 205px;
  background: #fff;
  border: 1px solid #eee;
  box-shadow: -7px 7px 50px 0px rgba(51, 51, 51, 0.5);
  z-index: 10;
  .title {
    width: 100%;
    height: 40px;
    background: #ffbc3d;
    text-align: center;
    line-height: 40px;
    color: #fff;
    .title_i {
      color: #fff;
      margin-right: 5px;
    }
  }
  .delete_text {
    width: 70%;
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: normal;
    word-break: break-all;
    text-align: left;
    margin: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .delete_btn {
    width: 100%;
    height: 45px;
    .no {
      float: left;
      width: 160px;
      height: 30px;
      background: #e0e0e0;
      color: #737373;
      text-align: center;
      line-height: 30px;
      margin-left: 33px;
      margin-right: 5px;
      cursor: pointer;
    }
    .yes {
      float: left;
      width: 160px;
      height: 30px;
      background: #f3e3ad;
      color: #eba241;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
    }
    .deleteConfig {
      width: 315px;
      height: 30px;
      background: #f3e3ad;
      color: #eba241;
      text-align: center;
      line-height: 30px;
      cursor: pointer;
      margin-left: 35px;
    }
  }
}
</style>