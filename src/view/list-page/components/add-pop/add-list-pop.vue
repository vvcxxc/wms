<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
  <div ref="scPopBox1" class="scPopBox2">
    <div v-drag1 class="scPopBox_c">
      <div class="head">{{popTitle}}
        <!-- <div @click="cancelFun()" class="headImg"></div> -->
        <div class="headImg" @click="cancelFun()">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div class="popCenten_box" v-loading="disLoading" v-stopdrag>
        <div class="add-btn-style">
          <el-button class="btn-style9" @click="addTableInput">添加</el-button>
        </div>
        <div class="pop-centent">

          <el-table :data="tableData" style="width: 100%" highlight-current-row @row-click="handleCurrentChange" border height="430">
            <el-table-column v-for="(item,index) in dataArr" :key="index" :label="item.fieldname" :prop="item.fieldindex" min-width="176" >
              <template slot-scope="{row,$index}">
                <!-- <el-input size="small" placeholder="请输入" @input="inputFun1(row,$index)" v-model="row[item.fieldindex]" ></el-input>  -->
                <el-input :disabled="item.isupdateavailable != '1'" v-if="item.fieldtype=='num'" v-model="row[item.fieldindex]" placeholder="请输入内容"></el-input>
                <el-autocomplete :disabled="item.isupdateavailable != '1'" :trigger-on-focus="false" v-if="item.fieldtype=='nvarchar'" v-model="row[item.fieldindex]" placeholder="请输入内容"
                  :fetch-suggestions="querySearchAsync" @focus="inputAutoComplele(row,$index,item)">
                </el-autocomplete>
                <el-date-picker class="list-date-style" popper-class="data-picker-class-li" :disabled="item.isupdateavailable != '1'" v-if="item.fieldtype=='datetime'" v-model="row[item.fieldindex]" type="datetime"
                  placeholder="选择日期时间">
                </el-date-picker>
                <el-select popper-class="select-dropdown-class-li" @change="selectChange(item)" :disabled="item.isupdateavailable != '1'" v-if="item.fieldtype=='selection'" v-model="row[item.fieldindex]"
                  placeholder="请选择">
                  <el-option v-for="i in item.data" :key="i.text" :label="i.text" :value="i.text">
                  </el-option>
                </el-select>
                <textarea :disabled="item.isupdateavailable != '1'" class="textarea" v-model="row[item.fieldindex]" v-if="item.fieldtype=='textarea'"></textarea>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" align="center">
              <template slot-scope="scope">
                <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button> -->
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </div>
      <div class="fool_btn">
        <el-button @click="conserve()" class="btn-style21">保存</el-button>
        <el-button @click="cancelFun()" class="btn-style22 btn-close">取消</el-button>
        <el-button @click="clearFun() " class="btn-style7 right">清空</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import './add-pop.less'
import { saveCommonData } from '@/api/home.js'
export default {
  data() {
    return {
      //内容数据
      Data: [],
      dataArr: null,
      GroupSelect: [], //下拉联动初始数据
      GroupSelectAll: [],//下拉全部数据
      inputData: '',
      loading: false,
      tableData: [],
    }
  },
  props: ['popTitle', 'data', 'axioData', 'tableDataArr', 'tableList', 'disLoading'],
  watch: {
    data(n, o) {
      this.init()
    }
  },

  created() {
    //fieldtype : textarea  datetime  selection  nvarchar num
    //selection => data 
    this.init()
  },
  methods: {
    init() {
      this.tableData = []
      this.GroupSelect = []
      this.GroupSelectAll = []
      this.dataArr = this.data
      // console.log(this.tableDataArr)
      console.log(this.data)
      this.addTableInput()
      console.log(this.tableData)

      // 1为添加
      if (this.axioData.WindowType == '1') {
        for (let i = 0; i < this.dataArr.length; i++) {
          if (this.dataArr[i].isAdd == 0) {
            this.dataArr.splice(i, 1)
            i--
          }
        }
        //编辑
      } else if (this.axioData.WindowType == '2') {
        for (let i = 0; i < this.dataArr.length; i++) {
          if (this.dataArr[i].isUpdate == 0) {
            this.dataArr.splice(i, 1)
            i--
          }
        }
        //多项编辑
      } else if (this.axioData.WindowType == '3') {
        for (let i = 0; i < this.dataArr.length; i++) {
          if (this.dataArr[i].isUpdate == 0) {
            this.dataArr.splice(i, 1)
            i--
          }
        }
      }

    },
    //模糊查询
    querySearchAsync(queryString, callback) {
      // console.log(item)
      let list1 = []
      let data = ''
      if (this.inputData) {
        var index = this.inputData.fieldindex
        let list = this.tableList
        if (this.inputData.GroupParent) {
          data = this.dataArr.filter((item) => {
            return this.inputData.GroupParent == item.fieldindex
          })
          for (let i = 0; i < list.length; i++) {
            if (list[i][index].indexOf(queryString) != -1) {
              // console.log(list[i][data[0].fieldindex])
              if (data[0].value == list[i][data[0].fieldindex]) {
                list1.push(list[i][index])
              }
            }
          }
        } else {
          for (let i = 0; i < list.length; i++) {
            if (list[i][index].indexOf(queryString) != -1) {
              list1.push(list[i][index])
            }
          }
        }
      }
      //   list1 = new Set(list1);
      list1 = [...new Set(list1)];
      var list2 = []
      for (let j = 0; j < list1.length; j++) {
        list2.push({
          value: list1[j]
        })
      }
      //   console.log(list2)
      callback(list2);

    },
    handleCurrentChange(row, event, column) {
      // console.log(row)
    },
    //多个添加
    addTableInput() {
      let tableInput = {}
      let data1 = this.data
      for (let i = 0; i < data1.length; i++) {
        var j = data1[i].fieldindex
        tableInput[j] = ''
      }
      let tableInput1 = JSON.parse(JSON.stringify(this.tableData))
      if (this.tableData.length > 0) {
        this.tableData.push(tableInput1[this.tableData.length - 1])
      } else {
        this.tableData.push(tableInput)
      }

    },
    //
    handleDelete(index,row){
      this.tableData.splice(index,1)

    },
    //下拉联动
    selectChange(item) {
      if (item.childrenName.length) {
        for (let i = 0; i < this.GroupSelectAll.length; i++) {
          if (item.fieldID == this.GroupSelectAll[i].id) {

            let value = {
              FieldID: item.fieldID,
              data: this.GroupSelectAll[i].selection,
              id: item.childrenName
            }
            let data = []
            data.push(value)
            this.selectDataFun(data)
          }
        }
      }
    },
    //关闭
    cancelFun() {
      for (let i = 0; i < this.dataArr.length; i++) {
        this.dataArr[i].value = ''
      }
      this.$parent.cancelFun()
    },
    //输入框
    inputFun(item) {
      console.log(item)
      this.inputData = item
      if (item.fieldtype == 'num') {
        item.value = parseInt(item.value)
        if (String(item.value) == 'NaN') {
          item.value = ''
        }
      }
    },
    inputAutoComplele(row, index, item) {
      this.inputData = item

    },
    inputFun1(item, index) {
      console.log(index)
      //  this.tableData[index] = item
      console.log(this.tableData)
      this.$set(this.tableData, index, item)
      // this.inputData = item
      // if (item.fieldtype == 'num') {
      //   item.value = parseInt(item.value)
      //   if (String(item.value) == 'NaN') {
      //     item.value = ''
      //   }
      // }
    },

    //清空
    clearFun() {
      this.tableData = []
    },

    //下拉框选择联动方法
    selectDataFun(arr) {
      for (let j = 0; j < arr.length; j++) {
        var selectId
        for (let k = 0; k < this.dataArr.length; k++) {     //获取选择的id
          if (this.dataArr[k].fieldID == arr[j].FieldID) {
            for (let f = 0; f < arr[j].data.length; f++) {
              if (arr[j].data[f].value == this.dataArr[k].value) {
                selectId = arr[j].data[f].id
              }
            }
          }
        }
        for (let i = 0; i < this.dataArr.length; i++) {    //重新赋值
          let index = arr[j].id.indexOf(this.dataArr[i].fieldID)
          if (index != -1) {
            for (let j = 0; j < this.GroupSelectAll.length; j++) {
              if (this.dataArr[i].fieldID == this.GroupSelectAll[j].id) {
                let arr = []
                for (let k = 0; k < this.GroupSelectAll[j].selection.length; k++) {
                  var parentidData = this.GroupSelectAll[j].selection[k]
                  if (parentidData.parentid == selectId) {
                    let value = {
                      id: this.GroupSelectAll[j].selection[k].id,
                      text: this.GroupSelectAll[j].selection[k].value
                    }
                    arr.push(value)
                  }
                }
                this.dataArr[i].data = arr
                this.dataArr[i].value = arr[0].text
                this.dataArr = JSON.parse(JSON.stringify(this.dataArr))
                if (this.dataArr[i].childrenName.length) {
                  let value = {
                    FieldID: this.dataArr[i].fieldID,
                    data: this.GroupSelectAll[j].selection,
                    id: this.dataArr[i].childrenName
                  }
                  let data = []
                  data.push(value)
                  this.selectDataFun(data)
                }
              }
            }

          }
        }
      }
    },

    //多个下拉联动数据
    GroupSelectFun(FieldID) {
      return new Promise((resolve, reject) => {
        this.$axios({            //1为添加保存  
          method: 'post',
          url: `${this.$store.state.dailog.url1}Common/Base_Field/GetGroupSelect?FieldID=${FieldID}`,
          FieldID: FieldID
        }).then(res => {
          var data = JSON.parse(res.data.resultdata)

          var arr = []
          if (data != null) {
            if (data.Grade == 1) {
              let value = {
                data: data.selection,
                id: data.FieldID,
                FieldID: FieldID
              }
              this.GroupSelect.push(value)
            }  //初始数据
            data.id = FieldID
            this.GroupSelectAll.push(data)  //全部数据
            for (let i = 0; i < data.selection.length; i++) {
              var value = {
                id: data.selection[i].id,
                text: data.selection[i].value,
                parentid: data.selection[i].parentid,

              }
              arr.push(value)
            }
            let Arr = {
              id: data.FieldID,
              data: arr
            }
            resolve(Arr)
          }
        })
      })
    },

    //单个下拉数据
    selectFun(url) {
      console.log(`========${this.$store.state.dailog.url1}${url}`)
      return new Promise((resolve, reject) => {
        this.$axios({            //1为添加保存  
          method: 'post',
          url: `${this.$store.state.dailog.url1}${url}`,
        }).then(res => {
          var selectData = JSON.parse(res.data.resultdata)
          var arr = []
          for (let i = 0; i < selectData.length; i++) {
            var value = {
              id: selectData[i].ID,
              text: selectData[i].Value,
            }
            arr.push(value)
          }
          resolve(arr)
        })
      })
    },

    //添加渲染下拉框
    addSelecFun(data) {
      //渲染
      for (let i = 0; i < this.dataArr.length; i++) {
        if (this.dataArr[i].fieldtype == 'selection') {
          if (this.dataArr[i].IsGroup != 'undefined') {
            if (this.dataArr[i].IsGroup == 1) {   //联动
              this.GroupSelectFun(this.dataArr[i].fieldID).then(val => {
                this.dataArr[i].data = val.data
                this.dataArr[i].value = this.dataArr[i].data[0].text
                this.dataArr[i].childrenName = val.id
                this.dataArr = this.dataArr
                if (val.id.length == 0) {
                  for (let i = 0; i < this.GroupSelect.length; i++) {
                    this.selectDataFun(this.GroupSelect)
                  }
                }
              })

            } else {   //单个下拉
              this.selectFun(this.dataArr[i].Selection_Url).then(val => {
                this.dataArr[i].data = val
                this.dataArr[i].value = this.dataArr[i].data[0].text
                this.dataArr = this.dataArr
              })
            }
          } else {  //单个下拉
            this.selectFun(this.dataArr[i].Selection_Url).then(val => {
              this.dataArr[i].data = val
              this.dataArr[i].value = this.dataArr[i].data[0].text
              this.dataArr = this.dataArr
            })
          }
        }
      }

    },

    //保存
    conserve() {
      console.log(this.tableData)
    },
    saveFun(value2) {
      saveCommonData(this.axioData.SumbitUrl, value2).then(res => {
        if (res.data.isLogin) {
          this.$parent.UptableFun() //表单刷新
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          });
        }

      }).catch(error => {
        console.log(error)
      })
    }

  }
}
</script>
<style lang="less">
.scPopBox2 {
  max-width: 85%;
  height: 700px;
  position: absolute;
  top: 0;
  left: 0px;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 10;
  // padding: 20px;
  .el-table__header-wrapper {
    height: 42px;
  }
  .el-table th > .cell {
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    font-family: "Alibaba PuHuiTi";
    font-weight: 400;
    color: #fffefe;
  }
  .scPopBox_c {
    position: relative;
    width: 100%;
    background: #f5f4f9;
    box-shadow: 0px 1px 42px 9px rgba(7, 8, 26, 0.23);
  }

  .fool_btn {
    height: 40px;
    overflow: hidden;
    width: 100%;
    bottom: 0px;
    text-align: center;
    background: #f5f4f9;
    padding-top: 10px;
  }

  .head {
    width: 100%;
    height: 50px;
    background: #3399ff;
    position: relative;
    line-height: 50px;
    text-align: center;
    font-size: 16px;
    font-family: "Alibaba PuHuiTi", "Microsoft YaHei";
    font-weight: bold;
    color: #ffffff;
    user-select: none;

    .headImg {
      position: absolute;
      right: 12px;
      top: 0px;

      height: 100%;
      background-size: cover;
      cursor: pointer;
      i {
        font-size: 28px;
        vertical-align: middle;
      }
    }
  }

  .popCenten_box {
    height: 500px;
    // width: 100%;
    background: #ffffff;
    overflow: auto;
    // padding-top: 20px;
    // display: flex;
    // justify-content:center;
    // align-items:center;
    padding: 0 20px;
    .pop-centent {
      width: 100%;
      height: 430px;
      
      .el-table--border td{
        background: #F8F8F8;
      }
      .el-table__body-wrapper{
        background: #F8F8F8;

      }
    }

    .textA {
      width: 100% !important;

      .textB {
        width: 85.5% !important;
      }
    }
  }

  .button {
    width: 80px;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-family: "Source Han Sans CN", "Alibaba PuHuiTi", "Microsoft YaHei";
    font-weight: 400;
    color: rgba(248, 248, 248, 1);
    cursor: pointer;
    line-height: 32px;
    overflow: hidden;
    margin-right: 10px;
    text-align: center;
  }
  .btn-close {
    height: 33px;
    margin-left: 14px;
  }

  .right {
    position: absolute;
    // float: right;
    right: 32px;
  }
  .list-date-style.el-date-editor.el-input {
    width: 180px;
    .el-input__inner {
      padding-left: 26px;
    }
  }
  .add-btn-style {
    padding: 10px 0;
  }
  .btn-style9 {
    width: 80px;
    height: 30px;
    background: #ffffff;
    border: 1px solid #3399ff;
    border-radius: 2px;
    color: #3399ff;
    font-family: "Source Han Sans CN", "Microsoft YaHei";
    line-height: 28px;
    padding: 0 15px;

    &:hover {
      border: 1px solid #0b7ff4;
      color: #0872dd;
    }
    &:active {
      background: #e4f2ff;
      border: 1px solid #3399ff;
      color: #3399ff;
    }
  }
}
</style>

<style lang="less" scoped>
</style>