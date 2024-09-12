<!--
 * @Description: 这是图表页面（组件）
 * @Date: 2020-08-14 13:55:10
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:37:55
-->
<template>
    <div class="echart_box">
          <div v-for="(item,index) in echartArr" :key="index" class="echart">
             <lineEcharts 
                :data="item" 
                v-if="item.Chart_Type == '1' || item.Chart_Type == '1'" 
                style="width:100%;height:100%">
            </lineEcharts>
             <barEcharts 
                :data="item" 
                v-if="item.Chart_Type == '4'" 
                style="width:100%;height:100%">
            </barEcharts>
             <pieEcharts 
                :data="item" 
                v-if="item.Chart_Type == '3'" 
                style="width:100%;height:100%">
            </pieEcharts>
        </div>

    </div>
</template>
<script>

import lineEcharts from '../../components/common/echartsLine'
import pieEcharts from '../../components/common/echartspPie'
import barEcharts from '../../components/common/echartsBar'

export default {
    components:{
        lineEcharts,
        pieEcharts,
        barEcharts
    },
    data(){
        return{
            echartArr:[]
        }
    },
    created(){
       this.init()
    },
    mounted(){
        this.stopF5Refresh()
    },
    methods:{
        init(){
            // 1 为折线 2为柱状 3为饼图  4为正负柱状
            this.id = this.$route.query.name

            // var url = `${this.$store.state.dailog.url1}/Common/Base_Chart/GetPageChart?page_ID=${this.id}`
            var url = `${this.$store.state.dailog.url1}/api/wms/chart/config?groupId=${this.id}`
             this.$axios({              //初始化数据
                    method: 'get',
                    url: url,
                }).then(res => {
                    var data = JSON.parse(res.data.resultdata)
                    this.echartArr = data
                }).catch(function(error) {
                        console.log(error);
                });
        },
         //阻止F5事件并页面刷新
        stopF5Refresh() {
            document.onkeydown =  (e) => {
                var evt = window.event || e;
                var code = evt.keyCode || evt.which;
                if (code == 116) {
                    this.init()
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    } else {
                        evt.keyCode = 0;
                        evt.returnValue = false
                    }
                
                }
            }
        },
    }

}
</script>
<style lang="less" scoped>
.echart_box{
    width:100%;
    height:100%;
    overflow: auto;
    .echart{
        width:48%;
        height:400px;
        margin-left:2%;
        background: #fff;
        float: left;
        margin-bottom:15px;
    }
}
</style>