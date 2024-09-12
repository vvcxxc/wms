<!--
 * @Description: 这是工作空间页面（组件）
 * @Date: 2020-08-24 10:44:35
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:34:09
-->
<template>
    <div v-loading="loading" class="desktop_box">
         <div class="desktop_top">
             <div @click="jumpFun('1')" class="desktop_top_box">
                 <span class="text">当前库利用率：</span>
                 <span class="value">12%</span>
             </div>
             <div @click="jumpFun('2')" class="desktop_top_box">
                  <span class="text">当前任务数：</span>
                  <span class="value">12</span>
             </div>
             <div @click="jumpFun('3')" class="desktop_top_box">
                  <span class="text">当前报警数：</span>
                  <span class="value">1</span>
             </div>
         </div>

          <div class="echart_box">
            <div v-for="(item,index) in echartArr" :key="index" class="echart">
     
                    <lineEcharts 
                         v-if="item.Chart_Type == 1" 
                        :data="item" 
                        style="width:100%;height:100%">
                    </lineEcharts>
                    <barEcharts 
                        :data="item" 
                        v-if="item.Chart_Type == 4" 
                        style="width:100%;height:100%">
                    </barEcharts>
                    <pieEcharts 
                        :data="item" 
                        v-if="item.Chart_Type == 3" 
                        style="width:100%;height:100%">
                    </pieEcharts>
            </div>
          </div>
    </div>
</template>
<script>

import lineEcharts from '../../components/common/echartsLine.vue'
import pieEcharts from '../../components/common/echartspPie.vue'
import barEcharts from '../../components/common/echartsBar.vue'

export default {
    components:{
        lineEcharts,
        pieEcharts,
        barEcharts
    },
    data(){
        return{
            echartArr:[],
            loading:false
        }
    },
     watch:{
         $route(n,o){
                this.init()
            }
     },
    created(){
        this.init()
    },
    mounted(){
        this.stopF5Refresh()
    },
    methods:{
        //页面初始化
        init(){
             // 1 为折线 2为柱状 3为饼图  4为正负柱状
             this.loading = false
            this.id = this.$route.query.name
            // var url = `${this.$store.state.dailog.url1}/Common/Base_Chart/GetPageChart?page_ID=${this.id}`
            var url = `${this.$store.state.dailog.url1}/api/wms/chart/config?groupId=${this.id}`
            this.$axios({              //初始化数据
                method: 'get',
                url: url,
            }).then(res => {
                console.log('图表',res)
                this.loading = false
                var data = JSON.parse(res.data.resultdata)
                this.echartArr = data
            }).catch(function(error) {
                this.loading = false
                    console.log(error);
            });
        },
        //跳转页面
        jumpFun(text){
            if(text == '1'){
                this.$router.push({path:`/WarehouseMap`,query: {id:'库位地图',name:'399CFCAD-2E8D-42BB-B550-590992E44035'}})
            }else if(text == '2'){
               this.$router.push({path:`/ListPage`,query: {id:'任务列表',name:'2919F971-83F9-4D21-BDE4-68F44B316984'}})
            }else if(text == '3'){
                this.$router.push({path:`/ListPage`,query: {id:'报警列表',name:'4D3F9245-DA20-43F7-8C20-29E473143EDB'}})
            }
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
    .desktop_box{
       width:100%;
    //    height: 97%; 
       .desktop_top{
           width:100%;
           height:140px;
           background: #fff;
           overflow: hidden;
           .desktop_top_box{
               float: left;
               width:19%;
               height:58px;
               margin-top:41px;
               margin-left:2%;
               background: url('../../assets/img/Background color.png');
               background-size:cover ;
               border-radius: 12px;
               box-sizing: border-box;
               line-height: 58px;
               position: relative;
               cursor: pointer;
               user-select: none;
               span{
                    font-size: 16px;
                    font-family: Source Han Sans CN;
                    font-weight: 500;
                    color: #FFFFFF;
               }
               .text{
                  position: absolute;
                  left: 20px;
               }
               .value{
                  position: absolute;
                  right: 20px;
               }
           }
           .desktop_top_box:hover{
               margin-top:40px;
               box-shadow: 2px 2px 10px rgba(0,0,0,0.5) ;
           }
           .desktop_top_box2{
                float: left;
                width:26%;
                height:140px;
                // margin-top:20px;
                margin-left:8%;
                .top_box2_title{
                    text-align: left;
                    margin-bottom:21px;
                    font-size: 16px;
                    font-family: Source Han Sans CN;
                    font-weight: 500;
                    color: #272727;
                }
                .state{
                    width:100%;
                    height: 100px;
                    overflow: hidden;
                    .state_box{
                     float: left;
                     width: 32px;
                     height: 100px;
                     margin-right:10%;
                     text-align: center;
                    }
                    .tate_circle{
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        margin-bottom:10px;
                    }
                    .red{
                        background: red;
                    }
                    .green{
                        background: green;
                    }
                    .yellow{
                        background: yellow;
                    }
                    .grey{
                        background: grey;
                    }
                }
           }
       }
       .echart_box{
           margin-top:50px;
           width:100%;
           min-height: 600px;
           overflow: hidden;
           .echart{
                width:48%;
                height:400px;
                margin-left:2%;
                background: #fff;
                float: left;
                margin-bottom:15px;
            }
       }
    }

</style>