<!--
 * @Description: 这是饼图页面（组件）
 * @Date: 2020-08-17 09:26:09
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-09-21 16:27:44
-->
<template>
  <div ref="main3" class="echart"></div>
</template>
<script>
import { getEchartInfo } from "@/api/home.js";
export default {
  data() {
    return {
      echartData: [],
      series: [],
      legendData: [],
      title: "",
      myChart3: "",
    };
  },
  props: ["data", "dataIndex", "dateBtnList"],
  created() {
    this.init();
  },
  mounted() {
    this.$nextTick(function () {
      if (this.$refs.main3) {
        window.addEventListener("resize", () => {
          this.myChart3.resize();
          // console.log(myChart3)
        });
        this.drawLine();
      }
    });
  },
  watch: {
    dateBtnList: {
      deep: true,
      handler(val) {
        let item = val.find((_ => _.select));
        if (item) {
          let url = item.url;
          this.init(url);
        }
      },
    },
  },
  methods: {
    init(_url) {
      // console.log('ddd',this.data)
      // var data = {
      //   chartname: "缓存区库位使用情况分析图",
      //   xdata: null,
      //   histogramEntities: null,
      //   pieEntities: [
      //     { name: "已满", value: 67 },
      //     { name: "已冻结", value: 3 },
      //     { name: "已锁定", value: 0 },
      //     { name: "可用", value: 12 },
      //   ],
      // };
      // for (var item in this.data.pieEntities) {
      //   this.legendData.push(this.data.pieEntities[item].name);
      // }
      // this.title = this.data.title;
      // this.series = this.data.pieEntities;
      let url = _url ? _url : this.data.data_url;
      getEchartInfo(url)
        .then((res) => {
          if (!res.data.resultdata) return;
          let data = JSON.parse(res.data.resultdata);
          this.title = data.chartname;
          this.series = data.pieEntities;
          for (var item in data.pieEntities) {
            this.legendData.push(data.pieEntities[item].name);
          }
          this.drawLine();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //渲染图表
    drawLine() {
      //饼图
      var option = {
        title: {
          text: "{a|    }" + this.title,
          left: "left",
          padding: [10, 20],
          textStyle: {
            fontSize: 16,
            fontFamily: "Alibaba PuHuiTi",
            fontWeight: 500,
            color: "#333333",
            lineHeight: 36,
            rich: {
              a: {
                height: 16,
                width: 16,
                backgroundColor: {
                  image: require("@/assets/img1/65.png"),
                },
              },
            },
          },
        },

        color: [
          "#797FF9",
          "#87E0CD",
          "#2377D8",
          "#FCB977",
          "#50AFFC",
          "#61CAD7",
          "#82A0C0",
          "#FFC23E",
          "#2377D8",
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
          data: this.legendData,
          right: null, //右邊距
          top: null,
          bottom: -23,
          left: "center",
          padding: [40, 20],
          // width:20
          itemWidth: 18,
          itemHeight: 18,
          // borderRadius:0
        },
        series: [
          {
            name: "",
            radius: ["40%", "55%"],
            type: "pie",
            center: ["50%", "50%"],
            //  width:'50%',
            // height:'50%',
            data: this.series,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              fontSize: 14,
              fontFamily: "Alibaba PuHuiTi",
              fontWeight: 500,
              color: "#888888",
              lineHeight: 48,
            },
            labelLine: {
              length: 50,
            },
          },
        ],
      };
      this.myChart3 = this.$echarts.init(this.$refs.main3);
      this.myChart3.setOption(option);
      this.myChart3.resize();
    },
  },
  destroyed() {
    //关键四   定时清除init带来的定时器
    window.removeEventListener("resize", this.myChart3);
  },
};
</script>
<style lang="less" scoped>
.echart {
  width: 100%;
  height: 440px;
}
</style>