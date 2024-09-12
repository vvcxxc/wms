<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
  <div ref="tablePopBox" class="scPopBox1">
    <div v-drag1 class="scPopBox_c" ref="tablePopC">
      <div class="head">
        {{ propsData.popTitle }}
        <div class="headImg" @click="cancelFun()">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="tablepopCenten_box" v-stopdrag ref="popCentenBox">
        <div class="table_box">
          <el-table :data="tableList" border height="100%" style="width: 100%">
            <el-table-column
              v-for="(item, index) in propsData.tableHeader"
              :key="index"
              :prop="item.Name"
              :label="item.Text"
              :render-header="labelHead"
              :show-overflow-tooltip="true"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="fool_btn">
        <el-button
          class="btn-style21"
          v-for="item in propsData.Buttons"
          :key="item.Sort"
          @click="handleBtn(item)"
          >{{ item.Text }}</el-button
        >
        <el-button @click="cancelFun()" class="btn-style22 btn-close"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import "../add-table/add-table.less";
export default {
  data() {
    return {
      timer: "",
      tableList: [],
    };
  },
  props: {
    propsData: {
      type: Object,
      default() {
        return {
          HeaderId: "",
          popTitle: "",
          Buttons: [],
          tableHeader: [],
          Ids: [],
          DataUrl: "",
          DataUrlType: "",
        };
      },
    },
  },
  watch: {
    data(n, o) {
      this.getTop();
    },
  },
  mounted() {
    this.getTop();
    let ids = {
      ids: [...this.propsData.Ids],
    };
    console.log(ids);
    this.$request({
      method: this.propsData.DataUrlType,
      url: this.propsData.DataUrl,
      data: ids,
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      let data = JSON.parse(res.data.resultdata);
      this.tableList = data;
    });
  },
  methods: {
    getTop() {
      this.$refs.tablePopBox.style.top = "50%";
      let height = this.$refs.tablePopC.clientHeight;
      this.$refs.tablePopBox.style.marginTop = -height / 2 + "px";
    },
    handleBtn(btn) {
      if (btn.Url) {
        let ids = JSON.stringify({
          taskId: this.propsData.Ids,
        });
        this.$request({
          method: btn.UrlType,
          url: btn.Url,
          headers: {
            "Content-Type": "application/json",
          },
          data: ids,
        })
          .then((res) => {
            this.cancelFun();
            this.$parent.init();
            setTimeout(() => {
              this.$parent.showPop(res.data.message);
            }, 1000);
          })
          .catch((err) => {
            console.log("err:" + err);
            this.$parent.showPop("请求出错");
          });
      }
    },
    //关闭
    cancelFun() {
      this.$parent.cancelFun();
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
<style lang="less" scoped>
.scPopBox1 {
  width: 1140px;

  ::v-deep .table_box .el-table .caret-wrapper {
    float: right;
    margin-top: 4px;
  }
}
</style>