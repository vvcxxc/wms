<template>
  <div ref="scPopBox1" class="scPopBox2">
    <div v-drag1 class="scPopBox_c">
      <div class="head">
        生成出库任务详情
        <div class="headImg" @click="handleDetails(false)">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div class="popCenten_box" v-stopdrag style="margin-top: 20px">
        <el-table
          :data="tableDataArr"
          style="width: 100%"
          highlight-current-row
          border
          height="430"
        >
          <el-table-column
            prop="TrayNum"
            label="条码"
            show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="MaterialInfo3"
            label="物料编号"
            show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="MaterialInfo1"
            label="物料名称"
            show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="MaterialInfo2"
            label="图号"
            show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="MaterialInfo4"
            label="线别"
            show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="RowNum"
            label="排"
            show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column prop="Line" label="列" show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="Plie" label="层" show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
        <div style="width: 100%; text-align: center; margin-top: 20px">
          <span>出库去向：</span>
          <el-select
            popper-class="select-dropdown-class-li"
            v-model="selectVal"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>

      <div class="fool_btn">
        <el-button @click="handleDetails(true)" class="btn-style21"
          >确认</el-button
        >
        <el-button @click="handleDetails(false)" class="btn-style22 btn-close"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import "./details-pop.less";
export default {
  props: ["data"],
  data() {
    return {
      selectVal: 1,
      tableDataArr: [],
      options: [
        {
          label: "生产",
          value: 1,
        },
        {
          label: "委外维修",
          value: 2,
        },
        {
          label: "厂内维修",
          value: 3,
        },
      ],
    };
  },
  created() {
    this.tableDataArr.push(this.data);
  },
  methods: {
    handleDetails(flag) {
      const arr = this.tableDataArr.map((item) => ({
        ...item,
        kutai: this.selectVal,
      }));
      this.$emit("handleDetails", flag, arr);
    },
  },
};
</script>