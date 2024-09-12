<!--
 * @description: 报警统计页面
 * @since: 2019-11-08 15:00:48
 * @Author: jawnwa22
 * @LastEditors: jawnwa22
 * @LastEditTime: 2019-11-11 10:13:58
 -->
<template>
    <div class="tapwater" v-loading="this.$store.state.isShow">
        <div class="linebox">
            <div class="table clearfix">
                <div class="fll">
                    <span >开始时间</span>
                    <div class="tapwater-container">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker :key="'normal'" :popper-class="'normal'" v-model="value1" type="datetime"
                                placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="[{ height: 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 250 * 1 + 'px' }]">
                            </el-date-picker>
                        </div>
                        <span >结束时间</span>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker :key="'normal'" :popper-class="'normal'" v-model="value2" type="datetime"
                                placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="[{ height: 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 250 * 1 + 'px' }]">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="query W1" 
                    :style="[{ lineHeight: 36 * 1 < 36 ? 36 + 'px' : 36 * 1 + 'px' }, { height: 40 * 1 < 40 ? 40 : 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 120 * 1 + 'px' }]">
                    查询</div>
                <div class="fr">
                    <div class="export"  
                        :style="[{ lineHeight: 40 * 1 < 40 ? 40 + 'px' : 40 * 1 + 'px' }, { height: 40 * 1 < 40 ? 40 : 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 120 * 1 + 'px' }]">
                        导出</div>
                </div>
            </div>
            <div class="tabledata" id="w" :style="{ width: '100%', height: `calc(100% - ${60}px)` }">


            </div>
        </div>
        <div class="tip" ref="kongtiao3" v-if="tipchange1">
            <div class="tiptop">
                <img :src="gth" alt />
                <span>提示</span>
            </div>
            <div class="tipcontanin">
                <div class="w">{{ w }}</div>
                <div class="tipdetermine" @click="tip2">确定</div>
            </div>
        </div>
        <div class="cover3" v-if="tipchange1"></div>
    </div>
</template>

<script>
// vue文件中引入echarts工具
let echarts = require('echarts/lib/echarts');
import html2canvas from 'html2canvas';
require('echarts/lib/chart/line');
// 以下的组件按需引入
require('echarts/lib/component/tooltip'); // tooltip组件
require('echarts/lib/component/title'); //  title组件
require('echarts/lib/component/legend'); // legend组件
export default {
    name: 'tapwater',
    data() {
        return {
            tipchange1: false,
            w: '',
            gth: require('../../assets/img/gth.png'),
            value1: new Date(new Date().toLocaleDateString()),
            value2: new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ),

        };
    },

    created() {
    },
    computed: {

    },
    mounted() {

    },
    watch: {


    },
    methods: {
        tip2() {

            this.tipchange1 = false;
        },

    },


};
</script>
<style lang="less">
.tapwater {

    .el-input--small .el-input__inner {
        padding-left: 30px;
        box-sizing: border-box;
    }

    table {
        border-spacing: 0;

        th {
            border: 1px solid #7e7e7e;
            background-color: #f0ffff;
        }

        td {
            border: 1px solid #7e7e7e;
        }
    }
}
</style>
<style lang="less" scoped>
.tabledata {
    overflow-y: auto;
    overflow-x: hidden;

    table {
        border-spacing: 0;

        td {
            border: 1px solid #7e7e7e;
        }
    }
}

.sum {
    margin-top: 5px;
    color: #9d9d9d;
}

.fll {
    float: left;
}

.fr {
    float: right;
}

.clearfix::after {
    content: '';
    height: 0;
    line-height: 0;
    clear: both;
    visibility: hidden;
}

.clearfix {
    zoom: 1;
}

.tapwater {
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    background-color: #eeeeee;



    .linebox {
        height: 100%;
        width: 100%;
        background-color: #ffffff;
        border: 1px solid #d5d5d5;
        overflow: hidden;
    }

    .table {
        height: 60px;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
        background-color: #dddddd;
        line-height: 60px;
        overflow: hidden;
        font-size: 14px;
        color: #6b6668;

        span {
            margin-left: 18px;
        }

        .tablename {
            height: 40px;
            width: 250px;
        }

        .tabledatetime {
            height: 40px;
            width: 178px;
        }

        .starttime {
            height: 40px;
            width: 210px;
            display: inline-block;
            margin-left: 18px;
            background-color: #ffffff;
            line-height: 40px;
            padding-left: 12px;
        }

        .endtime {
            height: 40px;
            width: 210px;
            display: inline-block;
            background-color: #ffffff;
            line-height: 40px;
            padding-left: 12px;
        }
    }

    .query,
    .export {
        display: inline-block;
        text-align: center;
        color: #ffffff;
        border-radius: 5px;
        font-weight: 600;
        cursor: pointer;
    }

    .query {
        background-color: #ffffff;
        border: 2px solid #4270e4;
        color: #4270e4;
        margin-right: 20px;
    }

    .export {
        color: #fd9e00;
        background-color: #ffffff;
        border: 2px solid #fd9e00;
        margin-right: 10px;

    }

    .tapwater-container {
        display: inline-block;
        height: 40px;

        .block {
            display: inline-block;
        }
    }

    .separate {
        position: relative;
        left: 7px;
    }
}

.tabledata {
    padding: 10px;
    box-sizing: border-box;
    width: calc(100%-20px);
}

select {
    text-indent: 0.5em;
}

.query:hover {
    cursor: pointer;
}

.tip {
    position: fixed;
    width: 380px;
    height: 200px;
    z-index: 30;
    top: 350px;
    left: 750px;
    box-shadow: 0px 0px 8px black;
    background-color: #f3f3f4;

    .tiptop {
        width: 380px;
        height: 40px;
        background-color: #ffbc3d;

        img {
            width: 20px;
            height: 20px;
            margin-top: 10px;
            margin-left: 160px;
        }

        span {
            color: #ffffff;
            position: relative;
            top: -5px;
            margin-left: 7px;
        }
    }

    .tipword {
        width: 100%;
        padding: 30px;
        // text-align: center;
        padding-bottom: 0;
    }

    .w {
        width: 100%;
        margin-top: 40px;
        overflow-y: auto;
        text-align: center;
    }

    .tipdetermine {
        color: #ea9328;
        width: 310px;
        line-height: 30px;
        cursor: pointer;
        text-align: center;
        margin-top: 40px;
        margin-left: 35px;
        height: 30px;
        background-color: #f3e3ad;
    }

    .delclass {
        width: 330px;
        line-height: 30px;
        margin-top: 40px;
        margin-left: 25px;
        height: 30px;

        .one {
            cursor: pointer;
            display: inline-block;
            height: 30px;
            width: 160px;
            text-align: center;
            background-color: #e0e0e0;
            color: #7e7e7e;
        }

        .two {
            cursor: pointer;
            display: inline-block;
            height: 30px;
            margin-left: 10px;
            width: 160px;
            background-color: #f3e3ad;
            text-align: center;
            color: #eeb764;
        }
    }


}

.cover2 {
    width: 100%;
    height: 100%;
    z-index: 29;
    position: fixed;
    top: 0;
    left: 0;
}

.cover3 {
    width: 100%;
    height: 100%;
    z-index: 29;
    position: fixed;
    top: 0;
    left: 0;
}

input,
textarea,
select,
a:focus {
    outline: none;
}

.headtable {
    color: #000000;
    font-size: 16pt;
    font-weight: 700;
    font-style: normal;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
}

.headtable_td {
    color: #000000;
    font-size: 12pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: left;
    vertical-align: middle;
    border: 0.5pt solid #000000;
}

.headtable_ba {
    color: #000000;
    font-size: 12pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    border: 0.5pt solid #000000;
    background: #f2f2f2;
}

.headtableinput {
    border: none;
    background-color: #f2f2f2;
    height: 30px;
    width: 50px;
}

.middletablefirst {
    color: #000000;
    font-size: 10pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: left;
    vertical-align: middle;
    border: 0.5pt solid #000000;
}

.middletablesecond {
    color: #000000;
    font-size: 9pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: center;
    vertical-align: middle;
    border: 0.5pt solid #000000;
    background: #f2f2f2;
}

#table2 td {
    color: #000000;
    font-size: 9pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: left;
    vertical-align: middle;
}

#rule span {
    font-size: 8pt;
}

#table3 td {
    color: #000000;
    font-size: 12pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: left;
    vertical-align: middle;
    width: 100px;
}

#table4 td {
    color: #000000;
    font-size: 12pt;
    font-weight: 400;
    font-style: normal;
    text-decoration: none;
    text-align: left;
    vertical-align: middle;
    width: 100px;
    height: 50px;
}

#tabledata {
    font-size: 14pt;
    color: #333333;
    border-width: 1px;
    border-color: #999999;
    border-collapse: collapse;
    text-align: center;
}

#tabledata th {
    background-color: #dcf0f9 !important;
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
    text-align: center;
}

.W1 {
    margin-left: 10px;
}

#tabledata td {
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
    text-align: center;
}

#subtabledata {
    font-size: 14pt;
    color: #333333;
    border-width: 1px;
    border-color: #000;
    border-style: solid;
    border-collapse: collapse;
    text-align: center;
    table-layout: fixed;
}

#subtabledata th {
    //  background:#dcf0f9 url('cell-blue.jpg');
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
    text-align: center;
}

#subtabledata td {
    //  background:#ffffff url('cell-grey.jpg');
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
    text-align: center;
}

#tabletemple {
    font-size: 11px;
    color: #333333;
    border-width: 1px;
    border-color: #999999;
    border-collapse: collapse;
}

#tabletemple th {
    //  background:#dcf0f9 url('cell-blue.jpg');
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
}

#tabletemple td {
    //  background:#ffffff url('cell-grey.jpg');
    border-width: 1px;
    padding: 8px;
    border-style: solid;
    border-color: #999999;
}

.colordiv {
    background-color: #d9dbde;
}

table {}

td {
    white-space: nowrap !important;
    overflow: auto !important;
}

#main,
#main1,
#main3 {
    transform-origin: 0%;
    position: absolute;
    top: 0px;
    bottom: 0;
    left: 0;
    margin: auto;
}
</style>t