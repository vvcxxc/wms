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
            <div class="shanhe_title left"></div>
            <div class="shanhe_time left">
                <div class="time_logo"></div>
                <div class="time_value">{{ newDate + " " + newTime }}</div>
                <!-- <div class="time_date"></div> -->
            </div>
        </div>
        <div class="shanhe_conter clearfix">
            <div class="shanhe_left left">
                <div class="joinLocation">
                    <div style="opacity:1" class="joinLogo"></div>
                    <div style="opacity:1" class="joinText">可用库位</div>
                    <div class="joinNum Num1">{{ can1 }}</div>
                    <div class="joinNum Num2">{{ can2 }}</div>
                    <div class="joinNum Num3">{{ can3 }}</div>
                    <div class="joinNum Num4">{{ can4 }}</div>
                    <div class="joinNum Num5">{{ can5 }}</div>
                </div>
                <div class="userLocation">
                    <div class="joinLogo"></div>
                    <div class="joinText">库位情况分析</div>
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
                    <div style="opacity:1" class="joinLogo"></div>
                    <div style="opacity:1" class="joinText">堆垛机监控</div>
                    <Kanban />
                </div>
                <div class="middle_bottom">
                    <div class="middle_bottom_title">今日入库</div>
                    <div class="middle_bottom_num">{{ EntryAmount }}</div>
                    <div class="middle_bottom_dom">
                        <div ref="EntryAmount" class="middle_bottom_domColor"></div>
                    </div>
                    <div class="middle_bottom_title1 titile1">今日出库</div>
                    <div class="middle_bottom_num1 num1">{{ DeliverAmount }}</div>
                    <div class="middle_bottom_dom1 dom1">
                        <div ref="DeliverAmount" class="middle_bottom_domColor"></div>
                    </div>
                </div>
            </div>
            <div class="shanhe_right left">
                <div class="right_top">
                    <div class="joinLogo"></div>
                    <div class="joinText">已用库位</div>
                    <div class="joinNum Num1">{{ use1 }}</div>
                    <div class="joinNum Num2">{{ use2 }}</div>
                    <div class="joinNum Num3">{{ use3 }}</div>
                    <div class="joinNum Num4">{{ use4 }}</div>
                    <div class="joinNum Num5">{{ use5 }}</div>
                </div>
                <div class="right_middle">
                    <div class="joinLogo "></div>

                    <div class="joinText">报警信息</div>
                    <Police :dataList="dataList" />
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
import Police from './police.vue'
import Kanban from './kanban4.vue'
export default {
    components: {
        Police,
        Kanban
    },
    data() {
        return {
            time: null,
            time1: null,
            newTime: null,
            newDate: null,
            myChart: '',
            myChart2: '',
            myChart3: "",
            myChart4: "",
            can1: 0,
            can2: 0,
            can3: 0,
            can4: 0,
            can5: 0,
            use1: 0,
            use2: 0,
            use3: 0,
            use4: 0,
            use5: 0,
            EntryAmount: 0,
            DeliverAmount: 0,
            dataList: []
        }
    },
    mounted() {
        //全屏
        var endtime = 0;
        document.onkeydown = (e) => {
            if (e.keyCode == 13) {
                endtime++;
                if (endtime == 2) {
                    this.clickFullscreen();
                }
            }
            setTimeout(() => {
                endtime = 0;
            }, 600)
        }
        this.drawLine1(0, 0, 0)
        this.drawLine2([], [])
        this.drawLine4([], [])
        //调试看着太乱了，调完再放开
        this.time1 = setInterval(() => {
            this.GetGuZhang()
            this.getAmoNum()
            this.getAmount()
            this.GetEnterAmount()
            this.GetDeliverAmount()
            this.GetEDOut()
        }, 1000)
    },
    beforeDestroy() {
        clearInterval(this.time)
        clearInterval(this.time1)
        this.$echarts.dispose(this.myChart)
        this.$echarts.dispose(this.myChart2)
        this.$echarts.dispose(this.myChart3)
        this.$echarts.dispose(this.myChart4)
    },
    destroyed() {
        clearInterval(this.time)
        clearInterval(this.time1)
        this.$echarts.dispose(this.myChart)
        this.$echarts.dispose(this.myChart2)
        this.$echarts.dispose(this.myChart3)
        this.$echarts.dispose(this.myChart4)
    },
    created() {
        this.time = setInterval(() => {
            this.newDate = this.$moment().format('YYYY-MM-DD')
            this.newTime = this.$moment().format('HH:mm:ss')
        }, 1000)

    },

    methods: {
        //可用库位、已用库位
        getAmoNum() {
            this.$axios({
                method: 'post',
                url: `/api/wms/report/get-location-data`,
            }).then(res => {
                let data = JSON.parse(res.data.resultdata);
                this.can1 = 0
                this.can2 = 0
                this.can3 = 0
                this.can4 = 0
                this.can5 = 0
                this.use1 = 0
                this.use2 = 0
                this.use3 = 0
                this.use4 = 0
                this.use5 = 0
                var Free = data.availableCount.toString()
                var FullC = data.unavailableCount.toString()
                for (let i = 0; i < Free.length; i++) {
                    var Fvalue = Free.slice(Free.length - (1 + i), Free.length - i)
                    i == 0 ? this.can5 = Fvalue : i == 1 ? this.can4 = Fvalue : i == 2 ? this.can3 = Fvalue : i == 3 ? this.can2 = Fvalue : i == 4 ? this.can1 = Fvalue : this.can1 = Fvalue
                }
                for (let j = 0; j < FullC.length; j++) {
                    var Cvalue = FullC.slice(FullC.length - (1 + j), FullC.length - j)
                    j == 0 ? this.use5 = Cvalue : j == 1 ? this.use4 = Cvalue : j == 2 ? this.use3 = Cvalue : j == 3 ? this.use2 = Cvalue : j == 4 ? this.use1 = Cvalue : this.use1 = Cvalue
                }
            })
        },
        //库位饼图
        getAmount() {
            this.$axios({
                method: 'get',
                url: `/api/wms/report/location`,
            }).then(res => {
                let data = JSON.parse(res.data.resultdata);
                let a = data.pieEntities.find(_ => _.name == '已占库位').value;
                let b = data.pieEntities.find(_ => _.name == '锁定库位').value;
                let c = data.pieEntities.find(_ => _.name == '空库位').value;
                this.drawLine1(a, b, c)
            })
        },
        GMTToStr(time) {
            let date = new Date(time);
            let m = date.getMonth() + 1,
                mm = '-' + (m < 10 ? '0' + m : m);
            let d = date.getDate(),
                dd = '-' + (d < 10 ? '0' + d : d);
            let h = date.getHours(),
                hh = h < 10 ? '0' + h : h;
            let i = date.getMinutes(),
                ii = i < 10 ? '0' + i : i;
            let s = date.getSeconds(),
                ss = s < 10 ? '0' + s : s;
            return (
                date.getFullYear() + mm + dd + ' ' + hh + ':' + ii + ':' + ss
            );
        },
        //故障
        GetGuZhang() {
            this.$axios({
                method: 'post',
                url: `/api/AlarmRecord/AlarmRecord_GstCurrentAlarmRecord?argStatus=${'不限'
                    }&argAlarmType=${'不限'
                    }&argStartTime=${this.GMTToStr(new Date(new Date().toLocaleDateString()))
                    }&argEndTime=${this.GMTToStr(new Date(
                        new Date(new Date().toLocaleDateString()).getTime() +
                        24 * 60 * 60 * 1000 -
                        1
                    ))
                    }&argKeyword=&argPageSize=999&argPageIndex=1`,
            }).then(res => {
                this.dataList = res.data.data.DataList.map(_ => ({ value: _.AlarmMsg }));
            })
        },
        //今日出库入库
        GetEDOut() {
            this.$axios({
                method: 'post',
                url: `/api/wms/report/get-inventory-data`,
            }).then(res => {
                let data = JSON.parse(res.data.resultdata)
                this.EntryAmount = data.inboundCount
                this.DeliverAmount = data.outboundCount
                var EntryAmountBl = (this.EntryAmount / 500) * 100
                var DeliverAmountBl = (this.DeliverAmount / 500) * 100
                this.$refs.DeliverAmount.style.width = `${DeliverAmountBl > 100 ? 100 : DeliverAmountBl}%`
                this.$refs.EntryAmount.style.width = `${EntryAmountBl > 100 ? 100 : EntryAmountBl}%`
            })
        },
        //入库曲线
        GetEnterAmount() {
            this.$axios({
                method: 'post',
                url: `/api/wms/report/get-inbound-line-chart-data`,
            }).then(res => {
                let data = JSON.parse(res.data.resultdata)
                var time = data.xdata || [];
                var value = data.histogramEntities.length ? data.histogramEntities[0].data : [];
                this.drawLine2(time, value)

            })
        },
        //出库曲线
        GetDeliverAmount() {
            this.$axios({
                method: 'post',
                url: `/api/wms/report/get-outbound-line-chart-data`,
            }).then(res => {
                let data = JSON.parse(res.data.resultdata)
                var time = data.xdata || [];
                var value = data.histogramEntities.length ? data.histogramEntities[0].data : [];
                this.drawLine4(time, value)

            })
        },

        drawLine1(num1, num2, num3) {
            // 基于准备好的dom，初始化echarts实例
            this.myChart = this.$echarts.init(this.$refs.charts_1)
            // 绘制图表
            this.myChart.resize()
            let option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                background: 'transparent',
                legend: {
                    orient: 'vertical',
                    left: 'center',
                    bottom: 'bottom',
                    data: ['已占库位', '锁定库位', '空库位'],
                    "textStyle": {
                        "fontWeight": '400',
                        "color": '#fff',
                        "fontSize": '20',
                    },
                    itemGap: 30
                },

                series: [
                    {
                        name: '库位情况分析',
                        color: ['#E4914C', '#34A2FF', '#58bc58'],
                        type: 'pie',
                        radius: ['35%', '55%'],
                        "selectedMode": "single",
                        "labelLine": {
                            "show": true,
                            "length": 10,
                            "length2": 20
                        },
                        label: {
                            normal: {
                                formatter: '{b}:{d}%',
                                fontSize: '18'
                            }
                        },
                        data: [

                            { value: num1, name: '已占库位' },
                            { value: num2, name: '锁定库位' },
                            { value: num3, name: '空库位' },
                        ]
                    }
                ]
            };
            this.myChart.setOption(option)
        },

        drawLine2(num1, num2) {
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
                    color: '#Fff',
                    splitLine: {
                        show: true,
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
                    boundaryGap: false,
                    data: num1,
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        "lineStyle": {
                            "color": '#282D56'
                        },
                        show: true
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
                    symbolSize: 10,//拐点大小
                    symbol: 'circle',//拐点样式                            
                    itemStyle: {
                        normal: {
                            color: "#F45E23", //拐点颜色
                            borderColor: '#eee',
                            borderWidth: 2
                        },
                    },
                    smooth: true,
                    "lineStyle": {
                        "color": '#FDC55A',
                        "width": 4,
                        "shadowBlur": 25,
                        "shadowOffsetY": 10,
                        "shadowColor": "rgba(0, 0, 0, 0.2)"
                    },
                }]
            };
            this.myChart2.setOption(option)
        },
        drawLine4(num1, num2) {
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
                    color: '#Fff',
                    splitLine: {
                        show: true,
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
                    boundaryGap: false,
                    data: num1
                },
                yAxis: {
                    type: 'value',
                    splitLine: {
                        "lineStyle": {
                            "color": '#282D56'

                        },
                        show: true
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
                    symbolSize: 10,//拐点大小
                    symbol: 'circle',//拐点样式                            
                    itemStyle: {
                        normal: {
                            color: "#F45E23", //拐点颜色
                            borderColor: '#eee',
                            borderWidth: 2
                        },
                    },
                    smooth: true,
                    "lineStyle": {
                        "color": '#FDC55A',
                        "width": 4,
                        "shadowBlur": 25,
                        "shadowOffsetY": 10,
                        "shadowColor": "rgba(0, 0, 0, 0.2)"
                    },
                }]
            };
            this.myChart4.setOption(option)
        },


        //全屏状态
        clickFullscreen() {
            if (!screenfull.isEnabled) {
                this.$message({
                    message: 'you browser can not work',
                    type: 'warning'
                })
                return false
            }
            screenfull.toggle()
        },
    }
}
</script>
<style lang="less">
.shanhe_box {
    .el-table {
        background: transparent;
    }

    .el-table th {
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 500;
        color: #0A1547;
        height: 50px;
        padding: 0;
    }

    .el-table tr {
        height: 50px;
        font-size: 30px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: #FFFFFF;
    }

    .el-table .cell {
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
* {
    margin: 0;
    padding: 0;
}

.shanhe_box {
    width: 1920px;
    height: 100vh;
    background: url('../../../src/assets/img/beijing.png');
    background-size: cover;

    .left {
        float: left;
    }

    .right {
        float: right;
    }

    .clearfix:after {
        /*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        *zoom: 1;
    }

    .shanhe_head {
        width: 100%;
        height: 54px;
        margin-bottom: 34px;
        position: relative;


        .shanhe_time {
            width: 295px;
            height: 54px;
            position: absolute;
            right: 0;
            top: 0;

            .time_logo {
                display: inline-block;
                width: 32px;
                height: 32px;
                background: url('../../../src/assets/img/shijian.png');
                background-size: cover;
                line-height: 54px;
                position: absolute;
                margin: auto;
                top: 0;
                bottom: 0;
                left: 0;
            }

            .time_value {
                display: inline-block;
                font-size: 24px;
                font-family: Helvetica CE 55 Roman;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 54px;
                margin-left: 42px;
            }

            .time_date {
                display: inline-block;
                font-size: 24px;
                font-family: Helvetica CE 55 Roman;
                font-weight: 400;
                color: #FFFFFF;
                line-height: 40px;
                margin-left: 29px;
            }
        }

        .shanhe_title {
            position: absolute;
            top: 0;
            left: 37%;
            color: #fff;
            font-size: 35px;
            width: 400px;
            height: 54px;
            background: url('../../../src/assets/img/kanban_title.png');
            background-size: inherit;
            background-repeat: no-repeat;
            background-position: center;
        }
    }

    .shanhe_conter {
        width: 100%;
        height: calc(100% - 88px);
        display: flex;
        overflow-y: auto;

        .joinText {
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

        .joinLogo {
            width: 20px;
            height: 20px;
            background: url('../../assets/img/组 10.png');
            background-size: cover;
            position: absolute;
            left: 25px;
            top: 25px;
            // opacity: 0.5;
        }

        .joinNum {
            position: absolute;
            width: 52px;
            height: 74px;
            background: rgba(0, 53, 178, 0.3);
            border: 2px solid;
            border-image: linear-gradient(0deg, #24C4FF, #0057C2) 10 10;
            top: 90px;
            font-size: 50px;
            font-family: Helvetica Inserat LT Std;
            font-weight: normal;
            color: #89EAFF;
            text-align: center;
            line-height: 74px;
        }

        .shanhe_left {
            width: 518px;
            height: 100%;
            padding-left: 21px;
            box-sizing: border-box;

            .joinLocation {
                width: 482px;
                height: 230px;
                background: url('../../assets/img/zuo1.png');
                background-size: cover;
                position: relative;

                .Num1 {
                    left: 58px;
                }

                .Num2 {
                    left: 141px;
                }

                .Num3 {
                    left: 219px;
                }

                .Num4 {
                    left: 296px;
                }

                .Num5 {
                    left: 375px;
                }
            }

            .userLocation {
                width: 480px;
                height: 356px;
                background: url('../../assets/img/zuo2.png');
                background-size: cover;
                margin-top: 16px;
                position: relative;

                .echarts_1 {
                    position: absolute;
                    top: 45px;
                    left: 35px;
                    width: 85%;
                    height: 80%;
                }
            }

            .joinStatistics {
                width: 480px;
                height: 353px;
                background: url('../../assets/img/zuo3.png');
                background-size: cover;
                margin-top: 15px;
                position: relative;

                .upTime {
                    position: absolute;
                    top: 27px;
                    right: 24px;
                    font-size: 18px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #C3CAD9;
                }

                .echarts_2 {
                    position: absolute;
                    top: 55px;
                    left: 35px;
                    width: 85%;
                    height: 80%;
                }
            }
        }

        .shanhe_middle {
            width: 878px;
            height: 100%;

            .middle_top {
                width: 878px;
                height: 754px;
                background: url('../../assets/img/组 12.png');
                background-size: cover;
                position: relative;

                .middleTable {
                    position: absolute;
                    top: 40px;
                    left: 20px;
                }
            }

            .middle_bottom {
                width: 878px;
                height: 208px;
                background: url('../../assets/img/组 11.png');
                background-size: cover;
                position: relative;

                .middle_bottom_title,
                .middle_bottom_title1 {
                    position: absolute;
                    left: 35px;
                    top: 30px;
                    font-size: 22px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 22px;
                }

                .middle_bottom_num,
                .middle_bottom_num1 {
                    position: absolute;
                    top: 30px;
                    left: 150px;
                    font-size: 30px;
                    font-family: Helvetica Inserat LT Std;
                    font-weight: normal;
                    color: #FDC55A;
                    line-height: 30px;
                }

                .middle_bottom_dom,
                .middle_bottom_dom1 {
                    position: absolute;
                    top: 70px;
                    left: 35px;
                    width: 810px;
                    height: 16px;
                    background: #182C63;
                    border-radius: 8px;

                    .middle_bottom_domColor {
                        position: absolute;
                        width: 80%;
                        height: 100%;
                        background: linear-gradient(100deg, #40C4E9 0%, #228FFE 100%);
                        border-radius: 8px;
                    }
                }

                .num1 {
                    position: absolute;
                    left: 150px;
                    top: 112px;
                    color: #228FFE;
                }

                .dom1 {
                    position: absolute;
                    top: 150px;
                    left: 35px;
                }

                .titile1 {
                    position: absolute;
                    left: 35px;
                    top: 112px;
                }

                .middle_bottom_tatol {
                    position: absolute;
                    right: 43px;
                    top: 68px;
                    font-size: 18px;
                    font-family: Helvetica CE 55 Roman;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 18px;
                }

                .middle_bottom_tatol1 {
                    position: absolute;
                    top: 150px;
                    right: 43px;
                    font-size: 18px;
                    font-family: Helvetica CE 55 Roman;
                    font-weight: 400;
                    color: #FFFFFF;
                    line-height: 18px;
                }
            }
        }

        .shanhe_right {
            width: 497px;
            height: 100%;
            box-sizing: border-box;
            margin-right: 27px;
            position: relative;

            .right_top {
                width: 482px;
                height: 230px;
                background: url('../../assets/img/you1.png');
                background-size: cover;
                position: absolute;
                right: 0;
                top: 0;

                .joinNum {
                    position: absolute;
                    width: 52px;
                    height: 74px;
                    background: rgba(0, 53, 178, 0.3);
                    border: 2px solid;
                    border-image: linear-gradient(0deg, #24C4FF, #0057C2) 10 10;
                    top: 90px;
                    // opacity: 0.5;
                }

                .Num1 {
                    left: 58px;
                }

                .Num2 {
                    left: 141px;
                }

                .Num3 {
                    left: 219px;
                }

                .Num4 {
                    left: 296px;
                }

                .Num5 {
                    left: 375px;
                }
            }

            .right_middle {
                width: 480px;
                height: 356px;
                background: url('../../assets/img/you2.png');
                background-size: cover;
                position: absolute;
                right: 0;
                top: 243px;
                padding: 50px 16px 16px;
                box-sizing: border-box;


            }

            .right_bottom {
                width: 480px;
                height: 353px;
                background: url('../../assets/img/you3.png');
                background-size: cover;
                position: absolute;
                right: 0;
                top: 619px;

                .upTime {
                    position: absolute;
                    top: 27px;
                    right: 24px;
                    font-size: 18px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #C3CAD9;
                }

                .echarts_4 {
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