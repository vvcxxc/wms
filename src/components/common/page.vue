<!--
 * @Description: 这是通用列表页分页、用户信息分页页面（组件）
 * @Date: 2020-08-12 15:35:43
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:21:44
-->
<template>
    <div class="block">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage4"
      :page-sizes="PageNum"
      :page-size="pageSize"
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
              var num = Math.ceil(this.totalNum / 50)
              this.PageNum = []
              for(var i=1;i<=num;i++){
                var value = 50 * i
                    this.PageNum.push(value)
              }
                this.pageSize = 50
          }  
    },
    created(){
      this.totalNum = this.allpage
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
          this.pageSize = val
          if(this.$parent.$refs.homePage != undefined){
            this.$parent.$refs.homePage.dataFun2(val)
          }else{
            this.$parent.dataFun2(val)
          }
      },
      //当前页码数
      handleCurrentChange(val) {
        if(this.$parent.$refs.homePage != undefined){
          this.$parent.$refs.homePage.dataFun(val,this.pageSize)
        }else{
          this.$parent.dataFun(val,this.pageSize)
        }
      }
    }
}
</script>
<style lang="less">

</style>