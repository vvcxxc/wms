<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
    <div ref="reservoirArea" class="task-list reservoirArea">
        <div v-drag1 class="scPopBox_c" ref="tablePopC">
            <div class="head">
                故障修复记录添加
                <div class="headImg" @click="cancelFun()">
                    <i class="el-icon-close"></i>
                </div>
            </div>
            <div class="tablepopCenten_editbox" v-stopdrag ref="popCentenBox">

                <div class="input_box">
                    <div class="input_key">报警源：</div>
                    <div class="plc">
                        <el-input v-model="changedata.AlarmSource" disabled />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">报警时间：</div>
                    <div class="plc">
                        <el-input v-model="changedata.AlarmTime" disabled />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">报警类别：</div>
                    <div class="plc">
                        <el-input v-model="changedata.AlarmType" disabled />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">恢复时间：</div>
                    <div class="plc">
                        <el-input v-model="changedata.RecoverTime" disabled />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">用户：</div>
                    <div class="plc">
                        <el-input v-model="changedata.AddPerson" disabled />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">处理人：</div>
                    <div class="plc">
                        <el-input v-model="changedata.DealPerson" />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">关键字：</div>
                    <div class="plc">
                        <el-input v-model="changedata.KeyWord" />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">报警信息：</div>
                    <div class="plc">
                        <el-input v-model="changedata.AlarmMsg" disabled />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">报警原因：</div>
                    <div class="plc">
                        <el-input v-model="changedata.Reason" />
                    </div>
                </div>
                <div class="input_box">
                    <div class="input_key">故障处理方法：</div>
                    <div class="plc">
                        <el-input v-model="changedata.FaultTreatment" />
                    </div>
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
export default {
    data() {
        return {
            changedata: {
                KeyWord: '',
                Reason: '',
                FaultTreatment: '',
                DealPerson: '',
                RecoverTime: '',
                AlarmSource: '',
                AddPerson: ''
            }
        };
    },
    props: ['editItem'],
    mounted() {
        this.$axios
            .post(`/api/AlarmRecord/AlarmRecord_GetFaultStatus?argAlarmID=${this.editItem.ID}&argTableName=${this.editItem.TableName}`)
            .then(res => {
                if (res.data.data == '2') {
                    this.$axios
                        .post(
                            `/api/AlarmRecord/AlarmRecord_GetFault?argAlarmID=${this.editItem.ID}&argTableName=${this.editItem.TableName}`
                        )
                        .then((res) => {
                            if (res.data.data.length) {
                                this.changedata.KeyWord = res.data.data[0].KeyWord || '';
                                this.changedata.Reason = res.data.data[0].Reason || '';
                                this.changedata.FaultTreatment = res.data.data[0].FaultTreatment || '';
                                this.changedata.DealPerson = res.data.data[0].DealPerson || '';
                                this.changedata.RecoverTime = this.formatToDate(res.data.data[0].RecoverTime) || '';
                                this.changedata.AlarmSource = res.data.data[0].AlarmSource || '';
                                this.changedata.AddPerson = res.data.data[0].AddPerson || '';
                            }
                        });
                } else {
                    this.changedata.KeyWord = this.editItem.KeyWord || '';
                    this.changedata.Reason = this.editItem.Reason || '';
                    this.changedata.FaultTreatment = this.editItem.FaultTreatment || '';
                    this.changedata.DealPerson = this.editItem.DealPerson || '';
                    this.changedata.RecoverTime = this.editItem.RecoverTime || '';
                    this.changedata.AlarmSource = this.editItem.AlarmTagName || '';
                    this.changedata.AddPerson = this.editItem.OperatorName || '';
                }
            })

    },
    methods: {
        formatToDate(val) {
            if (val != null) {
                var date = new Date(parseInt(val.replace("/Date(", "").replace(")/", ""), 10));
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
            }
            return "";
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
            this.$parent.closeEditItem();
        },
        //save
        conserve() {
            if (!this.changedata.DealPerson) {
                this.$parent.showTips("请输入处理人");
                return
            }
            this.$axios({
                method: 'post',
                url: `/api/AlarmRecord/AlarmRecord_SetFault`,
                data: {
                    ...this.editItem,
                    ...this.changedata,
                    AddTime: this.getNowTime(),
                    AddPerson: this.editItem.OperatorName
                },
            })
                .then((res) => {
                    if (res.data.msg == '请求成功') {
                        this.$parent.showTips("保存成功");
                        this.cancelFun();
                    } else {
                        this.$parent.showTips(res.data.msg);
                    }
                })
        },

    },
};
</script>
<style lang="less">
.reservoirArea {
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

    .tablepopCenten_editbox {
        width: 400px;
        padding: 16px;
        box-sizing: border-box;
        background-color: #fff;
    }

    .input_box {
        display: flex;
        align-items: center;
        margin-bottom: 16px;

        .input_key {
            width: 100px;
        }

        .plc {
            width: 210px;
        }
    }
}
</style>
  
