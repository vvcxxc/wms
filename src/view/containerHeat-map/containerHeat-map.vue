<template>
  <div class="ContainerHeatMap">
    <div class="select">
      <span class="spans">时间范围:</span>
      <el-date-picker
        v-model="query.BeginDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      />
      <span class="spans">-</span>
      <el-date-picker
        v-model="query.EndDate"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择日期"
      />
      <span class="spans">颜色区间:</span>
      <el-select class="mySelect" v-model="query.SpecQty" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item"
          :label="item"
          :value="item"
        >
        </el-option>
      </el-select>
      <el-button class="btn-style1" @click="handleSearch">
        <img :src="chaxun" />查询
      </el-button>
    </div>

    <div class="containerHeatMap-content">
      <div class="map-content">
        <div>
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
          <span style="margin: 0 5px 0 20px">第</span>
          <el-select
            class="mySelect2"
            v-model="value"
            placeholder="请选择"
            @change="valueChange"
          >
            <el-option
              v-for="item in optionList"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <span style="margin-left: 5px">{{ isActive ? "层" : "排" }}</span>
        </div>

        <div class="lines">
          <div class="line" style="width: 30px"></div>
          <div class="line" v-for="item in arrLine" :key="item">
            {{ item >= 10 ? item : `0${item}` }}列
          </div>
        </div>

        <div
          class="plie-rows"
          v-for="(item, index) in arrPlieRow"
          :key="`plie-row${item}`"
        >
          <div class="plie-row plie-row-titles">
            <div class="plie-row-title" style="line-height: 30px">
              {{ item >= 10 ? item : `0${item}` }}
            </div>
            <div class="plie-row-title" style="line-height: 20px">
              {{ isActive ? "排" : "层" }}
            </div>
          </div>
          <div
            class="plie-row plie-row-style"
            v-for="(datas, idx) in listData[index]"
            :style="{
              background: datas.color,
              'border-color': datas.flag ? '#000000' : '#ffffff',
            }"
            :key="datas.ContainerNum"
            @click="handleClick(datas, index, idx)"
          ></div>
        </div>
      </div>

      <div class="color-msg">
        <div class="color-section">
          <div class="color-title">
            <div style="flex: 1">颜色</div>
            <div style="flex: 1">区间</div>
          </div>
          <div
            class="color-content"
            v-for="item in sectionList"
            :key="item.color"
          >
            <div style="width: 100px">
              <div :style="{ background: item.color }" class="color-contentK" />
            </div>
            <div style="width: 200px">
              <span class="color-span">{{ item.section }}</span>
              <span class="color-span">{{ item.min }}</span>
            </div>
          </div>
        </div>

        <div class="message">
          <div class="msg">
            <div class="msg-title">货格号</div>
            <div class="msg-content">
              {{ msg.name }}
            </div>
          </div>
          <div class="msg">
            <div class="msg-title">数量</div>
            <div class="msg-content">{{ msg.value }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetContainerHeatMap } from "@/api/home.js";
import chaxun from "@/assets/img1/chaxun.png";

import "./containerHeat-map.less";
export default {
  data() {
    return {
      chaxun,
      options: [1, 2, 3, 4, 5, 6, 7],
      colorList: [
        "#FFF8DC",
        "#FFE4C4",
        "#DEB887",
        "#D2691E",
        "#A0522D",
        "#800000",
        "#000000",
      ],
      query: {
        BeginDate: "",
        EndDate: "",
        SpecQty: 7,
      },
      allData: [], // 所有数据
      sectionList: [], // 颜色及区间数据
      arrPlie: [], // 层
      arrLine: [], // 列
      arrRow: [], //排
      listData: [], // 显示数据
      optionList: [], // 俯视为层，侧视为排
      arrPlieRow: [],
      isActive: true, // true为俯视，false为侧视
      value: 1, // 热力图排或层数
      msg: {
        // 选中的数据
        name: "",
        value: "",
      },
    };
  },
  created() {
    this.query.BeginDate = this.getYesterDayTime();
    this.query.EndDate = this.getNowTime();
    this.value = 1;
    this.isActive = true;
    this.initData(this.query);
  },
  methods: {
    // 数据初始化
    initData(query) {
      GetContainerHeatMap(query).then((res) => {
        this.value = 1;
        const { ContainerHeatSpecs, ContainerHeapCounts } = res.data;
        console.log(ContainerHeatSpecs);
        this.allData = ContainerHeapCounts;
        this.sectionList = ContainerHeatSpecs.map((item, index) => ({
          color: this.colorList[index],
          section: `${item.Min}~${item.Max}`,
          min: item.Min,
          max: item.Max,
        }));
        this.arrPlie = Array.from(
          new Set(ContainerHeapCounts.map((item) => item.Plie))
        ).sort((a, b) => {
          return b - a;
        });
        this.arrLine = Array.from(
          new Set(ContainerHeapCounts.map((item) => item.Line))
        ).sort((a, b) => {
          return a - b;
        });
        this.arrRow = Array.from(
          new Set(ContainerHeapCounts.map((item) => item.Row))
        ).sort((a, b) => {
          return b - a;
        });
        this.showView(this.isActive);
      });
    },
    // 查询
    handleSearch() {
      this.initData(this.query);
    },
    // 俯视、侧视
    showView(val) {
      this.isActive = val;
      this.optionList = val
        ? this.arrPlie.sort((a, b) => {
            return a - b;
          })
        : this.arrRow.sort((a, b) => {
            return a - b;
          });
      this.arrPlieRow = val
        ? this.arrRow.sort((a, b) => {
            return b - a;
          })
        : this.arrPlie.sort((a, b) => {
            return b - a;
          });
      this.showData();
    },
    valueChange() {
      this.showData();
    },
    // 数据展示
    showData() {
      this.listData = [];
      if (this.isActive) {
        this.arrRow.forEach((val) => {
          let arr = this.allData
            .filter((item) => item.Row === val && item.Plie === this.value)
            .sort((a, b) => {
              return a.Line - b.Line;
            });
          this.listData.push(arr);
        });
      } else {
        this.arrPlie.forEach((val) => {
          let arr = this.allData
            .filter((item) => item.Plie === val && item.Row === this.value)
            .sort((a, b) => {
              return a.Line - b.Line;
            });
          this.listData.push(arr);
        });
      }
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i] = this.listData[i].map((item) => {
          let obj = { ...item, flag: false };
          this.sectionList.forEach((vals) => {
            if (obj.Count <= vals.max && obj.Count >= vals.min) {
              obj.color = vals.color;
            }
          });
          return obj;
        });
      }
    },
    handleClick(val, index, idx) {
      this.msg = {
        name: val.ContainerNum,
        value: val.Count,
      };
      for (let i = 0; i < this.listData.length; i++) {
        this.listData[i] = this.listData[i].map((item, indexs) => {
          if (indexs === idx && i === index) {
            return { ...item, flag: true };
          }
          return { ...item, flag: false };
        });
      }
    },
    // 获取当前日期
    getNowTime() {
      let date = new Date();
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      // let h = date.getHours();
      // h = h < 10 ? "0" + h : h;
      // let m = date.getMinutes();
      // m = m < 10 ? "0" + m : m;
      // let s = date.getSeconds();
      // s = s < 10 ? "0" + s : s;
      // return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
      return y + "-" + MM + "-" + d;
    },
    // 获取前一天日期
    getYesterDayTime() {
      let time = new Date().getTime() - 24 * 60 * 60 * 1000;
      let yesterday = new Date(time);
      yesterday =
        yesterday.getFullYear() +
        "-" +
        (yesterday.getMonth() > 9
          ? yesterday.getMonth() + 1
          : "0" + (yesterday.getMonth() + 1)) +
        "-" +
        (yesterday.getDate() > 9
          ? yesterday.getDate()
          : "0" + yesterday.getDate());
      return yesterday;
    },
  },
};
</script>