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
let myChart3
export default {
      data(){
        return{
            echartData:[],
            series:[],
            legendData:[],
            title:''
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
            this.series = []
            this.legendData = []
              this.$axios({              //初始化数据
                    method: 'get',
                    url:url1,
                }).then(res => {
                    var data = JSON.parse(res.data.resultdata)
                        for(var item in data.pieEntities){
                            this.legendData.push(data.pieEntities[item].name)
                        }
                        this.title = data.chartname
                        this.series = data.pieEntities
                        this.drawLine();
                }).catch(function(error) {
                        console.log(error);
                });
        },
        //渲染图表
        drawLine(){
            myChart3 = this.$echarts.init(this.$refs.main3)
            myChart3.resize()
            
             //饼图
          var option = {
                title: {
                    text: this.title,
                    left: 'left',
                    padding:[10,20]
                },
                 color:['#7C8ED8','#87D068','#FFDB5C','#FD6D26','#86C5D0','#C4FFEE'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    data: this.legendData,
                    right: null, //右邊距
                    top:'top',
                    bottom:null,
                    left:'center',
                    padding:[40,20]
                },
                series: [
                    {
                        name: '访问来源',
                        radius: ['40%', '70%'],
                        type: 'pie',
                        center: ['50%', '60%'],
                        data:this.series,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
          }
               
           myChart3.setOption(option)

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