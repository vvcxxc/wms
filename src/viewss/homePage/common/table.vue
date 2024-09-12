<!--
 * @Description: 这是通用列表页面表单（组件）
 * @Date: 2020-08-12 11:39:53
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:23:23
-->
<template>
 
<div class="tableBox"> 
 <el-table
    :data="tableData"
    style="margin-bottom: 20px;"
    height="674"
    border
    default-expand-all
    highlight-current-row
    :tree-props="{children: 'children'}"
    row-key="id"
    :row-style="rowClass"
    :row-class-name="tableRowClassName"
    ref="handSelectTest_multipleTable"
    @row-click="handleRowClick"
    @selection-change="handleSelectionChange"
    @sort-change="sortChange"
    >
    
   <el-table-column
      type="selection"
      width="55">
    </el-table-column>
     <!-- 动态内容 -->
     <el-table-column
      :render-header="labelHead"
      
     v-for="(item,index) in name" :key="index"
      :prop="name[index]"
      :label="title[index]"
      sortable
      :show-overflow-tooltip="true">
    </el-table-column>

  </el-table>

</div>
</template>
<script>
  export default {
    data() {
      return {
          tableData:null,
          selectData:[],
          selectRow:[]
      }
    },
    props:['data','name','title'],
    watch:{
      data(n,o){
        this.init()
      },
      selectData(data){
        this.selectRow = []
        if(data.length > 0){
          data.forEach((item,index) => {
            this.selectRow.push(this.tableData.indexOf(item))
          })
        }
      },
       $route(n,o){
         this.$parent.$refs.page.pageSizeFun()
       }
    },
    created(){
       this.init()
    },
    methods: {
      //点行选中复选框
      	handleRowClick(row, column, event) {
          this.$refs.handSelectTest_multipleTable.toggleRowSelection(row);
      },
      init(){
         //分页数据
         if(this.data != null){
           if(this.data.length == 0){
              this.tableData = []
           }else{
             this.tableData =  this.data.slice(0,50)
            // this.tableData =  this.data
             console.log('Color',this.tableData)
           }
         }
      },
      sortChange ({ column, prop, order }) {
         if (order === 'ascending') {
           this.data.sort(
             function (a, b) {
              return a[prop] - b[prop]
             }
           )
         } else if (order === 'descending') {
           this.data.sort(
             function (a, b) {
              return b[prop] - a[prop]
             }
           )
          }
        this.$parent.$refs.page.currentPage4 = 1
        this.$parent.$refs.page.handleCurrentChange(1)
        this.init()
      },
       //表格样式
        tableRowClassName({row, rowIndex}) {
           console.log('row==>',row.Color)
           if(row.Color == '#F7363B'){
              return 'warning-row';
           }else if(row.Color == '#F28105'){
              return 'success-row';
           }else if(row.Color == '#089800'){
              return 'success-active';
           }
           return ''
        },
      
      //分页数据
       dataFun(index,num){
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
           this.tableData = this.data.slice(0,num)
         }
       },
       handleSelectionChange(val){
         this.$parent.tabelFun(val)
         this.selectData = val
       },
       rowClass({row,rowIndex}){
         if(this.selectRow.includes(rowIndex)){
           return {"background-color":"rgba(0,0,0,0.05)"}
         }
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
  .el-table__body-wrapper{
    height: 91% !important;
  }
    .el-table .warning-row {
        background: #F7363B;
        color:#fff;
    }
    .el-table .success-row {
        background: #F28105;
        color:#fff;
    }
    .el-table .success-active {
        background: #089800;
        color:#fff;
    }
}
</style>
<style lang="less">
.tableBox{
  .el-table--scrollable-y .el-table__body-wrapper{
    height: 604px !important;
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