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
            :btnData="btnData.filter((_) => _.Btn_Type != 9)"
            :btnPowerData="btnPowerArr"
          ></all-button>
        </div>
      </div>
      <div class="list-table" v-loading="loading1">
        <list-table
          ref="homePage"
          :btnData="btnData.filter((_) => _.Btn_Type == 9)"
          :btnPowerData="btnPowerArr"
          :data="tableData"
          :name="name"
          :title="title"
          :tableWatchFlag="tableWatchFlag"
          :current-page="currentPage"
          :routerPathName="a"
        ></list-table>

        <!-- :data="[
            {
              TaskId: '1111',
              Row: 1,
              Line: 1,
              Depth: 1,
              Qty: 1,
              CreateOn: '2022-5-30 09:00:00',
              LastModifyOn: '2022-5-30 09:00:00',
            },
            {
              TaskId: '22222',
              Row: 2,
              Line: 2,
              Depth: 2,
              Qty: 2,
              CreateOn: '2022-5-27 09:00:00',
              LastModifyOn: '2022-5-27 09:00:00',
            },
          ]" -->
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
    <!-- 遮罩层 -->
    <div
      v-if="addShow || tipsShow || upimgShow || isAddList"
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
import {
  getPageInfo,
  getPageTableData,
  getTableCondition,
  tableSettingContent,
  popupEditorData,
  importExcel,
  saveCommonData,
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
    UpImg,
    AddListPop,
    // TipsPop,
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
      tableWatchFlag: false,
      a: "",
    };
  },

  watch: {
    $route(n, o) {
      this.a = this.$route.query.name;
      this.init();
    },
  },
  created() {
    this.init();
  },
  mounted() {
    this.a = this.$route.query.name;
  },
  methods: {
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
          console.log("ff", data);
          if (data != null && data != "") {
            this.searchdata = data.filter_list; //查询条件
            this.btnData = data.Btn_list; //按钮列表
            console.log("this.searchdata", this.searchdata);
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
            // this.tableFun(this.tableUrl, this.queryArr);//由搜索组件发起
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
    },
    //开启提示
    activeTips(text, item) {
      this.tipsShow = true;
      this.tipsType = "4";
      this.TitleText = text;
      this.item = item;
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
        .then(async (res) => {
          this.loading1 = false;
          if (this.title != 0) {
            // console.log("获取表格数据=》" + res.data.resultdata);
            let data = JSON.parse(res.data.resultdata);

            // let data = JSON.parse(JSON.stringify(res.data.resultdata));
            this.tableData = data;
            await this.stateFun();
            this.allpage = this.tableData.length;
          }
        })
        .catch((error) => {
          this.loading1 = false;
          // alert(error);
        });
    },
    //保存提交
    saveData(SumbitUrl, data) {
      saveCommonData(SumbitUrl, data)
        .then((res) => {
          if (res.data.isLogin) {
            this.$message({
              message: res.data.message,
              type: "success",
            });
            this.UptableFun(); //表单刷新
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: error,
            type: "error",
          });
        });
    },
    //开启添加编辑
    activePop(text, item) {
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
            // this.$axios({
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
      }
    },
    //排版内容
    PopDomFun(editUrl) {
      return new Promise((resolve, reject) => {
        // var url = `${this.$store.state.dailog.url1}${editUrl}`;
        // this.$axios({
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
    searchDataFun(data, kuweixinxiType) {
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
      if (kuweixinxiType) {
        this.SearchData.push(kuweixinxiType);
      }
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
  }
  .list-paginate {
    padding-bottom: 10px;
  }
}
</style>