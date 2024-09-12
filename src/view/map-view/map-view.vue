<template>
  <div class="map-view" ref="map">
    <div class="map-title">
      <div class="map-title-sel">
        <span class="map_text">排：</span>
        <el-select
          popper-class="select-dropdown-class-li"
          v-model="rowValue"
          placeholder="请选择"
          @change="rowValueChange"
        >
          <el-option
            v-for="item in allRowList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="map-title-sel">
        <span class="map_text">列：</span>
        <el-select
          popper-class="select-dropdown-class-li"
          v-model="columnsValue"
          placeholder="请选择"
        >
          <el-option
            v-for="item in allColumnsList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="map-title-sel">
        <span class="map_text">层：</span>
        <el-select
          popper-class="select-dropdown-class-li"
          v-model="floorValue"
          placeholder="请选择"
          @change="floorValueChange"
        >
          <el-option
            v-for="item in allFloorList"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
     
      <div class="map-title-sel">
        <!-- <span class="map_text">托盘号：</span> -->
        <span class="map_text">计划号：</span>
        <el-input
          class="title-input"
          v-model="trayNum"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <el-button @mousedown.native="down" @click="chaXunFun" class="btn-style1"
        ><img :src="chaxun" />查看</el-button
      >
    </div>
    <div class="map-content">
      <div class="map-left" v-loading="loading">
        <div class="left-title">
          <el-button
            @click="showView(true)"
            class="btn-style11"
            :class="{ active1: isActive }"
            >俯视</el-button
          >
          <el-button
            @click="showView(false)"
            class="btn-style11"
            :class="{ active1: !isActive }"
            >侧视</el-button
          >
          <div class="left-title-zoom">
            <i class="el-icon-zoom-in" @click="zoomIn"></i>
            <div class="left-title-text">{{ (zoom * 100).toFixed(0) }}%</div>
            <i class="el-icon-zoom-out" @click="zoomOut"></i>
          </div>
        </div>

        <!-- <vue-drag-resize> -->
        <div
          style="position: relative; height: 80%; overflow: auto; width: 100%"
        >
          <!-- <vue-drag-resize :parentLimitation="true"> -->
          <div
            class="map-table"
            :style="
              'height:80%;transform: scale(' +
              zoom +
              ');transform-origin: top;transform-origin-x: left;'
            "
            @mousewheel="tableMapFun"
          >
            <!-- 列数 -->
            <div class="columns-title" :style="{ width: trendsStyle.lWidth }">
              <div class="title">
                <div class="title-text title-text1">列</div>
                <div class="title-line"></div>
                <div class="title-text title-text2">
                  {{ isActive ? "排" : "层" }}
                </div>
              </div>
              <div
                class="title1"
                v-for="i in columnsList"
                :key="i"
                :style="{
                  width: trendsStyle.eleWidth,
                }"
              >
                {{ i }}
              </div>
            </div>
            <div
              class="columus-data"
              ref="columusData"
              @mousewheel="scrool"
              :style="{
                width: trendsStyle.lWidth,
              }"
            >
              <div v-for="(item, index) in rowAlldata" :key="index">
                <div class="columus-text">
                  <div class="title">
                    {{ item.rowNum }}
                  </div>

                  <div
                    class="title1"
                    v-for="(i, index1) in item.data"
                    :key="index1"
                    @click="showData(i)"
                    :class="{ color3: !i.IsFull, color1: i.IsFull }"
                    @contextmenu.prevent.stop="rightClick(i, $event)"
                    :style="{
                      width: trendsStyle.eleWidth,
                      visibility: i.isFlag ? 'visible' : 'hidden',
                    }"
                  >
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :open-delay="400"
                      :content="i.ContainerID"
                      placement="top-start"
                      popper-class="tooltip-popper"
                    >
                      <div class="toopltip-style">
                        <div class="border-size"></div>
                        <div class="border-box" v-show="i.isShow"></div>

                        <!-- {{ i.ContainerID.split("-")[0] }} -->

                        <p>
                          {{
                            i.ContainerID.slice(
                              i.ContainerID.split("-")[0].length + 1
                            )
                          }}
                        </p>

                        <div class="pic">
                          <!-- <span v-show="i.isShow">
                      2021043001
                      
                    </span> -->
                          <img
                            v-show="i.ISLocked == '1'"
                            style="margin-right: 5px"
                            :src="suoding"
                          />
                          <img v-show="i.ISHold == '1'" :src="jingyong" />
                          <!-- <img style="margin-right: 5px" :src="suoding" />
                      <img :src="jingyong" /> -->
                        </div>
                      </div>
                    </el-tooltip>
                  </div>
                </div>
                <div
                  v-show="(index + 1) % 2 == 0 && isActive && item.depth == 1"
                  class="text-line"
                >
                  <div class="text-line1"></div>
                </div>
              </div>
            </div>
          </div>
          <!-- </vue-drag-resize> -->
        </div>
        <!-- </vue-drag-resize> -->
        <!-- <div class="page-style">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage1"
            :page-size="19"
            layout="prev, pager, next"
            :total="totalNum"
          >
          </el-pagination>
        </div> -->
      </div>
      <div class="map-right">
        <div class="map-right-top">
          <div class="right-top-list">
            <div class="top-text">
              <img :src="suoding" /><span>已锁定</span>
            </div>
            <div
              class="top-text"
              v-for="item in rightTop"
              :key="item.fieldvalue"
            >
              <div class="text-type" :style="{ background: item.color }"></div>
              <!-- <span>大托盘</span> -->
              <span>{{ item.fieldtext }}</span>
            </div>

            <div class="top-text">
              <div class="text-type color31"></div>
              <span>空货位</span>
            </div>
          </div>
        </div>
        <div class="map-right-bottom">
          <div class="right-bottom-list">
            <div class="bottom-text">
              <div class="badge"></div>
              <span class="text-title">{{ chackData.ContainerID }}</span>
            </div>
            <div
              v-for="(item, index) in TrayInfo"
              :key="'dd' + index"
              class="bottom-text"
            >
              <!-- <span class="text-title1">托盘号：{{ chackData.TrayNum?chackData.TrayNum:'' }}</span> -->
              <!-- {{index}} -->
              <!-- {{chackData}} -->
              <span class="text-title1"
                >{{ item }}：{{
                  chackData[index] ? chackData[index] : ""
                }}</span
              >
            </div>
            <!-- <div class="bottom-text">
              
              <span class="text-title1">车型：{{ chackData.cartype?chackData.cartype:''}}</span>
            </div>
            <div class="bottom-text">
              <span class="text-title1">颜色：{{ chackData.color?chackData.color:''}}</span>
            </div>
            <div class="bottom-text">
              <span class="text-title1">产线：{{ chackData.line?chackData.line:''}}</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <div
      class="rightmenu"
      ref="rightmenu"
      :style="{ top: clientY, left: clientX }"
      v-if="showmenucover"
    >
      <ul>
        <li v-for="item in rightmenus" @click="changetype(item)" :key="item.id">
          {{ item.ButtonText }}
        </li>
      </ul>
    </div>
    <div
      class="rightmenucover"
      v-if="showmenucover"
      @click="rightmenucover"
    ></div>

    <tipsPop
      :text="tipsText"
      @deleteBtn="deleteBtn"
      :deleteShow="deleteShow"
      v-if="tipsPopShow"
    ></tipsPop>
    <details-pop
      :data="itemdata"
      @handleDetails="handleDetails"
      v-if="detailsPopShow"
    />
    <div v-if="tipsPopShow || detailsPopShow" class="mask_box"></div>
  </div>
</template>
<script>
import "./map-view.less";
import jingyong from "@/assets/img1/jingyong.png";
import suoding from "@/assets/img1/suoding.png";
import { getMap, getContainerMapInfo } from "@/api/home.js";
import chaxun from "@/assets/img1/chaxun.png";
import axios from "@/libs/api.request";
import VueDragResize from "vue-drag-resize";
import tipsPop from "./tipsPop";
import DetailsPop from "./details-pop.vue";
export default {
  components: {
    VueDragResize,
    tipsPop,
    DetailsPop,
  },
  data() {
    return {
      itemdata: "",
      tipsText: "",
      deleteShow: true,
      tipsPopShow: false,
      detailsPopShow: false,
      showmenucover: false,
      ButtonText: "",
      SubmitUrl: "",
      chaxun: chaxun,
      loading: false,
      rightmenus: ["开锁", "解锁", "手动出库"],
      clientX: 0,
      clientY: 0,
      suoding: suoding,
      jingyong: jingyong,
      isActive: true,
      rowValue: "", //排
      allRowList: [], //总排数
      columnsValue: "", //列
      allColumnsList: [], //总列数
      columnsList: [], //页面列数
      floorValue: "", //层
      allFloorList: [], //总层数
       allDepthList: [], //总深度数
      trayNum: "", //托盘号
      mapData: "", //图库数据
      totalNum: 0,
      currentPage1: 1,
      rowAlldata: [], //俯视数据内容
      staNum: 0,
      endNum: 0,
      rowData: [],
      chackData: "",
      zoom: 1,
      rightTop: {},
      TrayInfo: {},
      piePage: 0, //获取层数
      trendsStyle: {
        lWidth: "",
        eleWidth: "",
        eleHeight: "",
      },
    };
  },
  directive: {
    drag2: function (el) {
      // let dragBox = el; //获取当前元素
      el.onmousedown = (e) => {
        console.log(1);
      };
    },
    //   dragBox.onmousedown = e => {
    //     let box = document.querySelector('.scPopBox')

    //     //算出鼠标相对元素的位置
    //     let disX = e.clientX - dragBox.offsetLeft;
    //     let disY = e.clientY - dragBox.offsetTop;
    //     document.onmousemove = e => {
    //       //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
    //       let left = e.clientX - (Number(disX));
    //       let top = e.clientY - (Number(disY));
    //       //移动当前元素
    //       box.style.left = left + "px";
    //       box.style.top = top + "px";
    //     };
    //     document.onmouseup = e => {
    //       document.onmousemove = null;
    //       document.onmouseup = null;
    //     };
    //   };
    // }
  },
  methods: {
    initStyle() {
      if (window.screen.width == 1024) {
        if (this.columnsList.length <= 21) {
          this.trendsStyle.lWidth = this.columnsList.length * 38 + 30 + "px";
          this.trendsStyle.eleWidth = "38px";
          this.trendsStyle.eleHeight = "38px";
        } else {
          this.trendsStyle.lWidth = 21 * 38 + 30 + "px";
          this.trendsStyle.eleWidth =
            (21 * 38) / this.columnsList.length + "px";
          // this.trendsStyle.eleHeight = "25px";
        }
      } else {
        if (this.columnsList.length <= 24) {
          this.trendsStyle.lWidth = this.columnsList.length * 75 + 30 + "px";
          this.trendsStyle.eleWidth = "75px";
          this.trendsStyle.eleHeight = "75px";
        } else {
          this.trendsStyle.lWidth = 24 * 75 + 30 + "px";
          this.trendsStyle.eleWidth =
            (24 * 75) / this.columnsList.length + "px";
          // this.trendsStyle.eleHeight = "25px";
        }
      }
    },
    changetype(data) {
      this.SubmitUrl = data.SubmitUrl;
      this.showmenucover = false;
      this.ButtonText = data.ButtonText;
      console.log(data);
      if (data.ButtonText == "出库" && !data.Type) {
        this.detailsPopShow = true;
      } else {
        this.tipsPopShow = true;
        this.deleteShow = true;
        this.tipsText = `是否确定将【${this.itemdata.barcode}】进行【${data.ButtonText}】`;
      }
    },
    deleteBtn(num) {
      this.tipsPopShow = false;
      if (num === "1") return;
      if (this.itemdata && num === "2") {
        // let type;
        // if (data == "手动出库") {
        //   type = 1;
        // } else if (data == "锁定") {
        //   type = 2;
        // } else if (data == "解锁") {
        //   type = 3;
        // }
        axios
          .request({
            url: this.SubmitUrl,
            method: "post",
            data: this.itemdata,
          })
          .then((res) => {
            this.tipsPopShow = true;
            this.deleteShow = false;
            if (res.data.isLogin) {
              this.tipsText = `【${this.ButtonText}】成功！`;
            } else {
              this.tipsText = `${res.data.message}`;
            }
            this.loading = false;
            this.showmenucover = false;
            // this.init();
            this.allRowList = [];
            this.allColumnsList = [];
            this.allFloorList = [];
            this.allDepthList = [];
            this.loading = true;
            getMap()
              .then((res) => {
                this.loading = false;
                if (res.data.resultdata) {
                  // console.log()
                  this.mapData = JSON.parse(res.data.resultdata);
                  for (let i = 0; i < this.mapData.length; i++) {
                    this.allFloorList.push(this.mapData[i].Plie);
                    this.allRowList.push(this.mapData[i].RowNum);
                    this.allColumnsList.push(this.mapData[i].Line);
                    this.allDepthList.push(this.mapData[i].Depth);
                  }
                  this.allFloorList = this.getMapTitle(this.allFloorList); //获取层数
                  this.allRowList = this.getMapTitle(this.allRowList); //获取排数
                  this.allColumnsList = this.getMapTitle(this.allColumnsList); //获取列数
                  this.allDepthList = this.getMapTitle(this.allDepthList); //获取深度数
                  // this.floorValue =
                  //   this.allFloorList[this.allFloorList.length - 1];
                  // this.rowValue = this.allRowList[0];
                  // this.columnsValue = this.allColumnsList[0];
                   // this.totalNum = this.allColumnsList.length;

                  // this.piePage = Math.max(...this.allFloorList);
                  // this.overLooking(this.piePage);
                  // this.handleCurrentChange(1);
                  // this.showView(this.isActive);
                  if (!this.isActive) {
                    this.sideLooking(this.rowValue);
                  } else {
                    this.overLooking(this.floorValue);
                  }
                  this.handleCurrentChange(1);
                }
              })
              .catch((error) => {
                this.loading = false;
                console.log(error);
              });
          })
          .catch((error) => {
            this.loading = false;
            console.log(error);
          });
        // WHTrayInfo(this.itemdata, type)
        //   .then((res) => {
        //     this.loading = false;
        //   })
        //   .catch((error) => {
        //     this.loading = false;
        //     console.log(error);
        //   });
      }
    },
    handleDetails(flag, val) {
      this.detailsPopShow = false;
      if (flag) {
        axios
          .request({
            url: this.SubmitUrl,
            method: "post",
            data: val,
          })
          .then((res) => {
            this.tipsPopShow = true;
            this.deleteShow = false;
            if (res.data.isLogin) {
              this.tipsText = `【${this.ButtonText}】成功！`;
            } else {
              this.tipsText = `${res.data.message}`;
            }
            this.loading = false;
            this.showmenucover = false;
            // this.init();
            this.allRowList = [];
            this.allColumnsList = [];
            this.allFloorList = [];
            this.allDepthList = [];
            this.loading = true;
            getMap()
              .then((res) => {
                this.loading = false;
                if (res.data.resultdata) {
                  // console.log()
                  this.mapData = JSON.parse(res.data.resultdata);
                  for (let i = 0; i < this.mapData.length; i++) {
                    this.allFloorList.push(this.mapData[i].Plie);
                    this.allRowList.push(this.mapData[i].RowNum);
                    this.allColumnsList.push(this.mapData[i].Line);
                    this.allDepthList.push(this.mapData[i].Depth);
                  }
                  this.allFloorList = this.getMapTitle(this.allFloorList); //获取层数
                  this.allRowList = this.getMapTitle(this.allRowList); //获取排数
                  this.allColumnsList = this.getMapTitle(this.allColumnsList); //获取列数
                  this.allDepthList = this.getMapTitle(this.allDepthList); //获取深度数
                  // this.floorValue =
                  //   this.allFloorList[this.allFloorList.length - 1];
                  // this.rowValue = this.allRowList[0];
                  // this.columnsValue = this.allColumnsList[0];
                   // this.totalNum = this.allColumnsList.length;

                  // this.piePage = Math.max(...this.allFloorList);
                  // this.overLooking(this.piePage);
                  // this.handleCurrentChange(1);
                  // this.showView(this.isActive);
                  if (!this.isActive) {
                    this.sideLooking(this.rowValue);
                  } else {
                    this.overLooking(this.floorValue);
                  }
                  this.handleCurrentChange(1);
                }
              })
              .catch((error) => {
                this.loading = false;
                console.log(error);
              });
          });
      }
    },
    rightmenucover() {
      this.showmenucover = false;
    },
    zoomIn() {
      if (this.zoom < 3) {
        this.zoom += 0.2;
        if (parseInt(this.trendsStyle.eleWidth) < 75) {
          if (parseInt(this.trendsStyle.eleWidth) * this.zoom > 75) {
            this.trendsStyle.lWidth = this.columnsList.length * 75 + 30 + "px";
            this.trendsStyle.eleWidth = "75px";
            this.trendsStyle.eleHeight = "75px";
          } else {
            this.trendsStyle.lWidth =
              parseInt(this.trendsStyle.lWidth) * this.zoom + "px";
            this.trendsStyle.eleWidth =
              parseInt(this.trendsStyle.eleWidth) * this.zoom + "px";
          }
        }
      }
    },
    zoomOut() {
      if (this.zoom > 1) {
        this.zoom -= 0.2;
        if (
          parseInt(this.trendsStyle.eleWidth) >
          (24 * 75) / this.columnsList.length
        ) {
          if (
            parseInt(this.trendsStyle.eleWidth) * 0.8 <
            (24 * 75) / this.columnsList.length
          ) {
            this.trendsStyle.lWidth = 24 * 75 + 30 + "px";
            this.trendsStyle.eleWidth =
              (24 * 75) / this.columnsList.length + "px";
          } else {
            this.trendsStyle.eleWidth =
              parseInt(this.trendsStyle.eleWidth) * 0.8 + "px";
            this.trendsStyle.lWidth =
              parseInt(this.trendsStyle.eleWidth) * this.columnsList.length +
              30 +
              "px";
          }
        }
        if (this.zoom == 1) {
          this.initStyle();
        }
      }
    },
    async rightClick(item, e) {
      // if (item.ISLocked === 1) {
      //   this.rightmenus = ["解锁", "手动出库"];
      // } else {
      //   this.rightmenus = ["锁定", "手动出库"];
      // }
      const scrollY =
        document.documentElement.clientHeight || document.body.clientHeight;
      const y = scrollY - e.clientY;

      this.showmenucover = true;
      let height = 0;
      await this.$nextTick(() => {
        height = this.$refs.rightmenu.offsetHeight;
      });

      this.clientY = y >= height ? e.clientY + "px" : e.clientY - height + "px";
      this.clientX = e.clientX + "px";
      this.showmenucover = true;
      this.itemdata = item;
    },
    //数据初始化，row为排 line为列 初始化层数、排数、列数
    init() {
      this.allRowList = [];
      this.allColumnsList = [];
      this.allFloorList = [];
      this.allDepthList = [];
      this.loading = true;
      getMap()
        .then((res) => {
          this.loading = false;
          if (res.data.resultdata) {
            // console.log()
            this.mapData = JSON.parse(res.data.resultdata);
            for (let i = 0; i < this.mapData.length; i++) {
              this.allFloorList.push(this.mapData[i].Plie);
              this.allRowList.push(this.mapData[i].RowNum);
              this.allColumnsList.push(this.mapData[i].Line);
              this.allDepthList.push(this.mapData[i].Depth);
            }
            this.allFloorList = this.getMapTitle(this.allFloorList); //获取层数
            this.allRowList = this.getMapTitle(this.allRowList); //获取排数
            this.allColumnsList = this.getMapTitle(this.allColumnsList); //获取列数
            this.allDepthList = this.getMapTitle(this.allDepthList); //获取深度数
            this.floorValue = this.allFloorList[0]; // this.allFloorList.length - 1
            this.rowValue = this.allRowList[0];
            this.columnsValue = this.allColumnsList[0];
             this.totalNum = this.allColumnsList.length;

            this.piePage = Math.min(...this.allFloorList);
            this.overLooking(this.piePage);
            this.handleCurrentChange(1);
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
      // this.getMapData()
    },
    tableMapFun() {},
    rowValueChange(val) {
      if (!this.isActive) {
        this.sideLooking(val);
        this.handleCurrentChange(1);
      }
    },
    floorValueChange(val) {
      if (this.isActive) {
        this.overLooking(val);
        this.handleCurrentChange(1);
      }
    },
    async chaXunFun() {
      this.allRowList = [];
      this.allColumnsList = [];
      this.allFloorList = [];
      this.allDepthList = [];
      this.loading = true;
      await getMap()
        .then((res) => {
          this.loading = false;
          if (res.data.resultdata) {
            // console.log()
            this.mapData = JSON.parse(res.data.resultdata);
            console.log(this.rowValue, this.floorValue);
            for (let i = 0; i < this.mapData.length; i++) {
              this.allFloorList.push(this.mapData[i].Plie);
              this.allRowList.push(this.mapData[i].RowNum);
              this.allColumnsList.push(this.mapData[i].Line);
              this.allDepthList.push(this.mapData[i].Depth);
            }
            this.allFloorList = this.getMapTitle(this.allFloorList); //获取层数
            this.allRowList = this.getMapTitle(this.allRowList); //获取排数
            this.allColumnsList = this.getMapTitle(this.allColumnsList); //获取列数
            this.allDepthList = this.getMapTitle(this.allDepthList); //获取深度数
            // this.floorValue = this.allFloorList[this.allFloorList.length - 1];
            // this.rowValue = this.allRowList[0];
            // this.columnsValue = this.allColumnsList[0];
             // this.totalNum = this.allColumnsList.length;

            // this.piePage = Math.max(...this.allFloorList);
            // // this.overLooking(this.piePage);
            // // this.handleCurrentChange(1);
            // this.showView(this.isActive);
            if (!this.isActive) {
              this.sideLooking(this.rowValue);
            } else {
              this.overLooking(this.floorValue);
            }
            this.handleCurrentChange(1);
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });

      this.chackData = "";
      let list = this.mapData;
      if (this.trayNum != "") {
        for (let i = 0; i < list.length; i++) {
          if (this.trayNum == list[i].TrayNum) {
            this.chackData = list[i];
            this.showData(list[i]);
            break;
          }
        }
        if (this.chackData == "") {
          this.$message({
            message: "查找不到该托盘号",
            type: "warning",
          });
        } else {
          this.rowValue = this.chackData.RowNum;
          this.columnsValue = this.chackData.Line;
          this.floorValue = this.chackData.Plie;
        }
      } else {
        if (
          this.rowValue &&
          this.columnsValue &&
          this.floorValue  
        ) {
          for (let i = 0; i < list.length; i++) {
            if (
              this.rowValue == list[i].RowNum &&
              this.columnsValue == list[i].Line &&
              this.floorValue == list[i].Plie  
            ) {
              this.chackData = list[i];
              break;
            }
          }
          if (this.chackData == "") {
            this.$message({
              message: "找不到此库位",
              type: "warning",
            });
          }
        }
      }

      if (this.chackData != "") {
        this.currentPage1 = Math.ceil(this.chackData.Line / 19);
        if (this.isActive) {
          //true为俯视
          this.overLooking(this.chackData.Plie);
          let hight =
            (this.$refs.columusData.offsetHeight *
              (this.chackData.RowNum - 1)) /
            this.rowAlldata.length;
          this.$refs.columusData.scrollTop = hight; //给地图div滚动条赋值
        } else {
          //false为侧视
          this.sideLooking(this.chackData.RowNum);
        }
        this.handleCurrentChange(this.currentPage1);
        this.showData(this.chackData);
      }
    },

    getMapTitle(list) {
      list = new Set(list);
      list = [...list];
      list = list.sort(function (a, b) {
        return a - b;
      });
      return list;
    },
    // 选择俯视或侧视
    showView(isActive) {
      this.isActive = isActive;
      if (isActive) {
        this.overLooking(this.piePage);
      } else {
        this.sideLooking(1);
      }
      this.currentPage1 = 1;
      this.handleCurrentChange(1);
      // console.log(this.isActive);
    },
    // 右侧显示数据
    showData(item) {
      this.chackData = item;
      var list = this.rowAlldata;
      for (var i = 0; i < list.length; i++) {
        let data = list[i].data;
        for (var j = 0; j < data.length; j++) {
          if (item.ContainerID == data[j].ContainerID) {
            data[j].isShow = true;
          } else {
            data[j].isShow = false;
          }
        }
      }
    },

    getMapData() {
      // alert(1)
    },
    //获取俯视数据方法 num为层数
    overLooking(num) {
      // var data;
      this.rowData = [];
      var data = this.mapData.filter((value) => {
        return value.Plie == num;
      });

      for (let i = 0; i < this.allRowList.length; i++) {
        let data1 = data.filter((value) => {
          value.isShow = false;
          return value.RowNum == this.allRowList[i];
        });
        data1 = data1.sort(this.compare("Line"));
        this.rowData.push(data1);
      }
      let depthList = [];
      for (let i = 0; i < this.rowData.length; i++) {
        depthList.push({
          rowNum: this.rowData[i][0].RowNum,
          depth: this.rowData[i][0].Depth,
          data: this.rowData[i][0],
        });
      }
    },
    //获取侧视视数据方法 num为排数
    sideLooking(num) {
      // var data;
      this.rowData = [];
      var data = this.mapData.filter((value) => {
        return value.RowNum == num;
      });

      for (let i = 0; i < this.allFloorList.length; i++) {
        let data1 = data.filter((value) => {
          value.isShow = false;
          return value.Plie == this.allFloorList[i];
        });
        data1 = data1.sort(this.compare("Line"));
        this.rowData.push(data1);
      }
    },
    //分页
    handleCurrentChange(val) {
      this.rowAlldata = [];
      if (val == 1) {
        this.staNum = 0;
      } else {
        this.staNum = (val - 1) * 19 - 1;
      }
      this.endNum = val * 19;

      this.columnsList = this.allColumnsList.slice(0); //this.staNum, this.endNum
      for (var i = 0; i < this.rowData.length; i++) {
        if (this.isActive) {
          this.rowAlldata.push({
            rowNum: this.rowData[i][0].Row,
            data: this.rowData[i].slice(0), //this.staNum, this.endNum
            depth: this.rowData[i][0].Depth,
          });
        } else {
          // console.log(this.rowData[i][0])
          this.rowAlldata.push({
            rowNum: this.rowData[i][0].Plie,
            data: this.rowData[i].slice(0), //this.staNum, this.endNum
            depth: this.rowData[i][0].Depth,
          });
        }
      }
      if (this.rowAlldata.length > 0) {
        this.rowAlldata = this.rowAlldata.reverse();
        this.rowAlldata.forEach((item) => {
          for (let i = 0; i < item.data.length; i++) {
            if (i + 1 != item.data[i].ContainerID.split("-")[1]) {
              item.data.splice(i, 0, { isFlag: false, ContainerID: "" });
            } else {
              item.data[i].isFlag = true;
            }
          }
        });
      }
      console.log(this.rowAlldata);
      this.initStyle();
    },
    //升序
    compare(property) {
      return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        return value1 - value2;
      };
    },
    //监听滚动事件
    scrool() {
      // console.log("===scrool===");
      // let scrolled = this.$refs.columusData.scrollTop;
      // console.log(scrolled);
    },
    down(event) {},
    //获取地图配置信息
    getContainerMapInfoFun() {
      getContainerMapInfo()
        .then((res) => {
          // console.log(res)
          const data = res.data;
          if (data) {
            let AttrText = data.AttrText;
            // delete(AttrText.ISLocked)
            let TrayInfo = data.TrayInfo;
            let rightmenus = data.MapButtons;
            this.rightTop = AttrText;
            this.TrayInfo = TrayInfo;
            this.rightmenus = rightmenus;
            // console.log(this.rightmenus);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  mounted() {
    // this.$refs.columusData.addEventListener("scroll", this.scrool);
  },
  created() {
    this.init();
    this.getContainerMapInfoFun();
  },
};
</script>
<style lang="less" scoped>
.rightmenu {
  // width: 120px;
  // height: 90px;
  background: #f8f8f8;
  border: 1px solid #c6c6c6;
  box-shadow: 2px 2px 2px 0px rgb(143 144 145);
  position: fixed;
  top: 0;
  left: 0;
  padding: 8px;
  z-index: 1000;
  ul {
    list-style: none;
  }
  li {
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    text-indent: 1em;
  }
  li:hover {
    background: #d1e8fd;
    color: #23527c;
  }
}
.rightmenucover {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}
</style>