<!--
 * @description: 报警统计页面
 * @since: 2019-11-08 15:00:48
 * @Author: jawnwa22
 * @LastEditors: jawnwa22
 * @LastEditTime: 2019-11-11 10:13:58
 -->
<template>
    <div class="currentAlarm" v-loading="this.$store.state.isShow">
        <div class="linebox">
            <div class="table clearfix">
                <div class="fll">
                    <span :style="[{ marginLeft: 0 }]">报警状态：</span>
                    <el-select v-model="type0" clearable filterable class="search-select">
                        <el-option label="不限" value="不限"></el-option>
                        <el-option label="未确认未恢复" value="未确认未恢复"></el-option>
                        <el-option label="已确认未恢复" value="已确认未恢复"></el-option>
                        <el-option label="未确认已恢复" value="未确认已恢复"></el-option>
                    </el-select>
                    <span>报警类别：</span>
                    <el-select v-model="type1" clearable filterable class="search-select">
                        <el-option label="不限" value="不限"></el-option>
                        <el-option v-for="(item,idx) in optionList" :key="item+idx" :label="item" :value="item">
                        </el-option>
                    </el-select>
                    <span>报警时间范围：</span>
                    <div class="currentAlarm-container">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker :key="'normal'" :popper-class="'normal'" v-model="value1" type="datetime"
                                placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="[{ height: 40 * a1 < 40 ? 40 : 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 210 + 'px' }]">
                            </el-date-picker>
                        </div>
                        <span>-</span>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker :key="'normal'" :popper-class="'normal'" v-model="value2" type="datetime"
                                placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="[{ height: 40 * a1 < 40 ? 40 : 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 210 + 'px' }]">
                            </el-date-picker>
                        </div>
                    </div>
                    <el-input class="currentAlarm-input" v-model="inputvalue" placeholder="请输入关键字"
                        :style="[{ width: 185 * 1 + 'px', marginRight: '10px' }]"></el-input>
                    <el-button @click="searchData(1)" class="btn-style1"><img :src="chaxun" />查看</el-button>
                </div>



                <div class="fr">
                    <div class="export" @click="confirm"
                        :style="[{ lineHeight: '30px' }, { height: '30px' }, { fontSize: '16px' }, { width: '80px' }, { boxSizing: 'border-box' }]">
                        报警确认</div>
                    <div class="export" @click="beforeallconfirm"
                        :style="[{ lineHeight: '30px' }, { height: '30px' }, { fontSize: '16px' }, { width: '80px' }, { boxSizing: 'border-box' }]">
                        全部确认</div>
                    <div class="export" @click="exportFn"
                        :style="[{ lineHeight: '30px' }, { height: '30px' }, { fontSize: '16px' }, { width: '80px' }, { boxSizing: 'border-box' }]">
                        导出</div>
                </div>
            </div>
            <div class="tabledata" id="w" ref="img">
                <el-table height="100%" :data="dataList" @select="select" @select-all="select" :cell-style="cellStyle"
                    highlight-current-row style="width: 100%;height:100%;" :header-cell-style="{
                        height: '40px', border: '1px solid #EAEAEA'
                    }">
                    <el-table-column type="selection" width="80" :show-overflow-tooltip="true">
                    </el-table-column>
                    <el-table-column prop="AlarmTime" :show-overflow-tooltip="true" label="报警时间">
                    </el-table-column>
                    <el-table-column prop="AlarmTagName" :show-overflow-tooltip="true" label="报警变量名">
                    </el-table-column>
                    <el-table-column prop="AlarmTagAddress" :show-overflow-tooltip="true" label="报警地址">
                    </el-table-column>
                    <el-table-column prop="AlarmDevice" :show-overflow-tooltip="true" label="报警设备">
                    </el-table-column>
                    <el-table-column prop="AlarmType" :show-overflow-tooltip="true" label="报警类别">
                    </el-table-column>
                    <el-table-column prop="AlarmGroup" :show-overflow-tooltip="true" label="报警组">
                    </el-table-column>
                    <el-table-column prop="AlarmMsg" :show-overflow-tooltip="true" label="报警信息">
                    </el-table-column>
                    <el-table-column prop="AlarmValue" :show-overflow-tooltip="true" label="报警值">
                    </el-table-column>
                    <el-table-column prop="AlarmLevel" :show-overflow-tooltip="true" label="报警等级">
                    </el-table-column>
                    <el-table-column prop="RecoverTime" :show-overflow-tooltip="true" label="恢复时间">
                    </el-table-column>
                    <el-table-column prop="ConfirmTime" :show-overflow-tooltip="true" label="确认时间">
                    </el-table-column>
                    <el-table-column prop="OperatorName" :show-overflow-tooltip="true" label="报警确认员">
                    </el-table-column>
                    <el-table-column prop="AlarmStateName" :show-overflow-tooltip="true" label="报警状态">
                    </el-table-column>
                </el-table>
            </div>
            <div class="my-page">
                <my-page :pageData="pageData" @req="req"></my-page>
            </div>
        </div>
        <div class="tip" ref="kongtiao3" v-if="tipchange1">
            <div class="tiptop">
                <img :src="gth" alt />
                <span>提示</span>
            </div>
            <div class="tipcontanin">
                <div class="w">{{ w }}</div>
                <div class="tipdetermine" v-if="deltrue" @click="tip2">确定</div>
                <div class="delclass" v-if="!deltrue">
                    <div class="one" @click="no1">取消</div>
                    <div class="two" @click="allconfirm">
                        确定
                    </div>
                </div>
            </div>
        </div>
        <div class="cover3" v-if="tipchange1"></div>
    </div>
</template>

<script>
// vue文件中引入echarts工具
let echarts = require('echarts/lib/echarts');
import chaxun from "@/assets/img1/chaxun.png";
import MyPage from './Pages.vue';
require('echarts/lib/chart/line');
// 以下的组件按需引入
require('echarts/lib/component/tooltip'); // tooltip组件
require('echarts/lib/component/title'); //  title组件
require('echarts/lib/component/legend'); // legend组件
export default {
    name: 'currentAlarm',
    components: {
        MyPage,
    },
    data() {
        return {
            chaxun: chaxun,
            tipchange1: false,
            tip: 'noData',
            w: '',
            gth: require('../../assets/img/gth.png'),
            type0: '不限',
            type1: '不限',
            optionList: [],
            value1: '',
            value2: '',
            inputvalue: '',

            starttime: '',
            endtime: '',
            a1: 1,
            a2: 1,
            dataList: [],
            selection: [],
            pageData: {
                PageSize: 50,
                TotalCount: 0,
                TotalPage: 0,
                PageIndex: 1,
                LastEnabled: false,
                NextEnabled: false,
            },
            PageIndex: 1,
            deltrue: true,
        };
    },

    computed: {

    },
    mounted() {
        this.value1 = new Date(new Date().toLocaleDateString());
        this.value2 = new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
            24 * 60 * 60 * 1000 -
            1
        );
        this.value1 = this.GMTToStr(this.value1);
        this.value2 = this.GMTToStr(this.value2);
        this.$axios
            .post(`/api/AlarmRecord/AlarmRecord_GstAlarmType`)
            .then(res => {
                if (res.data.code == 0) {
                    this.optionList = res.data.data;
                }
            })
        this.searchData(1);
    },
    watch: {


    },
    methods: {
        cellStyle({ row, column, rowIndex, columnIndex }) {
            console.log('rowrow', row);
            if (row.AlarmStateName == '未确认未恢复') {
                return "color:#ff0000";
            } else if (row.AlarmStateName == '已确认未恢复') {
                return "color: #f6b81a";
            } else if (row.AlarmStateName == '未确认已恢复') {
                return "color:#121FFC";
            }
            return "color:#666666";
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
        // 获取当前日期
        getNowTime() {
            let date = new Date();
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? "0" + MM : MM;
            let d = date.getDate();
            d = d < 10 ? "0" + d : d;
            let h = date.getHours();
            h = h < 10 ? "0" + h : h;
            let m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            let s = date.getSeconds();
            s = s < 10 ? "0" + s : s;
            return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        },

        select(selection, row) {
            this.selection = selection;
        },
        tip2() {

            this.tipchange1 = false;
        },
        isPositiveInteger(s) {
            //是否为正整数
            var re = /^[0-9]+$/;
            return re.test(s);
        },
        req(pageIndex, s) {
            this.deltrue = true;
            if (s == 'jump') {
                if (!this.isPositiveInteger(pageIndex)) {
                    this.w = '请输入正整数';
                    this.tipchange1 = true;
                    return;
                } else {
                    if (
                        pageIndex !== 1 &&
                        pageIndex !== this.pageData.TotalPage
                    ) {
                        if (
                            pageIndex < 1 ||
                            pageIndex > this.pageData.TotalPage
                        ) {
                            this.tipchange1 = true;
                            this.w =
                                '请输入正确的页码';
                            return;
                        }
                    }
                }
            }
            this.searchData(pageIndex);
        },
        searchData(pageIndex) {

            this.$axios
                .post(
                    `/api/AlarmRecord/AlarmRecord_GstCurrentAlarmRecord?argStatus=${this.type0
                    }&argAlarmType=${this.type1
                    }&argStartTime=${this.value1}&argEndTime=${this.value2
                    }&argKeyword=${this.inputvalue}&argPageSize=${this.pageData.PageSize}&argPageIndex=${pageIndex ? pageIndex : this.pageIndex
                    }`

                )
                .then(res => {
                    if (res.data.code == 0) {
                        this.selection = [];
                        this.dataList = res.data.data.DataList;
                        this.pageData = res.data.data.ParameterList;
                        this.pageIndex = Number(res.data.data.ParameterList.pageIndex) + 1
                    }
                })
                .catch(err => { });
        },
        confirm() {
            this.tipchange1 = true;
            if (!this.selection.length) {
                this.w = `请选择记录`;
                return
            }
            this.$axios({
                method: 'post',
                url: `/api/AlarmRecord/AlarmRecord_SetAlarmConfirm`,
                data: {
                    AlarmList: this.selection,
                    OperatorName: 'SuperAdmin'
                },
            }).then((res) => {
                this.selection = [];
                this.tipchange1 = true;
                this.w = res.data.data;
                this.searchData(this.PageIndex);
            });
        },
        no1() {
            this.tipchange1 = false;
            this.deltrue = true;
        },
        beforeallconfirm() {
            this.deltrue = false;
            this.tipchange1 = true;
            this.w = "是否全部确认？";
        },
        allconfirm() {
            this.$axios({
                method: 'post',
                url: `/api/AlarmRecord/AlarmRecord_AllAlarmConfirmation?argAlarmType=${this.type0}&argStatus=${this.type1}&argStartTime=${this.value1}&argEndTime=${this.value2}&argKeyword&argOperatorName=SuperAdmin`,
            })
                .then((res) => {
                    this.searchData(this.PageIndex);
                    if (res.data.data) {
                        this.selection = [];
                        this.w = `${res.data.data}`;
                        this.tipchange1 = true;
                        this.deltrue = true;
                    }
                })

        },
        exportFn() {
            let filterVal = [
                'AlarmTime',
                'AlarmTagName',
                'AlarmTagAddress',
                'AlarmDevice',
                'AlarmType',
                'AlarmGroup',
                'AlarmMsg',
                'AlarmValue',
                'AlarmLevel',
                'RecoverTime',
                'ConfirmTime',
                'OperatorName',
                'AlarmStateName',
            ];
            let title = [
                '报警时间',
                '报警变量名',
                '报警地址',
                '报警设备',
                '报警类别',
                '报警组',
                '报警信息',
                '报警值',
                '报警等级',
                '恢复时间',
                '确认时间',
                '报警确认员',
                '报警状态',
            ];
            if (this.pageData.TotalCount == 0) {
                let excelDatas = [
                    {
                        tHeader: title,
                        filterVal: filterVal,
                        tableDatas: [],
                        sheetName: 'sheet1',
                    },
                    {
                        tHeader: title,
                        filterVal: filterVal,
                        tableDatas: [],
                        sheetName: 'sheet1',
                    }, //不知道源码为啥删一次，写两次才正常
                ];
                this.json2excel(excelDatas, '实时报警', true, 'xlsx');
                return;
            }
            this.$axios
                .post(
                    `/api/AlarmRecord/AlarmRecord_GstCurrentAlarmRecord?argStatus=${this.type0
                    }&argAlarmType=${this.type1
                    }&argStartTime=${this.value1}&argEndTime=${this.value2
                    }&argKeyword=${this.inputvalue}&argPageSize=${this.pageData.TotalCount}&argPageIndex=1`
                )
                .then((res) => {
                    if (res.data.code == 0) {
                        let tableList = [...res.data.data.DataList];
                        require.ensure([], () => {
                            const {
                                expor_json_to_excel,
                            } = require('./Export2Excel');
                            let excelDatas = [
                                {
                                    tHeader: title,
                                    filterVal: filterVal,
                                    tableDatas: tableList,
                                    sheetName: 'sheet1',
                                },
                                {
                                    tHeader: title,
                                    filterVal: filterVal,
                                    tableDatas: tableList,
                                    sheetName: 'sheet1',
                                }, //不知道源码为啥删一次，写两次才正常
                            ];
                            this.json2excel(
                                excelDatas,
                                '实时报警',
                                true,
                                'xlsx'
                            );
                        });
                    } else {
                        this.w = res.data.msg;
                        this.tipchange1 = true;

                    }
                });
        },
        json2excel(tableJson, filenames, autowidth, bookTypes) {
            var that = this;
            //这个是引用插件
            import('./Export2Excel').then((excel) => {
                var tHeader = [];
                var dataArr = [];
                var sheetnames = [];
                for (var i in tableJson) {
                    tHeader.push(tableJson[i].tHeader);
                    dataArr.push(
                        that.formatJson(
                            tableJson[i].filterVal,
                            tableJson[i].tableDatas
                        )
                    );
                    sheetnames.push(tableJson[i].sheetName);
                }
                excel.export_json_to_excel({
                    header: tHeader,
                    data: dataArr,
                    sheetname: sheetnames,
                    filename: filenames,
                    autoWidth: autowidth,
                    bookType: bookTypes,
                });
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]));
        },
    },


};
</script>
<style lang="less">
.currentAlarm {

    .block .el-input--small .el-input__inner {
        padding-left: 30px;
        box-sizing: border-box;
    }

    .my-page {
        width: 100%;
        padding: 0 0px;
        box-sizing: border-box;
        background-color: #f2f2f2;


        .input {
            width: 100px;
        }

    }

    .tabledata {
        table {
            border-spacing: 0;

            td {
                border-left: 1px solid #ebeef5;
            }
        }
    }

    .el-table td div {
        color: inherit;
    }
}
</style>
<style lang="less" scoped>
.btn-style1 {
    padding: 4px 0;

    img {
        vertical-align: middle;
        margin-right: 5px;

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
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.clearfix {
    zoom: 1;
}

.currentAlarm {
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    background-color: #f2f2f2;



    .linebox {
        height: 100%;
        width: 100%;
        background-color: #ffffff;
        overflow: hidden;
    }

    .table {
        height: 60px;
        width: 100%;
        box-sizing: border-box;
        background-color: #f2f2f2;
        line-height: 60px;
        overflow: hidden;
        font-size: 14px;
        color: #6b6668;
        display: flex;
        align-items: center;
        justify-content: space-between;

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
        text-align: center;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
    }

    .query {
        background-color: #4270e4;
        margin-right: 20px;
    }

    .export {
        background-color: #F29B76;
        margin-left: 10px;

    }

    .search-select {
        width: 120px;
    }

    .currentAlarm-container {
        display: inline-block;
        height: 40px;

        .block {
            display: inline-block;
        }
    }

    .currentAlarm-input {
        margin-left: 16px;
        width: 150px;
        display: inline-block;
    }

    .separate {
        position: relative;
        left: 7px;
    }
}

.tabledata {
    width: calc(100%-20px);
    height: calc(100% - 120px);
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
    padding: 8px;
    border-style: solid;
    text-align: center;
}

#subtabledata td {
    //  background:#ffffff url('cell-grey.jpg');
    padding: 8px;
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
    padding: 8px;
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
</style>