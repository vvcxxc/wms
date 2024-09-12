<template>
  <div class="massage">
    <el-dropdown placement="bottom" @command="alterFun">
      <el-badge :value="massageNum" :max="99" class="item">
        <img :src="xiaoxi" @mouseenter="enter()" @mouseleave="leave()" />
        <!-- <i class="el-icon-bell"></i> -->
      </el-badge>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item
          v-for="(item, index) in alarmInfoList"
          :key="index"
          class="skin-drop"
          :command="index"
          >{{ item.AlarmText }}：{{ item.AlarmAmount }}</el-dropdown-item
        >
        <!-- <el-dropdown-item class="skin-drop" command="2">超时风险：{{massageNum-1}}</el-dropdown-item>
        <el-dropdown-item class="skin-drop" command="3">设备预警：{{massageNum>1?1:0}}</el-dropdown-item> -->
      </el-dropdown-menu>
    </el-dropdown>

    <!-- hbsis -->
    <!-- </el-popover>  -->
  </div>
</template>
<script>
import xiaoxi1 from "@/assets/img1/xiaoxi.png";
import xiaoxi from "@/assets/img1/xiaoxi1.png";
import { addTagNavList } from "@/libs/util.js";
import { getAlarmInfo } from "@/api/home.js";
export default {
  data() {
    return {
      xiaoxi: xiaoxi1,
      massageNum: 1,
      timer: "",
      visible: true,
      alarmInfoList: [],
    };
  },
  methods: {
    //跳转报警页面
    alterFun(index1) {
      // console.log(item)
      let alarmInfo = this.alarmInfoList[index1];
      console.log(alarmInfo);
      let AlarmPath =
        "/" +
        (alarmInfo.AlarmPath == "ListPage"
          ? alarmInfo.AlarmPath + "1"
          : alarmInfo.AlarmPath);

      var query = {
        id: alarmInfo.AlarmPathId,
        name: alarmInfo.AlarmPathName,
        type: alarmInfo.AlarmPathType,
      };
      this.$router.push({
        path: AlarmPath,
        query: query,
      });
      let index = `${AlarmPath}/${alarmInfo.AlarmPathId}/${alarmInfo.AlarmPathName}`;
      addTagNavList(index, query);
    },
    enter() {
      this.xiaoxi = xiaoxi;
    },
    leave() {
      this.xiaoxi = xiaoxi1;
    },
    getMessage() {
      // this.massageNum++;
      // if(this.massageNum === 4){
      //  this.visible = true

      // }
      // if (this.massageNum === 100) {
      //   clearInterval(this.timer);
      // }
      getAlarmInfo()
        .then((res) => {
          const data = res.data;
          //  console.log(data)
          this.alarmInfoList = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  mounted() {
    this.getMessage();
    // this.timer = setInterval(()=>{
    //   this.getMessage()
    // },5000)
  },
  beforeDestroy() {
    // console.log('massage')
    clearInterval(this.timer);
  },
};
</script>
<style lang="less">
.massage {
  float: right;
  margin-right: 10px;
  height: 100%;
  display: flex;
  align-items: center;

  img {
    // margin-top: 19px;
    vertical-align: middle;
  }

  .item {
    .el-badge__content {
      min-width: 14px;
      height: 14px;
      line-height: 12px;
      padding: 0 1px;
    }
    .el-badge__content.is-fixed {
      top: 1px;
      right: 12px;
    }
  }
  &:hover {
    .el-badge__content {
      border: 1px solid #fba936;
    }
  }

  .el-icon-bell {
    font-size: 23px;
    color: #ffffff;
    &:hover {
      color: #fba936;
    }
  }
}
.massage-popper {
  // background: #f2f2f2;
  position: absolute;
}
</style>