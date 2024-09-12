<!--
 * @Description: 这是自定义表格页面（组件）
 * @Date: 2020-12-03 18:11:08
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:49:24
-->
<template>
    <div class="table" v-loading="loading">

     <currcySearch ref="search" :searchdata="searchdata"></currcySearch>

      <div class="buttom clearfix">
      
          <div style="margin-left:20px" class="left">
            <el-date-picker
              v-model="DT"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </div>
            <div v-if="TableType==0?false:true" style="margin-left:20px" class="left">
                <el-input v-model="CodeValue" :placeholder="CodeName"></el-input>
          </div>
      
          <div @click="SubmitFun()" class="button conter green right">
            <div class="btnText">提交</div>
          </div>
          <div @click="addFun()"  class="button conter green right">
            <div class="btnText">{{addText}}</div>
          </div>
          <div @click="getexcel()" class="button conter green right">
            <div class="btnText">导出</div>
          </div>
         
         
         
      </div>
        
      <div class="table_box">
        <homePage ref="homePage" 
        :data="tableData" 
        :IsStatistics="IsStatistics" 
        :IsStatisticsArr="IsStatisticsArr" 
        :name="name" 
        :title="title">
        </homePage>
      </div>
      
        <!-- 提示弹窗 -->
        <currencyTips ref="tipsPop" 
         :tipsText="tipsText"
         :tipsType="tipsType"
         :tipsValue="tipsValue"
          v-if="tipsShow">
        </currencyTips>
         <!-- 分页 -->
        <currencyPage :allpage="allpage" ref="page"></currencyPage>
        <!-- 遮罩层 -->
        <div v-if="tipsShow" class="mask_box"></div>
    </div>
</template>
<script>
import homePage from './common/customTable'
import currencyPage from './common/currencyPage'
import currcySearch from './common/currencySearch'
import currencyTips from './common/currencyTips'
export default {
  components:{
    homePage,
    currencyTips,
    currcySearch,
    currencyPage
  },
     data() {
      return {
        allpage:0,
        name:'',
        title:'',
        searchdata:[],   //搜索data
        tableData: [],
        loading:false,

        DT:"",
        CodeValue:'',
        tipsValue:'',
        tipsType:'',
        tipsText:'',
        tipsShow:false,
        addText:'添加',
        CodeName: "", //输入框名称
        TableType: '',//是否显示输入框
        IsStatistics:'',//是否合计
        IsStatisticsArr:[],//是否合计
        SearchData:[],//表单数据
        tableID:''

      }
    },
    watch:{
         $route(n,o){
             this.loading = true
             this.init()
         }
    },
    mounted(){
      this.DT = this.$moment().format('YYYY-MM-DD')
      this.init()
    },
    methods:{
      DtCodeValue(){
        var value = {
          DT:this.DT,
          CodeValue:this.CodeValue
        }
        return value
      },
      //提示弹窗
      tipsFun(type,text,value){
         this.tipsShow = true
         this.tipsValue=value
         this.tipsType=type
         this.tipsText = text
      },
      //获取时间值和code值
      dtCodeFun(){
        var value = {
          Dt:this.DT,
          CodeValue:this.CodeValue
        }
        return value
      },
      //关闭弹窗
      closeFun(){
        this.tipsShow = false
      },
      //提交方法
      SubmitFun(){
        this.$refs.homePage.SubmitFun()
      },
      //添加弹窗
      addFun(){
        this.$refs.homePage.addFun()
      },
      
       //导出
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getexcel() {
        require.ensure([], () => {
            const { export_json_to_excel } = require('../../vendor/Export2Excel.js');
            const tHeader = this.title
            const filterVal = this.name
            const list = this.tableData;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, '表单列表');
        })
    },

       //初始化列表页面
        init(){
          this.SearchData = []
           this.tableID = this.$route.query.tableID
          this.$refs.search.queryFun()
          this.SearchFun()
          this.tableInfoFun()
          this.tableHeadFun()
          this.tableDataFun()
        },
        //查询方法
        SearchDataFun(data){
          this.SearchData =  JSON.parse(JSON.stringify(data))
           // 修改时间参数格式
            for(let i=0;i<this.SearchData.length;i++){
                if(this.SearchData[i].logic == 'date'){
                  var index = this.SearchData[i].value.indexOf('|')
                  var time1 = this.SearchData[i].value.slice(0,index)
                  var time2 =this.SearchData[i].value.slice(index+1)
                  let value1={
                       logic:'>',
                       name:this.SearchData[i].name,
                       value:time1
                  }
                  let value2={
                       logic:'<',
                       name:this.SearchData[i].name,
                       value:time2
                  }
                  this.SearchData.push(value1)
                  this.SearchData.push(value2)
                  this.SearchData.splice(i,1)
                }
            }
            
            let value ={
              logic:'=',
              name:'DT',
              value:this.DT,
            }
            let value1 ={
              logic:'=',
              name:'tableID',
              value:this.tableID,
            }
            let value2 ={
              logic:'=',
              name:'Code',
              value:this.CodeValue,
            }
         this.SearchData.push(value)
         this.SearchData.push(value1)
         this.SearchData.push(value2)
          console.log('查询方法==>',this.SearchData)
          this.$refs.homePage.initNum()
          this.tableDataFun()
        },
        //请求报表信息
        tableInfoFun(){
          // WMSBusinessManage
           var url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_TableInfo/GetData?tableID=${this.tableID}`
            this.$axios({              //初始化数据
                    method: 'post',
                    url: url,
                }).then(res => {
                   let data = JSON.parse(res.data.resultdata)[0]
                   this.IsStatistics = data.IsStatistics==undefined?0:data.IsStatistics
                   this.CodeName = data.CodeName
                   this.TableType = data.TableType

                   console.log('请求报表信息',data,this.IsStatistics,data.IsStatistics)

                }).catch((error)=> {
                        console.log(error);
                });
        },
        //请求表头数据
        tableHeadFun(){
         
            var url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_TabelField/GetData?tableID=${this.tableID}`
            this.$axios({              //初始化数据
                    method: 'post',
                    url: url,
                }).then(res => {
                    let data = JSON.parse(res.data.resultdata)
                    this.name = []
                    this.title = []
                    for(let i=0;i<data.length;i++){
                         this.name.push(data[i].FieldIndex)
                         this.title.push(data[i].FieldName)
                         if(data[i].IsStatistics != undefined){
                             if(data[i].IsStatistics == 1){
                               this.IsStatisticsArr.push(data[i].FieldName)
                             }
                         }
                    }
                      this.name.unshift('operation')
                      this.title.unshift('操作')
                     console.log('请求表头数据',data,this.name,this.title)
          
                }).catch((error)=> {
                        console.log(error);
                });
        },
        //请求表格数据
        tableDataFun(){
          console.log('参数',this.SearchData)
            var url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_TableValue/GetData`
            this.$axios({              //初始化数据
                    method: 'post',
                    url: url,
                    data:this.SearchData
                }).then(res => {
                   this.loading = false
                    let data1 = JSON.parse(res.data.resultdata)
                    
                    for(let i=0;i<data1.length;i++){
                        data1[i].operation = true
                        data1[i].editImg = require('../../assets/img/Editor.png')
                        data1[i].editShow = false
                        data1[i].deleteImg = require('../../assets/img/Delete.png')
                        data1[i].deleteShow = false
                        data1[i].addShow = false
                    }
                    this.tableData = data1
                    this.allpage = this.tableData.length
                     console.log('请求表格数据88',res,data1)
                }).catch((error)=> {
                        console.log(error);
                });

        },
        //请求搜索头数据
        SearchFun(){
            this.id = this.$route.query.name
            if(this.id == undefined){
                this.id = ''
                return
            }
            var url = `${this.$store.state.dailog.url1}/WMSBusinessManage/Base_Page/GetPageInfo?page_ID=${this.id}`
              this.$requset({              //初始化数据
                    method: 'get',
                    url: url,
                }).then(res => {
                    let data1 = JSON.parse(res.data.resultdata)
                     this.searchdata = data1.filter_list
                   
                }).catch((error)=> {
                        console.log(error);
                });
        },
         //阻止F5事件并页面刷新
        stopF5Refresh() {
            document.onkeydown =  (e) => {
                var evt = window.event || e;
                var code = evt.keyCode || evt.which;
                if (code == 116) {
                  console.log('触发')
                
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    } else {
                        evt.keyCode = 0;
                        evt.returnValue = false
                    }
                
                }
            }
        },
       
       
      
    }
}
</script>
<style lang="less">
.table{
    .table_box{
        .el-loading-mask{
            top:56px;
        }
    }
    .select{
      .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:200px;
      }
    }
    .buttom{
        .el-date-editor.el-input{
           width:200px !important;
        }
    }

}
</style>
<style lang="less" scoped>
.table{
  width:100%;
  height:100%;
  background: #fff;
  
  .left{
    float:left;
  }
  .right{
    float: right;
  }
  .clearfix:after{/*伪元素是行内元素 正常浏览器清除浮动方法*/
        content: "";
        display: block;
        height: 0;
        clear:both;
        visibility: hidden;
    }
    .clearfix{
        *zoom: 1;
    }
    .select{
        width: 170px;
        height: 40px;
        margin-right:20px;
    }
    .button{
      width:80px;
      height:32px;
      border-radius:4px;
      font-size:14px;
      font-family:Source Han Sans CN;
      font-weight:400;
      color:rgba(248,248,248,1);
      cursor: pointer;
      line-height: 32px;
      overflow: hidden;
      margin-right:10px;
      user-select: none;
  }
  .button2{
      width:108px;
      height:32px;
      border-radius:4px;
      font-size:14px;
      font-family:Source Han Sans CN;
      font-weight:400;
      color:rgba(248,248,248,1);
      cursor: pointer;
      line-height: 32px;
      overflow: hidden;
  }
  .green:hover{
    background: #33DAC1;
  }
  .blue:hover{
      background: #6FB4FA;
  }
  .green{
    background:rgba(44,160,147,1);
  }
  .green2{
      background:rgba(58,179,118,1);
  }
  .yellow{
      background:rgba(224,181,50,1);
  }
  .red{
      background:rgba(230,98,98,1);
  }
  .blue{
      background:rgba(50,141,234,1);
  }
  .grey{
      background:rgba(134,153,171,1);
  }
  .searchButton{  
    background: url("../../assets/img/icon_serch.png");
    background-size: cover;
  }
  .refreshButton{
      background: url("../../assets/img/icon_refresh.png");
      background-size: cover;
  }
  .btnImg{
      width:16px;
      height:16px;
      float: left;
      position: relative;
      margin-top:9px;
      margin-left:16px;
      margin-right:5px;
  }

  .search{
    padding-top:10px;
    padding-left:10px;
    width:100%;
    height:40px;
  }
  .btnText{
    display: inline-block;
  }
  .conter{
    text-align: center;
  }
  .buttom{
    margin-bottom:10px;
    .buttom_time{
        line-height: 32px;
        margin-left: 19px;
        margin-right: 10px;
    }
    .buttom_inp{
      line-height: 32px;
      margin-left:20px;
      margin-right:10px;
    }
  }
}

</style>
