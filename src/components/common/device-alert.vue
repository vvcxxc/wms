<template>
  <div>
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      :show-close="false"
      width="30%"
      :close-on-click-modal="false"
    >
      <span
        v-if="dialog.text"
        :style="{
          'font-size': '24px',
          display: 'inline-block',
          height: '200px',
          'line-height': '200px',
        }"
        >{{ dialog.text }}</span
      >
      <div v-else class="dialog-content">
        <div
          v-for="(item, index) in dialog.paramss"
          :key="index"
          class="dialog-content-child"
        >
          <span>{{ item.paramText }}:</span>
          <el-input
            v-model="item.paramValue"
            v-if="item.paramType === 'num'"
            :disabled="item.IsEnable == 0"
            style="width: 65%"
            onkeyup="this.value=this.value.replace(/[^\-?\d.]/g,'')"
          ></el-input>
          <el-input
            style="width: 65%"
            v-model="item.paramValue"
            :disabled="item.IsEnable == 0"
            v-if="item.paramType === 'nvarchar'"
          ></el-input>
          <el-date-picker
            style="width: 65%"
            v-model="item.paramValue"
            :disabled="item.IsEnable == 0"
            v-if="item.paramType === 'datetime'"
            type="datetime"
            placeholder="选择日期"
          >
          </el-date-picker>
          <el-select
            placeholder="暂无查询条件"
            style="width: 65%"
            v-model="item.paramValue"
            :disabled="item.IsEnable == 0"
            v-if="item.paramType === 'selection'"
          >
            <el-option
              v-for="(val, i) in item.paramSelectionData"
              :key="'select' + i"
              class="select-option"
              :value="val"
            >
              {{ val }}
            </el-option>
          </el-select>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel" v-if="!dialog.text">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import axios from "axios";
import axios from "@/libs/api.request";
import { GetiOpenWindowsInfo } from "@/api/user.js";
export default {
  data() {
    return {
      dialog: {
        show: false,
        title: "",
        text: "",
        submitUrl: "",
        paramss: [],
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    getDeviceInfo() {
      GetiOpenWindowsInfo().then(
        (res) => {
          console.log(res.data);
          if (res.data.type === 2 || res.data.type === 3) {
            setTimeout(() => {
              this.getDeviceInfo();
            }, 3000);
            return;
          }
          this.dialog.show = true;
          this.dialog.title = res.data.resultdata.windowtitle;
          this.dialog.text = res.data.resultdata.windowText;
          this.dialog.submitUrl = res.data.resultdata.submitUrl;
          this.dialog.paramss = res.data.resultdata.paramss.map((item) => {
            if (item.paramType === "selection") {
              let arr = [];
              for (let keys in item.paramSelectionData) {
                arr.push(item.paramSelectionData[keys]);
              }
              return { ...item, paramSelectionData: arr };
            } else {
              return item;
            }
          });
        },
        (err) => {
          setTimeout(() => {
            this.getDeviceInfo();
          }, 3000);
          return err;
        }
      );
    },
    dialogCancel() {
      this.dialog.show = false;
      setTimeout(() => {
        this.getDeviceInfo();
      }, 3000);
    },
    dialogConfirm() {
      if (this.dialog.text) {
        this.dialogCancel();
        return;
      }
      var obj = {};
      for (let i = 0, iLen = this.dialog.paramss.length; i < iLen; i++) {
        const item = this.dialog.paramss[i];
        // if (!item.paramValue) {
        //   this.$message.warning("值不能为空");
        //   return;
        // }
        obj[item.paramName] = item.paramValue;
      }
      axios
        .request({
          url: this.dialog.submitUrl,
          method: "post",
          data: obj,
        })
        .then((res) => {
          this.$message(res.data.message);
          if (res.data.type === 1) this.dialogCancel();
        })
        .catch((err) => {
          return err;
        });
    },
    init() {
      this.getDeviceInfo();
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep .el-dialog__body {
  // padding-top: 0;
  text-align: center;
}
::v-deep .el-dialog__header {
  background: #456ce8;
  text-align: center;
  padding: 10px 20px;
  height: 25px;
}
::v-deep .el-dialog__title {
  color: #ffffff;
}
.dialog-content {
  display: flex;
  justify-content: space-between;
  flex-flow: wrap;
  .dialog-content-child {
    display: flex;
    width: 50%;
    margin: 10px 0;
    span {
      display: inline-block;
      width: 30%;
    }
    ::v-deep .el-input {
      width: 100%;
    }
  }
}

.dialog-footer {
  ::v-deep .el-button--default {
    color: #666666;
    background-color: #ffffff;
    border-color: #d9d9d9;
  }
  ::v-deep .el-button--primary {
    background-color: #3399ff;
    border-color: #3399ff;
  }
}
</style>