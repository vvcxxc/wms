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
          <template v-for="(item, index) in name">
            <!-- <el-table-column type="expand" :key="index" v-if="index == 0"> </el-table-column> -->
            <el-table-column
              :key="'table' + index"
              :prop="name[index]"
              :label="title[index].FieldName"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
          </template>
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
import "./add-pop.less";
export default {
  props: ["name", "title", "tableDataArr"],
  data() {
    return {
      selectVal: 1,
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