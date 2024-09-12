<!--
 * @Description: 这是通用列表页分页、用户信息分页页面（组件）
 * @Date: 2020-08-12 15:35:43
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:21:44
-->
<template>
  <div class="paginate">
    <!-- {{currentPage4}} -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage4"
      :page-size="pageSize"
      layout="sizes,total, prev, pager, next, jumper"
      :total="totalNum"
      popper-class="select-dropdown-class-li"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      currentPage4: 1,
      totalNum: 0,
      pageSize: 50,
    };
  },
  props: ["allpage"],
  watch: {
    allpage(n, o) {
      this.totalNum = this.allpage;
      var num = Math.ceil(this.totalNum / 50);
      this.PageNum = [];
      for (var i = 1; i <= num; i++) {
        var value = 50 * i;
        this.PageNum.push(value);
      }
      this.pageSize = 50;
    },
    currentPage4(n,o){
      this.$emit('get-current-page',this.currentPage4)
    }
  },
  created() {
    this.totalNum = this.allpage
    var num = Math.ceil(this.totalNum / 50);
    this.PageNum = [];
    for (var i = 1; i <= num; i++) {
      var value = 50 * i;
      this.PageNum.push(value);
    }
  },
  methods: {
    pageSizeFun() {
      this.$refs.pagination.internalCurrentPage = 1;
    },
    //每页数量
    handleSizeChange(val) {
      this.pageSize = val;
      if (this.$parent.$refs.homePage != undefined) {
        this.$parent.$refs.homePage.dataFun2(val);
      } else {
        this.$parent.dataFun2(val);
      }
    },
    //当前页码数
    handleCurrentChange(val) {
      if (this.$parent.$refs.homePage != undefined) {
        this.$parent.$refs.homePage.dataFun(val, this.pageSize);
      } else {
        this.$parent.dataFun(val, this.pageSize);
      }
    },
  },
};
</script>
<style lang="less">
.paginate {
  text-align: right;
  .el-pagination .btn-next, .el-pagination .btn-prev,.el-pager li{
      background: #f2f2f2;
  }
  .el-pagination span,
  .el-pager li,
  .el-pagination__total {
    font-size: 14px !important;
    font-family: 'Microsoft YaHei';
    font-weight: 400;
    color: #333333;
  }
  .el-input__inner{
      color: #FCB977;
  }
  .el-pagination__sizes .el-input .el-input__inner:hover{
    border: 1px solid #3399FF;
  }
  .el-pager li:hover,.el-pagination button:hover,
  .el-pager li.active{
      color: #3399FF;
  }

}
</style>