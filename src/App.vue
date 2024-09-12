<!--
 * @Description: 这是***页面（组件）
 * @Date: 2020-09-11 12:59:09
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-09-21 15:19:42
-->
<template>
  <div id="app">
    <router-view></router-view>
    <!-- 全局设备报警监听，移除改组件就可以取消监听 -->
    <device-alert></device-alert>
  </div>
</template>
<script>
import DeviceAlert from "@/components/common/device-alert";
export default {
  components: { DeviceAlert },
};
</script>
<style>
@import "./assets/css/main.css";
/* @import "./assets/css/color-dark.css"; */ /*深色主题*/
@import "./assets/css/theme-green/color-green.css"; /*浅绿色主题*/
.el-button.is-disabled,
.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  color: #bfcbd9;
  cursor: not-allowed;
  background-image: none;
  background-color: #eef1f6;
  border-color: #d1dbe5;
}
</style>