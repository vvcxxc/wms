<template>
  <div v-loading="loading" class="list-page" ref="listPage">
    <div class="list-content">
      <div class="list-header" ref="listHeader">
        <!-- 搜索 -->
        <div class="list-search">
          <search :searchdata="searchdata"></search>
        </div>
        <!-- 按钮 -->
        <div class="list-btn">
          <all-button
            :btnData="btnData"
            :btnPowerData="btnPowerArr"
          ></all-button>
        </div>
      </div>
      <div class="list-table" v-loading="loading1">
        <div class="select-count" v-if="haveWeightLabel">{{ `选中数量合计：${selectCountWeight}` }}</div>
        <list-table
          ref="homePage"
          :data="tableData"
          :name="name"
          :title="title"
          :tableWatchFlag="tableWatchFlag"
          :current-page="currentPage"
        ></list-table>
      </div>
    </div>
    <div class="list-paginate">
      <paginate
        :allpage="allpage"
        ref="page"
        @get-current-page="getCurrentPage"
      ></paginate>
    </div>
    <!-- 弹窗 -->
    <add-pop
      ref="addpop"
      :popTitle="popTitle"
      :tableDataArr="tableDataArr"
      :axioData="item"
      :data="addData"
      v-if="addShow"
      :tableList="tableData"
      :disLoading="loading2"
    ></add-pop>
    <tips-pop
      ref="tipsPop"
      :tableDataArr="tableDataArr"
      :title="TitleText"
      :data="item"
      :type="tipsType"
      :textInfo="textInfo"
      v-if="tipsShow"
    >
    </tips-pop>
    <my-pop
      v-if="isMyPopShow"
      :text="myPopText"
      :deleteShow="false"
      @deleteBtn="deleteBtn"
    >
    </my-pop>
    <details-pop
      v-if="isDetailsShow"
      :name="name"
      :title="title"
      :tableDataArr="tableDataArr"
      @handleDetails="handleDetails"
    ></details-pop>
    <detailed-pop
      v-if="isDetailedShow"
      :tableDataArr="tableDataArr"
      :item="item"
      @handleDetailed="handleDetailed"
    />
    <alarm-deatils
      v-if="isAlarmShow"
      :tableDataArr="tableDataArr"
      :item="item"
      @handleAlarm="handleAlarm"
    />
    <add-list-pop
      ref="addListPop"
      :popTitle="popTitle"
      :tableDataArr="tableDataArr"
      :axioData="item"
      :data="addData"
      :tableList="tableData"
      :disLoading="loading2"
      v-if="isAddList"
    ></add-list-pop>
    <up-img :data="imgdata" :imgType="imgType" v-if="upimgShow"></up-img>

    <add-table
      v-if="addtableShow"
      ref="addtable"
      :addTableData="addTableData"
    ></add-table>

    <add-form-table
      v-if="addformtableShow"
      ref="addformtable"
      :propsData="formTableData"
    />

    <!-- 遮罩层 -->
    <div
      v-if="
        addShow ||
        tipsShow ||
        upimgShow ||
        isAddList ||
        isMyPopShow ||
        isDetailsShow ||
        isDetailedShow ||
        isAlarmShow ||
        addtableShow
      "
      class="mask-box-li"
    ></div>
  </div>
</template>

<script>
import Search from "./components/search/search.vue";
import AllButton from "./components/all-button/all-button.vue";
import ListTable from "./components/list-table/list-table.vue";
import Paginate from "@/components/paginate/paginate.vue";
import TipsPop from "@/components/main/components/tips/tips-pop.vue";
import AddPop from "./components/add-pop/add-pop.vue";
import UpImg from "./components/up-img/up-img.vue";
import { addTagNavList } from "@/libs/util.js";
import MyPop from "./components/add-pop/my-pop.vue";
import DetailsPop from "./components/add-pop/details-pop.vue";
import DetailedPop from "./components/add-pop/detailed-pop.vue";
import AlarmDeatils from "./components/add-pop/alarm-details.vue";
import axios from "@/libs/api.request";
import AddTable from "./components/add-table/add-table.vue";
import AddFormTable from "./components/add-form-table/add-form-table.vue";

import {
  getPageInfo,
  getPageTableData,
  getTableCondition,
  tableSettingContent,
  popupEditorData,
  importExcel,
} from "@/api/home.js";
import AddListPop from "./components/add-pop/add-list-pop.vue";
// import collapseTransition from '../../../../iview/ViewUI-master/src/components/base/collapse-transition';
export default {
  components: {
    Search,
    AllButton,
    ListTable,
    Paginate,
    TipsPop,
    AddPop,
    AddTable,
    UpImg,
    AddListPop,
    // TipsPop,
    MyPop,
    DetailsPop,
    DetailedPop,
    AlarmDeatils,
    AddFormTable,
  },
  data() {
    return {
      imgdata: [], //图片数据
      imgType: "", //新增或查看图片
      upimgShow: false,
      addShow: false,
      tipsShow: false,
      loading: false,
      loading1: false,
      searchdata: [],
      id: "",
      loading2: false,
      btnData: [],
      btnPowerArr: [],
      tableData: [], //表单data
      name: [],
      title: [],
      tableUrl: "", //表单数据
      queryArr: [], //查询条件
      allpage: 0, //分页总数
      SearchData: [], //表单数据
      tableDataArr: [], //选中的表单数据
      TitleText: "", //弹窗标题
      item: "", //提示内容
      textInfo: "", //提示弹窗文本
      tipsType: "",
      popTitle: "",
      addData: [], //弹窗数据
      // tableTitleList:[]//表格表头数据
      currentPage: 1, //页数
      isAddList: false,
      isMyPopShow: false,
      myPopText: "请勾选内容",
      isDetailsShow: false,
      isDetailedShow: false,
      tableWatchFlag: false,
      isAlarmShow: false,
      addtableShow: false,
      addTableData: {
        headerId: "",
        popTitle: "",
        Title: "",
        DetailTitle: "",
        DataUrl: "",
        Details: [],
        SaveUrl: "",
        SaveUrlType: "",
      },
      addformtableShow: false,
      formTableData: {
        popTitle: "",
        Buttons: [],
        tableHeader: [],
        Ids: [],
        DataUrlType: "",
        DataUrl: "",
      },
    };
  },
  watch: {
    $route(n, o) {
      this.init();
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  computed: {
    haveWeightLabel() {
      return this.title.find(_ => _.FieldIndex == "MaterialAmount" || _.FieldName == "数量")
    },
    selectCountWeight() {
      return this.tableDataArr.reduce((sum, w) => { return Number(w.MaterialAmount) + sum }, 0)
    }
  },
  methods: {
    OpenTableShow(item) {
      this.addtableShow = true;
    },
    //页面初始化
    init() {
      this.tableWatchFlag = !this.tableWatchFlag;
      this.btnData = [];
      this.btnPowerArr = [];
      this.tableData = [];
      this.tableDataArr = [];
      this.SearchData = [];
      this.btnPowerArr = this.$store.state.dailog.AutorizedBtnList;
      this.id = this.$route.query.name;
      if (this.id == undefined) {
        this.id = "";
        return;
      }
      this.loading = true;
      this.allpage = 0;
      getPageInfo(this.id)
        .then((res) => {
          this.loading = false;
          let data = JSON.parse(res.data.resultdata);
          // console.log("ff" + data);
          if (data != null && data != "") {
            this.searchdata = data.filter_list; //查询条件
            this.btnData = data.Btn_list; //按钮列表

            this.name = [];
            this.title = [];
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
            var JumpType = this.$route.query.type;
            this.queryArr = [];
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
            } else {
              this.queryArr = [];
            }
            // console.log(data.Field_list)
            this.tableUrl = data.URL;
            this.tableFun(this.tableUrl, this.queryArr);
          }
        })
        .catch((error) => {
          this.loading = false;
          alert(error);
        });
    },
    //调整
    jumpFun(data) {
      if (this.tableDataArr.length == 0) {
        this.tipsType = "7";
        this.tipsShow = true;
        this.textInfo = "请至少勾选一个";
      } else if (this.tableDataArr.length > 1) {
        this.tipsType = "7";
        this.tipsShow = true;
        this.textInfo = "不可多选查看子菜单";
      } else {
        var value = this.editVFun(data);
        this.$store.state.dailog.routerArr = value;
        if (data.Route.length != 0) {
          var aa = data.Route.trim() + "1";
          let index =
            aa + "/" + data.Btn_Text + "/" + data.ChildPageID + "/" + 2;
          var query = {
            id: data.Btn_Text,
            name: data.ChildPageID,
            type: "2",
          };
          this.$router.push({
            path: aa,
            query: query,
          });
          addTagNavList(index, query);
        } else {
          this.$router.push({
            path: `/konbi`,
            query: {
              id: `你好`,
              name: `2DC5DF27-E93D-41EC-8811-1BC6D53416BC`,
              type: "2",
            },
          });
        }
      }
    },
    //开启上传图片
    upImgPop(data) {
      if (this.tableDataArr.length == 0) {
        this.tipsType = "7";
        this.tipsShow = true;
        this.textInfo = "请至少勾选一个";
      } else if (this.tableDataArr.length > 1) {
        this.tipsType = "7";
        this.tipsShow = true;
        this.textInfo = "不可多选编辑图片";
      } else {
        this.imgType = data.Btn_Type;
        this.imgdata = this.tableDataArr;
        this.upimgShow = true;
      }
    },
    //关闭弹窗
    cancelFun() {
      this.addShow = false;
      this.tipsShow = false;
      this.upimgShow = false;
      this.isAddList = false;
      this.addtableShow = false;
      this.addformtableShow = false;
    },
    //开启提示
    activeTips(text, item) {
      this.tipsShow = true;
      this.tipsType = "4";
      this.TitleText = text;
      this.item = item;
    },
    deleteBtn() {
      this.isMyPopShow = false;
    },
    handleDetails(flag, val) {
      this.isDetailsShow = false;
      if (flag) {
        axios
          .request({
            url: this.item.SumbitUrl,
            method: "post",
            data: val,
          })
          .then((res) => {
            this.myPopText = res.data.message;
            this.isMyPopShow = true;
          });
      }
    },
    handleDetailed() {
      this.isDetailedShow = false;
    },
    handleAlarm() {
      this.isAlarmShow = false;
    },
    //接收表格数据
    tabelFun(data) {
      this.tableDataArr = data;
      // console.log(this.tableDataArr)
      // console.log(this.tableData)
    },
    //表格数据
    tableFun(url, queryArr) {
      this.loading1 = true;
      getPageTableData(url, queryArr)
        .then((res) => {
          this.loading1 = false;
          if (this.title != 0) {
            //  console.log('获取表格数据=》'+res.data.resultdata)
            let data = JSON.parse(res.data.resultdata);

            // let data = JSON.parse(JSON.stringify(res.data.resultdata));
            this.tableData = data;
            this.stateFun();
            this.allpage = this.tableData.length;
          }
        })
        .catch((error) => {
          this.loading1 = false;
          // alert(error);
        });
    },
    //开启添加编辑
    activePop(text, item) {
      console.log(item);
      //编辑类
      if (item.WindowType == "2" || item.WindowType == "3") {
        if (this.tableDataArr.length == 0) {
          this.tipsType = "0";
          this.tipsShow = true;
        } else if (this.tableDataArr.length > 1 && item.WindowType == "2") {
          this.tipsType = "2";
          this.tipsShow = true;
        } else {
          this.popTitle = text;
          this.item = item;
          this.addShow = true;
          this.loading2 = true;
          // var editUrl = `COMmon/Common/RenderEditWindows?Page_ID=${this.id}&WindowType=2`;
          let editUrl = {
            Page_ID: this.id,
            WindowType: 2,
          };
          this.PopDomFun(editUrl).then((val) => {
            //请求编辑排版
            var v = this.editVFun(item);
            console.log(this.item);
            // console.log("vvvvv", v);
            // var url = `${this.$store.state.dailog.url1}${item.PopupUrl}`;
            // //请求编辑内容
            // this.$request({
            //   method: "post",
            //   url: url,
            //   data: v,
            // }).then((res) => {
            //   //  console.log("dataV==>", res);
            //   var dataV = JSON.parse(res.data.resultdata);
            //   this.loading2 = false
            //   this.$refs.addpop.Rendering(dataV, this.addData);
            //   resolve("成功了");
            // })
            //   .catch((err) => {
            //     console.log("err", err);
            //   });
            popupEditorData(item.PopupUrl, v)
              .then((res) => {
                var dataV = JSON.parse(res.data.resultdata);
                this.loading2 = false;
                // console.log(33)
                //  console.log(this.addData)
                this.$refs.addpop.Rendering(dataV, this.addData);
                // resolve("成功了");
              })
              .catch((err) => {
                console.log("err", err);
              });
          });
        }
      } else if (item.WindowType == "1") {
        //新增类
        this.popTitle = text;
        this.item = item;
        this.addShow = true;
        // var url = `COMmon/Common/RenderEditWindows?Page_ID=${this.id}&WindowType=1`;
        let editUrl = {
          Page_ID: this.id,
          WindowType: 1,
        };
        this.PopDomFun(editUrl).then((val) => {
          this.$refs.addpop.addSelecFun(this.addData);
        });
      } else if (item.WindowType == "0") {
        if (this.tableDataArr.length) {
          this.isDetailsShow = true;
          this.item = item;
        } else {
          this.myPopText = "请勾选内容";
          this.isMyPopShow = true;
        }
      } else if (item.WindowType == "4") {
        if (this.tableDataArr.length) {
          if (this.tableDataArr.length > 1) {
            this.myPopText = "请勾选一条内容";
            this.isMyPopShow = true;
            return;
          }
          this.isDetailedShow = true;
          this.item = item;
        } else {
          this.myPopText = "请勾选内容";
          this.isMyPopShow = true;
        }
      } else if (item.WindowType == "5") {
        if (this.tableDataArr.length) {
          if (this.tableDataArr.length > 1) {
            this.myPopText = "请勾选一条内容";
            this.isMyPopShow = true;
            return;
          }
          this.isAlarmShow = true;
          this.item = item;
        } else {
          this.myPopText = "请勾选内容";
          this.isMyPopShow = true;
        }
      } else if (item.WindowType == "6") {
        // 新增
        this.$request({
          method: "get",
          url: item.PopupUrl,
        }).then((res) => {
          let data = JSON.parse(res.data.resultdata);
          this.addTableData = {
            headerId: "",
            popTitle: text,
            ...data,
          };
          this.addtableShow = true;
          this.item = item;
        });
      } else if (item.WindowType == "8") {
        // 编辑
        if (this.tableDataArr.length) {
          if (this.tableDataArr.length > 1) {
            this.myPopText = "请勾选一条内容";
            this.isMyPopShow = true;
            return;
          }
          this.$request({
            method: "get",
            url: item.PopupUrl,
          }).then((res) => {
            let data = JSON.parse(res.data.resultdata);
            this.addTableData = {
              headerId: this.tableDataArr[0].Id,
              popTitle: text,
              ...data,
            };
            this.addtableShow = true;
            this.item = item;
          });
        } else {
          this.myPopText = "请勾选内容";
          this.isMyPopShow = true;
        }
      } else if (item.WindowType == "7") {
        if (this.tableDataArr.length) {
          if (this.tableDataArr.length > 1 && item.IsMultipleChoice == 0) {
            this.myPopText = "请勾选一条内容";
            this.isMyPopShow = true;
            return;
          }
          this.$request({
            method: "get",
            url: item.PopupUrl,
          }).then((res) => {
            let data = JSON.parse(res.data.resultdata);
            console.log("data:", data);

            this.formTableData.popTitle = data.Title;
            this.formTableData.tableHeader = [...data.Fields];
            console.log(this.tableDataArr);

            this.formTableData.Ids = [];
            this.tableDataArr.forEach((item1) => {
              this.formTableData.Ids.push(item1.Id);
            });
            this.formTableData.Buttons = [...data.Buttons];
            this.formTableData.DataUrl = data.DataUrl;
            this.formTableData.DataUrlType = data.DataUrlType;

            this.item = item;
            this.addformtableShow = true;
          });
        } else {
          this.myPopText = "请勾选内容";
          this.isMyPopShow = true;
        }
      } else if (item.WindowType == "9") {
        if (this.tableDataArr.length > 0) {
          this.$request({
            method: "get",
            url: item.PopupUrl,
          }).then((res) => {
            let data = JSON.parse(res.data.resultdata);
            console.log("data:", data);

            this.formTableData.popTitle = data.Title;
            this.formTableData.tableHeader = [...data.Fields];
            console.log(this.tableDataArr);

            this.formTableData.Ids = [];
            this.tableDataArr.forEach((item1) => {
              this.formTableData.Ids.push(item1.Id);
            });
            this.formTableData.Buttons = [...data.Buttons];
            this.formTableData.DataUrl = data.DataUrl;
            this.formTableData.DataUrlType = data.DataUrlType;

            this.item = item;
            this.addformtableShow = true;
          });
        } else {
          this.myPopText = "请勾选内容";
          this.isMyPopShow = true;
        }
      }
    },
    showPop(text) {
      this.myPopText = text;
      this.isMyPopShow = true;
    },
    //排版内容
    PopDomFun(editUrl) {
      return new Promise((resolve, reject) => {
        // var url = `${this.$store.state.dailog.url1}${editUrl}`;
        // this.$request({
        //   method: "get",
        //   url: url,
        // }).then((res) => {
        //   var editdata = JSON.parse(res.data.resultdata);
        //   for (var i = 0; i < editdata.length; i++) {
        //     editdata[i].value = "";
        //     editdata[i].isupdateavailable = "1";
        //   }
        //   this.addData = editdata;
        //   resolve("成功了");
        // });
        tableSettingContent(editUrl.Page_ID, editUrl.WindowType).then((res) => {
          let editdata = JSON.parse(res.data.resultdata);
          for (var i = 0; i < editdata.length; i++) {
            editdata[i].value = "";
            editdata[i].isupdateavailable = "1";
          }
          this.addData = editdata;
          resolve("成功了");
        });
      });
    },

    //编辑内容参数
    editVFun(data) {
      var Params = data.Params;
      var paramData = [];
      this.value = [];
      for (let i = 0; i < Params.length; i++) {
        paramData.push(Params[i].ParamName);
      }
      let value2 = {};
      for (let j = 0; j < paramData.length; j++) {
        for (var item in this.tableDataArr[0]) {
          if (item == paramData[j]) {
            var o = {};
            var str = `o.${item}="${this.tableDataArr[0][item]}"`;
            eval(str);
            Object.assign(value2, o);
            break;
          } else {
            var o1 = {};
            var str1 = "o1." + paramData[j] + "=''";
            eval(str1);
            Object.assign(value2, o1);
          }
        }
      }
      return value2;
    },
    //刷新表单数据
    UptableFun() {
      this.loading1 = true;
      var JumpType = this.$route.query.type;
      if (JumpType == "2") {
        var routerArr = this.$store.state.dailog.routerArr;
        // console.log(routerArr)
        for (var i in routerArr) {
          var queryValue = {
            name: i,
            logic: "=",
            value: routerArr[i],
          };
          this.SearchData.push(queryValue);
        }
      }
      getPageTableData(this.tableUrl, this.SearchData)
        .then((res) => {
          this.loading1 = false;
          let data = JSON.parse(res.data.resultdata);
          console.log("data8888", res);
          this.tableData = data;
          this.stateFun();
          this.allpage = this.tableData.length;
          this.addShow = false;
        })
        .catch((error) => {
          this.loading1 = false;
          // console.log(error);
        });
    },
    //状态文本
    stateFun() {
      getTableCondition(this.id)
        .then((res) => {
          var data = JSON.parse(res.data.resultdata);
          if (data.length) {
            for (let i = 0; i < data.length; i++) {
              var name = data[i].QuoteColumn;
              for (let k = 0; k < data[i].Base_QuoteDetailList.length; k++) {
                for (let j = 0; j < this.tableData.length; j++) {
                  if (
                    this.tableData[j][name] ==
                    data[i].Base_QuoteDetailList[k].Val
                  ) {
                    this.tableData[j][name] =
                      data[i].Base_QuoteDetailList[k].Name;
                    if (data[i].Base_QuoteDetailList[k].Color != undefined) {
                      if (data[i].Base_QuoteDetailList[k].Color != null) {
                        this.tableData[j].Color =
                          data[i].Base_QuoteDetailList[k].Color;
                      }
                    }
                  }
                }
              }
            }
          }
        })
        .catch((error) => {});
    },

    //筛选表单
    searchDataFun(data) {
      this.SearchData = JSON.parse(JSON.stringify(data));
      if (this.$route.query.type == "2") {
        this.SearchData.push(this.queryArr[0]);
      }
      // 修改时间参数格式
      for (let i = 0; i < this.SearchData.length; i++) {
        // console.log(this.SearchData[i].logic)
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
            // this.SearchData.splice(i, 1);
          }
        }
      }
      this.SearchData = this.SearchData.filter((val) => val.logic != "date");
      this.tableFun(this.tableUrl, this.SearchData);
    },
    //批量添加
    addList(item) {
      if (item.WindowType == "1") {
        //新增类
        this.popTitle = "批量添加";
        this.item = item;
        this.isAddList = true;
        // var url = `COMmon/Common/RenderEditWindows?Page_ID=${this.id}&WindowType=1`;
        let editUrl = {
          Page_ID: this.id,
          WindowType: 1,
        };
        this.PopDomFun(editUrl).then((val) => {
          this.$refs.addListPop.addSelecFun(this.addData);
        });
      }
    },

    //直接请求
    myRequest(item) {
      axios
        .request({
          url: item.SumbitUrl,
          method: "post",
        })
        .then((res) => {
          this.tipsType = "7";
          this.tipsShow = true;
          this.textInfo = res.data.message;
        });
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
      let data1 = [];
      if (this.tableDataArr.length > 0) {
        data1 = this.tableDataArr;
      } else {
        data1 = this.tableData;
      }
      let title1 = this.title.map((item) => {
        return item.FieldName;
      });
      require.ensure([], () => {
        const {
          export_json_to_excel,
        } = require("../../vendor/Export2Excel1.js");
        const tHeader = title1;
        const filterVal = this.name;
        const list = data1;
        const data = this.formatJson(filterVal, list);
        export_json_to_excel(tHeader, data, "表单列表", true);
      });
    },

    //导入
    importExcelData(item) {
      console.log(item);
      let Page_ID = item.Page_ID;
    },
  },
};
</script>

<style lang="less">
.list-page {
  width: 100%;
  height: 100%;
  position: relative;

  .list-header {
    overflow: hidden;
  }
  .list-search {
    width: 70%;
    float: left;
  }
  .list-btn {
    float: right;
    width: 30%;
    text-align: right;
  }
  .list-table {
    margin-top: 10px;
    position: relative;

    .select-count {
      position: absolute;
      right: 0;
      top: 0;
      width: fit-content;
    }
  }
  .list-paginate {
    padding-bottom: 10px;
  }
}
</style>