<template>
  <div ref="scPopBox1" class="scPopBox2">
    <div v-drag1 class="scPopBox_c">
      <div class="head">
        报警明细
        <div class="headImg" @click="handleAlarm()">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div style="width: calc(100% - 40px); margin: 20px; text-align: right">
        <el-button @click="handleExport" class="btn-style21">导出</el-button>
      </div>

      <div
        style="
          width: calc(100% - 40px);
          margin: 20px;
          display: flex;
          height: 30px;
          line-height: 30px;
          justify-content: space-between;
        "
      >
        <!-- <div style="width: 49%">
          <span style="margin-right: 10px">报警类型:</span>
          <el-input
            type="text"
            v-model="AlarmType"
            disabled
            style="width: calc(100% - 70px)"
          />
        </div> -->
        <div style="width: 100%">
          <span style="margin-right: 10px">报警数量:</span>
          <el-input
            type="text"
            v-model="Total"
            disabled
            style="width: calc(100% - 70px)"
          />
        </div>
      </div>

      <div class="popCenten_box" v-stopdrag style="margin-top: 20px">
        <el-table
          :data="tableData"
          style="width: 100%"
          highlight-current-row
          border
          height="430"
        >
          <el-table-column
            prop="Date"
            label="统计时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="AlarmType"
            label="报警类型"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="AlarmMsg"
            label="报警内容"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="AlarmTime"
            label="报警时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
        </el-table>
        <div class="list-paginate" style="margin-top: 20px">
          <paginate
            :allpage="allpage"
            ref="page"
            @get-current-page="getCurrentPage"
          ></paginate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "./add-pop.less";
import Paginate from "@/components/paginate/paginate.vue";
import axios from "@/libs/api.request";
export default {
  components: {
    Paginate,
  },
  props: ["item", "tableDataArr"],
  data() {
    return {
      allpage: 0,
      currentPage: 1,
      selectVal: "0",
      pageNum: 50,
      tableData: [],
      data: [],
      AlarmType: "",
      Total: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      axios
        .request({
          url: `${this.item.PopupUrl}?beginDate=${this.tableDataArr[0].Date}&type=${this.tableDataArr[0].AlarmType}`,
          method: "get",
        })
        .then((res) => {
          let data = JSON.parse(res.data.resultdata);
          this.data = data.sCMSAlarmLogInfos;
          this.AlarmType = data.AlarmType;
          this.Total = data.Total;
          this.allpage = this.data.length;
          if (this.data.length) {
            this.dataFun(this.currentPage, this.pageNum);
          } else {
            this.tableData = [];
          }
        });
    },
    handleAlarm() {
      this.$emit("handleAlarm");
    },

    //获取页码
    getCurrentPage(val) {
      this.currentPage = val;
      // console.log(val)
    },

    //分页数据
    dataFun(index, num) {
      if (index == 1) {
        if (this.data.length != 0) {
          this.tableData = this.data.slice(0, num);
        }
      } else {
        var ind = (index - 1) * num;
        var zn = num + ind;
        if (this.data.length != 0) {
          this.tableData = this.data.slice(ind, zn);
        }
      }
      //  this.tableData.forEach(item=>{
      //    if(item.vuekey){
      //      delete item.Children
      //    }
      //  })
      // this.forArr(this.tableData, false);
    },
    //分页数据
    dataFun2(num) {
      if (this.data.length != 0) {
        this.pageNum = num;
        this.tableData = this.data.slice(0, num);
      }
    },
    //导出
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    handleExport() {
      require.ensure([], () => {
        const title = [
          "统计时间",
          "报警类型",
          "报警内容",
          "报警时间",
          "",
          "报警数量",
        ];
        const prop = [
          "Date",
          "AlarmType",
          "AlarmMsg",
          "AlarmTime",
          "",
          "Total",
        ];
        const exportData = this.data.map((item, index) => {
          if (index == 0) {
            return {
              ...item,
              Total: this.Total,
            };
          }
          return { ...item };
        });
        const {
          export_json_to_excel,
        } = require("../../../../vendor/Export2Excel1.js");
        const tHeader = title;
        const filterVal = prop;
        const list = exportData;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "表单列表", true);
      });
    },
  },
};
</script>