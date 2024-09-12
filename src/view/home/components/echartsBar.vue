<!--
 * @Description: 这是横向柱形图页面（组件）
 * @Date: 2020-08-17 09:09:24
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-09-21 14:53:01
-->
<template>
  <div>
    <div ref="main3" class="echart"></div>
  </div>
</template>
<script>
import { getEchartInfo } from "@/api/home.js";
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
  props: ["data", "dateBtnList"],
  created() {
    this.init();
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
      // var url = this.data.data_url
      let url = _url ? _url : this.data.data_url;
      this.series = []
      this.legendData = []
      //  console.log(url)
      getEchartInfo(url)
        .then((res) => {
          // console.log(res)
          if (!res.data.resultdata) return;
          let data = JSON.parse(res.data.resultdata);
          this.xdata = data.xdata;
          this.title = data.chartname;
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
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
      // this.title = "七日报警数"
      // this.xdata = ['1日', '2日', '3日', '4日','5日','6日','7日']
      // // this.legendData = ['出库数量','入库数量','当前库存量']
      // let list = [{
      //   name: '每日报警数',
      //   data: [30, 20, 35, 30,20,10,7],
      //   // stack:'出库'
      // },
      // {
      //   name: '当前库存量',
      //   data: [10, 70, 100, 50],
      //   stack:'库存'
      // },
      //  {
      //   name: '入库数量',
      //   data: [120, 150, 170, 180],
      //   stack:'库存'
      // },

      // ]
      // for (let i = 0; i < list.length; i++) {
      //   this.legendData.push(list[i].name)
      //   var value = {
      //     name: list[i].name,
      //     type: 'bar',
      //     label: {
      //       show: true,
      //       // position: 'inside',
      //        color:'#494949',
      //        position: 'right',
      //     },
      //     barGap: 0.5, //柱子之间间距
      //     barWidth: 12, //柱子宽度
      //     stack:list[i].stack,
      //     data: list[i].data,
      //   }
      //   console.log(value)
      //   this.series.push(value)

      // }
      // this.drawLine()

      // var url1 = `${this.$store.state.dailog.url1}${url}`
      // this.$axios({              //初始化数据
      //   method: 'get',
      //   url: url1,
      // }).then(res => {
      //   var data = JSON.parse(res.data.resultdata)
      //   this.xdata = data.xdata
      //   this.title = data.chartname
      //   for (let i = 0; i < data.histogramEntities.length; i++) {
      //     this.legendData.push(data.histogramEntities[i].name)
      //     var value = {
      //       name: data.histogramEntities[i].name,
      //       type: 'bar',
      //       label: {
      //         show: true,
      //         position: 'inside'
      //       },
      //       data: data.histogramEntities[i].data,
      //     }

      //     this.series.push(value)
      //   }
      //   this.drawLine()
      // }).catch(function (error) {
      //   console.log(error);
      // });
    },
    //渲染图
    drawLine() {
      this.myChart = this.$echarts.init(this.$refs.main3);
      this.myChart.resize();
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