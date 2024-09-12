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
        {{ addTableData.popTitle }}
        <div class="headImg" @click="cancelFun()">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="tablepopCenten_box" v-stopdrag ref="popCentenBox">
        <div class="input_box">
          <div class="input_key">胶囊型号:</div>
          <el-input v-model="inputContent" />
        </div>
        <div class="btn_box">
          <div class="add_btn" @click="setTimeoutAddItem">新增</div>
          <div
            :class="selectList.length ? 'add_btn' : 'cancel_btn'"
            @click="deleItem"
          >
            删除
          </div>
        </div>
        <div class="table_box">
          <el-table
            :data="tableData"
            border
            height="100%"
            style="width: 100%"
            @select="selectFn"
            @select-all="selectFn"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column
              :show-overflow-tooltip="true"
              label="胶料型号"
            >
              <template slot-scope="scope">
                <el-select
                  filterable
                  v-model="scope.row.num"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option v-for="item in selectList" :key="item.DetailId" :label="item.DetailName" :value="item.DetailId"> </el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="fool_btn">
        <el-button @click="conserve()" class="btn-style21">保存</el-button>
        <el-button @click="cancelFun()" class="btn-style22 btn-close"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import "./add-table.less";
export default {
  data() {
    return {
      timer: "",
      inputContent: "",
      tableData: [],
      selectList: [],
      selected: []
    };
  },
  props: ["addTableData"],
  watch: {
    data(n, o) {
      this.getTop();
      this.getData();
    },
  },
  mounted() {
    console.log(this.addTableData)
    this.getTop();
    this.getData();
  },
  methods: {
    changeArrToObj(list, key){
      let obj = {}
      list.forEach(item=>{
        obj[item[key]] = item
      })
      return obj
    },
    //延时保证idx唯一
    setTimeoutAddItem() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.addItem();
      }, 400);
    },
    addItem() {
      this.tableData.unshift({
        idx: new Date().getTime(),
        num: "",
      });
    },
    deleItem() {
      let list = this.selected.map((_) => _.idx);
      console.log()
      this.tableData = this.tableData.filter((_) => !list.includes(_.idx));
    },
    selectFn(n) {
      this.selected = n;
    },
    getData() {
      this.inputContent = ''
      this.selectList = [...this.addTableData.Details]
      this.tableData = [];
      if(this.addTableData.headerId !== ''){
        this.$request({
          method: this.addTableData.DataUrlType,
          url: this.addTableData.DataUrl + "?id=" + this.addTableData.headerId
        }).then(res=>{
          let {Name, Details} = JSON.parse(res.data.resultdata)
          this.inputContent = Name
          Details.forEach((item, index)=>{
            this.tableData.push({
              idx: item.DetailId + index,
              num: item.DetailId
            })
          })
        })
      }
    },
    getTop() {
      this.$refs.tablePopBox.style.top = "50%";
      let height = this.$refs.tablePopC.clientHeight;
      this.$refs.tablePopBox.style.marginTop = -height / 2 + "px";
    },
    //保存
    conserve() {
      let details = []
      let list = this.changeArrToObj(this.selectList, 'DetailId')
      this.tableData.forEach(item=>{
        details.push({
          DetailId: item.num,
          DetailName: list[item.num]?.DetailName || ''
        })
      })
      this.$request({
        method: this.addTableData.SaveUrlType,
        url: this.addTableData.SaveUrl,
        data: {
          Name: this.inputContent,
          HeaderId: this.addTableData.headerId,
          Details: details
        }
      }).then(res=>{
          this.cancelFun();
          this.$parent.init();
          setTimeout(()=>{
            this.$parent.showPop(res.data.message)
          }, 1000)
      }).catch((err) => {
        console.log("err:" + err);
        this.$parent.showPop('请求出错')
      });
    },
    //关闭
    cancelFun() {
      this.$parent.cancelFun();
    },
  },
};
</script>
<style lang="less">
.scPopBox {
  .el-date-editor.el-input {
    width: 150px;
  }
}
</style>

<style lang="less" scoped>
</style>