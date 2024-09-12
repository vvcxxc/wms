<!--
 * @Description: 这是【通用列表页提示弹窗页面】（组件）
 * @Date: 2020-08-10 17:20:29
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 11:46:04
-->
<template>
  <div class="deletePop">
    <div v-drag1 class="deletePopDrag">
      <div class="title">
        <span class="title_i el-icon-warning"></span>
        <span class="text">提示</span>
      </div>

      <div class="delete_text">
        <span>{{ text }}</span>
      </div>

      <div v-if="deleteShow" class="delete_btn">
        <el-button class="btn-style2" @click="deleteBtn('2')"
          >是(YES)</el-button
        >
        <el-button class="btn-style22 no" @click="deleteBtn('1')"
          >否(NO)</el-button
        >
      </div>

      <div v-if="!deleteShow" class="delete_btn">
        <div @click="deleteBtn('1')" class="deleteConfig btn-style22 no">
          确认
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { delListData } from "@/api/home.js";
export default {
  data() {
    return {
      deleteShow: true,
      name: "删除",
      text: "",
      value: [],
    };
  },
  props: ["title", "data", "tableDataArr", "type", "textInfo"],
  created() {
    this.init();
  },
  methods: {
    init() {
      //0、1、2为编辑，4为删除冻结  5为权限角色删除 7为提示信息
      if (this.type == "0") {
        this.text = "请勾选编辑内容";
        this.deleteShow = false;
      } else if (this.type == "2") {
        this.text = "不可多项编辑内容";
        this.deleteShow = false;
      } else if (this.type == "5") {
        this.text = "请勾选内容";
        this.deleteShow = false;
      }
      if (this.type == "4") {
        if (this.tableDataArr.length == 0) {
          this.text = "请勾选内容";
          this.deleteShow = false;
        } else {
          // IsMultipleChoice==0 不可以多选
          if (this.data.IsMultipleChoice == 0) {
            console.log("tableDataArr2", this.tableDataArr.length);
            if (this.tableDataArr.length > 1) {
              this.text = "不可多选内容";
              this.deleteShow = false;
              return;
            }
          }

          this.text = "是否确认" + this.title + "?";
          this.value = this.tableDataArr.map((item) => {
            if ("State" in item) {
              return {
                ...item,
                State: item.State ? item.State.split("-")[0] : item.State,
              };
            }
            return item;
          });
          console.log(this.value);
          //   var Params = this.data.Params;
          //   var paramData = [];
          //   this.value = [];
          //   for (let i = 0; i < Params.length; i++) {
          //     paramData.push(Params[i].ParamName);
          //   }
          //   console.log("paramData", paramData);
          //   if (this.tableDataArr != "") {
          //     var data = [];
          //     for (let i = 0; i < this.tableDataArr.length; i++) {
          //       let value2 = {};
          //       for (let j = 0; j < paramData.length; j++) {
          //         var lastName;
          //         for (var item1 in this.tableDataArr[i]) {
          //           lastName = item1;
          //         }
          //         for (var item in this.tableDataArr[i]) {
          //           if (item == paramData[j]) {
          //             var o = {};
          //             var str = `o.${item}="${this.tableDataArr[i][item]}"`;
          //             eval(str);
          //             Object.assign(value2, o);
          //             break;
          //           } else {
          //             if (lastName == item) {
          //               var o1 = {};
          //               var str1 = "o1." + paramData[j] + "=''";
          //               eval(str1);
          //               Object.assign(value2, o1);
          //               break;
          //             }
          //           }
          //         }
          //       }
          //       this.value.push(value2);
          //       console.log("ssscc", value2, this.value);
          //     }
          //   } else {
          //     if (paramData.length != 0) {
          //       var value2 = {};
          //       for (let i = 0; i < paramData.length; i++) {
          //         var o = {};
          //         var str = "o." + paramData[i] + "=''";
          //         eval(str);
          //         Object.assign(value2, o);
          //       }
          //       this.value.push(value2);
          //     }
          //     console.log("ssscc", value2, this.value);
          //   }
        }
      } else if (this.type == "7") {
        this.text = this.textInfo;
        this.deleteShow = false;
      }
    },

    deleteBtn(num) {
      if (num == "2") {
        var url = this.data.SumbitUrl;
        delListData(url, this.value)
          .then((res) => {
            if (res.data.type==1) {
              this.$message({
                message: res.data.message,
                type: "success",
              });
              this.$parent.cancelFun();
              this.$parent.reSearch(); //刷新表单数据
            } else {
              console.log("弹窗文本", res);
              this.text = res.data.message;

              this.deleteShow = false;
              this.$parent.reSearch(); //刷新表单数据
            }
          })
          .catch(function (error) {
            console.log(error);
            this.$message({
              message: error,
              type: "error",
            });
          });
      } else {
        this.$parent.cancelFun();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.deletePop {
  position: absolute;
  left: 0;
  right: 0;
  // bottom:0;
  top: 30%;
  margin: auto;
  width: 480px;
  height: 250px;
  font-size: 16px;
  z-index: 10;
  // box-shadow: 0px 1px 42px 9px rgba(7, 8, 26, 0.23);
  // font-family: Microsoft YaHei;
  // background: #fff;
  .deletePopDrag {
    position: relative;
    width: 100%;
    height: 100%;
    box-shadow: 0px 1px 42px 9px rgba(7, 8, 26, 0.23);
    font-family: "Microsoft YaHei";
    background: #fff;
  }
  .title {
    width: 100%;
    height: 50px;
    font-weight: bold;
    color: #ffffff;
    background: #fd9a4c;
    text-align: center;
    line-height: 50px;
    .title_i {
      color: #fff;
      margin-right: 5px;
    }
  }
  .delete_text {
    font-weight: 400;
    color: #333333;
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: normal;
    word-break: break-all;
    text-align: left;
    margin: auto;
    span {
      margin: 0 20px;
    }
    // margin-top: 10px;
    // margin-bottom: 10px;
  }
  .delete_btn {
    width: 100%;
    // height: 32px;
    text-align: center;
    .no {
      height: 33px;
      margin-left: 14px;
      cursor: pointer;
    }
    .deleteConfig {
      width: 100px;
      // height: 30px;
      // background: #ffffff;
      border: 1px solid #d9d9d9;
      // border-radius: 4px;
      text-align: center;
      line-height: 32px;
      cursor: pointer;
      display: inline-block;
      //   margin-left: 35px;
    }
  }
}
</style>