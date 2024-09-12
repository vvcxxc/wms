<template>
    <div class="kanban-page">
        <div class="pile-top">
            <div class="pile-content-box">
                <div class="kanban-info">
                    <div class="kanban-info-item"> 1#堆垛机状态：<span
                            :class="this.workState1 == '放货完成' ? 'greencolor' : 'yellowcolor'">{{
                                this.workState1
                            }}</span></div>
                    <div class="kanban-info-item">1#堆垛机当前列：{{ this.realnl1 }}</div>
                    <div class="kanban-info-item">1#堆垛机当前层：{{ this.realnc1 }}</div>
                    <div class="kanban-info-item">2#堆垛机状态：<span
                            :class="this.workState2 == '放货完成' ? 'greencolor' : 'yellowcolor'">{{
                                this.workState2
                            }}</span></div>
                    <div class="kanban-info-item">2#堆垛机当前列：{{ this.realnl2 }}</div>
                    <div class="kanban-info-item">2#堆垛机当前层：{{ this.realnc2 }}</div>
                </div>
                <div class="pile-content" v-if="curIdx == 0">
                    <div class="pile-list" v-for="(_) in  maxRowCount">
                        <div class="pile-item" v-for="(_2) in maxColumnCount ">
                            <div class="item-box"></div>
                            <div class="item-box"></div>
                        </div>
                    </div>
                    <div class="line" :style="{
                        width: (this.maxColumnCount + 1 + 1.5) * 60 + 'px',
                        top: this.np1 * 240 - 120 + 'px'
                    }"></div>
                    <div class="car" :style="{
                        'animation-name': 'flyableBox1' + currentStep1,
                        'animation-duration': '0.8s',
                        'animation-iteration-count': 1,
                        left: this.nl1 * 60 - 30 + 'px',
                        top: this.np1 * 240 - 120 + 'px'
                    
                    }"></div>
                    <div class="kutai" :style="{ top: 0 - 10 + 'px' }"></div>
                    <div class="line" :style="{
                        width: (this.maxColumnCount + 1 + 1.5) * 60 + 'px',
                        top: this.np2 * 240 - 120 + 'px'
                    }"></div>
                    <div class="car" :style="{
                        'animation-name': 'flyableBox2' + currentStep2,
                        'animation-duration': '0.8s',
                        'animation-iteration-count': 1,
                        left: this.nl2 * 60 - 30 + 'px',
                        top: this.np2 * 240 - 120 + 'px'
                    
                    }"></div>
                    <div class="kutai" :style="{ top: 240 - 10 + 'px' }"></div>
                </div>
                <div class="pile-content" v-if="curIdx == 1">
                    <div class="Front-padding">
                        <div class="pile-list2" v-for="(_) in maxTierCount">
                            <div class="pile-item" v-for="(_2) in maxColumnCount">
                                <div class="item-box-front"></div>
                            </div>
                        </div>
                        <div class="bar" :style="{
                            'animation-name': 'bar1' + currentStep1,
                            'animation-duration': '0.8s',
                            'animation-iteration-count': 1,
                            height: this.maxTierCount * 60 + 60 + 'px',
                            left: this.nl1 * 60 - 30 + 'px',
                        }"></div>
                        <div class="line-front" :style="{
                            width: (this.maxColumnCount + 1 + 1.5) * 60 + 'px',
                            top: this.maxTierCount * 60 + 125 + 'px',
                        }"></div>
                        <div class="car-front" :style="{
                            'animation-name': 'flyableBox1f' + currentStep1,
                            'animation-duration': '0.8s',
                            'animation-iteration-count': 1,
                            left: this.nl1 * 60 - 30 + 'px',
                            top: (this.maxTierCount - this.nc1 + 1) * 60 - 30 + 100 + 'px'
                        
                        }"></div>
                        <div class="kutai-front" :style="{ top: (this.maxTierCount - 1) * 60 + 120 + 'px' }"></div>
                    </div>
                </div>
                <div class="pile-content" v-if="curIdx == 2">
                    <div class="Front-padding">
                        <div class="pile-list2" v-for="(_) in maxTierCount">
                            <div class="pile-item" v-for="(_2) in maxColumnCount">
                                <div class="item-box-front"></div>
                            </div>
                        </div>
                        <div class="bar" :style="{
                            'animation-name': 'bar2' + currentStep2,
                            'animation-duration': '0.8s',
                            'animation-iteration-count': 1,
                            height: this.maxTierCount * 60 + 60 + 'px',
                            left: this.nl2 * 60 - 30 + 'px',
                        }"></div>
                        <div class="line-front" :style="{
                            width: (this.maxColumnCount + 1 + 1.5) * 60 + 'px',
                            top: this.maxTierCount * 60 + 125 + 'px',
                        }"></div>
                        <div class="car-front" :style="{
                            'animation-name': 'flyableBox2f' + currentStep2,
                            'animation-duration': '0.8s',
                            'animation-iteration-count': 1,
                            left: this.nl2 * 60 - 30 + 'px',
                            top: (this.maxTierCount - this.nc2 + 1) * 60 - 30 + 100 + 'px'
                        }"></div>
                        <div class="kutai-front" :style="{ top: (this.maxTierCount - 1) * 60 + 120 + 'px' }"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="switch-box">
            <div :class="curIdx == 0 ? 'cur-btn' : 'switch-btn'" @click="switchBtn(0)">俯视图</div>
            <div :class="curIdx == 1 ? 'cur-btn' : 'switch-btn'" @click="switchBtn(1)">1#堆垛机</div>
            <div :class="curIdx == 2 ? 'cur-btn' : 'switch-btn'" @click="switchBtn(2)">2#堆垛机</div>
        </div>

    </div>
</template>
<script>
export default {
    data() {
        return {
            l1: 1,
            c1: 1,
            np1: 1,//堆垛机1终点
            nl1: 1,
            realnl1: 1,
            nc1: 1,
            realnc1: 1,
            l2: 1,
            c2: 1,
            np2: 2,//堆垛机2终点
            nl2: 1,
            realnl2: 1,
            nc2: 1,
            realnc2: 1,
            currentStep1: 1,//堆垛机1计数器
            currentStep2: 1,//堆垛机2计数器
            workState1: '',
            workState2: '',
            curIdx: 0,
            maxRowCount: 0,
            maxColumnCount: 0,
            maxTierCount: 0,
            timer: 0,
            idxtimer: 0
        }
    },
    watch: {
        // nl1(nl1) {
        //     if (this.curIdx != 0 && this.curIdx != 1) {
        //         return;
        //     }
        //     let text = `{0% {left: ${this.l1 * 60 - 30}px;}100% {left: ${nl1 * 60 - 30}px;}}`
        //     let style = document.documentElement.appendChild(document.createElement("style"));
        //     if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes flyableBox1${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes bar1${this.currentStep1 + 1} ${text}`, 0);
        //     } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
        //         style.sheet.insertRule(
        //             `@-moz-keyframes flyableBox1${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-moz-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-moz-keyframes bar1${this.currentStep1 + 1} ${text}`, 0);
        //     } else if (CSSRule.KEYFRAMES_RULE) { // W3C
        //         style.sheet.insertRule(
        //             `@keyframes flyableBox1${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@keyframes bar1${this.currentStep1 + 1} ${text}`, 0);
        //     }
        //     this.currentStep1 += 1;
        //     this.l1 = nl1;
        // },
        // nc1(nc1) {
        //     if (this.curIdx != 1) {
        //         return;
        //     }
        //     let text = `{0% {top: ${(this.maxTierCount - this.c1 + 1) * 60 - 30 + 100}px;}100% {top: ${(this.maxTierCount - this.nc1 + 1) * 60 - 30 + 100}px;}}`;
        //     let text2 = `{0% {left: ${this.nl1 * 60 - 30}px;}100% {left: ${this.nl1 * 60 - 30}px;}}`;
        //     let style = document.documentElement.appendChild(document.createElement("style"));
        //     if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes bar1${this.currentStep1 + 1} ${text2}`, 0);
        //     } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
        //         style.sheet.insertRule(
        //             `@-moz-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-moz-keyframes bar1${this.currentStep1 + 1} ${text2}`, 0);
        //     } else if (CSSRule.KEYFRAMES_RULE) { // W3C
        //         style.sheet.insertRule(
        //             `@keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@keyframes bar1${this.currentStep1 + 1} ${text2}`, 0);
        //     }
        //     this.currentStep1 += 1;
        //     this.c1 = nc1;
        // },

        // nl2(nl2) {
        //     if (this.curIdx != 0 && this.curIdx != 2) {
        //         return;
        //     }
        //     let text = `{0% {left: ${this.l2 * 60 - 30}px;}100% {left: ${nl2 * 60 - 30}px;}}`
        //     let style = document.documentElement.appendChild(document.createElement("style"));
        //     if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes flyableBox2${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes bar2${this.currentStep2 + 1} ${text}`, 0);
        //     } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
        //         style.sheet.insertRule(
        //             `@-moz-keyframes flyableBox2${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-moz-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-moz-keyframes bar2${this.currentStep2 + 1} ${text}`, 0);
        //     } else if (CSSRule.KEYFRAMES_RULE) { // W3C
        //         style.sheet.insertRule(
        //             `@keyframes flyableBox2${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@keyframes bar2${this.currentStep2 + 1} ${text}`, 0);
        //     }
        //     this.currentStep2 += 1;
        //     this.l2 = nl2;
        // },
        // nc2(nc2) {
        //     if (this.curIdx != 2) {
        //         return;
        //     }
        //     let text = `{0% {top: ${(this.maxTierCount - this.c2 + 1) * 60 - 30 + 100}px;}100% {top: ${(this.maxTierCount - this.nc2 + 1) * 60 - 30 + 100}px;}}`
        //     let text2 = `{0% {left: ${this.nl2 * 60 - 30}px;}100% {left: ${this.nl2 * 60 - 30}px;}}`;
        //     let style = document.documentElement.appendChild(document.createElement("style"));
        //     if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-webkit-keyframes bar2${this.currentStep2 + 1} ${text2}`, 0);
        //     } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
        //         style.sheet.insertRule(
        //             `@-moz-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@-moz-keyframes bar2${this.currentStep2 + 1} ${text2}`, 0);
        //     } else if (CSSRule.KEYFRAMES_RULE) { // W3C
        //         style.sheet.insertRule(
        //             `@keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
        //         style.sheet.insertRule(
        //             `@keyframes bar2${this.currentStep2 + 1} ${text2}`, 0);
        //     }
        //     this.currentStep2 += 1;
        //     this.c2 = nc2;
        // },
    },
    methods: {
        cnl1() {
            if (this.curIdx != 0 && this.curIdx != 1) {
                return;
            }
            let text = `{0% {left: ${this.l1 * 60 - 30}px;}100% {left: ${this.nl1 * 60 - 30}px;}}`
            let style = document.documentElement.appendChild(document.createElement("style"));
            if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
                style.sheet.insertRule(
                    `@-webkit-keyframes flyableBox1${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-webkit-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-webkit-keyframes bar1${this.currentStep1 + 1} ${text}`, 0);
            } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
                style.sheet.insertRule(
                    `@-moz-keyframes flyableBox1${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-moz-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-moz-keyframes bar1${this.currentStep1 + 1} ${text}`, 0);
            } else if (CSSRule.KEYFRAMES_RULE) { // W3C
                style.sheet.insertRule(
                    `@keyframes flyableBox1${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@keyframes bar1${this.currentStep1 + 1} ${text}`, 0);
            }
            this.currentStep1 += 1;
            this.l1 = this.nl1;
        },
        cnc1() {
            if (this.curIdx != 1) {
                return;
            }
            let text = `{0% {top: ${(this.maxTierCount - this.c1 + 1) * 60 - 30 + 100}px;}100% {top: ${(this.maxTierCount - this.nc1 + 1) * 60 - 30 + 100}px;}}`;
            let text2 = `{0% {left: ${this.nl1 * 60 - 30}px;}100% {left: ${this.nl1 * 60 - 30}px;}}`;
            let style = document.documentElement.appendChild(document.createElement("style"));
            if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
                style.sheet.insertRule(
                    `@-webkit-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-webkit-keyframes bar1${this.currentStep1 + 1} ${text2}`, 0);
            } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
                style.sheet.insertRule(
                    `@-moz-keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-moz-keyframes bar1${this.currentStep1 + 1} ${text2}`, 0);
            } else if (CSSRule.KEYFRAMES_RULE) { // W3C
                style.sheet.insertRule(
                    `@keyframes flyableBox1f${this.currentStep1 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@keyframes bar1${this.currentStep1 + 1} ${text2}`, 0);
            }
            this.currentStep1 += 1;
            this.c1 = this.nc1;
        },

        cnl2() {
            if (this.curIdx != 0 && this.curIdx != 2) {
                return;
            }
            let text = `{0% {left: ${this.l2 * 60 - 30}px;}100% {left: ${this.nl2 * 60 - 30}px;}}`
            let style = document.documentElement.appendChild(document.createElement("style"));
            if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
                style.sheet.insertRule(
                    `@-webkit-keyframes flyableBox2${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-webkit-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-webkit-keyframes bar2${this.currentStep2 + 1} ${text}`, 0);
            } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
                style.sheet.insertRule(
                    `@-moz-keyframes flyableBox2${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-moz-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-moz-keyframes bar2${this.currentStep2 + 1} ${text}`, 0);
            } else if (CSSRule.KEYFRAMES_RULE) { // W3C
                style.sheet.insertRule(
                    `@keyframes flyableBox2${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@keyframes bar2${this.currentStep2 + 1} ${text}`, 0);
            }
            this.currentStep2 += 1;
            this.l2 = this.nl2;
        },
        cnc2() {
            if (this.curIdx != 2) {
                return;
            }
            let text = `{0% {top: ${(this.maxTierCount - this.c2 + 1) * 60 - 30 + 100}px;}100% {top: ${(this.maxTierCount - this.nc2 + 1) * 60 - 30 + 100}px;}}`
            let text2 = `{0% {left: ${this.nl2 * 60 - 30}px;}100% {left: ${this.nl2 * 60 - 30}px;}}`;
            let style = document.documentElement.appendChild(document.createElement("style"));
            if (CSSRule.WEBKIT_KEYFRAMES_RULE) { // WebKit
                style.sheet.insertRule(
                    `@-webkit-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-webkit-keyframes bar2${this.currentStep2 + 1} ${text2}`, 0);
            } else if (CSSRule.MOZ_KEYFRAMES_RULE) { // Mozilla
                style.sheet.insertRule(
                    `@-moz-keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@-moz-keyframes bar2${this.currentStep2 + 1} ${text2}`, 0);
            } else if (CSSRule.KEYFRAMES_RULE) { // W3C
                style.sheet.insertRule(
                    `@keyframes flyableBox2f${this.currentStep2 + 1} ${text}`, 0);
                style.sheet.insertRule(
                    `@keyframes bar2${this.currentStep2 + 1} ${text2}`, 0);
            }
            this.currentStep2 += 1;
            this.c2 = this.nc2;
        },
        switchBtn(type) {
            this.curIdx = type;
        },
        isPowerOfTwo(n) {
            if (n == 0)
                return false;
            else {
                while (n != 1) {
                    if (n % 2 == 0)
                        n = n / 2;
                    else
                        return false;
                }
            }
            return true;
        },
        stackerStatus() {
            this.$axios({
                method: 'get',
                url: `/open/wcs/stacker-status`,
            }).then(res => {
                if (res.data.type == 1) {
                    const {
                        workState1,
                        column1,//列真实值
                        tier1,
                        workState2,
                        column2, //列真实值
                        tier2,
                        relativeColumn1, //列定位值
                        relativeColumn2, //列定位值
                        relativeTier1,
                        relativeTier2
                    } = JSON.parse(res.data.resultdata);
                    this.np1 = 1
                    this.nl1 = relativeColumn1;
                    this.realnl1 = column1;
                    this.nc1 = relativeTier1;
                    this.realnc1 = tier1;
                    this.workState1 = this.workState(workState1);
                    this.np2 = 2;
                    this.nl2 = relativeColumn2;
                    this.realnl2 = column2;
                    this.nc2 = relativeTier2;
                    this.realnc2 = tier2;
                    this.workState2 = this.workState(workState2);
                    this.cnc1();
                    this.cnc2();
                    this.cnl1();
                    this.cnl2();

                }
            })
        },
        workState(state) {
            let str = '';
            switch (state) {
                case 0:
                    str = '待机';
                    break;
                case 1:
                    str = '动作中';
                    break;
                case 3:
                    str = '放货完成';
                    break;
                case 7:
                    str = '召回中';
                    break;
                case 8:
                    str = '急停';
                    break;
                case 9:
                    str = '脱机';
                    break;
                case 10:
                    str = '待机有货';
                    break;
            }
            return str
        },

        changeIdx() {
            clearTimeout(this.idxtimer)
            if (this.curIdx == 0) {
                this.curIdx = 1
            } else if (this.curIdx == 1) {
                this.curIdx = 2
            } else {
                this.curIdx = 0
            }
            this.idxtimer = setTimeout(() => {
                this.changeIdx()
            }, 10000);
        }
    },
    mounted() {
        // /api/wms/location/options
        this.$axios({
            method: 'get',
            url: `/api/wms/location/options`,
        }).then(res => {
            if (res.data.type == 1) {
                let data = JSON.parse(res.data.resultdata);
                this.maxRowCount = Math.ceil(data.maxRowCount / 2);//排
                this.maxColumnCount = data.maxColumnCount;//列
                this.maxTierCount = data.maxTierCount;//层
            }
        })

        this.timer = setInterval(() => {
            this.stackerStatus()

        }, 1000)
        this.idxtimer = setTimeout(() => {
            this.changeIdx()
        }, 10000);
    },
    beforeDestroy() {
        clearTimeout(this.timer)

    },
    destroyed() {
        clearTimeout(this.timer)
    },
}
</script>


<style scoped lang="less">
.kanban-page {
    width: 100%;
    height: 100%;


    .pile-top {
        width: 100%;
        height: calc(100% - 80px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 40px;
        box-sizing: border-box;
    }

    .pile-content-box {
        width: fit-content;
        height: auto;
        position: relative;
        padding-left: 130px;
        padding-top: 50px;
        box-sizing: border-box;
        background: #0F1327;

        .kanban-info {
            width: 190px;
            height: auto;
            position: absolute;
            right: 10px;
            top: 110px;
            z-index: 10;

            .kanban-info-item {
                margin-bottom: 44px;
                color: #C0C0C0;
                text-align: left;

                .greencolor {
                    color: #54C835;
                }

                .yellowcolor {
                    color: #FF9F07;
                }
            }
        }
    }

    .pile-content {
        width: 700px;
        height: 550px;
        box-sizing: border-box;
        position: relative;

        .Front-padding {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            position: relative;
            padding-top: 100px;
        }

        .kutai {
            width: 94px;
            height: 80px;
            background: url('../../assets/img/kutai.png');
            background-size: cover;
            position: absolute;
            left: -110px;
        }

        .kutai-front {
            width: 94px;
            height: 40px;
            background: url('../../assets/img/kutai_zheng.png');
            background-size: cover;
            position: absolute;
            left: -110px;
        }

        .pile-list,
        .pile-list2 {
            width: 100%;
            height: 240px;
            display: flex;

            .pile-item {
                display: flex;
                flex-direction: column;
                justify-content: space-between;

                .item-box,
                .item-box-front {
                    width: 60px;
                    height: 60px;
                    box-sizing: border-box;
                    padding: 2px;
                    background: url('../../assets/img/kuwei.png');
                    background-size: cover;

                }

                .item-box-front {
                    background: url('../../assets/img/kuwei_zheng.png');

                }
            }
        }

        .pile-list2 {
            height: auto;
        }

        .line,
        .line-front {
            position: absolute;
            transform: translate(0, -50%);
            left: -110px;
            width: 100%;
            height: 16px;
            background: #888888;
        }

        .line-front {
            background: url('../../assets/img/guidao_zheng.png');
            background-size: 100% 100%;
        }

        .bar {
            position: absolute;
            transform: translate(-50%, calc(-100% - -35px));
            width: 130px;
            background: #fff;
            background: url('../../assets/img/lizhu_zheng.png');
            background-size: 100% 100%;
            z-index: 2;
        }

        .car {
            position: absolute;
            transform: translate(-50%, -50%);
            width: 170px;
            height: 60px;
            background: url('../../assets/img/duiduoji.png');
            background-size: cover;
        }

        .car-front {
            position: absolute;
            transform: translate(-50%, -50%);
            width: 70px;
            height: 50px;
            background: url('../../assets/img/huakuai_zheng.png');
            background-size: cover;
            z-index: 3;
        }

    }

    .switch-box {
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;

        .switch-btn,
        .cur-btn {
            height: 32px;
            width: 106px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background: url('../../assets/img/btn_decoration.png');
            background-size: 100% 100%;
            background-color: #5D749A;
            margin-right: 20px;
            cursor: pointer;
        }

        .cur-btn {
            background-color: #298EFB;
        }

        input {
            width: 50px;
            height: 30px;
        }
    }

}
</style>
