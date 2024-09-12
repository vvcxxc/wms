<!--
 * @Description: 这是横向柱形图页面（组件）
 * @Date: 2020-08-17 09:09:24
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-09-21 14:53:01
-->
<template>
  <div style="width: 100%; height: 100%">
    <div ref="main3" class="echart"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "",
      xdata: [],
      series: [],
      legendData: [],
      myChart: "",
    };
  },
  props: ["data"],
  created() {
    this.init();
  },
  watch: {
    data() {
      this.init();
    },
  },
  mounted() {
    this.$nextTick(function () {
      if (this.$refs.main3) {
        window.addEventListener("resize", () => {
          // console.log(222)
          this.myChart.resize();
          // this.drawLine();
        });
        this.drawLine();
      }
    });
  },
  methods: {
    init() {
      let data = this.data;
      this.xdata = data.xdata;
      this.title = data.chartname;
      this.series = [];
      this.legendData = [];
      for (let i = 0; i < data.histogramEntities.length; i++) {
        this.legendData.push(data.histogramEntities[i].name);
        var value = {
          name: data.histogramEntities[i].name,
          type: "bar",
          label: {
            show: true,
            position: "inside",
            formatter: "{c}" + data.histogramEntities[i].unit,
          },
          data: data.histogramEntities[i].data,
        };

        this.series.push(value);
      }
      this.drawLine();
    },
    //渲染图
    drawLine() {
      this.myChart = this.$echarts.init(this.$refs.main3);
      this.myChart.clear();
      //折线图
      var option3 = {
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
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        color: [
          "#FCB977",
          "#3399FF",
          "#50AFFC",
          "#797FF9",
          "#61CAD7",
          "#82A0C0",
        ],
        legend: {
          data: this.legendData,
          right: 0, //右邊距
          top: 0,
          // bottom: -22,
          // left: "center",
          padding: [20, 20],
          // width:20
          itemWidth: 18,
          itemHeight: 18,
        },
        grid: {
          left: "10%",
          right: "10%",
          bottom: "5%",
          top: "15%",
          // containLabel: true
        },
        xAxis: [
          {
            type: "value",
            axisLine: {
              //x轴样式
              show: false,
              lineStyle: {
                color: "#DFDFDF",
                width: 1,
                type: "solid",
              },
            },
            axisLabel: {
              show: false,
              textStyle: {
                color: "#333333",
              },
            },
          },
        ],
        yAxis: [
          {
            type: "category",
            axisTick: {
              show: false,
            },
            data: this.xdata,
            axisLabel: {
              show: true,
              textStyle: {
                color: "#333333",
              },
            },
            axisLine: {
              //x轴样式
              show: true,
              lineStyle: {
                color: "#DFDFDF",
                width: 1,
                type: "solid",
              },
            },
          },
        ],
        series: this.series,
      };
      this.myChart.setOption(option3);
      this.myChart.resize();
    },
  },
};
</script>
<style lang="less" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>