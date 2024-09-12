<!--
 * @Description: 这是山河看板页面（组件）
 * @Date: 2020-12-07 10:47:52
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-11 09:44:48
-->
<template>
    <div class="shanhe_box">
        <div class="shanhe_head clearfix">
            <div class="shanhe_logo left"></div>
            <div class="shanhe_title left"></div>
            <div class="shanhe_time left">
                <div class="time_logo"></div>
                <div class="time_value">{{newTime}}</div>
                <div class="time_date">{{newDate}}</div>
            </div>
        </div>
        <div class="shanhe_conter clearfix">
            <div class="shanhe_left left">
                <div class="joinLocation">
                    <div style="opacity:1" class="joinLogo"></div>
                    <div style="opacity:1" class="joinText">可用库位</div>
                    <div class="joinNum Num1">{{can1}}</div>
                    <div class="joinNum Num2">{{can2}}</div>
                    <div class="joinNum Num3">{{can3}}</div>
                    <div class="joinNum Num4">{{can4}}</div>
                    <div class="joinNum Num5">{{can5}}</div>
                </div>
                <div class="userLocation">
                    <div class="joinLogo"></div>
                    <div class="joinText">库存使用率</div>
                    <div ref="charts_1" class="echarts_1"></div>
                </div>
                <div class="joinStatistics">
                    <div class="joinLogo"></div>
                    <div class="joinText">入库统计</div>
                    <!-- <div class="upTime">(数据更新:12:30)</div> -->
                    <div ref="charts_2" class="echarts_2"></div>
                </div>
            </div>
            <div class="shanhe_middle left">
                <div class="middle_top">
                    <el-table
                        height="90%"
                        class="middleTable"
                        :data="tableData"
                        :row-class-name="tableRowClassName"
                        :header-cell-style="headClass"
                        style="width: 96%">
                        <el-table-column
                        prop="ID"
                        :show-overflow-tooltip="true"
                        label="任务号"
                        width="140">
                        </el-table-column>
                        <el-table-column
                        prop="TrayID"
                        :show-overflow-tooltip="true"
                        width="145"
                        label="托盘号">
                        </el-table-column>
                        <el-table-column
                        prop="MaterialChildID"
                        :show-overflow-tooltip="true"
                        width="265"
                        label="物料号">
                        </el-table-column>
                        <el-table-column
                        prop="CommandState"
                        :show-overflow-tooltip="true"
                        label="任务状态"
                        width="150">
                        </el-table-column>
                        <el-table-column
                        prop="Commandtype"
                        :show-overflow-tooltip="true"
                        label="任务类型"
                        width="140">
                        </el-table-column>
                    </el-table>

                </div>
                <div class="middle_bottom">
                    <div class="middle_bottom_title">今日入库</div>
                    <div class="middle_bottom_num">{{EntryAmount}}</div>
                    <div class="middle_bottom_dom">
                        <div ref="EntryAmount" class="middle_bottom_domColor"></div>
                    </div>
                    <div class="middle_bottom_title1 titile1">今日出库</div>
                    <div class="middle_bottom_num1 num1">{{DeliverAmount}}</div>
                    <div class="middle_bottom_dom1 dom1">
                        <div ref="DeliverAmount" class="middle_bottom_domColor"></div>
                    </div>
                </div>
            </div>
            <div class="shanhe_right left">
                <div class="right_top">
                    <div class="joinLogo"></div>
                    <div class="joinText">已用库位</div>
                    <div class="joinNum Num1">{{use1}}</div>
                    <div class="joinNum Num2">{{use2}}</div>
                    <div class="joinNum Num3">{{use3}}</div>
                    <div class="joinNum Num4">{{use4}}</div>
                    <div class="joinNum Num5">{{use5}}</div>
                </div>
                <div class="right_middle">
                     <div class="joinLogo"></div>
                    <div class="joinText">故障率</div>
                    <div ref="charts_3" class="echarts_3"></div>
                </div>
                <div class="right_bottom">
                     <div class="joinLogo"></div>
                    <div class="joinText">出库统计</div>
                    <!-- <div class="upTime">(数据更新:12:30)</div> -->
                    <div ref="charts_4" class="echarts_4"></div>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
import screenfull from 'screenfull'
export default {
    data(){
        return{
            tableData: [],
            time:null,
            time1:null,
            newTime:null,
            newDate:null,
            myChart:'',
            myChart2:'',
            myChart3:"",
            myChart4:"",
            can1:0,
            can2:0,
            can3:0,
            can4:0,
            can5:0,
            use1:0,
            use2:0,
            use3:0,
            use4:0,
            use5:0,
            EntryAmount:0,
            DeliverAmount:0,
        }
    },
    mounted(){
        //全屏
          var endtime=0;
        document.onkeydown=(e)=>{
            if(e.keyCode==13){
                endtime++;
                if(endtime==2){
                    this.clickFullscreen();
                }
            }
            setTimeout(()=>{
                endtime=0;
            },600)}
            this.drawLine1(0,0)
            this.drawLine2([],[])
            this.drawLine3(null,1)
            this.drawLine4([],[])
         
          this.time1 = setInterval(()=>{
                 this.GetGuZhang()
                 this.getTable()
                 this.getAmount()
                 this.GetEnterAmount()
                 this.GetDeliverAmount()
                 this.GetEDOut()
          },1000)
    },
    beforeDestroy(){
        clearTimeout(this.time)
        clearTimeout(this.time1)
        this.$echarts.dispose(this.myChart)
        this.$echarts.dispose(this.myChart2)
        this.$echarts.dispose(this.myChart3)
        this.$echarts.dispose(this.myChart4)
    },
    destroyed(){
        clearTimeout(this.time)
        clearTimeout(this.time1)
        this.$echarts.dispose(this.myChart)
        this.$echarts.dispose(this.myChart2)
        this.$echarts.dispose(this.myChart3)
        this.$echarts.dispose(this.myChart4)
    },
    created(){
    this.time = setInterval(()=>{
        this.newDate = this.$moment().format('YYYY-MM-DD')
        this.newTime = this.$moment().format('HH:mm:ss')
    },1000)
    
   },

    methods:{
          //表格
        getTable(){
              this.$axios({       
                    method: 'post',
                    url: `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Command/GetAllCommand`,
                }).then(res => {
                    this.tableData = []
                    this.tableData = res.data
                })
        },
        //可用库位、已用库位
        getAmount(){
            this.$axios({       
                    method: 'post',
                    url: `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Command/GetLocationAmount`,
                }).then(res => {
                    this.can1=0
                    this.can2=0
                    this.can3=0
                    this.can4=0
                    this.can5=0
                    this.use1=0
                    this.use2=0
                    this.use3=0
                    this.use4=0
                    this.use5=0
                    var Free =  res.data[0].Free.toString()
                    var FullC =  res.data[0].FullC.toString()
                    for(let i=0;i<Free.length;i++){
                        var Fvalue = Free.slice(Free.length-(1+i),Free.length - i)
                        i==0?this.can5=Fvalue:i==1?this.can4=Fvalue:i==2?this.can3=Fvalue:i==3?this.can2=Fvalue:i==4?this.can1=Fvalue:this.can1=Fvalue
                    }
                    for(let j=0;j<FullC.length;j++){
                        var Cvalue = FullC.slice(FullC.length-(1+j),FullC.length - j)
                        j==0?this.use5=Cvalue:j==1?this.use4=Cvalue:j==2?this.use3=Cvalue:j==3?this.use2=Cvalue:j==4?this.use1=Cvalue:this.use1=Cvalue
                    }
                    
                    this.drawLine1(res.data[0].Free,res.data[0].FullC)
                })
        },
        //故障
        GetGuZhang(){
             this.$axios({       
                    method: 'post',
                    url: `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Command/GetGuZhang`,
                }).then(res => {
                    if(res.data.length == 0){
                        this.drawLine3(null,1)
                    }else{
                        this.drawLine3(res.data[0].UnNormal,res.data[0].Normal)
                    }
                })
        },
        //今日出库入库
        GetEDOut(){
              this.$axios({       
                    method: 'post',
                    url: `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Command/GetEDOut`,
                }).then(res => {
                    this.EntryAmount = res.data.EntryAmount
                    this.DeliverAmount = res.data.DeliverAmount
                    var EntryAmountBl = (this.EntryAmount / 500) * 100
                    var DeliverAmountBl = (this.DeliverAmount / 500) * 100
                    this.$refs.DeliverAmount.style.width = `${DeliverAmountBl >100?100:DeliverAmountBl}%`
                    this.$refs.EntryAmount.style.width = `${EntryAmountBl >100?100:EntryAmountBl}%`
                })
        },
        //入库曲线
        GetEnterAmount(){
             this.$axios({       
                    method: 'post',
                    url: `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Command/GetEnterAmount`,
                }).then(res => {
                   if(res.data.length){
                       var time = []
                       var value = []
                       for(let i=0;i<res.data.length;i++){
                           time.push(res.data[i].EnterTime)
                           value.push(res.data[i].EnterAmount)
                       }
                        this.drawLine2(time,value)
                   }
                })
        },
        //出库曲线
        GetDeliverAmount(){
             this.$axios({       
                    method: 'post',
                    url: `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Command/GetDeliverAmount`,
                }).then(res => {
                    if(res.data.length){
                       var time = []
                       var value = []
                       for(let i=0;i<res.data.length;i++){
                           time.push(res.data[i].DeliverTime)
                           value.push(res.data[i].DeliverAmount)
                       }
                        this.drawLine4(time,value)
                   }
                })
        },

        drawLine1(num1,num2){
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.$echarts.init(this.$refs.charts_1)
            // 绘制图表
            this.myChart.resize()
           let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                background:'transparent',
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom:'bottom',
                    data: [ '空货位', '满货位'],
                    "textStyle": {
                        "fontWeight":'400',
                        "color":'#fff',
                        "fontSize":'20',
                    },
                    itemGap:30
                },
            
                series: [
                    {
                        name: '访问来源',
                        color:['#E4914C','#34A2FF'],
                        type: 'pie',
                        radius: ['35%', '55%'],
                        "selectedMode": "single",
                        "labelLine": {
                            "show": true,
                            "length": 10,
                            "length2": 20
                        },
                         label:{
                            normal:{
                                formatter:'{b}:{d}%',
                                fontSize:'18'
                            }
                        },
                        data: [
                          
                            {value: num1, name: '空货位'},
                            {value: num2, name: '满货位'}
                        ]
                    }
                ]
            };
            this.myChart.setOption(option)
        },
        drawLine3(num1,num2){
            // 基于准备好的dom，初始化echarts实例
            this.myChart3 = this.$echarts.init(this.$refs.charts_3)
            // 绘制图表
            this.myChart3.resize()
           let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                background:'transparent',
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom:'bottom',
                    data: ['故障', '正常'],
                    "textStyle": {
                        "fontWeight":'400',
                        "color":'#fff',
                        "fontSize":'20',
                    },
                    itemGap:30
                },
            
                series: [
                    {
                        name: '访问来源',
                        color:['#E4914C','#34A2FF'],
                        type: 'pie',
                        radius: ['35%', '55%'],
                        "selectedMode": "single",
                        "labelLine": {
                            "show": true,
                            "length": 10,
                            "length2": 20
                        },
                         label:{
                            normal:{
                                formatter:'{b}:{d}%',
                                fontSize:'18'
                            }
                        },
                        data: [
                           
                            {value: num1, name: '故障'},
                            {value: num2, name: '正常'}
                        ]
                    }
                ]
            };
            this.myChart3.setOption(option)
        },
         drawLine2(num1,num2){
            // 基于准备好的dom，初始化echarts实例
            this.myChart2 = this.$echarts.init(this.$refs.charts_2)
            // 绘制图表
            this.myChart2.resize()
           let option = {
                tooltip: {
                        trigger: 'axis'
                    },
                xAxis: {
                    type: 'category',
                    color:'#Fff',
                    splitLine:{
                        show:true,
                         "lineStyle": {
                                "color": '#282D56'
                            },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1, //这里是为了突出显示加上的  
                        }
                    },
                    boundaryGap:false,
                    data: num1,
                },
                yAxis: {
                    type: 'value',
                      splitLine:{
                        "lineStyle": {
                                "color": '#282D56'
                            
                            },
                        show:true
                      },
                      axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1, //这里是为了突出显示加上的  
                        }
                    },
                },
                series: [{
                    data: num2,
                    type: 'line',
                    symbolSize:10,//拐点大小
                        symbol: 'circle',//拐点样式                            
                        itemStyle : { 
                            normal: {
                                color: "#F45E23", //拐点颜色
                                borderColor:'#eee',
                                borderWidth:2
                            },
                        },
                    smooth: true,
                    "lineStyle": {
                            "color":'#FDC55A',
                            "width": 4,
                            "shadowBlur": 25,
                            "shadowOffsetY": 10,
                            "shadowColor": "rgba(0, 0, 0, 0.2)"
                        },
                }]
            };
            this.myChart2.setOption(option)
        },
         drawLine4(num1,num2){
            // 基于准备好的dom，初始化echarts实例
            this.myChart4 = this.$echarts.init(this.$refs.charts_4)
            // 绘制图表
            this.myChart4.resize()
           let option = {
                  tooltip: {
                        trigger: 'axis'
                    },
                xAxis: {
                    type: 'category',
                    color:'#Fff',
                    splitLine:{
                        show:true,
                         "lineStyle": {
                                "color": '#282D56'
                            },
                    },
                  
                    axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1, //这里是为了突出显示加上的  
                        }
                    },
                    boundaryGap:false,
                    data: num1
                },
                yAxis: {
                    type: 'value',
                      splitLine:{
                        "lineStyle": {
                                "color": '#282D56'
                            
                            },
                        show:true
                      },
                      axisLine: {
                        lineStyle: {
                            color: '#fff',
                            width: 1, //这里是为了突出显示加上的  
                        }
                    },
                },
                series: [{
                    data: num2,
                    type: 'line',
                    symbolSize:10,//拐点大小
                        symbol: 'circle',//拐点样式                            
                        itemStyle : { 
                            normal: {
                                color: "#F45E23", //拐点颜色
                                borderColor:'#eee',
                                borderWidth:2
                            },
                        },
                    smooth: true,
                    "lineStyle": {
                            "color":'#FDC55A',
                            "width": 4,
                            "shadowBlur": 25,
                            "shadowOffsetY": 10,
                            "shadowColor": "rgba(0, 0, 0, 0.2)"
                        },
                }]
            };
            this.myChart4.setOption(option)
        },
      

        //表格样式
        tableRowClassName({row, rowIndex}) {
            if (rowIndex % 2 != 0) {
                return 'warning-row';
            } else{
                return 'success-row'
            }
            return '';
        },
        //表格样式
         headClass(){
             return 'background:#2D8CFF'
         },
         //全屏状态
        clickFullscreen(){
            if(!screenfull.isEnabled){
                this.$message({
                message:'you browser can not work',
                type:'warning'
            })
                return false
            }
                screenfull.toggle()
        },
    }
}
</script>
<style lang="less">
.shanhe_box{
    .el-table{
        background: transparent;
    }
    .el-table th{
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #0A1547;
        height:50px;
        padding:0 im !important;
    }
    .el-table tr{
        height: 50px;
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #FFFFFF;
    }
    .el-table td{
        border-bottom:none;
    }
    .el-table .cell{
        line-height: 30px;
    }
      
    .el-table .warning-row {

        background: #182E68;
        
    }
    .el-table .success-row {
        background: #102059;
    }
    .el-table .success-active {
        background: #079ab7;
    }
}

</style>
<style lang="less" scoped>
*{
    margin:0;
    padding:0;
}
.shanhe_box{
    width:1920px;
    height:100vh;
    background: url('../../../src/assets/img/beijing.png');
    background-size:cover ;
    .left{
        float: left;
    }
    .right{
        float:right ;
    }
    .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
    }
    .clearfix{
        *zoom: 1;
    }
    .shanhe_head{
        width:100%;
        height:54px;
        margin-bottom:34px;
        position: relative;
        .shanhe_logo{
            position: absolute;
            top: 0;
            left:0 ;
            width:197px;
            height:54px;
            background: url('../../../src/assets/img/logo.png');
            background-size:cover ;
        }
        .shanhe_time{
            width:295px;
            height:54px;
            position: absolute;
            right: 0;
            top: 0;
            .time_logo{
                display: inline-block;
                width:32px;
                height: 32px;
                background:url('../../../src/assets/img/shijian.png');
                background-size:cover ;
                line-height: 54px;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
            }
            .time_value{
                display: inline-block;
                font-size: 24px;
                font-family: Helvetica CE 55 Roman;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 54px;
                margin-left:42px;
            }
            .time_date{
                display: inline-block;
                font-size: 24px;
                font-family: Helvetica CE 55 Roman;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 54px;
                margin-left:29px;
            }
        }
        .shanhe_title{
                position: absolute;
                top: 0;
                left: 37%;
                color: #fff;
                font-size: 35px;
                width: 400px;
                height: 54px;
                background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAdIAAABDCAYAAAAoLYRkAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ1IDc5LjE2MzQ5OSwgMjAxOC8wOC8xMy0xNjo0MDoyMiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjNCODc3OTk4Mzg3NDExRUI5NzFCRUYzM0MzRDNCQTNGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjNCODc3OTk5Mzg3NDExRUI5NzFCRUYzM0MzRDNCQTNGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6M0I4Nzc5OTYzODc0MTFFQjk3MUJFRjMzQzNEM0JBM0YiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6M0I4Nzc5OTczODc0MTFFQjk3MUJFRjMzQzNEM0JBM0YiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7d4KQgAAALkklEQVR42uyd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);
                background-size: cover;
        }
    }
    .shanhe_conter{
        width:100%;
        height:calc(100% - 88px);
        .joinText{
            position: absolute;
            top: 25px;
            left: 50px;
            font-size: 20px;
            font-family: Source Han Sans CN;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 20px;
            // opacity: 0.5;
        }
        .joinLogo{
            width:20px;
            height: 20px;
            background: url('../../assets/img/组 10.png');
            background-size:cover ;
            position: absolute;
            left:25px;
            top: 25px;
            // opacity: 0.5;
        }
        .joinNum{
            position: absolute;
            width: 52px;
            height: 74px;
            background: rgba(0, 53, 178, 0.3);
            border: 2px solid;
            border-image: linear-gradient(0deg, #24C4FF, #0057C2) 10 10;
            top:90px;
            font-size: 50px;
            font-family: Helvetica Inserat LT Std;
            font-weight: normal;
            color: #89EAFF;
            text-align: center;
            line-height: 74px;
        }
        .shanhe_left{
            width:518px;
            height:100%;
            padding-left:21px;
            box-sizing: border-box;
            .joinLocation{
                width:482px;
                height:230px;
                background: url('../../assets/img/zuo1.png');
                background-size:cover ;
                position: relative;
                .Num1{
                    left:58px;
                }
                .Num2{
                    left:141px; 
                }
                .Num3{
                    left:219px;
                }
                .Num4{
                    left:296px;
                }
                .Num5{
                    left:375px;
                }
            }
            .userLocation{
                width:480px;
                height:356px;
                background: url('../../assets/img/zuo2.png');
                background-size:cover ;
                margin-top:16px;
                position: relative;
                .echarts_1{
                    position: absolute;
                    top: 45px;
                    left: 35px;
                    width: 85%;
                    height: 80%;
                }
            }
            .joinStatistics{
                width:480px;
                height:353px;
                background: url('../../assets/img/zuo3.png');
                background-size:cover ;
                margin-top:15px;
                position: relative;
                .upTime{
                    position: absolute;
                    top:27px;
                    right:24px;
                    font-size: 18px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #C3CAD9;
                }
                .echarts_2{
                    position: absolute;
                    top: 55px;
                    left: 35px;
                    width: 85%;
                    height: 80%;
                }
            }
        }
        .shanhe_middle{
            width:878px;
            height:100%;
            .middle_top{
                width:878px;
                height: 754px;
                background: url('../../assets/img/组 12.png');
                background-size:cover ;
                position: relative;
                .middleTable{
                    position: absolute;
                    top:40px;
                    left:20px;
                }
            }
            .middle_bottom{
                width:878px;
                height: 208px;
                background: url('../../assets/img/组 11.png');
                background-size:cover ;
                position: relative;
                .middle_bottom_title,.middle_bottom_title1{
                    position: absolute;
                    left:35px;
                    top:30px;
                    font-size: 22px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 22px;
                }
                .middle_bottom_num,.middle_bottom_num1{
                    position: absolute;
                    top:30px;
                    left:150px;
                    font-size: 30px;
                    font-family: Helvetica Inserat LT Std;
                    font-weight: normal;
                    color: #FDC55A;
                    line-height: 30px;
                }
                .middle_bottom_dom,.middle_bottom_dom1{
                    position: absolute;
                    top: 70px;
                    left: 35px;
                    width:810px;
                    height: 16px;
                    background: #182C63;
                    border-radius: 8px;
                    .middle_bottom_domColor{
                        position: absolute;
                        width: 80%;
                        height:100%;
                        background: linear-gradient(100deg, #40C4E9 0%, #228FFE 100%);
                        border-radius: 8px;
                    }
                }
                .num1{
                    position: absolute;
                    left:150px;
                    top:112px;
                    color: #228FFE;
                }
                .dom1{
                    position: absolute;
                    top:150px;
                    left:35px;
                }
                .titile1{
                    position: absolute;
                    left:35px;
                    top:112px;
                }
                .middle_bottom_tatol{
                    position: absolute;
                    right: 43px;
                    top:68px;
                    font-size: 18px;
                    font-family: Helvetica CE 55 Roman;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 18px;
                }
                .middle_bottom_tatol1{
                    position: absolute;
                    top:150px;
                    right: 43px;
                    font-size: 18px;
                    font-family: Helvetica CE 55 Roman;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 18px;
                }
            }
        }
        .shanhe_right{
            width:497px;
            height:100%;
            box-sizing: border-box;
            margin-right:27px;
            position: relative;
            .right_top{
                width:482px;
                height: 230px;
                background: url('../../assets/img/you1.png');
                background-size:cover ;
                position: absolute;
                right: 0;
                top: 0;
                .joinNum{
                    position: absolute;
                    width: 52px;
                    height: 74px;
                    background: rgba(0, 53, 178, 0.3);
                    border: 2px solid;
                    border-image: linear-gradient(0deg, #24C4FF, #0057C2) 10 10;
                    top:90px;
                    // opacity: 0.5;
                }
                .Num1{
                    left:58px;
                }
                .Num2{
                    left:141px; 
                }
                .Num3{
                    left:219px;
                }
                .Num4{
                    left:296px;
                }
                .Num5{
                    left:375px;
                }
            }
            .right_middle{
                width:480px;
                height: 356px;
                background: url('../../assets/img/you2.png');
                background-size:cover ;
                position: absolute;
                right: 0;
                top:243px;
                .echarts_3{
                    position: absolute;
                    top:45px;
                    left: 35px;
                    width: 85%;
                    height: 80%;
                }
            }
            .right_bottom{
                width:480px;
                height:353px;
                background: url('../../assets/img/you3.png');
                background-size:cover ;
                position: absolute;
                right: 0;
                top:619px;
                .upTime{
                    position: absolute;
                    top:27px;
                    right:24px;
                    font-size: 18px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #C3CAD9;
                }
                .echarts_4{
                    position: absolute;
                    top: 55px;
                    left: 35px;
                    width: 85%;
                    height: 80%;
                }
            }
        }
    }
}
</style>