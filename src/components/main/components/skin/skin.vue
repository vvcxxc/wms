<template>
  <!-- 
        
    </div> -->
  <div class="skin">
    <el-dropdown trigger="click" placement="bottom" @command="huanFuFun">
      <span class="el-dropdown-link">
        <img :src="huanfu" @mouseenter="enter()" @mouseleave="leave()" />
      </span>
      <el-dropdown-menu  slot="dropdown">
        <el-dropdown-item class="skin-drop" command="1">皮肤1</el-dropdown-item>
        <el-dropdown-item class="skin-drop" command="2">皮肤2</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import huanfu from "@/assets/img1/huanfu.png";
import huanfu1 from "@/assets/img1/huanfu1.png";
export default {
  data() {
    return {
      huanfu: huanfu,
    };
  },
  methods: {
    enter() {
      this.huanfu = huanfu1;
    },
    leave() {
      this.huanfu = huanfu;
    },
    huanFuFun(val){
      console.log(val)
        // alert(1)
        // this.$store.state.app.systemType = val
        localStorage.systemType = val
        if(val == "1"){
            this.$router.push({
                path:'/HomePage1'
            })
        }else if(val =="2"){
             this.$router.push({
                path:'/HomePage'
            })

        }

    }
  },
};
</script>
<style lang="less">
.skin {
  float: right;
  margin-right: 10px;
  height: 100%;
  display: flex;
  align-items: center;
  img {
    // margin-top: 19px;
    vertical-align: middle;
  }
  .el-dropdown{
      background: rgba(0, 0, 0, 0);
  }
}

 .el-dropdown-menu--small .skin-drop {
  font-size: 14px;
  font-family: 'Alibaba PuHuiTi', 'Microsoft YaHei';
  font-weight: 500;
  color: #86868e;
}
.el-dropdown-menu__item .skin-drop:focus , .el-dropdown-menu--small .skin-drop:hover{
    color: #ffffff !important;
    background: #FBA936  !important;
}
</style>