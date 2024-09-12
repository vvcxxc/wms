<template>
  <div class="itemStyle">
    <el-submenu :index="parentItem.index" popper-class="hor-submenu-class-li">
      <template slot="title">
        <i :class="parentItem.icon || ''"></i>
        <span>{{ parentName }}</span>
        <div class="item-border"></div>
      </template>
      <template v-for="(item, index) in ChildrenPage">
        <template v-if="item.ChildrenPage && item.ChildrenPage.length >= 1">
          <horizontal-menu-item :parentItem="item" :key="index"></horizontal-menu-item>
        </template>
        <template v-else>
          <el-menu-item style="color: #86868e; padding: 0 20px" class="submenu-item" :index="item.index" :key="index">
            <!-- <i :class="item.icon"></i> -->
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-submenu>
  </div>
</template>

<script>
export default {
  name: "HorizontalMenuItem",
  props: {
    parentItem: {
      Object,
      default: () => {},
    },
  },
  computed: {
    parentName() {
      return this.parentItem.name;
    },
    ChildrenPage() {
      return this.parentItem.ChildrenPage;
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less">
.itemStyle {
  float: left;
}
.submenu-item.is-active:hover,
.submenu-item:hover {
  font-size: 16px;
  background: #ededef !important;
  color: #3399ff !important;
  border-radius: 0px;
}

/* .el-submenu.is-active .el-submenu__title{
		font-size: 16px;
	} */
.submenu-item.is-active,
.submenu-item:active {
  font-size: 16px;
  color: #3399ff !important;
  
}

.submenu-item.is-active{
   background: rgba(0, 0, 0, 0) !important;
}
</style>
