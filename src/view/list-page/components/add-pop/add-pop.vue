<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
  <div ref="scPopBox1" class="scPopBox1">
    <div v-drag1 class="scPopBox_c" ref="scPopBoxC">
      <div class="head">{{popTitle}}
        <!-- <div @click="cancelFun()" class="headImg"></div> -->
        <div class="headImg" @click="cancelFun()">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="popCenten_box" v-loading="disLoading" v-stopdrag ref="popCentenBox">
        <div class="pop-centent">
          <div v-for="(item,index) in dataArr" :key="index" class="row_box" :class="item.fieldtype=='textarea'?'textA':''">
            <span class="pop-text" style="float:left">{{item.fieldname}}:</span>
            <div class="elemen_box" :class="item.fieldtype=='textarea'?'textB':''">
              <el-input :disabled="item.isupdateavailable != '1'" @input="inputFun(item)" v-if="item.fieldtype=='num'" v-model="item.value" placeholder="请输入内容"></el-input>
              <el-autocomplete :disabled="item.isupdateavailable != '1'" @input="inputFun(item)" :trigger-on-focus="false" v-if="item.fieldtype=='nvarchar'" v-model="item.value" placeholder="请输入内容"
                :fetch-suggestions="querySearchAsync">
              </el-autocomplete>
              <el-date-picker popper-class="data-picker-class-li" :disabled="item.isupdateavailable != '1'" v-if="item.fieldtype=='datetime'" v-model="item.value" type="datetime" placeholder="选择日期时间">
              </el-date-picker>
              <el-select popper-class="select-dropdown-class-li" @change="selectChange(item)" :disabled="item.isupdateavailable != '1'" v-if="item.fieldtype=='selection'" v-model="item.value" placeholder="请选择">
                <el-option v-for="i in item.data" :key="i.text" :label="i.text" :value="i.text">
                </el-option>
              </el-select>
              <textarea :disabled="item.isupdateavailable != '1'" class="textarea" v-model="item.value" v-if="item.fieldtype=='textarea'"></textarea>
            </div>
          </div>
        </div>

      </div>
      <div class="fool_btn">
        <el-button @click="conserve()" class="btn-style21" :loading="saveFromBtn">保存</el-button>
        <el-button @click="cancelFun()" class="btn-style22 btn-close">取消</el-button>
        <el-button @click="clearFun() " class="btn-style7 right">清空</el-button>
      </div>
    </div>

  </div>
</template>

<script>
import './add-pop.less'
import { saveCommonData, dropownQuery, dropownListQuery } from '@/api/home.js'
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
      saveFromBtn: false
    }
  },
  props: ['popTitle', 'data', 'axioData', 'tableDataArr', 'tableList', 'disLoading'],
  watch: {
    data(n, o) {
      this.getTop()
      this.init()
    }
  },
  mounted() {
    // this.$refs.popCentenBox.style.maxHeight =window.innerHeight/2+'px'
    this.getTop()
    // console.log()

  },
  created() {
    //fieldtype : textarea  datetime  selection  nvarchar num
    //selection => data 
    this.init()

  },
  methods: {
    getTop() {

      this.$refs.scPopBox1.style.top = "50%"
      let height = this.$refs.scPopBoxC.clientHeight
      console.log(height)
      this.$refs.scPopBox1.style.marginTop = -height / 2 + 'px';

    },
    init() {

      this.GroupSelect = []
      this.GroupSelectAll = []
      this.dataArr = this.data

      // console.log(this.tableDataArr)
      // console.log(this.data)
      // this.dataArr = array.concat(this.data,this.data)

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
    querySearchAsync(queryString, callback) {
      let list1 = []
      let data = ''
      if (this.inputData) {
        // console.log(this.inputData)
        var index = this.inputData.fieldindex
        let list = this.tableList
        if (this.inputData.GroupParent) {
          data = this.dataArr.filter((item) => {
            return this.inputData.GroupParent == item.fieldindex
          })
          for (let i = 0; i < list.length; i++) {
            if (list[i][index] && list[i][index].indexOf(queryString) != -1) {
              // console.log(list[i][data[0].fieldindex])
              if (data[0].value == list[i][data[0].fieldindex]) {
                list1.push(list[i][index])
              }
            }
          }
        } else {
          for (let i = 0; i < list.length; i++) {
            if (list[i][index] && list[i][index].indexOf(queryString) != -1) {
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
      //                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              console.log(item)
      this.inputData = item
      if (item.fieldtype == 'num') {
        item.value = parseInt(item.value)
        if (String(item.value) == 'NaN') {
          item.value = ''
        }
      }
    },
    //清空
    clearFun() {
      for (let i = 0; i < this.dataArr.length; i++) {
        this.dataArr[i].value = ''
      }
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
        // this.$axios({            //1为添加保存  
        //   method: 'post',
        //   url: `${this.$store.state.dailog.url1}Common/Base_Field/GetGroupSelect?FieldID=${FieldID}`,
        //   FieldID: FieldID
        // }).then(res => {
        dropownListQuery(FieldID).then(res => {
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
      return new Promise((resolve, reject) => {
        // this.$axios({            //1为添加保存  
        //   method: 'post',
        //   url: `${this.$store.state.dailog.url1}${url}`,
        // }).then(res => {

        dropownQuery(url).then(res => {

          var selectData = JSON.parse(res.data.resultdata)
          // console.log(selectData)
          var arr = []
          for (let i = 0; i < selectData.length; i++) {
            var value = {
              id: selectData[i].ID,
              text: selectData[i].Value,
            }
            arr.push(value)
          }
          resolve(arr)
        }).catch(err => {
          reject(err)
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
    //初始化编辑渲染
    async Rendering(data, htmlData) {
      // console.log(this.dataArr  )
      for (let i = 0; i < this.dataArr.length; i++) {
        for (var item in data) {
          if (item == this.dataArr[i].fieldindex) {
            if (this.axioData.WindowType != 3) {   //单个编辑
              this.dataArr[i].value = data[item]
              if (this.dataArr[i].fieldtype == 'selection') {
                var itemName = item
                console.log('this.dataArr[i].IsGroup', this.dataArr[i].IsGroup)
                if (this.dataArr[i].IsGroup != 'undefined') {
                  if (this.dataArr[i].IsGroup == 1) {
                  await  this.GroupSelectFun(this.dataArr[i].fieldID).then(val => {
                      this.dataArr[i].data = val.data
                      this.dataArr[i].value = this.dataArr[i].data[0].text
                      this.dataArr[i].childrenName = val.id
                      // this.dataArr = this.dataArr
                      if (val.id.length == 0) {
                        for (let i = 0; i < this.GroupSelect.length; i++) {
                          this.selectDataFun(this.GroupSelect)
                        }
                      }
                    })
                  } else {
                    // console.log(data[itemName])
                    // console.log(this.dataArr)
                    console.log('进来了IsGroup', this.dataArr[i].IsGroup)
                    await this.selectFun(this.dataArr[i].Selection_Url).then(val => {
                      // console.log(val)
                      this.dataArr[i].data = val
                      // console.log( this.dataArr[i])
                      for (let j = 0; j < this.dataArr[i].data.length; j++) {

                        if (data[itemName] == this.dataArr[i].data[j].id) {
                          this.dataArr[i].value = this.dataArr[i].data[j].text
                        }
                      }
                      // this.dataArr = this.dataArr
                      // console.log(this.dataArr)

                    })
                  }

                } else {
               await   this.selectFun(this.dataArr[i].Selection_Url).then(val => {
                    this.dataArr[i].data = val
                    for (let j = 0; j < this.dataArr[i].data.length; j++) {
                      if (data[itemName] == this.dataArr[i].data[j].id) {
                        this.dataArr[i].value = this.dataArr[i].data[j].text
                      }
                    }
                    // this.dataArr = this.dataArr

                  })
                }


              }
            } else {   //多项编辑

              if (this.dataArr[i].fieldtype == 'selection') {

                if (this.dataArr[i].IsGroup != 'undefined') {
                  if (this.dataArr[i].IsGroup == 1) {
                 await  this.GroupSelectFun(this.dataArr[i].fieldID).then(val => {
                      this.dataArr[i].data = val.data
                      this.dataArr[i].value = this.dataArr[i].data[0].text
                      this.dataArr[i].childrenName = val.id
                      //  this.dataArr = this.dataArr
                      if (val.id.length == 0) {
                        for (let i = 0; i < this.GroupSelect.length; i++) {
                         this.selectDataFun(this.GroupSelect)
                        }
                      }
                    })
                  } else {
                  await  this.selectFun(this.dataArr[i].Selection_Url).then(val => {
                      this.dataArr[i].data = val
                      this.dataArr[i].value = this.dataArr[i].data[0].text
                      // this.dataArr = this.dataArr
                    })
                  }

                } else {
                await  this.selectFun(this.dataArr[i].Selection_Url).then(val => {
                    this.dataArr[i].data = val
                    this.dataArr[i].value = this.dataArr[i].data[0].text
                    // this.dataArr = this.dataArr
                  })
                }
              }
            }
          }
        }
      }
     
      this.$nextTick(()=>{
         this.dataArr = this.dataArr
      })
      // console.log(this.dataArr)
    },
    //   获取批量编辑的参数
    editVFun() {
      var Params = this.axioData.Params
      var paramData = []
      this.value = []
      for (let i = 0; i < Params.length; i++) {
        paramData.push(Params[i].ParamName)
      }
      for (let i = 0; i < this.tableDataArr.length; i++) {
        let value2 = {}
        for (let j = 0; j < paramData.length; j++) {
          var lastName
          for (var item1 in this.tableDataArr[i]) {
            lastName = item1
          }
          for (var item in this.tableDataArr[i]) {
            if (item == paramData[j]) {
              var o = {};
              var str = `o.${item}="${this.tableDataArr[i][item]}"`
              eval(str);
              Object.assign(value2, o);
              break;
            }
            else {
              if (lastName == item) {
                var o1 = {};
                var str1 = "o1." + paramData[j] + "=''";
                eval(str1);
                Object.assign(value2, o1);
                break;
              }
            }
          }
        }
        this.value.push(value2)
      }
      // debugger
      return this.value
    },
    //保存
    conserve() {
      var btnParams = this.editVFun()
      var nameArr = []
      var valueArr = []
      for (let i = 0; i < this.dataArr.length; i++) {
        var va = this.dataArr[i].value
        // console.log(va)
        if (this.dataArr[i].fieldtype == 'datetime') {
          va = this.$moment(this.dataArr[i].value).format('YYYY-MM-DD hh:mm:ss')
          if (va == 'Invalid date') {
            va = ''
          }
          // console.log(va)
          this.dataArr[i].value = va
        } else if (this.dataArr[i].fieldtype == 'selection') {
          if (this.dataArr[i].data.length) {
            for (let j = 0; j < this.dataArr[i].data.length; j++) {
              if (this.dataArr[i].data[j].text == this.dataArr[i].value) {
                va = this.dataArr[i].data[j].id
                this.dataArr[i].value = va
              }
            }
          }
          // console.log(va)
        }
        nameArr.push(this.dataArr[i].fieldindex)
        valueArr.push(this.dataArr[i].value)
        // console.log(valueArr)
      }
      if (valueArr.length != 0) {
        var value2 = {}
        for (let k = 0; k < nameArr.length; k++) {
          var o = {};
          // var str = `o.${nameArr[k]}='${valueArr[k] === '' ? '""' : valueArr[k]}'`
          var str = `o.${nameArr[k]}='${valueArr[k]}'`
          // let str = `o[nameArr[k]]
          eval(str);
          Object.assign(value2, o);
        }
      }

      if (this.axioData.WindowType == '3') {
        for (let i = 0; i < btnParams.length; i++) {
          Object.assign(btnParams[i], value2);
        }
      } else if (this.axioData.WindowType == '2') {
        for (let i = 0; i < btnParams.length; i++) {
          Object.assign(btnParams[i], value2);
        }
      }
      // console.log(value2)
      // debugger
      //WindowType 1为添加 2为编辑 3为批量编辑
      if (this.axioData.WindowType == '1') { //1为添加保存
        this.saveFun(value2)
      } else {
        if (this.axioData.WindowType == '3') {
          value2 = btnParams
        } else {
          value2 = btnParams[0]
        }
        this.saveFun(value2)

      }
    },
    saveFun(value2) {
      this.saveFromBtn = true
      console.log(this.axioData.SumbitUrl)
      saveCommonData(this.axioData.SumbitUrl, value2).then(res => {
        this.saveFromBtn = false
        if (res.data.isLogin) {
          this.$message({
            message: res.data.message,
            type: 'success'
          });
          this.$parent.UptableFun() //表单刷新
        } else {
          this.$message({
            message: res.data.message,
            type: 'error'
          });
        }

      }).catch(error => {
        this.saveFromBtn = false
        //  console.log(error)
        //  console.log(333)
        this.$message({
          message: error,
          type: 'error'
        })
      })
    }

  }
}
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