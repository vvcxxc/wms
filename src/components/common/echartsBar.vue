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
let myChart
export default {
    data(){
        return{
            title:'',
            xdata:[],
            series:[],
            legendData:[]
        }
    },
    props:['data'],
    created(){
      this.init()
    },
    mounted(){
         this.$nextTick(function(){
            if(this.$refs.main3){
                window.onresize = function() {
                  myChart.resize()
                };
                this.drawLine();
            }
          })  

    },
    methods:{
        init(){
              var url = this.data.data_url
              
             var url1 = `${this.$store.state.dailog.url1}${url}`
              this.$axios({              //初始化数据
                    method: 'get',
                    url: url1,
                }).then(res => {
                   var data = JSON.parse(res.data.resultdata)
                    this.xdata = data.xdata
                    this.title = data.chartname
                     for(let i=0;i<data.histogramEntities.length;i++){
                        this.legendData.push(data.histogramEntities[i].name)
                        var value = {
                            name: data.histogramEntities[i].name,
                            type: 'bar',
                            label: {
                                show: true,
                                position: 'inside'
                            },
                            data:  data.histogramEntities[i].data,
                        }

                      this.series.push(value)
                    }
                    this.drawLine()
                }).catch(function(error) {
                        console.log(error);
                });
        },
        //渲染图
        drawLine(){
            myChart = this.$echarts.init(this.$refs.main3)
            myChart.resize()
              //折线图
            var option3 = {
                    title: {
                        text: this.title,
                        left: 'left',
                        padding:[10,20]
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                      color:['#7C8ED8','#87D068','#FFDB5C','#FD6D26','#86C5D0','#C4FFEE'],
                    legend: {
                        data: this.legendData,
                        right: '10px', //右邊距
                     
                        padding:[40,20]
                    },
                    grid: {
                        left: '3%',
                        right: '18%',
                        bottom: '3%',
                        top:'25%',
                        containLabel: true
                    },
                    xAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    yAxis: [
                        {
                            type: 'category',
                            axisTick: {
                                show: false
                            },
                            data: this.xdata
                        }
                    ],
                    series: this.series,
                };
             myChart.setOption(option3)

    }
    
}
}
</script>
<style lang="less" scoped>
.echart{
    width:100%;
    height: 100%;
}
</style>