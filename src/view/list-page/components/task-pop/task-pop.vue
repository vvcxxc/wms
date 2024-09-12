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
                {{ taskListPopType == '1001' || taskListPopType == '1003' ? '新增' : '编辑' }}
                <div class="headImg" @click="cancelFun()">
                    <i class="el-icon-close"></i>
                </div>
            </div>
            <div class="tablepopCenten_box reservoirArea-table" v-stopdrag ref="popCentenBox">

                <div class="input_box">
                    <div class="input_key"><span class="red-icon">*</span>夹具编号：</div>
                    <div class="plc">
                        <el-input v-model="code" />
                    </div>
                </div>
                <div class="input_box" v-if="taskListPopType == '1001' || taskListPopType == '1002'">
                    <div class="input_key">所属巷道：</div>
                    <div class="plc">
                        <el-select v-model="laneway" value-key="ID">
                            <el-option v-for="item in tunnelList" :key="item.Value" :value="item.ID"
                                :label="item.Value">

                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div class="input_box">
                    <div class="input_key">执行方式：</div>
                    <div class="plc">
                        <el-select v-model="execution" value-key="ID">
                            <el-option v-for="item in executeList" :key="item.Value" :value="item.ID"
                                :label="item.Value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key"><span class="red">*</span>夹具名称：</div>
                    <div class="plc">
                        <el-input v-model="name" disabled />
                    </div>
                    <div class="check_btn" @click="checkCode">检查夹具</div>
                </div>


            </div>
            <div class="fool_btn">

                <el-button @click="cancelFun()" class="btn-style22 btn-close auto ">取消</el-button>
                <el-button @click="conserve()" class="btn-style21 auto">保存</el-button>
            </div>
        </div>
    </div>
</template>
    
<script>
import "./task-pop.less";
import { GetSelectTion, CheckEquipmentCode, CreateInbound, UpdateInbound, CreateOutbound, UpdateOutbound } from "@/api/home.js";
export default {
    data() {
        return {
            code: '',
            laneway: '',
            execution: '',
            name: '',
            tunnelList: [],
            executeList: [],
            id: ''
        };
    },
    props: ['taskListPopType', 'tableDataArr'],
    mounted() {
        console.log("tableDataArr", this.tableDataArr)

        GetSelectTion('tunnel').then(res => {
            this.tunnelList = JSON.parse(res.data.resultdata);
            if (this.taskListPopType == '1002') {
                this.laneway = String(this.tableDataArr[0].tunnelID);

            }
        })

        GetSelectTion('execute_type').then(res => {
            this.executeList = JSON.parse(res.data.resultdata);
            if (this.taskListPopType == '1002' || this.taskListPopType == '1004') {
                this.execution = String(this.tableDataArr[0].executeType);
            }
        })
        if (this.taskListPopType == '1002' || this.taskListPopType == '1004') {
            this.code = this.tableDataArr[0].equipmentNo;
            this.name = this.tableDataArr[0].fixtureDescription;
            this.id = this.tableDataArr[0].id
        }
    },
    methods: {

        //关闭
        cancelFun() {
            this.$parent.closeTaskListPop();
        },
        //save
        conserve() {
            if (!this.code) {
                this.$parent.showTips('7', '请输入夹具编号');
                return
            }
            if (!this.name) {
                this.$parent.showTips('7', '请检查夹具');
                return
            }
            if (this.taskListPopType == '1001') {
                CreateInbound({
                    equipmentNo: this.code,
                    tunnel: this.laneway,
                    executeType: this.execution

                }).then((res) => {
                    if (res.data.type != 1) {
                        this.$parent.showTips('7', res.data.message);
                        return
                    }
                    this.$parent.showTips('7', '新建成功');
                    this.cancelFun()
                })
            } else if (this.taskListPopType == '1002') {
                UpdateInbound({
                    id: this.id,
                    equipmentNo: this.code,
                    tunnel: this.laneway,
                    executeType: this.execution

                }).then((res) => {
                    if (res.data.type != 1) {
                        this.$parent.showTips('7', res.data.message);
                        return
                    }
                    this.$parent.showTips('7', '修改成功');
                    this.cancelFun()
                })
            } else if (this.taskListPopType == '1003') {
                CreateOutbound({
                    equipmentNo: this.code,
                    executeType: this.execution

                }).then((res) => {
                    if (res.data.type != 1) {
                        this.$parent.showTips('7', res.data.message);
                        return
                    }
                    this.$parent.showTips('7', '新建成功');
                    this.cancelFun()
                })
            } else if (this.taskListPopType == '1004') {
                UpdateOutbound({
                    id: this.id,
                    equipmentNo: this.code,
                    executeType: this.execution

                }).then((res) => {
                    if (res.data.type != 1) {
                        this.$parent.showTips('7', res.data.message);
                        return
                    }
                    this.$parent.showTips('7', '修改成功');
                    this.cancelFun()
                })
            }

        },
        checkCode() {
            if (!this.code) {
                this.$parent.showTips('7', '请输入夹具编号');
                return
            }
            CheckEquipmentCode(this.code).then(res => {
                let data = JSON.parse(res.data.resultdata)
                if (!data) {
                    this.$parent.showTips('7', '请输入正确的夹具编号');
                    return
                }
                this.name = data.description
            })

        }
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
<style lang="less" scoped>
.reservoirArea-table {
    width: 450px;

    .red-icon {
        color: red;
        background-color: #fff;
    }
}
</style>
  