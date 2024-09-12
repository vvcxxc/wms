<template>
  <div ref="scPopBox1" class="scPopBox2">
    <div v-drag1 class="scPopBox_c">
      <div class="head">
        计划明细
        <div class="headImg" @click="handleDetailed()">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div
        style="
          width: calc(100% - 40px);
          margin: 20px;
          display: flex;
          justify-content: space-between;
        "
      >
        <div>
          <el-select
            popper-class="select-dropdown-class-li"
            v-model="selectVal"
            placeholder="请选择"
            style="margin-right: 10px"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button @click="init()" class="btn-style21">查询</el-button>
        </div>
        <div>
          <el-button @click="handleExport" class="btn-style21">导出</el-button>
        </div>
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
        <div style="width: 24%">
          <span style="margin-right: 10px">已完成数量:</span>
          <el-input
            type="text"
            v-model="ComplateNum"
            disabled
            style="width: calc(100% - 85px)"
          />
        </div>
        <div style="width: 24%">
          <span style="margin-right: 10px">点修数量:</span>
          <el-input
            type="text"
            v-model="PointRepairNum"
            disabled
            style="width: calc(100% - 70px)"
          />
        </div>
        <div style="width: 24%">
          <span style="margin-right: 10px">返修数量:</span>
          <el-input
            type="text"
            v-model="RepairNum"
            disabled
            style="width: calc(100% - 70px)"
          />
        </div>
        <div style="width: 24%">
          <span style="margin-right: 10px">替换数量:</span>
          <el-input
            type="text"
            v-model="ReplacedNum"
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
            type="index"
            label="序号"
            width="60"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="messageID"
            label="消息ID"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="Createtime"
            label="接收完成时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="planSeqCode"
            label="计划号"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="IsComplate"
            label="是否已出库"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="ComplateTime"
            label="出库时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="IsPointRepair"
            label="是否发送点修"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="IsRepair"
            label="是否发送大返修"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="ReplacedTrayId"
            label="替换计划号"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="tzMrlCode"
            label="涂装图号"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="ReplacedTime"
            label="替换时间"
            :show-overflow-tooltip="true"
          >
          </el-table-column>
          <el-table-column
            prop="color"
            label="颜色"
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
      input1: 1,
      tableData: [],
      data: [],
      options: [
        {
          label: "全部",
          value: "0",
        },
        {
          label: "已出库",
          value: "1",
        },
        {
          label: "未出库",
          value: "2",
        },
        {
          label: "点修",
          value: "3",
        },
        {
          label: "大返修",
          value: "4",
        },
        {
          label: "替换",
          value: "5",
        },
      ],
      ComplateNum: "",
      PointRepairNum: "",
      RepairNum: "",
      ReplacedNum: "",
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      axios
        .request({
          url: `${this.item.PopupUrl}?type=${this.selectVal}&messageId=${this.tableDataArr[0].MessageId}`,
          method: "get",
        })
        .then((res) => {
          let data = JSON.parse(res.data.resultdata);
          this.data = data.PlansInfo;
          this.ComplateNum = data.ComplateNum;
          this.PointRepairNum = data.PointRepairNum;
          this.RepairNum = data.RepairNum;
          this.ReplacedNum = data.ReplacedNum;
          this.allpage = this.data.length;
          console.log(this.data);
          if (this.data.length) {
            this.dataFun(this.currentPage, this.pageNum);
          } else {
            this.tableData = [];
          }
        });
    },
    handleDetailed() {
      this.$emit("handleDetailed");
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
          "序号",
          "消息ID",
          "接收完成时间",
          "计划号",
          "是否已出库",
          "出库时间",
          "是否发送点修",
          "是否发送大返修",
          "替换计划号",
          "涂装图号",
          "替换时间",
          "颜色",
          "",
          "已完成数量",
          "点修数量",
          "返修数量",
          "替换数量",
        ];
        const prop = [
          "index",
          "messageID",
          "Createtime",
          "planSeqCode",
          "IsComplate",
          "ComplateTime",
          "IsPointRepair",
          "IsRepair",
          "ReplacedTrayId",
          "tzMrlCode",
          "ReplacedTime",
          "color",
          "xx",
          "ComplateNum",
          "PointRepairNum",
          "RepairNum",
          "ReplacedNum",
        ];
        const exportData = this.data.map((item, index) => {
          if (index == 0) {
            return {
              ...item,
              index: index + 1,
              ComplateNum: this.ComplateNum,
              PointRepairNum: this.PointRepairNum,
              RepairNum: this.RepairNum,
              ReplacedNum: this.ReplacedNum,
            };
          }
          return { ...item, index: index + 1 };
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