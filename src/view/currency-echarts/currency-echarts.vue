<template>
  <div class="currency-page" ref="listPage">
    <div class="top-search">
      <my-search :searchdata="searchdata" ref="child"></my-search>
      <div v-if="chartType != 3">
        <el-button class="btn-style3" v-show="isBtn" @click="getexcel">
          导出
        </el-button>
        <el-button class="btn-style3" @click="handleChange">
          {{ btnText }}
        </el-button>
      </div>
    </div>
    <div class="echarts-body" v-if="!isBtn">
      <lineEcharts :data="chartData" v-if="chartType == 2" key="lineChart">
      </lineEcharts>
      <barEcharts :data="chartData" v-if="chartType == 1" key="barChart">
      </barEcharts>
      <pieEcharts :data="chartData" v-if="chartType == 3" key="pieChart">
      </pieEcharts>
    </div>
    <div class="echarts-body" v-else>
      <div>
        <list-table
          ref="homePage"
          :data="tableData"
          :name="name"
          :title="title"
          :tableWatchFlag="tableWatchFlag"
          :current-page="currentPage"
          style="height: 100%"
        ></list-table>
      </div>
      <div class="list-paginate" ref="listHeader">
        <paginate
          :allpage="allpage"
          ref="page"
          @get-current-page="getCurrentPage"
        ></paginate>
      </div>
    </div>
  </div>
</template>

<script>
import LineEcharts from "./components/echartsLine.vue";
import PieEcharts from "./components/echartspPie.vue";
import BarEcharts from "./components/echartsBar.vue";
import MySearch from "./components/search.vue";
import { getPageChart, getPageTableData } from "@/api/home.js";
import moment from "moment";
import ListTable from "../list-page/components/list-table/list-table.vue";
import Paginate from "@/components/paginate/paginate.vue";
export default {
  components: {
    LineEcharts,
    PieEcharts,
    BarEcharts,
    MySearch,
    ListTable,
    Paginate,
  },
  data() {
    return {
      id: "",
      searchdata: [],
      SearchData: [],
      queryArr: [],
      chartUrl: "",
      chartType: null,
      chartData: {},
      btnText: "列表",
      isBtn: false,
      tableData: [],
      name: [],
      title: [],
      currentPage: 1,
      allpage: 0, //分页总数
      tableWatchFlag: false,
    };
  },
  watch: {
    "$route.query.name"(n, o) {
      this.id = n;
      this.init(this.id);
    },
  },
  created() {
    this.id = this.$route.query.name;
    this.init(this.id);
  },
  methods: {
    init(id) {
      if (id == undefined) {
        id = "";
        return;
      }
      getPageChart(id).then((res) => {
        let data = JSON.parse(res.data.resultdata);
        console.log(data);
        this.searchdata = data.filter_list;
        this.chartUrl = data.URL;
        var JumpType = this.$route.query.type;
        this.tableWatchFlag = !this.tableWatchFlag;
        this.queryArr = [];
        this.name = [];
        this.title = [];
        this.allpage = 0;
        this.isBtn = false;
        this.btnText = "列表";
        for (let i = 0; i < data.Field_list.length; i++) {
          //表格表头数据
          if (data.Field_list[i].isTableAvailable == 0) {
            console.log("不添加");
          } else {
            this.name.push(data.Field_list[i].FieldIndex);
            this.title.push(data.Field_list[i]);
            // this.tableTitleList.push(data)
          }
        }
        if (JumpType == "2") {
          var routerArr = this.$store.state.dailog.routerArr;
          for (var i in routerArr) {
            var queryValue = {
              name: i,
              logic: "=",
              value: routerArr[i],
            };
            this.queryArr.push(queryValue);
          }
        } else if (
          this.searchdata.length &&
          this.searchdata[0].FieldType == "datetime"
        ) {
          this.queryArr = [
            {
              logic: ">",
              name: this.searchdata[0].FieldName,
              value: moment().add(-1, "h").format("YY-MM-DD HH:mm:ss"),
            },
            {
              logic: "<",
              name: this.searchdata[0].FieldName,
              value: moment().format("YY-MM-DD HH:mm:ss"),
            },
          ];
        } else {
          this.queryArr = [];
        }
        this.chartFun(this.chartUrl, this.queryArr);
      });
    },
    //筛选表单
    searchDataFun(data) {
      console.log("czj", data);
      this.SearchData = JSON.parse(JSON.stringify(data));
      if (this.$route.query.type == "2") {
        this.SearchData.push(this.queryArr[0]);
      }
      // 修改时间参数格式
      for (let i = 0; i < this.SearchData.length; i++) {
        console.log("asd", this.SearchData[i].logic);
        if (this.SearchData[i]) {
          if (this.SearchData[i].logic == "date") {
            var index = this.SearchData[i].value.indexOf("|");
            var time1 = this.SearchData[i].value.slice(0, index);
            var time2 = this.SearchData[i].value.slice(index + 1);
            var value1 = {
              logic: ">",
              name: this.SearchData[i].name,
              value: time1,
            };
            var value2 = {
              logic: "<",
              name: this.SearchData[i].name,
              value: time2,
            };
            this.SearchData.push(value1);
            this.SearchData.push(value2);
            this.SearchData.splice(i, 1);
          }
        }
      }
      this.chartFun(this.chartUrl, this.SearchData);
    },
    chartFun(url, query) {
      getPageTableData(url, query).then((res) => {
        let data = JSON.parse(res.data.resultdata);
        console.log(data);
        this.chartType = data.charttype;
        this.chartData = data;
        this.tableData = data.data;
        this.allpage = this.tableData.length;
      });
    },

    handleChange() {
      this.isBtn = !this.isBtn;
      if (this.isBtn) {
        this.btnText = "图表";
      } else {
        this.btnText = "列表";
      }
    },

    //获取页码
    getCurrentPage(val) {
      this.currentPage = val;
      // console.log(val)
    },

    //导出
    formatJson(filterVal, jsonData) {
      return jsonData.map((v) => filterVal.map((j) => v[j]));
    },
    getexcel() {
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../vendor/Export2Excel1.js");
        const tHeader = this.title.map((item) => {
          return item.FieldName;
        });
        const filterVal = this.name;
        const data = this.formatJson(filterVal, this.tableData);
        export_json_to_excel(tHeader, data, "表单列表", true);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.currency-page {
  width: 100%;
  height: 100%;

  .top-search {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .echarts-body {
    width: 100%;
    height: calc(100% - 60px);
  }
}
</style>