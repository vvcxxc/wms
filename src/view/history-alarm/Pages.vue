<!--
 * @Description: 分页组件
 * @Date: 2019-11-24 14:57:49
 * @Author: 随风
 * @LastEditors: 随风
 * @LastEditTime: 2019-11-27 15:55:08
 -->
<template>
    <section class="page-container" :style="{ zoom: a }">
        <div class="page">
            <div class="left">
                总共{{ pageData.TotalCount
                }}页，当前第{{ pageData.PageIndex
                }}页,
                总共{{ pageData.TotalPage
                }}条记录，每页{{ pageData.PageSize
                }}条
            </div>
            <div class="right" :style="{ height: 30 * a + 'px' }">
                <span class="btn" @click="jump('first')">首页</span>
                <span class="btn" @click="jump('prev')" :class="{ nopage: !pageData.LastEnabled }">上一页</span>
                <span class="btn" @click="jump('next')" :class="{ nopage: !pageData.NextEnabled }">下一页</span>
                <span class="btn" @click="jump('last')">末页</span>
                <span>第</span>
                <div class="input">
                    <el-input class="pages" v-model="targetPage"></el-input>
                </div>
                <span class="mright">页</span>
                <span class="btn jump" @click="jump('jump')">跳转</span>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    props: ['pageData'],
    watch: {
        pageData(val) {
            if (val.PageIndex) {
                this.targetPage = this.pageData.PageIndex;
            }
        },
    },
    data() {
        return {
            a: 1,
            targetPage: 1,
        };
    },
    created() {
         this.targetPage = this.pageData.PageIndex;
    },
    mounted() {
        this.a = Number(parseFloat(window.screen.width / 1920).toFixed(2));
        if (this.a < 1) {
            this.a = 0.8;
        }
        //      $('.page-container').css({
        //       zoom:(a-0.09)
        //   })
    },
    isPositiveInteger(s) {
        //是否为正整数
        var re = /^[0-9]+$/;
        return re.test(s);
    },
    methods: {
    
        jump(flag) {
            if (flag === 'first') {
                if (this.targetPage == 1) {
                    return;
                }
                this.targetPage = 1;
                this.$emit('req', this.targetPage, flag);
                return;
            }
            if (flag === 'last') {
                console.log('this.pageData.', this.pageData);
                console.log(this.targetPage);
                if (this.targetPage == this.pageData.TotalPage) {
                    return;
                }
                this.targetPage = this.pageData.TotalPage;
                this.$emit('req', this.targetPage, flag);
                return;
            }
            if (flag === 'prev') {
                console.log(this.targetPage);
                if (this.targetPage <= 1) {
                    return;
                }
                if (this.pageData.PageIndex == 1) {
                    this.targetPage = this.pageData.PageIndex;
                } else {
                    this.targetPage = --this.pageData.PageIndex;
                }

                this.$emit('req', this.targetPage, flag);
                return;
            }
            if (flag === 'next') {
                console.log(this.targetPage <= 1);
                if (
                    this.targetPage < 1 ||
                    this.targetPage >= this.pageData.TotalPage
                ) {
                    return;
                }
                if (this.pageData.PageIndex == this.pageData.TotalPage) {
                    this.targetPage = this.pageData.PageIndex;
                } else {
                    this.targetPage = ++this.pageData.PageIndex;
                }

                this.$emit('req', this.targetPage, flag);
                return;
            }
            // this.handlePage();
            // if (this.targetPage == this.pageData.PageIndex) {
            // 	return;
            // }
            this.$emit('req', this.targetPage, flag);
        },
        handlePage() {
            if (
                this.targetPage === '' ||
                !/^\d+$/.test(this.targetPage) ||
                this.targetPage == 0
            ) {
                this.targetPage = this.pageData.PageIndex;
                return;
            }
            if (this.targetPage > this.pageData.TotalPage) {
                if (this.pageData.TotalPage == 0) {
                    this.targetPage = 1;
                    return;
                }
                this.targetPage = this.pageData.TotalPage;
            }
        },
    },
};
</script>

<style lang='less' scoped>
.page-container {
    height: 100%;
    width: 100%;
    position: relative;
    // justify-content: space-between;
    color: #888;
    padding: 0 10px;
    box-sizing: border-box;
    // box-sizing: border-box;
}

.left {

    float: left;
    color: #333333;
}

.right {
    float: right;

    .input {
        margin: 0 10px;
        margin-right: 0px;
    }

    input {
        display: inline-block;
    }

    .btn {
        justify-content: center;
        // width: 80px;
        // height: 28px;
        background-color: #fff;
        border-radius: 4px;
        border: solid 2px #EEEEEE;
        // line-height: 28px;
        // text-align: center;
        padding: 3px 8px;
        color: #fda100;
        margin-right: 10px;
        // display: inline-block;
        cursor: pointer;
        box-sizing: content-box;
    }

    .jump {
        margin-right: 0;
    }
}

.mright {
    margin-right: 10px;
}

.input {
    width: 66px !important;
    display: inline-block;
}

.page {
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: #ababab;
    font-size: 14px;
    overflow: hidden;
}

.nopage {
    border: 2px solid #EEEEEE !important;
    color: #F8CA7A !important;
    // display: inline-block;
}
</style>
