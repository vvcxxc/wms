<!--
 * @Description: 这是折线图或柱形图页面（组件）
 * @Date: 2020-08-17 09:09:24
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-11-23 17:24:54
-->
<template>
  <div>
    <div ref="main3" class="echart"></div>
  </div>
</template>
<script>
import { getEchartInfo } from '@/api/home.js'
export default {
  data() {
    return {
      dataArr: [],
      Yname: '',
      type: '',
      title: '',
      xdata: [],
      series: [],
      legendData: [],
      myChart: ''
    }
  },
  props: ['data'],
  created() {
    // console.log(333)
    this.init()
  },
  mounted() {
    this.$nextTick(function () {
      if (this.$refs.main3) {
        window.addEventListener('resize', () => {
          this.myChart.resize()
        })
        this.drawLine();
      }
    })
  },
  methods: {
    init() {
      // 1 为折线 2为柱状
      if (this.data.chart_type == '1') {
        this.type = 'line'
      } else {
        this.type = 'bar'
      }
      // this.title="库位情况分析"
      let url = this.data.data_url
      this.series = []
      this.legendData = []
      getEchartInfo(url).then(res => {

        if (!res.data.resultdata) return
        let data = JSON.parse(res.data.resultdata)
        // console.log(data)
        this.xdata = data.xdata
        this.title = data.chartname
        this.dataArr = data.histogramEntities
        for (let i = 0; i < data.histogramEntities.length; i++) {
          if (i == 0) {
            this.Yname = data.histogramEntities[i].unit
          }
          this.legendData.push(data.histogramEntities[i].name)
          var value = {
            name: data.histogramEntities[i].name,
            type: this.type,
            data: data.histogramEntities[i].data,
            // markLine: {
            
            //   data: [
            //     { type: 'average', name: '平均值' }
            //   ]
            // }
          }
          this.series.push(value)
        }
        this.drawLine()

      }).catch(err => {
        console.log(err)
      })

      // var url1 = `${this.$store.state.dailog.url1}${url}`

      // this.$axios({              //初始化数据
      //   method: 'get',
      //   url: url1,
      // }).then(res => {
      //   var data = JSON.parse(res.data.resultdata)
      //   this.series = []
      //   this.legendData = []
      //   this.xdata = data.xdata
      //   this.title = data.chartname
      //   this.dataArr = data.histogramEntities
      //   for (let i = 0; i < data.histogramEntities.length; i++) {
      //     if (i == 0) {
      //       this.Yname = data.histogramEntities[i].unit
      //     }
      //     this.legendData.push(data.histogramEntities[i].name)
      //     var value = {
      //       name: data.histogramEntities[i].name,
      //       type: this.type,
      //       data: data.histogramEntities[i].data,
      //       markLine: {
      //         data: [
      //           { type: 'average', name: '平均值' }
      //         ]
      //       }
      //     }
      //     this.series.push(value)
      //   }
      //   this.drawLine()
      // }).catch(function (error) {
      //   console.log(error);
      // });
      // this.drawLine()

    },
    //渲染图
    drawLine() {
      this.myChart = this.$echarts.init(this.$refs.main3)
      this.myChart.resize()

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
                  image: require('@/assets/img1/65.png')
                }
              },
            }
          },
        },
        tooltip: {
          trigger: 'axis'
        },
        toolbox: {
          show: true,
          feature: {
            magicType: {
              type: ['bar', 'line']
            },  //切换为折线图，切换为柱状图
          }
        },
        color: ['#FCB977', '#3399FF', '#FFDB5C', '#FD6D26', '#86C5D0', '#C4FFEE'],
        legend: {
          data: this.legendData,
          right: "right", //右邊距
          top: '30px',
          bottom: null,
          left: null,
           padding: [20, 10],
           itemWidth: 18,
          itemHeight: 18,
        },
        grid: {
          left: '3%',
          right: '18%',
          bottom: '3%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: true,
          data: this.xdata
        },
        yAxis: {
          name: this.Yname,
          type: 'value',
          axisLabel: {
            formatter: "{value}" + this.Yname,
            color: '#000',
            fontWeight: 400,
            textStyle: {
              fontWeight: 400
            }
          }
        },
        series: this.series,
      };
      this.myChart.setOption(option3)

      //初始化图例
      // setTimeout(() => {
      //   let option = this.myChart.getOption()
      //   var data = option.legend[0].data
      //   var lengenSelected = {}
      //   for (var i = 0; i < data.length; i++) {
      //     var key = data[i];
      //     var o = {};
      //     if (i == 0) {
      //       var str = "o." + key + "=true";
      //     } else {
      //       var str = "o." + key + "=false";
      //     }
      //     eval(str);
      //     Object.assign(lengenSelected, o);
      //   }
      //   option.legend[0].selected = lengenSelected
      //   this.myChart.setOption(option)
      // }, 300)

      // //图例点击
      // this.myChart.on('legendselectchanged', (obj) => {
      //   for (let j = 0; j < this.dataArr.length; j++) {
      //     if (obj.name == this.dataArr[j].name) {
      //       this.Yname = this.dataArr[j].unit
      //     }
      //   }
      //   let option = this.myChart.getOption()
      //   var data = option.legend[0].data
      //   var index = option.legend[0].data.indexOf(obj.name)
      //   var lengenSelected = {}
      //   for (var i = 0; i < data.length; i++) {
      //     var key = data[i];
      //     var o = {};
      //     if (i == index) {
      //       var str = "o." + key + "=true";
      //     } else {
      //       var str = "o." + key + "=false";
      //     }
      //     eval(str);
      //     Object.assign(lengenSelected, o);
      //   }
      //   option.yAxis[0].axisLabel.formatter = `{value}${this.Yname}`
      //   option.yAxis[0].name = this.Yname
      //   option.legend[0].selected = lengenSelected
      //   this.myChart.setOption(option)
      // })


    }


  }

}
</script>
<style lang="less" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>