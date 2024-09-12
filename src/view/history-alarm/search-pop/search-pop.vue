<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
    <div ref="reservoirArea" class="task-list">
        <div v-drag1 class="scPopBox_c" ref="tablePopC">
            <div class="head">
                故障检索
                <div class="headImg" @click="cancelFun()">
                    <i class="el-icon-close"></i>
                </div>
            </div>
            <div class="tablepopCenten_searchbox" v-stopdrag ref="popCentenBox">

                <div class="search-list">
                    <el-input class="search-input" v-model="keyword" placeholder="请输入关键字"></el-input>
                    <el-input class="search-input" v-model="AlarmMsg" placeholder="请输入故障描述"></el-input>
                    <div class="search-btn" @click="getsestion(1)"> 查询</div>
                </div>
                <div class="table-box">
                    <el-table height="100%" :data="tableData" style="width: 100%;height:100%;border: 1px solid #EAEAEA;"
                        :header-cell-style="{
                            height: '40px',
                            border: '1px solid #EAEAEA'
                        }">
                        <el-table-column prop="AlarmSource" :show-overflow-tooltip="true" label="报警源">
                        </el-table-column>
                        <el-table-column prop="AlarmTime" :show-overflow-tooltip="true" label="报警时间">
                        </el-table-column>
                        <el-table-column prop="KeyWord" :show-overflow-tooltip="true" label="关键字">
                        </el-table-column>
                        <el-table-column prop="AlarmType" :show-overflow-tooltip="true" label="报警类别">
                        </el-table-column>
                        <el-table-column prop="AlarmMsg" :show-overflow-tooltip="true" label="故障描述">
                            <template slot-scope="scope">
                                <a href="javascript:void(0);" @click="getdata(scope.row)">{{ scope.row.AlarmMsg }}</a>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Reason" :show-overflow-tooltip="true" label="故障原因">
                        </el-table-column>
                        <!-- <el-table-column prop="AddPerson" :show-overflow-tooltip="true" label="用户">
                        </el-table-column>
                        <el-table-column prop="DealPerson" :show-overflow-tooltip="true" label="处理人">
                        </el-table-column>
                        <el-table-column prop="AddTime" :show-overflow-tooltip="true" label="恢复时间">
                        </el-table-column>
                        <el-table-column prop="FaultTreatment" :show-overflow-tooltip="true" label="故障处理方法">
                        </el-table-column> -->
                    </el-table>
                </div>
                <div class="my-page">
                    <my-page :pageData="pageData" @req="req"></my-page>
                </div>
            </div>
        </div>
    </div>
</template>
    
<script>
import "./search-pop.less";
import MyPage from './Pages1.vue';
export default {
    components: {
        MyPage,
    },
    data() {
        return {
            pageData: {
                PageSize: 50,
                TotalCount: 0,
                TotalPage: 0,
                PageIndex: 1,
                LastEnabled: false,
                NextEnabled: false,
            },
            tableData: [],
            keyword: '',
            AlarmMsg: '',
        };
    },
    props: ['editItem'],
    mounted() {
        console.log("editItem", this.editItem);
        this.AlarmMsg = this.editItem.AlarmMsg || '';
        this.getsestion(1);

    },
    methods: {
        getdata(a) {
            this.$parent.editItemFn(a);
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
            this.getsestion(pageIndex);
        },
        //获取故障检索信息
        getsestion(pageIndex) {
            this.$axios
                .post(
                    `/api/AlarmRecord/AlarmRecord_GstFaultRetrieva?argKeyword=${this.keyword}&argPageSize=${this.pageData.PageSize}&argPageIndex=${pageIndex}&argDescribe=${this.AlarmMsg}`
                )
                .then((res) => {
                    console.log(res);
                    this.pageData = res.data.data.ParameterList;
                    this.tableData = res.data.data.DataList;
                });
        },
        getNowTime() {
            let date = new Date();
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? '0' + MM : MM;
            let d = date.getDate();
            d = d < 10 ? '0' + d : d;
            let h = date.getHours();
            h = h < 10 ? '0' + h : h;
            let m = date.getMinutes();
            m = m < 10 ? '0' + m : m;
            let s = date.getSeconds();
            s = s < 10 ? '0' + s : s;
            return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
        },
        //关闭
        cancelFun() {
            this.$parent.closeSearchItemFn();
        },
        //save
        conserve() {

        },

    },
};
</script>
<style lang="less">
.task-list {
    .el-radio__input.is-checked .el-radio__inner {
        border-color: #3399FF;
        background: #3399FF;
    }

    .el-radio__input.is-checked+.el-radio__label {
        color: #3399FF;
    }

    .el-radio__input {
        float: right;
        margin-left: 5px;
    }
}
</style>
    
  