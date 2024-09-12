<!--
 * @Description: 这是主页面（组件）
 * @Date: 2021-03-18 10:00:02
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-12-10 13:42:12
-->
<template>
  <div class="home" ref="home">
    <!-- <div class="home-top"> -->
    <div>
      <el-row :gutter="24">
        <el-col :span="8" v-for="(item, index) in topList" :key="index">
          <!-- @click="jumpPage(index + 1)" -->
          <div class="top-box">
            <div class="box-info">
              <div class="info-title1">{{ item.title1 }}</div>
              <div class="info-value1">{{ item.value2 }}</div>
            </div>
            <div class="box-progress">
              <el-progress
                :show-text="false"
                :percentage="(item.value2 / item.defultValue2) * 100"
                color="#3399FF"
                v-if="!isNaN(parseInt((item.value2 / item.defultValue2) * 100))"
              ></el-progress>
              <div
                class="pro-text"
                :style="{
                  left:
                    item.value2 / item.defultValue2
                      ? (item.value2 / item.defultValue2) * 100 - 2 >= 0
                        ? (item.value2 / item.defultValue2) * 100 - 2 + '%'
                        : 0
                      : 0,
                }"
              >
                {{
                  item.value2 != ""
                    ? (
                        (item.value2 /
                          (item.defultValue2 == 0 ? 1 : item.defultValue2)) *
                        100
                      ).toFixed(2) + "%"
                    : ""
                }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="echart-box">
      <el-row :gutter="24">
        <el-col
          :span="
            echartArr.length % 3 == 0
              ? 8
              : echartArr.length % 3 == 1 && index != echartArr.length - 1
              ? 8
              : echartArr.length % 3 == 1 && index == echartArr.length - 1
              ? 24
              : echartArr.length % 3 == 2 && index != echartArr.length - 1
              ? 8
              : 16
          "
          v-for="(item, index) in echartArr"
          :key="index"
          class="echart-box-style"
        >
          <lineEcharts
            :data="item"
            v-if="item.Chart_Type == 1"
            :dateBtnList="dateBtnList"
          >
          </lineEcharts>
          <barEcharts
            :data="item"
            v-if="item.Chart_Type == 4"
            :dateBtnList="dateBtnList"
          >
          </barEcharts>
          <pieEcharts :data="item" v-if="item.Chart_Type == 3"> </pieEcharts>
        </el-col>
      </el-row>
    </div>

    <div class="date-list">
      <div class="ligth-box">
        有无可出库物料:
        <img
          class="ligth-icon"
          :src="
            outboundLight
              ? require('../../assets/img/green-light.svg')
              : require('../../assets/img/grey-light.svg')
          "
        />
      </div>
      <div
        :class="item.select ? 'date-btn current-btn' : 'date-btn'"
        v-for="(item, idx) in dateBtnList"
        :key="idx"
        @click="changeDateType(item.label)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script>
import LineEcharts from "./components/echartsLine.vue";
import PieEcharts from "./components/echartspPie.vue";
import BarEcharts from "./components/echartsBar.vue";
import { getPageChart } from "@/api/home.js";
import { addTagNavList } from "@/libs/util.js";
import {
  getSystemInfo,
  getSystemBoxsInfo,
  getAllowOutboundTask,
} from "@/api/user.js";

import "./home.less";
export default {
  components: {
    LineEcharts,
    PieEcharts,
    BarEcharts,
  },
  data() {
    return {
      id: "",
      percentage: 20,
      echartArr: [],
      topList: [
        {
          title1: "库存使用率",
          value1: "10%",
          title2: "",
          value2: "6",
          defultValue2: "62",
        },
        {
          title1: "出库任务比例",
          value1: "40",
          title2: "出库任务",
          value2: "40",
          defultValue2: "100",
        },
        {
          title1: "当前报警数",
          value1: "0",
          title2: "",
          value2: "",
          defultValue2: "",
        },
      ],
      dateUrl: "",
      dateBtnList: [
        {
          label: "天",
          select: false,
          url: "/Base_Chart/GetDayBarInOutStockAnalyse",
        },
        {
          label: "周",
          select: true,
          url: "/Base_Chart/GetWeekBarInOutStockAnalyse",
        },
        {
          label: "月",
          select: false,
          url: "/Base_Chart/GetMonthBarInOutStockAnalyse",
        },
      ],
      outboundLight: false,
    };
  },

  methods: {
    changeDateType(label) {
      this.dateBtnList.forEach((item) => {
        item.select = item.label == label ? true : false;
      });
    },
    //页面初始化
    init() {
      // 1 为折线 2为柱状 3为饼图  4为正负柱状
      this.loading = false;
      this.id = "Home";
      getPageChart(this.id)
        .then((res) => {
          // console.log(res);
          this.loading = false;
          let data = JSON.parse(res.data.resultdata);
          this.echartArr = data;
          console.log("data", data);
        })
        .catch((error) => {
          this.loading = false;
          // console.loading(error);
        });
      this.getSystemInfoFun();
    },
    //获取首页信息
    getSystemInfoFun() {
      this.topList = [];
      getSystemInfo()
        .then((res) => {
          const data = res.data;
          // console.log(data)
          if (!data) return;
          // this.headerTitle = data.SystemName
          let BoxInfos = data.BoxInfos || [];
          this.getBoxInfosList(BoxInfos);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async getBoxInfosList(list) {
      for (let i = 0; i < list.length; i++) {
        await this.getInfos(list[i]).then((res) => {
          // console.log(res)
          const data = res.data;
          // console.log(data)
          if (data) {
            this.topList.push({
              title1: data.info_title,
              value1: data.info_value,
              title2: data.info_rightTxt,
              value2: data.info_right_amount,
              defultValue2: data.info_right_total,
            });
          }
        });
      }
      console.log(this.topList);
    },
    getInfos(info) {
      return new Promise((resolve, reject) => {
        //  let url = info.BoxUrl
        // console.log(info)
        getSystemBoxsInfo(info)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    jumpPage(index) {
      let routerPath = "";
      let index1 = "";
      let query = "";
      if (index == 1) {
        routerPath = "/WarehouseMap1";
        index1 = "WarehouseMap1/库位地图/399CFCAD-2E8D-42BB-B550-590992E44035";
        query = {
          id: "库位地图",
          name: "399CFCAD-2E8D-42BB-B550-590992E44035",
        };
      } else if (index == 2) {
        routerPath = "/ListPage1";
        index1 = "ListPage1/任务列表/2919F971-83F9-4D21-BDE4-68F44B316984";
        query = {
          id: "任务列表",
          name: "2919F971-83F9-4D21-BDE4-68F44B316984",
        };
      } else if (index == 3) {
        routerPath = "/ListPage1";
        index1 = "ListPage1/报警列表/4D3F9245-DA20-43F7-8C20-29E473143EDB";
        query = {
          id: "报警列表",
          name: "4D3F9245-DA20-43F7-8C20-29E473143EDB",
        };
      }
      addTagNavList(index1, query);
      this.$router.push({
        path: routerPath,
        query: query,
      });
    },
    getAllowOutboundTaskFn() {
      getAllowOutboundTask().then((res) => {
        this.outboundLight = JSON.parse(res.data.resultdata).Success;
      });
    },
  },
  mounted() {
    // console.log(this.$refs.home)
    this.init();
    this.getAllowOutboundTaskFn();
    // this.echartArr = [
    //   {
    //     title: '库存使用率',
    //     Chart_ID: "01_HuanCunQuKuWeiCircularChart",
    //     Chart_Type: 3,
    //     data_url: "/Common/Base_Chart/HuanCunQuKuWeiCircularChart",
    //     Page_ID: "Home",
    //     pieEntities: [
    //       { name: "无货", value: 67 },
    //       { name: "空托", value: 3 },
    //       { name: "不可用", value: 0 },
    //       { name: "有货", value: 12 },
    //     ],
    //   },
    //   {
    //     title: '当日任务比例',
    //     Chart_ID: "02_LiKuKuWeiCircularChart",
    //     Chart_Type: 3,
    //     data_url: "/Common/Base_Chart/LiKuKuWeiCircularChart",
    //     Page_ID: "Home",
    //     pieEntities: [
    //       { name: "冲压线出库", value: 67 },
    //       { name: "回库", value: 30 },
    //       { name: "空托给AGV", value: 0 },
    //       { name: "AGV入库", value: 22 },
    //     ],
    //   },
    //   // {
    //   //   Chart_ID: "03_DeliverBillSurveyCircularChart",
    //   //   Chart_Type: 3,
    //   //   data_url: "/Common/Base_Chart/DeliverBillSurveyCircularChart",
    //   //   Page_ID: "Home",
    //   // },
    //   // {
    //   //   Chart_ID: "03_DeliverBillSurveyCircularChart",
    //   //   Chart_Type: 3,
    //   //   data_url: "/Common/Base_Chart/DeliverBillSurveyCircularChart",
    //   //   Page_ID: "Home",
    //   // },

    //   {
    //     title: '',
    //     Chart_ID: "03_DeliverBillSurveyCircularChart",
    //     Chart_Type: 4,
    //     data_url: "/Common/Base_Chart/DeliverBillSurveyCircularChart",
    //     Page_ID: "Home",
    //   },
    // ];
  },
};
</script>
<style scoped lang="less">
.box-progress /deep/ .el-progress-bar__outer {
  //   background: #3399ff;
  background: rgba(51, 153, 255, 0.22);
  //   opacity: 0.22;
  border-radius: 0px 0px 5px 1px;
}
.top-box {
  margin-bottom: 20px;
}
</style>