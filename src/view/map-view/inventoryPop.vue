<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    v-dialogDrag
    @open="open"
    @close="close"
  >
    <div class="wrap">
      <div>
        <el-form :model="formData" label-position="left" label-width="90px">
          <el-row :gutter="50">
            <el-col :span="8">
              <el-form-item label="库位号">
                <el-input
                  v-model="formData.ContainerNum"
                  disabled
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="托盘类型">
                <el-select
                  v-model="formData.TrayType"
                  @change="changeType"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div class="table">
        <el-table
          class="pop_table"
          height="100%"
          :data="tableData"
          ref="popTable"
          border
        >
          <el-table-column
            label="序号"
            fixed="left"
            type="index"
            width="55"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in columnList"
            :key="Math.random() + index"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            :sortable="item.sortable"
            :width="item.width"
          >
            <template slot="header">
              <template v-if="![2, 1].includes(formData.TrayType)">
                <span
                  v-if="verifyProps.includes(item.prop)"
                  class="verify_label"
                  >{{ item.label }}</span
                >
                <span v-else>{{ item.label }}</span>
              </template>
              <template v-else>
                <span>{{ item.label }}</span>
              </template>
            </template>
            <template slot-scope="scope">
              <el-date-picker
                v-if="item.prop === 'CreateTime'"
                :disabled="scope.row.disabled"
                v-model="scope.row[item.prop]"
                type="datetime"
                :clearable="false"
                placeholder="选择日期时间"
              ></el-date-picker>
              <el-input
                v-else
                v-model="scope.row[item.prop]"
                :disabled="scope.row.disabled"
              ></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "新增库存",
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      options: [
        {
          label: "空托",
          value: 1,
        },
        {
          label: "钢管托",
          value: 2,
        },
        {
          label: "大卷托",
          value: 3,
        },
        {
          label: "小卷托",
          value: 4,
        },
        {
          label: "小卷带钢管托",
          value: 5,
        },
      ],
      columnList: [
        {
          label: "标识oid",
          prop: "Oid",
          fixed: "left",
          disabled: true,
          width: "110px",
        },
        {
          label: "标记",
          prop: "Sign",
          fixed: "left",
          width: "110px",
        },
        {
          label: "工单号",
          prop: "WorkOrderNumber",
          fixed: "left",
          width: "110px",
        },
        {
          label: "支号",
          prop: "RollNum",
          fixed: "left",
          width: "110px",
        },
        {
          label: "销售订单号",
          prop: "SalesOrderNumber",
          width: "110px",
        },
        {
          label: "销售订单行号",
          prop: "SalesOrderLine",
          width: "120px",
        },
        {
          label: "物料号",
          prop: "MaterialCode",
          width: "110px",
        },
        {
          label: "物料描述",
          prop: "MaterialDescription",
          width: "120px",
        },
        {
          label: "入库时间",
          prop: "CreateTime",
          width: "200px",
        },
        {
          label: "重量",
          prop: "Weight",
        },
        {
          label: "成品码数",
          prop: "Length",
        },
        {
          label: "数量",
          prop: "Quantity",
        },
        {
          label: "成本中心",
          prop: "CostCenter",
        },
        {
          label: "库台",
          prop: "kutai",
        },
      ],
      tableData: [
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
      ],
      // 必填校验的属性
      /* 
                标识 oid  工单号 支号 销售订单号 销售订单行号 入库时间 重量 成品码数
            */
      verifyProps: [
        "Oid",
        "WorkOrderNumber",
        "Sign",
        "RollNum",
        // "SalesOrderNumber",//非必填
        // "SalesOrderLine",
        // "MaterialCode",
        // "MaterialDescription",
        "CreateTime",
        "Weight",
        "Length",
      ],
    };
  },
  methods: {
    open() {
      this.setDisabled(this.formData.TrayType);
    },
    close() {
      this.tableData = [
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
        {
          Oid: "",
          WorkOrderNumber: "",
          Sign: "",
          RollNum: "",
          SalesOrderNumber: "",
          SalesOrderLine: "",
          MaterialCode: "",
          MaterialDescription: "",
          CreateTime: "",
          Weight: "",
          Length: "",
          Quantity: "",
          CostCenter: "",
          kutai: "",
          disabled: false,
        },
      ];
      this.$emit("close");
    },
    clearTableData() {
      this.tableData = [];
    },
    changeType() {
      this.setDisabled(this.formData.TrayType);
      this.$nextTick(() => {
        this.$refs.popTable.doLayout();
      });
    },
    setDisabled(value) {
      if (value === 1 || value === 2) {
        this.tableData.forEach((item) => {
          for (let key of Object.keys(item)) {
            item[key] = "";
          }
          item.disabled = true;
        });
      }
      if (value === 3) {
        this.tableData.forEach((item, index) => {
          if (index === 0) {
            item.disabled = false;
          } else {
            for (let key of Object.keys(item)) {
              item[key] = "";
            }
            item.disabled = true;
          }
        });
      }
      if (value === 4 || value === 5) {
        this.tableData.forEach((item) => {
          item.disabled = false;
        });
      }
    },
    confirm() {
      let $this = this;
      if (this.formData.TrayType === 3) {
        for (let key of Object.keys(this.tableData[0])) {
          if (this.verifyProps.includes(key)) {
            // if(this.tableData[0][key] === '') {
            //     this.$message.warning(`存在必填数据未填写，请先填写数据`)
            //     return
            // }
            if (
              !Object.values(this.tableData[0])
                .filter((f) => f !== false)
                .every((e) => e === "")
            ) {
              if (this.tableData[0][key] === "") {
                this.$message.warning(
                  `第${0 + 1}行存在必填数据未填写，请先填写数据`
                );
                return;
              }
            }
          }
        }
      }
      if (this.formData.TrayType === 4 || this.formData.TrayType === 5) {
        for (let i = 0; i < this.tableData.length; i++) {
          for (let key of Object.keys(this.tableData[i])) {
            if (this.verifyProps.includes(key)) {
              if (
                !Object.values(this.tableData[i])
                  .filter((f) => f !== false)
                  .every((e) => e === "")
              ) {
                if (this.tableData[i][key] === "") {
                  this.$message.warning(
                    `第${i + 1}行存在必填数据未填写，请先填写数据`
                  );
                  return;
                }
              }
            }
          }
        }
      }
      this.$confirm("是否确认调整该库位库存信息？", "提示", {
        type: "warning",
      }).then(() => {
        $this.$emit("confirm", $this.formData, $this.tableData);
      });
    },
  },
};
</script>

<style lang="less" scoped>
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #f1f1f1;
}
::v-deep .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 170px;
  .el-input__prefix {
    left: -1px;
  }
  .el-input__inner {
    padding-left: 20px;
  }
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-dialog {
  width: 1200px;
}
::v-deep .pop_table.el-table th {
  padding: 10px 0px;
}
.wrap {
  width: 100%;
  height: 400px;
}
.table {
  height: calc(100% - 30px);
}
.verify_label {
  position: relative;
  padding-left: 3px;
  &:before {
    content: "*";
    position: absolute;
    left: -6px;
    color: red;
  }
}
</style>
