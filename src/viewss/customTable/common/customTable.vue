<!--
 * @Description: 这是通用自定义列表页面表单（组件）
 * @Date: 2020-08-12 11:39:53
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:50:27
-->
<template>
 
<div class="tableBox"> 
 <el-table
    :data="tableData"
    style="margin-bottom: 20px;"
    height="660"
    border
    :summary-method="getSummaries"
    :show-summary="IsStatistics==0?false:true"
    default-expand-all
    highlight-current-row
    :tree-props="{children: 'children'}"
    row-key="id"
    :row-style="rowClass"
    ref="handSelectTest_multipleTable"
    @row-click="handleRowClick">

     <!-- 动态内容 -->
      <el-table-column
            :render-header="labelHead"
            v-for="(item,index) in name" :key="index"
            :prop="item"
            :label="title[index]"
            :fixed="title[index] == '操作'?true:false"
            :show-overflow-tooltip='true'>
            <template slot-scope="scope">

              <div :class="title[index] == '操作'?'tableCaoz':''">
                <el-input v-if="title[index] != '操作'?true:false" :disabled="!scope.row.editShow" v-model="scope.row[item]" placeholder=""></el-input>
                <div class="table_img" @click="deleteFun(scope.row,scope.$index)" v-if="title[index] == '操作'?true:false">
                  <img :src="scope.row.deleteImg">
                </div>
                <div class="table_img2" @click="editFun(scope.row,scope.$index)" v-if="title[index] == '操作'?true:false">
                    <img :src="scope.row.editImg">
                </div>

              </div>
            </template>
        </el-table-column>
  </el-table>


</div>
</template>
<script>

  export default {
    data() {
      return {
          tableData:[],
          selectData:[],
          selectRow:[],
          summary:true,
          nameArr:[],
          titleArr:[],
          indexNum:1,
          deleteData:[],//删除数据
      }
    },
    props:['data','name','title','IsStatistics','IsStatisticsArr'],
    watch:{
      name(n,o){
        this.init()
      },
      data(n,o){
        this.init()
      },
       $route(n,o){
         this.initNum()
         this.$parent.$refs.page.pageSizeFun()
         this.init()
       },
      selectData(data){
        this.selectRow = []
        if(data.length > 0){
          data.forEach((item,index) => {
            this.selectRow.push(this.tableData.indexOf(item))
          })
        }
      }
    },
    created(){
       this.init()
    },
    methods: {
      //表单合计
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);

           let IsIndex = this.IsStatisticsArr.indexOf(column.label)
            if(IsIndex != -1){
              sums[index] = ''
            }else{
              sums[index] += ' ';
            }
          } else {

            sums[index] = '';
          }
        });

        return sums;
      },
      //删除
    deleteFun(item,index){
      console.log('item',item.addShow)
      if(!item.addShow){
        this.$parent.tipsFun('2',`是否确认删除`,'删除')
        this.deleteData = item
      }else{
        this.tableData.splice(index,1)
      }
      console.log('sun',this.tableData)

      
    },
    //否有编辑
     editIng(){
       console.log('tableData',this.tableData)
        for(let i=0;i<this.tableData.length;i++){
          if(this.tableData[i].editShow == true){
            let value ={
              index:i,
              indexNum:this.indexNum
            }
            return value
          }
        }
        return ''
     },
     //添加空行
     addRowFun(){
             var newArr = []
             
             console.log('newArr',this.name)
           for(let j=0;j<this.name.length;j++){
             newArr.push(this.name[j])
           }
             let value = {}
             for(let i=0;i<newArr.length;i++){
                  var o = {};
                  var str = "o."+newArr[i]+"=''";
                  eval(str);
                  Object.assign(value,o);
             }
                value.editImg = require('../../../assets/img/Yes.png')
                value.editShow = true
                value.deleteImg = require('../../../assets/img/Delete.png')
                value.deleteShow = false
                value.addShow = true
            return value
     },
     //提交
     SubmitFun(){
        var editNum = this.editIng()
        if(editNum.length != 0){
          this.$parent.tipsFun('1',`请完成第${editNum.indexNum}页 第${editNum.index+1}行编辑`)
             return
        }
     },
     //添加
     addFun(){
        var editNum = this.editIng()
        if(editNum.length != 0){
          this.$parent.tipsFun('1',`请完成第${editNum.indexNum}页 第${editNum.index+1}行编辑`)
             return
        }
        //修改当前数据（剔除最后一个，加入一个空）
        if(this.tableData.length != 0){
          if(this.tableData.length == 50){
            this.tableData.splice(49,50)
             let value = this.addRowFun()
             this.tableData.unshift(value)

          }else{
             let value = this.addRowFun()
             this.tableData.unshift(value)
          }
        }else{
            let value = this.addRowFun()
            this.tableData.unshift(value)
        }
        
     },
     //删除接口
     deleteAxios(){
        let data = []
        data.push(this.deleteData)
        var entitys = {entitys:''}
        entitys.entitys =data
        // WMSBusinessManage
        var url = `${this.$store.state.dailog.url1}WMSBusinessManage/WMS_TableValue/RemoveForm`
        this.$axios({              //初始化数据
                method: 'post',
                url: url,
                data:entitys
            }).then(res => {
                  this.$parent.tableDataFun()
                  this.$parent.closeFun()
                  console.log('删除',res)

            }).catch((error)=> {
                    console.log(error);
            });
     },
    // 添加编辑接口
    addOrEdit(data,text){
      var entitys = {entitys:''}
      entitys.entitys =data

      console.log('参数==》',entitys,JSON.stringify(entitys))
        var url = `${this.$store.state.dailog.url1}WMSBusinessManage/WMS_TableValue/SaveData`
        this.$axios({              //初始化数据
                method: 'post',
                url: url,
                data:entitys
            }).then(res => {
                if(text == 'add'){
                  this.$parent.tipsFun('1',`添加成功`,'添加成功')
                }else{
                  this.$parent.tipsFun('1',`编辑成功`,'编辑成功')
                }
                  console.log('添加',res)

            }).catch((error)=> {
                    console.log(error);
            });
    },
    //开启编辑或添加
    editFun(item,index){
         var editNum = this.editIng()
         if(editNum.length != 0){
           if(editNum.index != index){
             this.$parent.tipsFun('1',`请完成第${this.indexNum}页 第${editNum.index+1}行编辑`)
             return
           }
         }

      if(item.addShow == true){  //添加表格行
        item.editImg = require("../../../assets/img/Editor.png")
        item.editShow = false
        item.addShow = false
        this.tableData = JSON.parse(JSON.stringify(this.tableData)) 
        console.log('添加',item)
        var DtCode = this.$parent.DtCodeValue()
        item.DT = DtCode.DT
        item.Code = DtCode.CodeValue
        item.TableId = this.$route.query.tableID
        let data = []
        data.push(item)
        console.log('data==>添加',data,DtCode)
        this.addOrEdit(data,'add')
      }else{                      //编辑表格行 
        if(item.editShow == false){                         //开始编辑
          item.editImg = require("../../../assets/img/Yes.png")
          item.editShow = true
           this.tableData = JSON.parse(JSON.stringify(this.tableData)) 
        }else if(item.editShow == true){                     //编辑完成   
          item.editImg = require("../../../assets/img/Editor.png")
          item.editShow = false
          this.tableData = JSON.parse(JSON.stringify(this.tableData)) 
          console.log('编辑',item)
          let data = []
          data.push(item)
          this.addOrEdit(data,'edit')
        }
      }


    },
      initNum(){
        this.indexNum = 1
      },
      init(){
        this.$nextTick(()=>{
          if(this.IsStatistics){
            document.querySelector('.el-table__body-wrapper').style.height = '88%'
          }else{
            document.querySelector('.el-table__body-wrapper').style.height = '94%'
          }
        })
        //  分页数据
         if(this.data != null){
           if(this.data.length == 0){
              this.tableData = []
           }else{
             console.log('indexNum',this.indexNum)
             this.dataFun(this.indexNum,50)
            
           }
         }
      },
      
      //分页数据
       dataFun(index,num){
         console.log('index88==>',index,num)
         this.indexNum = index
        
         if(index == 1){
           if(this.data.length != 0){
             this.tableData = this.data.slice(0,num)
           }
         }else{

           var ind = (index-1) * num
           var zn = num+ind
           if(this.data.length != 0){
             this.tableData = this.data.slice(ind,zn)
           }
         }
       },
       //分页数据
       dataFun2(num){
         if(this.data.length != 0){
            console.log('报错',this.data)
           this.tableData = this.data.slice(0,num)
         }
       },
       rowClass({row,rowIndex}){
         if(this.selectRow.includes(rowIndex)){
           return {"background-color":"rgba(0,0,0,0.05)"}
         }
       },
        //点行选中复选框
      	handleRowClick(row, column, event) {
          this.$refs.handSelectTest_multipleTable.toggleRowSelection(row);
      },
       //计算表头宽度
        labelHead: function(h, { column, $index }) {
          let zl = 0
          let yl = 0
          var fl = 0
          //判断中英文
          for(let i=0;i<column.label.length;i++){
            var gz = /^[A-Za-z0-9]+$/
            var show = gz.test(column.label[i])
            if(show == true){
              yl = yl + 1
            }else{
               //判断符号
              var zw = /^[\u4e00-\u9fa5]/
              var show1 = zw.test(column.label[i])
              if(zw == true){
                zl = zl + 1
              }else{
                fl = fl + 1
              }
            }
          }
        let z = 16
        let l = 8
        let f = 12
        column.minWidth = z * (zl + 2) + l * (yl + 2) + f * (fl + 3) //加上一个文字长度
        return h('div', { class: 'table-head', style: { width: '68%',display: 'inline-flex' } }, [column.label])
      },
    },
  }
</script>

<style lang="less">
.tableBox{
  .el-input.is-disabled .el-input__inner{
    color: #606266 !important;
    cursor:auto;
  }
    .el-input--small .el-input__inner{
      border:none;
      background: transparent;
  }
  .el-table td div{
    float: left;
  }
  .el-table__row--level-1{
    .el-checkbox{
      opacity: 0.2;
      pointer-events:none
    }
  }
  .el-table th div{
    padding-left:0px !important;
    padding-right:0px !important;
  }
    .el-table th{
        background: #009688;
        color:#fff;
        text-align: center;
    }
     .rowStyle{
        background-color:red!important;
      }
}
</style>

<style lang="less" scoped>
.tableBox{
  .tableCaoz{
    display: grid;
    grid-template-columns: 1fr 1fr;
    width:100%
  }
  .table_img{
    display: inline-block;
    width:26px;
    height:26px;
    cursor: pointer;
    margin-left:35%;
    position: relative;
    img{
      width:100%;
      height: 100%;
      position: absolute;
      top:0;
      left: 0;
      bottom:0;
      right:0;
      margin: auto;
    }
  }
  .table_img2{
    display: inline-block;
    width:25px;
    height:25px;
    cursor: pointer;
    margin-left:5%;
    position: relative;
    img{
      width:100%;
      height: 100%;
      position: absolute;
      top:0;
      left: 0;
      bottom:0;
      right:0;
      margin: auto;
    }
  }

}
</style>