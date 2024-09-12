<!--
 * @Description: 这是通用列表页面表单（组件）
 * @Date: 2020-08-12 11:39:53
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:23:23
-->
<template>
  <div class="tableBox1" ref="tableBox1">
    <!-- {{ title }} -->
    <!-- {{screenHeight}}
    {{tableHeight}} -->
    <div class="sort-list">
      排序筛选：
      <el-tag
        class="sort-tag"
        v-for="(item, index) in tit1"
        :key="index"
        closable
        type="info"
        @close="closeSort(item, index)"
      >
        {{ item.label }}
      </el-tag>
    </div>

    <div
      class="current-tab"
      v-if="
        routerPathName == 'OutboundTaskList' ||
        routerPathName == 'InboundTaskList'
      "
    >
      <div class="current-left">
        <div class="current-leftTop">
          {{
            routerPathName == "OutboundTaskList"
              ? "当前出库任务"
              : routerPathName == "InboundTaskList"
              ? "当前入库任务"
              : ""
          }}
        </div>
        <div class="current-leftBottom">
          <span>任务号:{{ selectItem.TaskId }}</span>
          <span>最后修改时间:{{ selectItem.LastModifyOn }}</span>
          <span>实际数量:{{ selectItem.ActualQty }}</span>
        </div>
      </div>
      <div class="current-right">
        <div
          class="current-rightBtn"
          v-show="item.Btn_Type == '9'"
          v-for="(item, index) in btnData"
          :key="index"
          @click="clickBtn(item)"
        >
          {{ item.Btn_Text }}
        </div>
      </div>
    </div>

    <el-table
      :show-summary="disShowSummary"
      :summary-method="summaryMethod"
      :data="tableData"
      style="margin-bottom: 20px"
      :height="tableHeight"
      border
      default-expand-all
      highlight-current-row
      :tree-props="{ children: 'Children', hasChildren: 'hasChildren' }"
      row-key="vuekey"
      :row-style="rowClass"
      :row-class-name="tableRowClassName"
      ref="handSelectTest_multipleTable"
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <!-- @row-click="handleRowClick" 单击某行选中多选，，跟单选冲突了-->
      <el-table-column v-if="vuekeyNum" width="50" type="expand">
      </el-table-column>
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <!-- 动态内容 -->
      <template v-for="(item, index) in name">
        <!-- <el-table-column type="expand" :key="index" v-if="index == 0"> </el-table-column> -->
        <el-table-column
          :render-header="labelHead"
          :key="'table' + index"
          :prop="name[index]"
          :label="title[index].FieldName"
          sortable="custom"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
      </template>
    </el-table>

    <div class="deletePop" v-if="popShow && selectItem.TaskId">
      <div class="title">
        <span class="text">修改数量</span>
      </div>
      <div class="delete_text">
        实际数量<input
          type="number"
          :min="0"
          :max="6"
          v-model="popValue"
          @blur="checkValue"
        />
      </div>
      <div class="delete_btn">
        <div class="no" @click="closePop">取消</div>
        <div class="yes" @click="sumbitPop">确认</div>
      </div>
    </div>
    <div class="mask_box" v-if="popShow && selectItem.TaskId"></div>
  </div>
</template>
<script>
import bus from "@/components/common/bus";
import "./list-table.less";
export default {
  data() {
    return {
      updateNumUrl: "",
      popShow: false,
      popValue: 0,
      tableData: null,
      selectData: [],
      selectRow: [],
      tit1: [], //排序键值
      tableHeight: 350,
      pageNum: 50, //每页数量
      disShowSummary: false,
      screenWidth: null,
      screenHeight: null,
      vuekeyNum: 0,
      selectItem: {},
    };
  },
  props: [
    "data",
    "name",
    "title",
    "currentPage",
    "tableWatchFlag",
    "btnData",
    "btnPowerData",
    "routerPathName",
  ],
  directives: {
    drag: function (el) {
      let dragBox = el; //获取当前元素
      dragBox.onmousedown = (e) => {
        let box = document.querySelector(".deletePop");
        //算出鼠标相对元素的位置
        let disX = e.clientX - dragBox.offsetLeft;
        let disY = e.clientY - dragBox.offsetTop;
        document.onmousemove = (e) => {
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - Number(disX);
          let top = e.clientY - Number(disY);
          //移动当前元素
          box.style.left = left + "px";
          box.style.top = top + "px";
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
        };
      };
    },
  },
  watch: {
    data(n, o) {
      // this.tit1 = [];
      if (this.routerPathName == "OutboundTaskList") {
        this.selectItem = n.find((item) => item.Status != "shipped") || {};
      } else if (this.routerPathName == "InboundTaskList") {
        this.selectItem = n.find((item) => item.Status != "succeeded") || {};
      }
      this.init();
    },
    tableWatchFlag() {
      this.tit1 = [];
    },
    selectData(data) {
      this.selectRow = [];
      if (data.length > 0) {
        data.forEach((item, index) => {
          this.selectRow.push(this.tableData.indexOf(item));
        });
      }
    },
    screenHeight(n, o) {
      this.getHeight();
    },
    screenWidth(n, o) {
      this.getHeight();
    },
    $route(n, o) {
      this.routerChang;
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    this.screenHeight = document.body.clientHeight;
    window.onresize = () => {
      return (() => {
        this.screenWidth = document.body.clientWidth;
        this.screenHeight = document.body.clientHeight;
      })();
    };
  },
  methods: {
    closePop() {
      this.popShow = false;
      this.popValue = 0;
    },
    isPositiveInteger(s) {
            var re = /^[0-9]+$/;
            return re.test(s);
        },
    sumbitPop() {
      if (!this.isPositiveInteger(this.popValue)) {
        this.$message.error({
          message: "请输入正整数",
        });     
        return;
      }
      this.$parent.saveData(this.updateNumUrl, {
        taskId: this.selectItem.TaskId,
        currentQty: this.selectItem.ActualQty,
        reQty: Number(this.popValue),
      });
      this.closePop();
    },
    clickBtn(item) {
      if (this.btnPowerData.length != 0) {
        for (let i = 0; i < this.btnPowerData.length; i++) {
          if (this.btnPowerData[i].Btn_ID == item.Btn_ID) {
            if (this.btnPowerData[i].IsAuthorized == "N") {
              this.$message.error({
                message: "没有【" + item.Btn_Text + "】权限",
              });
              return;
            }
          }
        }
      }
      if (item.Btn_Text == "修改数量") {
        this.popShow = true;
        this.popValue = this.selectItem.ActualQty;
        this.updateNumUrl = item.SumbitUrl;
      } else {
        this.$parent.saveData(item.SumbitUrl, {
          taskId: this.selectItem.TaskId,
        });
      }
    },
    checkValue() {
      if (!this.isPositiveInteger(this.popValue)) {
        this.$message.error({
          message: "数量应该为正整数",
        });
        this.popValue = this.selectItem.ActualQty;
        return;
      }
      if (Number(this.popValue) < 0 || Number(this.popValue) > 6) {
        this.$message.error({
          message: "数量应该在0到6之间",
        });
        this.popValue = this.selectItem.ActualQty;
        return;
      }
    },
    //是否为正整数
    isPositiveInteger(s) {
      var re = /^[0-9]+$/;
      return re.test(s);
    },
    //列表展开和收起
    forArr(arr, isExpand) {
      // console.log(this.$refs.handSelectTest_multipleTable)
      arr.forEach((i) => {
        this.$refs.handSelectTest_multipleTable.toggleRowExpansion(i, isExpand);
        if (i.Children) {
          this.forArr(i.Children, isExpand);
        }
      });
    },
    //获取高度
    getHeight() {
      let num =
        this.routerPathName == "InboundTaskList" ||
        this.routerPathName == "OutboundTaskList"
          ? 180
          : 100;
      this.$nextTick(() => {
        // console.log(this.$parent.$refs.listPage.offsetHeight)
        this.tableHeight =
          this.$parent.$refs.listPage.offsetHeight -
          this.$parent.$refs.listHeader.offsetHeight -
          num;
      });
    },
    routerChang() {
      this.keyArr = [];
      this.$parent.$refs.page.pageSizeFun();
    },
    //点行选中复选框
    handleRowClick(row, column, event) {
      this.$refs.handSelectTest_multipleTable.toggleRowSelection(row);
    },

    init() {
      //分页数据
      this.disShowSummary = false;
      bus.$on("renovate", (data) => {
        this.tit1 = [];
      });
      if (this.data != null) {
        if (this.data.length == 0) {
          this.tableData = [];
        } else {
          // this.tableData = this.data.slice(0, 50);
          // this.tableData =  this.data
          //  console.log('Color',this.tableData)
          this.vuekeyNum = 0;
          this.data.forEach((item) => {
            // console.log(item)
            if (item.vuekey) {
              this.vuekeyNum++;
            }
          });
          this.dataFun(this.currentPage, this.pageNum);
        }
      }
      this.title.forEach((item) => {
        if (item.IsSummary == "1") {
          this.disShowSummary = true;
        }
      });
      this.getHeight();
      // this.$nextTick(() => {
      //   // this.tableHeight = this.$parent.$refs.listPage.offsetHeight - this.$parent.$refs.listHeader.offsetHeight - 80;
      //   // console.log(this.$parent.$refs.listPage.offsetHeight)
      //   // console.log(this.$parent.$refs.listHeader.offsetHeight)
      // });
    },
    closeSort(item, index) {
      this.tit1.splice(index, 1);
      this.sortChange1();
    },
    summaryMethod({ columns, data }) {
      // console.log(this.title)
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        } else {
          if (this.title[index - 1].IsSummary == "1") {
            const values = data.map((item) => Number(item[column.property]));
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
        }
      });
      this.$nextTick(() => {
        this.$refs.handSelectTest_multipleTable.doLayout();
      });
      return sums;
    },
    sortChange({ column, prop, order }) {
      var num = 0;
      console.log(this.tit1);
      for (var i = 0; i < this.tit1.length; i++) {
        if (prop == this.tit1[i].prop) {
          this.tit1[i].order = order;
          num++;
          if (order == null) {
            this.tit1.splice(i, 1);
            console.log(this.tit1);
            i = i - 1;
          }
        }
      }
      if (num == 0) {
        this.tit1.push({
          prop: prop,
          order: order,
          label: column.label,
        });
      }
      this.sortChange1();
    },
    sortChange1() {
      var tit = this.tit1;
      this.data = this.data.sort(function (a, b) {
        if (tit.length > 0) {
          for (var i = 0; i < tit.length; i++) {
            var key = tit[i].prop;
            if (a[key] == b[key]) {
              continue;
              // return b[key] < a[key]
            } else {
              if (a[key] < b[key] && tit[i].order == "descending") {
                return 1;
              }
              if (a[key] > b[key] && tit[i].order == "ascending") {
                return 1;
              } else {
                return -1;
              }
            }
          }
        } else {
          return -1;
        }
      });
      this.$parent.$refs.page.currentPage4 = 1;
      this.$parent.$refs.page.handleCurrentChange(1);
      this.init();
    },
    //表格样式
    tableRowClassName({ row, rowIndex }) {
      // console.log("row==>", row);

      // let data = row.row;
      let children = row.Children;
      let res = [];
      if (children && children.length > 0) {
        res.push("row-expand-has");
        // return res;
      } else {
        res.push("row-expand-unhas");
        // return res;
      }

      if (row.Color == "#F7363B") {
        // return "warning-row";
        res.push("warning-row");
      } else if (row.Color == "#F28105") {
        // return "success-row";
        res.push("success-row");
      } else if (row.Color == "#089800") {
        // return "success-active";
        res.push("success-active");
      } else {
        // return "";
      }
      return res;
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
      this.forArr(this.tableData, false);
    },
    //分页数据
    dataFun2(num) {
      if (this.data.length != 0) {
        this.pageNum = num;
        this.tableData = this.data.slice(0, num);
      }
    },
    handleSelectionChange(val) {
      this.$parent.tabelFun(val);
      this.selectData = val;
    },
    rowClass({ row, rowIndex }) {
      if (this.selectRow.includes(rowIndex)) {
        return { "background-color": "rgba(0,0,0,0.05)" };
      }
    },
    //计算表头宽度
    labelHead: function (h, { column, $index }) {
      let zl = 0;
      let yl = 0;
      var fl = 0;
      //判断中英文
      for (let i = 0; i < column.label.length; i++) {
        var gz = /^[A-Za-z0-9]+$/;
        var show = gz.test(column.label[i]);
        if (show == true) {
          yl = yl + 1;
        } else {
          //判断符号
          var zw = /^[\u4e00-\u9fa5]/;
          var show1 = zw.test(column.label[i]);
          if (zw == true) {
            zl = zl + 1;
          } else {
            fl = fl + 1;
          }
        }
      }
      let z = 16;
      let l = 8;
      let f = 12;
      column.minWidth = z * (zl + 2) + l * (yl + 2) + f * (fl + 3); //加上一个文字长度
      return h(
        "div",
        {
          class: "table-head",
          // style: { width: "50%", display: "inline-flex" },
        },
        [column.label]
      );
    },
  },
};
</script>
<style lang="less">
.row-expand-unhas .el-table__expand-column {
  pointer-events: none;
}
.row-expand-unhas .el-table__expand-column .el-icon {
  visibility: hidden;
}
.el-table__expanded-cell[class*="cell"] {
  padding: 0;
}
</style>