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
                    <span v-show="ri == 1">开始时间</span>
                    <div class="tapwater-container">
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker :key="'normal'" :popper-class="'normal'" v-model="value1" type="datetime"
                                @focus="sx" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="[{ height: 40 * a1 < 40 ? 40 : 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 250 * 1 + 'px' }]">
                            </el-date-picker>
                        </div>
                        <span v-show="ri == 1">结束时间</span>
                        <div class="block">
                            <span class="demonstration"></span>
                            <el-date-picker :key="'normal'" :popper-class="'normal'" v-model="value2" type="datetime"
                                @focus="sx" placeholder="请选择" value-format="yyyy-MM-dd HH:mm:ss"
                                :style="[{ height: 40 * a1 < 40 ? 40 : 40 * 1 + 'px' }, { fontSize: 16 * 1 + 'px' }, { width: 250 * 1 + 'px' }]">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                <el-button @click="tablename()" v-show="ri == 1" class="btn-style1"><img :src="chaxun" />查看</el-button>
                <div class="fr">
                    <div class="export" @click="saveImage('img', '报警记录')"
                        :style="[{ lineHeight: '30px' }, { height: '30px' }, { fontSize: '16px' }, { width: '80px' }, { boxSizing: 'border-box' }]">
                        导出</div>

                    <div class="export" @click="back" v-show="ri == 2"
                        :style="[{ lineHeight: '30px' }, { height: '30px' }, { fontSize: '16px' }, { width: '80px' }, { boxSizing: 'border-box' }]">
                        返回</div>

                </div>
            </div>
            <!-- <div id="myChart" ref="myChart" :style="{width: '100%', height: '36%'}"></div> -->
            <div class="tabledata" id="w" :style="{ width: '100%', height: `calc(100% - ${a2})` }"
                v-if="ddddssss.length !== 0" ref="img">
                <div class='mainbox' style="width:100%;height:350px;position:relative">
                    <div id="main3" style="height:350px;display:block;position:absolute"
                        :style="{ width: 100 / (a1 - 0.1) + '%', height: '340px', zoom: 1 / (a1 - 0.1), transform: 'scale(' + (a1 - 0.1) + ')' }">
                    </div>
                    <div id="main" style="height:350px;display:none;position:absolute"
                        :style="{ width: 100 / (a1 - 0.1) + '%', height: '340px', zoom: 1 / (a1 - 0.1), transform: 'scale(' + (a1 - 0.1) + ')' }">
                    </div>
                    <div id="main1" style="height:350px;display:none;position:absolute"
                        :style="{ width: 100 / (a1 - 0.1) + '%', height: '340px', zoom: 1 / (a1 - 0.1), transform: 'scale(' + (a1 - 0.1) + ')' }">
                    </div>
                </div>

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
import chaxun from "@/assets/img1/chaxun.png";
require('echarts/lib/chart/line');
// 以下的组件按需引入
require('echarts/lib/component/tooltip'); // tooltip组件
require('echarts/lib/component/title'); //  title组件
require('echarts/lib/component/legend'); // legend组件
export default {
    name: 'tapwater',
    data() {
        return {
            chaxun: chaxun,
            jurisdiction: [],
            buttonarr: [],
            aaa: 1,
            Chart1: '',
            Chart2: '',
            Charttemple: '',
            subChardata: [],
            secondgraphobj: '',
            ChartDataSource: '',
            ChartCalResult: '',
            ChartDataItem: '',
            Language: '',
            ZHObj: {
                chartitle: '设备报警统计',
                templechartitle: '设备报警统计模板',
                subcharttitle: '设备报警类型统计',
                tablecell0: '设备',
                tablecell1: '数量',
                tablecell2: '百分比',
                tablecell3: '累计百分比',
                subtablecell0: '报警类型',

                data1: '数据1',
                data2: '数据2',
                data3: '数据3'
            },
            PID: '',
            ddddssss:
                '[{"SericeId":null,"Name":"1","Con":"12","Per":"0.462","SumPer":"0.462","Children":[{"SericeId":null,"Name":"总是报警","Con":"8","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"伺服报警","Con":"1","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"天天报警","Con":"1","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"无法报警","Con":"1","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"从不报警","Con":"1","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null}],"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"2","Con":"10","Per":"0.385","SumPer":"0.847","Children":[{"SericeId":null,"Name":"总是报警","Con":"10","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"伺服报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"天天报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"无法报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"从不报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null}],"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"3","Con":"2","Per":"0.077","SumPer":"0.924","Children":[{"SericeId":null,"Name":"总是报警","Con":"2","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"伺服报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"天天报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"无法报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"从不报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null}],"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"4","Con":"1","Per":"0.038","SumPer":"0.962","Children":[{"SericeId":null,"Name":"总是报警","Con":"1","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"伺服报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"天天报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"无法报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"从不报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null}],"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"其他","Con":"1","Per":"0.038","SumPer":"1","Children":[{"SericeId":null,"Name":"总是报警","Con":"1","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"伺服报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"天天报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"无法报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null},{"SericeId":null,"Name":"从不报警","Con":"0","Per":null,"SumPer":null,"Children":null,"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null}],"GongYiAlarm":null,"SheBeiAlarm":null,"XiTongAlarm":null}]',
            tipchange1: false,
            tip: 'noData',
            w: '',
            gth: require('../../assets/img/gth.png'),
            option: {},
            option2: {},
            value1: new Date(new Date().toLocaleDateString()),
            value2: new Date(
                new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
            ),
            value3:
                new Date().getFullYear() +
                '-' +
                (new Date().getMonth() + 1) +
                '-' +
                (new Date().getDate() > 10
                    ? new Date().getDate()
                    : '0' + new Date().getDate()),
            value4:
                new Date().getFullYear() +
                '-' +
                (new Date().getMonth() + 1) +
                '-' +
                (new Date().getDate() > 10
                    ? new Date().getDate()
                    : '0' + new Date().getDate()),
            value5:
                new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
            value6:
                new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
            value7:
                new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
            value8:
                new Date().getFullYear() + '-' + (new Date().getMonth() + 1),
            tablenames: '',
            ri: 1,

            starttime: '',
            endtime: '',
            change: 2,
            tableData: [],
            try: 1,
            hasnum: 1,
            a1: 1,
            a2: 1,
            sum: 0,
            data11: [],
        };
    },

    created() {
        this.jurisdiction = this.$store.state.btnPowerData
    },
    computed: {
        theme() {
            return this.$store.state.color
        },
        VpowerData() {
            return this.$store.state.btnPowerData;
        },
    },
    mounted() {
        this.a1 = Number(parseFloat(window.screen.width / 1920).toFixed(2))
        if (this.a1 < 1) {
            this.a1 = 1
        }
        this.a2 = this.a1 * 60 < 60 ? 82 + 'px' : this.a1 * 60 + 22 + 'px'
        this.value1 = this.GMTToStr(this.value1);
        this.value2 = this.GMTToStr(this.value2);
        // this.drawLine();


        this.tablename();



        // this.intgraph(this.ddddssss);
    },
    watch: {
        theme(val) {
            if (document.getElementById('main').style.display === 'block' || document.getElementById('main1').style.display === 'block') {

                this.option.color = ['#E60012']
                this.option.yAxis.splitLine.lineStyle.color = '#ccc'
                this.option.yAxis.axisLabel.color = '#999'

                this.Chart1.setOption(this.option);
            }

            if (document.getElementById('main1').style.display === 'block') {

                this.option2.color = ['#E60012']
                this.option2.yAxis.splitLine.lineStyle.color = '#ccc'
                this.option2.yAxis.axisLabel.color = '#999'

                this.Chart2.setOption(this.option2);
            }
        },
        value1(val) {
            console.log(val);
        },

    },
    methods: {

        move(name, namehead) {
            //  $(`.${name}`).addClass('center')
            let left = ($(`.${name}`).width()) / 2 + 'px'
            let top = ($(`.${name}`).height()) / 2 + 'px'
            $(`.${name}`)[0].style.left = `calc(50% - ${left})`;
            $(`.${name}`)[0].style.top = `calc(50% - ${top})`;
            $(`.${name}`)[0].addEventListener('mousedown', function (e) {

                console.log(e.target.className.toLocaleLowerCase());
                if (e.target.className.toLocaleLowerCase() == namehead) {
                    $(`.${name}`).removeClass('center')
                    window.event.stopPropagation();
                    var x = 0;
                    var y = 0;
                    var l = 0;
                    var t = 0;
                    var isDown = false;
                    x = window.event.clientX;
                    y = window.event.clientY;
                    //获取左部和顶部的偏移量
                    l = $(`.${name}`)[0].offsetLeft;
                    t = $(`.${name}`)[0].offsetTop;
                    //开关打开
                    isDown = true;
                    var pdmove = false;


                    //设置样式
                    $('body')[0].style.cursor = 'move';

                    $('body')[0].addEventListener('mousemove', function (e) {
                        pdmove = true;
                        if (isDown == false) {
                            return;
                        }
                        //获取x和y
                        var nx = window.event.clientX;
                        var ny = window.event.clientY;

                        //计算移动后的左偏移量和顶部的偏移量
                        var nl = nx - (x - l);
                        var nt = ny - (y - t);
                        console.log(nx)
                        console.log(x)
                        console.log(l)
                        $(`.${name}`)[0].style.left = nl + 'px';
                        $(`.${name}`)[0].style.top = nt + 'px';
                    });
                    $('body')[0].addEventListener('mouseup', function (e) {
                        //开关关闭
                        isDown = false;
                        $('body')[0].style.cursor = 'default';
                    });
                }
            });
        },
        findPathByLeafId(id, node, path) {
            if (!path) {
                path = []
            }
            for (let i = 0; i < node.length; i++) {
                var temPath = path.concat();

                if (id == node[i].RightID) {
                    temPath.push(node[i])
                    return temPath
                }
                if (node[i].Children) {
                    var findResult = this.findPathByLeafId(id, node[i].Children, temPath)
                    if (findResult) {
                        return findResult
                    }
                }
            }
        },
        GetUrlParam(paraName) {
            let url = document.location.toString();
            let arrObj = url.split("?");
            if (arrObj.length > 1) {
                let arrPara = arrObj[1].split("&");
                let arr;
                for (let i = 0; i < arrPara.length; i++) {
                    arr = arrPara[i].split("=");
                    if (arr && arr[0] == paraName) {

                        return arr[1]
                    }
                }
                return ''
            } else {
                return ''
            }
        },
        back() {
            document.getElementById('main1').style.display = 'none';
            document.getElementById('main').style.display = 'block';
            document.getElementById('subtabledata').style.display = 'none';
            document.getElementById('tabledata').style.display = 'table';
            document.getElementById('tabledata').style.width = '100%';
            document.getElementById('tabledata').style.height = '300px';
            this.ri = 1;
        },
        tip2() {
            if (this.w == '时间格式错误！') {
                this.value1 = new Date(new Date().toLocaleDateString());
                this.value2 = new Date(
                    new Date(new Date().toLocaleDateString()).getTime() +
                    24 * 60 * 60 * 1000 -
                    1
                );
                this.value1 = this.GMTToStr(this.value1);
                this.value2 = this.GMTToStr(this.value2);
            }
            this.tipchange1 = false;
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]));
        },
        dataURLToBlob(dataurl) {
            let arr = dataurl.split(',');
            let mime = arr[0].match(/:(.*?);/)[1];
            let bstr = atob(arr[1]);
            let n = bstr.length;
            let u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        },
        changetime() {
            this.tablename();
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
        drawLine() {
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('myChart'));
            // 绘制图表
            myChart.setOption(this.option);
        },

        tablename() {
            var timeRegex = "^((([0-9]{3}[1-9]|[0-9]{2}[1-9][0-9]{1}|[0-9]{1}[1-9][0-9]{2}|[1-9][0-9]{3})-" +
                "(((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01]))|((0[469]|11)-(0[1-9]|[12][0-9]|30))|(02-(0[1-9]|[1][0-9]|2[0-8]))))|((([0-9]{2})" +
                "(0[48]|[2468][048]|[13579][26])|((0[48]|[2468][048]|[3579][26])00))-02-29))\\s+" +
                "([0-1]?[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$"
            var Regex = new RegExp(timeRegex)
            console.log(this.value1)
            console.log(Regex.test("2020-10-14 00:00:00"))

            if (!Regex.test(this.value1) || !Regex.test(this.value2)) {
                this.tipchange1 = true;
                setTimeout(() => {
                    $('.tip').css({

                        left: `calc(50% - ${($('.tip').width() / 2) * this.a1}px)`,
                        top: `calc(50% - ${($('.tip').height() / 2) * this.a1}px)`
                    })
                    this.move('tip', 'tiptop')
                })
                this.w1 = true
                this.tipword = ''
                this.w = '时间格式错误！';
                return
            }

            // let userName = localStorage.getItem("ms_username");
            let userName = 'SuperAdmin';//直接用cms逻辑 
            //请求接口
            this.$axios({
                method: 'post',
                url: `/api/AlarmStatistics/SearchAlarm?StartTime=${this.value1}&EndTime=${this.value2}&argUserAccount=${userName}`
            })
                .then(res => {
                    console.log("res", res)
                    this.try = 2;
                    if (res.data.code == 0) {
                        if (res.data.data.length === 0) {
                            this.tipchange1 = true;
                            setTimeout(() => {
                                $('.tip').css({

                                    left: `calc(50% - ${($('.tip').width() / 2) * this.a1}px)`,
                                    top: `calc(50% - ${($('.tip').height() / 2) * this.a1}px)`
                                })
                                this.move('tip', 'tiptop')
                            })
                            this.w = '无报警记录！';
                            // this.w = res.data.msg
                            return
                        }


                        this.ddddssss = res.data.data;
                        this.$nextTick(function () {
                            this.intgraph(this.ddddssss);
                        });
                    } else {

                        this.tipchange1 = true;
                        setTimeout(() => {
                            $('.tip').css({

                                left: `calc(50% - ${($('.tip').width() / 2) * this.a1}px)`,
                                top: `calc(50% - ${($('.tip').height() / 2) * this.a1}px)`
                            })
                            this.move('tip', 'tiptop')
                        })
                        this.w = res.data.msg
                    }
                })
        },
        sx() {
            let that = this
            setTimeout(() => {
                for (let i = 0; i < $('.el-picker-panel').length; i++) {
                    $('.el-picker-panel')[i].style.zoom = that.a1
                }
            })

        },
        saveImage(divText, imgText) {

            let canvasID = this.$refs[divText];
            let that = this;
            let a = document.createElement('a');
            html2canvas(canvasID).then(canvas => {
                let dom = document.body.appendChild(canvas);
                dom.style.display = 'none';
                a.style.display = 'none';
                document.body.removeChild(dom);
                let blob = that.dataURLToBlob(dom.toDataURL('image/jpg'));
                a.setAttribute('href', URL.createObjectURL(blob));
                //这块是保存图片操作  可以设置保存的图片的信息
                a.setAttribute('download', imgText + '.jpg');
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(blob);
                document.body.removeChild(a);
            });
        },
        initgraphsubchart(obj, ids) {

            if (document.getElementById('tabledata') != null) {
                document.getElementById('tabledata').style.display == 'none';
            }
            if (document.getElementById('tablebox') !== null) {

                document.getElementById('tablebox').parentNode.removeChild(document.getElementById('tablebox'))

            }
            let arrname = new Array();
            arrname.push(this.ZHObj.subtablecell0);
            for (let i = 0; i < obj.length; i++) {
                let j = i + 1;
                arrname.push(obj[i][0]);
            }

            let table = document.createElement('table');
            table.id = ids;
            table.classList.add('tableclass');
            let thead = document.createElement('thead');
            //创建tr,td项
            let tr = document.createElement('tr');
            //创建文档片段
            for (let i = 0; i < arrname.length; i++) {
                let td = document.createElement('th');
                td.innerHTML = arrname[i];
                tr.appendChild(td);
            }

            thead.appendChild(tr);
            table.appendChild(thead);
            let div = document.createElement('div');
            div.id = 'tablebox';
            div.appendChild(table);
            document.getElementsByClassName('tabledata')[0].appendChild(div);

            //   div.appendChild(document.getElementsByClassName('tabledata')[0]);
            //tabel赋样式
            table.style.width = '100%';
            table.style.border = '1px solid #000000';
            // table.style.height = '300px';
            // table.style.border = '1pt solid #000000';
            //for (let i = 0; i < json.length; i++) {
            //    let newRow = table.insertRow();
            //    let newcellname = newRow.insertCell(0);
            //    newcellname.innerHTML = json[i].name;
            //    let newcellname = newRow.insertCell(1);
            //    newcellname.innerHTML = json[i].age;
            //    let newcellname = newRow.insertCell(2);
            //    newcellname.innerHTML = json[i].sal
            //}

            //插入第一行
            let tbody = document.createElement('tbody');
            let newRow = tbody.insertRow();
            let newcellname = newRow.insertCell(0);
            newcellname.innerHTML = this.ZHObj.tablecell1;
            newcellname.style.backgroundColor = '#c7d5e8';
            console.log(obj)
            for (let j = 1; j < obj.length + 1; j++) {
                let newcellname = newRow.insertCell(j);
                newcellname.innerHTML = obj[j - 1][1];
            }
            table.appendChild(tbody);
            newRow = tbody.insertRow();
            newcellname = newRow.insertCell(0);
            newcellname.innerHTML = this.ZHObj.tablecell2;
            newcellname.style.backgroundColor = '#c7d5e8';
            for (let j = 1; j < obj.length + 1; j++) {
                let newcellname = newRow.insertCell(j);
                newcellname.innerHTML = parseFloat(obj[j - 1][2]);
            }
            table.appendChild(tbody);
            newRow = tbody.insertRow();
            newcellname = newRow.insertCell(0);
            newcellname.innerHTML = this.ZHObj.tablecell3;
            newcellname.style.backgroundColor = '#c7d5e8';
            for (let j = 1; j < obj.length + 1; j++) {
                let newcellname = newRow.insertCell(j);
                newcellname.innerHTML = parseFloat(obj[j - 1][3]);
            }
            table.appendChild(tbody);
        },

        initgraphchart(obj, ids) {

            let arrname = new Array();
            arrname.push(this.ZHObj.tablecell0);
            for (let i = 0; i < obj.length; i++) {
                let j = i + 1;
                arrname.push(obj[i].Name);
            }

            // if (document.getElementById(ids) != null) {
            //     document.body.removeChild(document.getElementById(ids));
            // }

            let table = document.createElement('table');
            table.id = ids;
            //创建tr,td项
            let tr = document.createElement('tr');
            //创建文档片段
            for (let i = 0; i < arrname.length; i++) {
                let td = document.createElement('th');
                td.innerHTML = arrname[i];
                tr.appendChild(td);
            }
            table.appendChild(tr);
            document.getElementsByClassName('tabledata')[0].appendChild(table);

            //tabel赋样式
            table.style.width = '100%';
            table.style.height = '300px';
            table.style.border = '1px solid #ededed';

            //插入第一行
            let newRow = table.insertRow();
            let newcellname = newRow.insertCell(0);
            newcellname.innerHTML = this.ZHObj.tablecell1;

            newcellname.style.backgroundColor = '#c7d5e8';
            for (let j = 1; j < obj.length + 1; j++) {
                let newcellname = newRow.insertCell(j);
                newcellname.innerHTML = obj[j - 1].Con;
            }
            newRow = table.insertRow();
            newcellname = newRow.insertCell(0);
            newcellname.innerHTML = this.ZHObj.tablecell2;
            newcellname.style.backgroundColor = '#c7d5e8';
            for (let j = 1; j < obj.length + 1; j++) {
                let newcellname = newRow.insertCell(j);
                newcellname.innerHTML = (
                    parseFloat(obj[j - 1].Per) * 100
                ).toFixed(1);
            }
            newRow = table.insertRow();
            newcellname = newRow.insertCell(0);
            newcellname.innerHTML = this.ZHObj.tablecell3;
            newcellname.style.backgroundColor = '#c7d5e8';
            for (let j = 1; j < obj.length + 1; j++) {
                let newcellname = newRow.insertCell(j);
                newcellname.innerHTML = (
                    parseFloat(obj[j - 1].SumPer) * 100
                ).toFixed(1);
            }

        },
        intgraph(secondgraphdata) {
            if (document.getElementById('tabledata') !== null) {
                document.getElementById('tabledata').parentNode.removeChild(document.getElementById('tabledata'))
            }
            if (this.Language == 'English') {
                secondgraphdata = secondgraphdata.replace(/其他/g, 'other');
            }
            document.getElementById('main3').style.display = 'none';
            //document.getElementById("tabletemple").style.display = "none";
            document.getElementById('main').style.display = 'block';

            this.secondgraphobj = secondgraphdata;
            this.Chart1 = this.$echarts.init(document.getElementById('main'));

            let dataAxis = new Array();
            let databar = new Array();
            let dataline = new Array();
            for (let i = 0; i < this.secondgraphobj.length; i++) {
                dataAxis.push(this.secondgraphobj[i].Name);
                databar.push(
                    parseInt(
                        parseFloat(this.secondgraphobj[i].Per) * 100
                    ).toFixed(1)
                );
                dataline.push(
                    parseInt(
                        parseFloat(this.secondgraphobj[i].SumPer) * 100
                    ).toFixed(1)
                );
            }
            let yMax = 100;
            let dataShadow = [];

            for (let i = 0; i < databar.length; i++) {
                dataShadow.push(yMax);
            }

            this.option = {
                color: ['#E60012'],
                title: {
                    text: this.ZHObj.chartitle,
                    textStyle: {
                        color: '#0DB9F2', //颜色
                        fontStyle: 'normal', //风格
                        fontWeight: 'normal', //粗细
                        fontFamily: 'Microsoft yahei', //字体
                        fontSize: 14, //大小
                        align: 'center' //水平对齐
                    },
                    left: 'center'
                },
                xAxis: {
                    data: dataAxis,
                    axisLabel: {
                        inside: false,
                        textStyle: {
                            color: '#0DB9F2'
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisLine: {
                        show: false
                    },
                    z: 10
                },
                yAxis: {
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#ccc'
                        }
                    },
                    axisLabel: {
                        color: '#999',
                    }
                },
                dataZoom: [
                    {
                        type: 'inside'
                    }
                ],
                series: [
                    {
                        // For shadow
                        type: 'bar',
                        itemStyle: {
                            normal: { color: 'rgba(0,0,0,0.05)' }
                        },
                        barGap: '-100%',
                        barCategoryGap: '40%',
                        data: dataShadow,
                        animation: false
                    },
                    {
                        type: 'bar',
                        showBackground: true,
                        itemStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        { offset: 0, color: '#83bff6' },
                                        { offset: 0.5, color: '#188df0' },
                                        { offset: 1, color: '#188df0' }
                                    ]
                                )
                            },
                            emphasis: {
                                color: new echarts.graphic.LinearGradient(
                                    0,
                                    0,
                                    0,
                                    1,
                                    [
                                        { offset: 0, color: '#2378f7' },
                                        { offset: 0.7, color: '#2378f7' },
                                        { offset: 1, color: '#83bff6' }
                                    ]
                                )
                            }
                        },
                        data: databar
                    },
                    {
                        type: 'line',
                        data: dataline
                    }
                ]
            };

            this.Chart1.setOption(this.option);
            // // Enable data zoom when user click bar.
            let zoomSize = 6;
            this.Chart1.on('click', params => {

                this.ri = 2;
                document.getElementById('main1').style.display = 'block';
                document.getElementById('main').style.display = 'none';
                for (let j = 0; j < this.secondgraphobj.length; j++) {
                    if (params.name == this.secondgraphobj[j].Name) {
                        //第二张表为空时创建
                        this.subChardata = new Array();
                        let dataAxis1 = new Array();
                        let databar1 = new Array();
                        let dataline1 = new Array();

                        let sum = 0;
                        let sumper1 = 0;
                        for (
                            let jj = 0;
                            jj < this.secondgraphobj[j].Children.length;
                            jj++
                        ) {
                            sum =
                                sum +
                                parseFloat(
                                    this.secondgraphobj[j].Children[jj].Con
                                );
                        }

                        //对子项进行统计
                        for (
                            let i = 0;
                            i < this.secondgraphobj[j].Children.length;
                            i++
                        ) {
                            if (
                                parseFloat(
                                    this.secondgraphobj[j].Children[i].Con
                                ) > 0
                            ) {

                                dataAxis1.push(this.secondgraphobj[j].Children[i].Name);
                                let per1 = (parseFloat(this.secondgraphobj[j].Children[i].Con) / sum) * 100;
                                sumper1 = sumper1 + per1;
                                databar1.push(per1);
                                dataline1.push(sumper1);
                                console.log("this.secondgraphobj", this.secondgraphobj[j].Children[i].Con)
                                console.log("per1", per1)
                                console.log("sum", sum)
                                console.log("sumper1", sumper1)
                                this.subChardata.push([
                                    this.secondgraphobj[j].Children[i].Name,
                                    parseFloat(
                                        this.secondgraphobj[j].Children[i].Con
                                    ),
                                    per1.toFixed(1),
                                    sumper1.toFixed(1)
                                ]);
                            }
                        }

                        let yMax = 100;
                        let dataShadow = [];

                        for (let i = 0; i < databar.length; i++) {
                            dataShadow.push(yMax);
                        }

                        this.option2 = {
                            color: ['#E60012'],
                            title: {
                                text: this.ZHObj.subcharttitle,
                                textStyle: {
                                    color: '#0DB9F2', //颜色
                                    fontStyle: 'normal', //风格
                                    fontWeight: 'normal', //粗细
                                    fontFamily: 'Microsoft yahei', //字体
                                    fontSize: 14, //大小
                                    align: 'center' //水平对齐
                                },
                                left: 'center'
                            },
                            xAxis: {
                                data: dataAxis1,
                                axisLabel: {
                                    inside: false,
                                    textStyle: {
                                        color: '#0DB9F2'
                                    }
                                },
                                axisTick: {
                                    show: false
                                },
                                axisLine: {
                                    show: false
                                },
                                z: 10
                            },
                            yAxis: {
                                axisLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: '#ccc'
                                    }
                                },
                                axisLabel: {
                                    color: '#999',
                                }
                            },
                            dataZoom: [
                                {
                                    type: 'inside'
                                }
                            ],
                            series: [
                                {
                                    // For shadow
                                    type: 'bar',
                                    itemStyle: {
                                        normal: { color: 'rgba(0,0,0,0.05)' }
                                    },
                                    barGap: '-100%',
                                    barCategoryGap: '40%',
                                    data: dataShadow,
                                    animation: false
                                },
                                {
                                    type: 'bar',
                                    showBackground: true,
                                    itemStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#83bff6'
                                                },
                                                {
                                                    offset: 0.5,
                                                    color: '#188df0'
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#188df0'
                                                }
                                            ]
                                            )
                                        },
                                        emphasis: {
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                                {
                                                    offset: 0,
                                                    color: '#2378f7'
                                                },
                                                {
                                                    offset: 0.7,
                                                    color: '#2378f7'
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#83bff6'
                                                }
                                            ]
                                            )
                                        }
                                    },
                                    data: databar1
                                },
                                {
                                    type: 'line',
                                    data: dataline1
                                }
                            ]
                        };
                        console.log(" this.subChardata", this.subChardata)
                        if (!this.Chart2) {
                            //初始化子图
                            // alert("s")
                            this.Chart2 = this.$echarts.init(
                                document.getElementById('main1')
                            );
                            this.Chart2.setOption(this.option2);
                            //初始化子表
                            document.getElementById('tabledata').style.display =
                                'none';
                            this.initgraphsubchart(
                                this.subChardata,
                                'subtabledata'
                            );
                            document.getElementById(
                                'subtabledata'
                            ).style.display = 'table';
                            document.getElementById(
                                'subtabledata'
                            ).style.width = '100%';
                            document.getElementById(
                                'subtabledata'
                            ).style.height = '300px';
                            //隐藏c#端的控件
                        } else {

                            this.Chart2.setOption(this.option2);
                            //初始化子表
                            document.getElementById('tabledata').style.display =
                                'none';
                            document.getElementById('subtabledata').remove();
                            this.initgraphsubchart(
                                this.subChardata,
                                'subtabledata'
                            );
                            document.getElementById(
                                'subtabledata'
                            ).style.display = 'table';
                            document.getElementById(
                                'subtabledata'
                            ).style.width = '100%';
                            document.getElementById(
                                'subtabledata'
                            ).style.height = '300px';
                        }
                    }
                }

                //Chart1.dispatchAction({
                //    type: 'dataZoom',
                //    startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
                //    endValue: dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
                //});
            });

            this.initgraphchart(this.secondgraphobj, 'tabledata');


        }
    },


};
</script>
<style lang="less">
.tapwater {
    .btn-style1 {
        padding: 4px 0;

        img {
            vertical-align: middle;
            margin-right: 5px;

        }
    }

    .el-input--small .el-input__inner {
        padding-left: 30px;
        box-sizing: border-box;
    }

    table {
        border-spacing: 0;

        th {
            border: 1px solid #ededed;
            background-color: #f0ffff;
        }

        td {
            border: 1px solid #ededed;
            text-align: center;
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
            border: 1px solid #ededed;
        }
    }
}

.sum {
    margin-top: 5px;
    color: #9d9d9d;
}

.fll {
    float: left;
    margin-right: 10px;
}

.fr {
    height: 100%;
    float: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
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
            color: #ededed;
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