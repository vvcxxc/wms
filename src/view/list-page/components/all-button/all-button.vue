<template>
  <div>
    <!-- <el-button class="btn-style3 btn" @click="test(test1)">批量新增</el-button> -->
    <!-- <el-button class="btn-style3 btn" @click="getExctel">导出</el-button> -->
    <div style="display: inline-block" v-show="item.Btn_Type != '3'" v-for="(item, index) in btnData" :key="index">
      <el-button @click="btnClick(item)" v-if="item.Btn_Type != '6'" class="btn"
        :class="{ [item.color]: true, myBtn: item.Btn_Text == '生成出库任务' }">{{ item.Btn_Text }}</el-button>
      <el-upload accept=".xls,.xlsx" :name="fileName" :action="elexUrl" v-if="item.Btn_Type == '6'"
        :show-file-list="false" :on-success="fileSuccess" :on-error="fileError">
        <el-button @click="btnClick(item)" class="btn" :class="item.color">{{
          item.Btn_Text
        }}</el-button>
        <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
      </el-upload>
    </div>
  </div>
</template>
<script>
import "./all-button.less";
export default {
  props: ["btnData", "btnPowerData", "$route"],
  watch: {
    btnData(n, o) {
      this.btnData.forEach((item) => {
        //0 为删除冻结类-类型3  2 为跳转类-类型5  1为弹窗类-类型3-1  3为导出-类型3  4/5为图片 //6为导入-类型3-1
        if (
          item.Btn_Type == "1" ||
          item.Btn_Type == "0" ||
          item.Btn_Type == "3" ||
          item.Btn_Type == "7" ||
          item.Btn_Type == "5" ||
          item.Btn_Type == "6"
        ) {
          item.color = "btn-style3";
        } else if (
          item.Btn_Type == "2" ||
          item.Btn_Type == "4" ||

          item.Btn_Type == "8"
        ) {
          // this.$parent.upImgPop(item)
          item.color = "btn-style5";
        }
      });
    },
  },
  data() {
    return {
      test1: "",
      elexUrl: "", //上传地址
      fileName: "Filedata",
    };
  },
  methods: {
    btnClick(item) {
      if (this.btnPowerData.length != 0) {
        for (let i = 0; i < this.btnPowerData.length; i++) {
          if (this.btnPowerData[i].Btn_ID == item.Btn_ID) {
            if (this.btnPowerData[i].IsAuthorized == "N") {
              this.$message.error({
                message: "没有【" + item.Btn_Text + "】权限",
              });
              // this.$parent.$parent.openFun(`没有【${item.Btn_Text}】权限`)
              return;
            }
          }
        }
      }
      console.log("$route", this.$route, item)
      //0 为删除冻结类-类型3-1  1为弹窗类-类型3-2   2 为跳转类-类型5  3为导出-类型3-1  4/5为图片 //6为导入-类型3-1
      if (item.Btn_Type == "0") {
        let text = item.Btn_Text;
        this.$parent.activeTips(text, item);
      } else if (item.Btn_Type == "1") {
        let text = item.Btn_Text;
        this.$parent.activePop(text, item);
      } else if (item.Btn_Type == "2") {
        this.$parent.jumpFun(item);
      } else if (item.Btn_Type == "3") {
        this.$parent.getexcel();
      } else if (item.Btn_Type == "4") {
        this.$parent.upImgPop(item);
      } else if (item.Btn_Type == "5") {
        this.getExctel();
      } else if (item.Btn_Type == "7") {
        this.$parent.addList(item);
      } else if (item.Btn_Type == "6") {
        // this.$parent.importExcelData(item)
        this.importExcelData(item);
      } else if (item.Btn_Type == "8") {
        this.$parent.myRequest(item);
      }
    },
    getExctel() {
      this.$parent.getexcel();
    },
    test(item) {
      // alert(1)
      this.$parent.addList(item);
    },
    importExcelData(item) {
      let Page_ID = item.Page_ID;
      let dev = this.$config.baseUrl.dev;
      this.elexUrl = `${window.location.origin}${dev}/wms/excel?id=${Page_ID}`;
    },

    fileSuccess(response, file, fileList) {
      console.log(response)
      let message = response.message;
      if (response.type == 1) {
        this.$message({
          message: message,
          type: "success",
          duration: 2000,
        });
      } else {
        this.$message({
          message: message,
          type: "error",
          duration: 2000,
        });
      }
    },
    fileError(err, file, fileList) {
      this.$message({
        message: err,
        type: "error",
        duration: 2000,
      });
    },
  },
};
</script>
<style lang="less">
.btn {
  margin-bottom: 10px;
  margin-left: 10px;
}

.myBtn {
  width: fit-content !important;
  min-width: 80px !important;
  padding: 7px 10px !important;
}

.el-upload--text {
  width: 100%;
  height: 100%;
  border: none;
  border-radius: 0;
  background: rgba(0, 0, 0, 0);
  overflow: visible;
}
</style>