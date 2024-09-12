<template>
  <div class="horizontal" >
    <!-- menu-trigger="click" -->

    <el-menu text-color="#ffffff" active-text-color="#EDEDEF" :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <template v-for="(item, index) in menuList">
        <template v-if="item.ChildrenPage && item.ChildrenPage.length >= 1">
          <horizontal-menu-item :parentItem="item" :key="index"></horizontal-menu-item>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
            <div class="item-border"></div>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import HorizontalMenuItem from "./horizontal-menu-item.vue";
export default {
  name: "HorizontalMenu",
  components: {
    HorizontalMenuItem,
  },
  props: {
    menuList: {
      Array,
      default: () => [],
    },
    activeIndex: {
      String,
      default: "/home",
    },
  },
  data() {
    return {};
  },
  methods: {
    handleSelect(index, indexPath) {
      this.$emit("handle-select", index, indexPath);
    },
  },
};
</script>

<style lang="less">
.horizontal {
 
  .item-border {
    position: absolute;
    height: 33px;
    border-right: 1px solid #6081fa;
    top: 14px;
    right: 0;
  }

  .el-menu--horizontal {
    background: rgba(0, 0, 0, 0);
    height: 100%;
    color: #ffffff;
    line-height: 20px;
    font-weight: 500;
    font-family:'Alibaba PuHuiTi', 'Microsoft YaHei';
  }

  .el-submenu__title i,
  .el-menu-item i {
    color: #ffffff;
    font-size: 14px;
    position: static;
    margin-top: 0px;
    margin-left: 3px;
  }
  .el-menu-item,
  .el-submenu__title {
    padding: 0 10px;
    height: 60px;
    line-height: 60px;
  }
  .el-menu-item [class^="el-icon-"],
  .el-submenu [class^="el-icon-"] {
    width: auto;
  }
 

 .el-menu--horizontal > .el-submenu .el-submenu__title:hover,
  .el-submenu__title:hover i,
  .el-submenu__title:hover,
  .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
  .el-menu-item:not(.is-disabled):hover i {
    color: #ffffff !important;
    background: rgba(0, 0, 0, 0) !important;
    font-size: 14px;
    
  }

  .el-menu--horizontal > .el-menu-item.is-active,
  .el-submenu.is-active,
  .el-menu-item.is-active i {
    color: #ffffff !important;
    background: rgba(0, 0, 0, 0) !important;
    border-bottom: 0px;
  }
  
}
</style>
