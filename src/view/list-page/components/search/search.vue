<template>
  <div class="box-search">
    <div class="box-select" style="margin-left: 0">
      <el-select
        popper-class="select-dropdown-class-li"
        v-model="value"
        @change="selectFun()"
        placeholder="请选择"
      >
        <el-option
          v-for="item in inputArr"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div v-show="seleShow" class="box-select">
      <el-select
        popper-class="select-dropdown-class-li"
        v-model="value2"
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
    <div v-show="!seleShow" class="box-select dateStyle">
      <el-date-picker
        popper-class="data-picker-class-li"
        @change="changeTime('state')"
        v-model="statetime"
        type="datetime"
        placeholder="选择日期"
      >
      </el-date-picker>
    </div>
    <div v-show="!seleShow" class="box-select dateStyle">
      <el-date-picker
        popper-class="data-picker-class-li"
        @change="changeTime('end')"
        type="datetime"
        v-model="endtime"
        placeholder="选择日期"
      >
      </el-date-picker>
    </div>
    <div v-show="seleShow" class="box-select">
      <el-input
        type="text"
        v-model="text"
        @change="valueFun()"
        placeholder="请输入"
      ></el-input>
    </div>
    <div class="box-select">
      <el-button class="btn-style1" @click="queryFun()"
        ><img :src="chaxun" />查询</el-button
      >
    </div>
    <div class="box-select">
      <span>*查询条件数量：</span>
      <span style="color: #fc6969">{{ massageArr.length }}</span>
    </div>
    <div class="box-select select-condition">
      <el-select :value="value3" placeholder="暂无查询条件">
        <el-option
          v-for="(item, index) in massageArr"
          :key="index"
          class="select-option"
          :label="item.value"
          :value="item.value"
        >
          <span style="float: left">{{ item.value }}</span>
          <span
            @click="colseMassage(index)"
            style="
              float: right;
              color: #888888;
              font-size: 18px;
              margin-left: 5px;
            "
            ><i class="el-icon-error"></i
          ></span>
        </el-option>
      </el-select>
    </div>
    <div class="box-select">
      <el-button class="btn-style1" @click="closeQuery()"
        ><img :src="qingkong" />清空</el-button
      >
      <el-button class="btn-style1" @click="renovate()"
        ><img :src="shuaxin" />刷新</el-button
      >
      <!-- <el-button class="btn-style3">导出</el-button> -->
    </div>
    <!-- {{ searchdata }} -->
  </div>
</template>
<script>
import "./search.less";
import moment from "moment";
import chaxun from "@/assets/img1/chaxun.png";
import qingkong from "@/assets/img1/qingkong.png";
import shuaxin from "@/assets/img1/shuaxin.png";
import bus from "@/components/common/bus";
export default {
  props: ["searchdata"],
  data() {
    return {
      chaxun: chaxun,
      qingkong: qingkong,
      shuaxin: shuaxin,
      Symbols: {
        string: [
          {
            value: "包含",
            label: "包含",
          },
        ],
        number: [
          {
            value: "大于",
            label: "大于",
          },
          {
            value: "等于",
            label: "等于",
          },
          {
            value: "小于",
            label: "小于",
          },
        ],
      },
      value: "", //第一个selece
      value2: "", //第二个selece
      value3: "", //第三个selece
      text: "", //文本值
      statetime: "",
      oldstatetime: "", //之前的开始时间
      endtime: "",
      oldendtime: "", // 之前的结束时间
      options: [], //第二个selece data
      inputArr: [], //第一个selece data
      axiosdata: [], //传参数组
      massageArr: [], //提示数组
      titleArr: [], //提示数组是否重复
      seleShow: true,
      type: "",
    };
  },
  created() {
    // this.init()
  },
  watch: {
    searchdata(n, o) {
      //  console.log(this.searchData)
      this.init();
    },
  },

  mounted() {},
  methods: {
    init() {
      this.value = "";
      this.value2 = "";
      this.text = "";
      this.statetime = "";
      this.endtime = "";
      this.inputArr = [];
      this.options = [];
      this.massageArr = [];
      this.value3 = "";
      this.axiosdata = [];
      if (this.searchdata.length == 0) {
        return;
      }

      this.inputArr = this.searchdata.map((item) => {
        let value = {
          value: item.FieldIndex,
          label: item.FieldIndex,
          type: item.FieldType,
        };
        return value;
      });
      //搜索头对应条件
      if (this.inputArr[0].type == "string") {
        this.options = this.Symbols.string;
        this.type = "string";
        this.value2 = "包含";
        this.seleShow = true;
      } else if (this.inputArr[0].type == "number") {
        this.options = this.Symbols.number;
        this.type = "number";
        this.value2 = "大于";
        this.seleShow = true;
      } else {
        this.seleShow = false;
        this.type = "datetime";
        this.endtime = moment().format();
        this.oldendtime = moment().format();
        this.statetime = moment().add(-1, "h").format();
        this.oldstatetime = moment().add(-1, "h").format();
      }
      // 值
      this.value = this.inputArr[0].value;
    },
    //删除选择类型
    colseMassage(index) {
      // console.log(this.massageArr)
      if (this.massageArr.length > 1) {
        if (this.value3 == this.massageArr[index].value) {
          if (index == this.massageArr.length - 1) {
            this.value3 = this.massageArr[index - 1].value;
            console.log(this.value3);
          } else {
            this.value3 = this.massageArr[index + 1].value;
          }
        }
      } else {
        this.value3 = "";
        // this.massageArr = []
      }
      this.massageArr.splice(index, 1);
      this.axiosdata.splice(index, 1);
      // if(this.axiosdata.length == 0){
      //    this.$parent.init()
      // }else{
      //   this.$parent.searchDataFun(this.axiosdata);
      // }
      this.$parent.searchDataFun(this.axiosdata);
    },
    closeQuery() {
      this.text = "";
      this.statetime = "";
      this.endtime = "";
      this.massageArr = [];
      this.value3 = "";
      this.axiosdata = [];
    },

    //选择类型
    selectFun() {
      this.value2 = "";
      this.text = "";
      this.statetime = "";
      this.endtime = "";
      //搜索头条件改变切换类型
      for (let i = 0; i < this.searchdata.length; i++) {
        if (this.value == this.searchdata[i].FieldIndex) {
          // console.log('rrrff',this.searchdata[i].FieldType)
          if (this.searchdata[i].FieldType == "string") {
            this.options = this.Symbols.string;
            this.type = "string";
            this.value2 = "包含";
            this.seleShow = true;
          } else if (this.searchdata[i].FieldType == "number") {
            this.options = this.Symbols.number;
            this.type = "number";
            this.seleShow = true;
            this.value2 = "大于";
          } else {
            this.type = "datetime";
            this.seleShow = false;
            this.endtime = moment().format();
            this.statetime = moment().add(-1, "h").format();
          }
        }
      }
    },
    //清空
    clearFun() {
      this.value3 = "";
      this.value = "";
      this.value2 = "";
      this.text = "";
      this.statetime = "";
      this.endtime = "";
      this.massageArr = [];
      this.axiosdata = [];
    },
    //刷新数据
    renovate() {
      bus.$emit("renovate", "");
      this.$parent.init();
    },

    //查询
    queryFun() {
      // alert('dsd')
      //有值最优先
      bus.$emit("renovate", "");
      var id = this.$route.query.id;
      let list = this.massageArr;
      console.log(this.axiosdata);

      if (this.type == "string" || this.type == "number") {
        let text = this.value + " " + this.value2 + "【" + this.text + "】";
        let value = {
          name: this.value,
          value: text,
        };
        //条件展示值存入数组
        if (this.text !== "" && this.value !== "") {
          var num = -1;
          for (let i = 0; i < list.length; i++) {
            if (text == list[i].value) {
              num++;
              break;
            }
          }
          if (num == -1) {
            this.massageArr.push(value);
            let logic =
              this.value2 == "大于"
                ? ">"
                : this.value2 == "小于"
                ? "<"
                : this.value2 == "等于"
                ? "="
                : this.value2 == "包含"
                ? "%"
                : "";
            this.axiosdataAll(logic, this.text);
          }
        }
      }
      if (this.type == "datetime") {
        let staTime = moment(this.statetime).format("YY-MM-DD HH:mm:ss");
        let endTime = moment(this.endtime).format("YY-MM-DD HH:mm:ss");
        let text = this.value + staTime + " | " + endTime;
        let time = staTime + "|" + endTime;
        let value = {
          name: this.value,
          value: text,
        };
        //条件展示值存入数组
        if (this.statetime != "" && this.endtime != "") {
          var num = -1;
          for (let i = 0; i < list.length; i++) {
            if (text == list[i].value) {
              num++;
              break;
            }
          }
          if (num == -1) {
            this.massageArr.push(value);
            let logic = "date";
            this.axiosdataAll(logic, time);
          }
        }
      }
      if (this.massageArr.length > 0) {
        this.value3 = this.massageArr[this.massageArr.length - 1].value;
      } else {
        this.value3 = "";
      }

      this.$parent.searchDataFun(this.axiosdata);
    },
    //查询数据集合
    axiosdataAll(logic, value) {
      for (let i = 0; i < this.searchdata.length; i++) {
        if (this.value == this.searchdata[i].FieldIndex) {
          var value2 = {
            name: this.searchdata[i].FieldName,
            logic: logic,
            value: value,
          };
          this.axiosdata.push(value2);
        }
      }
    },
    changeTime(text) {
      var sTime = this.$moment(this.statetime).format("YYYY-MM-DD HH:mm:ss");
      var eTime = this.$moment(this.endtime).format("YYYY-MM-DD HH:mm:ss");
      var diffs = moment(eTime).diff(moment(sTime), "seconds");
      if (diffs < 0) {
        //  this.$parent.tipsFun('1',`开始时间不能大于结束时间`)
        this.statetime = this.oldstatetime;
        this.endtime = this.oldendtime;
      } else if (diffs == 0) {
        // this.$parent.tipsFun('1',`开始时间不能等于结束时间`)
        this.statetime = this.oldstatetime;
        this.endtime = this.oldendtime;
      } else {
        if (text == "state") {
          this.oldstatetime = sTime;
        } else {
          this.oldendtime = eTime;
        }
      }
    },
    //只能为数字
    valueFun() {
      if (this.type == "number") {
        this.text = parseInt(this.text);
        if (String(this.text) == "NaN") {
          this.text = "";
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
</style>