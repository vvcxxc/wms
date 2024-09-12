<!--
 * @Description: 这是自定义编辑列表页分页页面（组件）
 * @Date: 2020-08-12 15:35:43
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 11:55:49
-->
<template>
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="PageNum"
      :page-size="pageSize"
      ref="pagination"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalNum">
    </el-pagination>
  </div>
</template>
<script>
export default {
    data(){
        return{
           PageNum:[],
           currentPage4:1,
           totalNum:0,
           pageSize:50
        }
    },
    props:['allpage'],
    watch:{
          allpage(n,o){
            this.totalNum = this.allpage
              // var num = Math.ceil(this.totalNum / this.pageSize)
              var num = Math.ceil(this.totalNum / 50)
              this.PageNum = []
              for(var i=1;i<=num;i++){
                // var value = this.pageSize * i
                 var value = 50 * i
                    this.PageNum.push(value)
              }
               this.pageSize = 50
          }  
    },
    created(){
      this.totalNum = this.allpage
        // var num = Math.ceil(this.totalNum / this.pageSize)
        var num = Math.ceil(this.totalNum / 50)
        this.PageNum = []
        for(var i=1;i<=num;i++){
            var value = 50 * i
            this.PageNum.push(value)
        }
    },
    methods:{
     pageSizeFun(){
       this.$refs.pagination.internalCurrentPage = 1
     },
     //每页数量
      handleSizeChange(val) {
      
          let editNum = this.$parent.$refs.homePage.editIng()
          if(editNum.length != 0){
            this.$parent.tipsFun('1',`请完成第${editNum.indexNum}页 第${editNum.index+1}行编辑`)
               return
          }

          this.pageSize = val
          if(this.$parent.$refs.homePage != undefined){
            this.$parent.$refs.homePage.dataFun2(val)
          }else{
            this.$parent.dataFun2(val)
          }
          console.log('PageNum',this.PageNum,this.pageSize,this.currentPage4)
      },
      //当前页码数
      handleCurrentChange(val) {
        console.log('vvaall',val)
          let editNum = this.$parent.$refs.homePage.editIng()
          if(editNum.length != 0){
           this.$parent.tipsFun('1',`请完成第${editNum.indexNum}页 第${editNum.index+1}行编辑`)
              return
         }
        

        if(this.$parent.$refs.homePage != undefined){
          this.$parent.$refs.homePage.dataFun(val,this.pageSize)
        }else{
          this.$parent.dataFun(val,this.pageSize)
        }
        console.log('PageNum222',this.PageNum,this.pageSize,this.currentPage4)
      }
    }
}
</script>
<style lang="less">
// .block{
//   .el-pagination{
//       margin-top:56px !important
//   }

// }
</style>