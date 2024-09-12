<!--
 * @Description: 这是通用列表页面（组件）
 * @Date: 2020-08-12 10:35:19
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:55:21
-->
<template>
    <div class="box" v-loading="loading">
      <!-- 搜索 -->
      <search :searchdata="searchdata"></search>
      <!-- 按钮 -->
      <buttomH :btnData="btnData" :btnPowerData="btnPowerArr"></buttomH>
      <!-- 表格 -->
      <div v-loading="loading2" class="table_box">
        <homePage ref="homePage" :data="tableData" :name="name" :title="title"></homePage>
      </div>
      <!-- 分页 -->
      <page :allpage="allpage" ref="page"></page>
      <!-- 弹窗 -->
      <addpop ref="addpop" :popTitle="popTitle" :tableDataArr="tableDataArr" :axioData="item" :data="addData" v-if="addShow"></addpop>
      <tipsPop ref="tipsPop" 
      :tableDataArr="tableDataArr" 
      :title="TitleText" 
      :data="item" 
      :type="tipsType"
      :textInfo='textInfo'
      v-if="tipsShow">
      </tipsPop>
      <!-- 遮罩层 -->
      <div v-if=" addShow || tipsShow" class="mask_box"></div>
      <upimg :data="imgdata" :imgType='imgType' v-if="upimgShow"></upimg>  

    </div>
</template>
<script>
import homePage from './common/table'
import page from '../../components/common/page'
import buttomH from './common/ButtomH'
import search from './common/search'
import addpop from './common/addPop'
import upimg from './common/upImg'
import tipsPop from '../../components/common/tipsPop'
export default {
    components:{
        homePage,
        page,
        buttomH,
        search,
        addpop,
        tipsPop,
        upimg
    },
    data(){
        return{
            loading2:false,
            loading:false,
            addShow:false,
            tipsShow:false,
            upimgShow:false,
            tableDataArr:[],
            addData:[],//弹窗数据
            allpage:0,//分页总数
            tipsType:'',
            TitleText:'',
            item:'',
            tableData:[],//表单data
            name:[],
            title:[],
            searchdata:[],   //搜索data
            btnData:[], //按钮data
            popTitle:'',
            id:'',
            url:'',//表单数据路径
            SearchData:[], //表单数据
            btnPowerArr:[], //有权限的按钮
            imgdata:[],//图片数据
            imgType:'',//新增或查看图片
            textInfo:'', //提示弹窗文本
            loading:false,
            tableUrl:'' , //表单数据
            queryArr:[] //查询条件
        }
    },
    watch:{
         $route(n,o){
             this.loading = true
             this.init()
         }
    },
    created(){
         this.init()
    },
    mounted(){
        this.stopF5Refresh()
    },
    methods:{
        //初始化列表页面
        init(){
            this.btnPowerArr = []
            this.tableData = []
            this.tableDataArr = []
            this.SearchData = []
            this.addShow =false
            this.tipsShow = false
            this.upimgShow = false
            this.id = this.$route.query.name
            if(this.id == undefined){
                this.id = ''
                return
            }
            this.btnPowerArr = this.$store.state.dailog.AutorizedBtnList
            console.log('btnPowerArr:'+this.btnPowerArr)
            // var url = `${this.$store.state.dailog.url1}/COMmon/Base_Page/GetPageInfo?page_ID=${this.id}`
            var url = `${this.$store.state.dailog.url1}/api/wms/page?id=${this.id}`
            this.allpage = 0
            this.tableData = []
              this.$axios({              //初始化数据
                    method: 'get',
                    url: url,
                }).then(res => {
                    this.loading = false
                    let data1 = JSON.parse(res.data.resultdata)
                     this.name = []
                     this.title = []
                     for(let i=0;i<data1.Field_list.length;i++){
                      
                         if(data1.Field_list[i].isTableAvailable == 0){
                             console.log('不添加')
                         }else{
                            this.name.push(data1.Field_list[i].FieldIndex)
                            this.title.push(data1.Field_list[i].FieldName)
                         }
                     }
                     console.log('表头',data1.filter_list)
                     this.searchdata = data1.filter_list
                     this.btnData = data1.Btn_list
                    //表单数据
                      var JumpType = this.$route.query.type
                        this.queryArr = []
                        if(JumpType == '2'){
                            var routerArr = this.$store.state.dailog.routerArr
                            for(var i in routerArr){
                                var queryValue = {
                                    name:i,
                                    logic:'=',
                                    value:routerArr[i]
                                }
                                this.queryArr.push(queryValue)
                            }
                        }else{
                            this.queryArr = []
                        }

                    this.url = data1.URL
                    var url1 = `${this.$store.state.dailog.url1}${this.url}`
                    this.tableUrl = url1
                    this.tableFun(url1,this.queryArr)

                }).catch((error)=> {
                     this.loading = false
                        console.log(error);
                });
        },
          //阻止F5事件并页面刷新
        stopF5Refresh() {
            document.onkeydown =  (e) => {
                var evt = window.event || e;
                var code = evt.keyCode || evt.which;
                if (code == 116) {
                    this.init()
                    if (evt.preventDefault) {
                        evt.preventDefault();
                    } else {
                        evt.keyCode = 0;
                        evt.returnValue = false
                    }
                
                }
            }
        },
        //表单数据
        tableFun(url1,queryArr){
            this.loading2 = true
              this.$axios({
                        method: 'post',
                        url: url1,
                        data:queryArr
                    }).then(res => {
                         this.loading2 = false
                        if(this.title != 0){
                            let data = JSON.parse(res.data.resultdata)
                            this.tableData = data
                            this.stateFun()
                            this.allpage = this.tableData.length
                            console.log('allpage999',this.allpage)
                        }
                    }).catch((error)=> {
                         this.loading2 = false
                            console.log(error);
                    });
        },
        //筛选表单
        SearchDataFun(data){
            this.SearchData =  JSON.parse(JSON.stringify(data))
            if(this.$route.query.type == '2'){
                this.SearchData.push(this.queryArr[0])
            }
            // 修改时间参数格式
            for(let i=0;i<this.SearchData.length;i++){
                if(this.SearchData[i].logic == 'date'){
                  var index = this.SearchData[i].value.indexOf('|')
                  var time1 = this.SearchData[i].value.slice(0,index)
                  var time2 =this.SearchData[i].value.slice(index+1)
                  var value1={
                       logic:'>',
                       name:this.SearchData[i].name,
                       value:time1
                  }
                  var value2={
                       logic:'<',
                       name:this.SearchData[i].name,
                       value:time2
                  }
                  this.SearchData.push(value1)
                  this.SearchData.push(value2)
                  this.SearchData.splice(i,1)
                }
            }
            console.log('SearchData',this.SearchData)
            this.tableFun(this.tableUrl,this.SearchData)
        },
        //刷新表单数据
        UptableFun(){
            var url = `${this.$store.state.dailog.url1}${this.url}`
              this.$axios({
                        method: 'post',
                        url: url,
                        data:this.SearchData,
                    }).then(res => {
                         let data = JSON.parse(res.data.resultdata)
                         console.log('data8888',data)
                         this.tableData = data
                          this.stateFun()
                         this.allpage = this.tableData.length
                         this.addShow = false
                    }).catch(function(error) {
                            console.log(error);
                    });
        },
        //提示弹窗信息
        textInfoFun(text){
            this.textInfo = text
            this.tipsType = '7'
            this.tipsShow = true
        },
        //关闭弹窗
        cancelFun(){
            this.addShow = false
            this.tipsShow = false
             this.upimgShow = false
        },
        
        //状态文本
        stateFun(){
        // var url = `${this.$store.state.dailog.url1}WMSBusinessManage/Base_Quote/GetListJson?Page_ID=${this.id}`
        var url = `${this.$store.state.dailog.url1}api/wms/option?id=${this.id}`
              this.$axios({
                        method: 'Get',
                        url: url,
                    }).then(res => {
                        var data = JSON.parse(res.data.resultdata)
                        console.log('文本',data)
                        if(data.length){
                            for(let i=0;i<data.length;i++){
                                var name = data[i].QuoteColumn
                                for(let k=0;k<data[i].Base_QuoteDetailList.length;k++){
                                    for(let j=0;j<this.tableData.length;j++){
                                        if(this.tableData[j][name] == data[i].Base_QuoteDetailList[k].Val){
                                            this.tableData[j][name] = data[i].Base_QuoteDetailList[k].Name
                                            if(data[i].Base_QuoteDetailList[k].Color != undefined){
                                                if(data[i].Base_QuoteDetailList[k].Color != null){
                                                    this.tableData[j].Color = data[i].Base_QuoteDetailList[k].Color
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }).catch((err)=>{

                    })
        },
        //排版内容
        PopDomFun(editUrl){
             return new Promise((resolve, reject) => {
                 var url = `${this.$store.state.dailog.url1}${editUrl}`
                  this.$axios({
                    method: 'get',
                    url:url
                  }).then((res)=>{
                      var editdata = JSON.parse(res.data.resultdata)
                    
                        for(var i=0;i<editdata.length;i++){
                            editdata[i].value = ""
                            editdata[i].isupdateavailable = '1'
                        }
                        console.log('url==>',url)
                        this.addData = editdata
                        resolve('成功了')
                  })
             })
        },
        //编辑内容参数
        editVFun(data){

            var Params = data.Params
            var paramData = []
            this.value = []
            for(let i=0;i<Params.length;i++){
                paramData.push(Params[i].ParamName)
            }
                let value2 = {}
                for(let j=0;j<paramData.length;j++){
                    for(var item in this.tableDataArr[0]){
                        if(item  == paramData[j]){
                                var o = {};
                                var str = `o.${item}="${this.tableDataArr[0][item]}"`
                                eval(str);
                                Object.assign(value2,o);
                            break;
                        }
                    else{
                                var o1 = {};
                                var str1 = "o1."+paramData[j]+"=''";
                                eval(str1);
                                Object.assign(value2,o1);
                        }
                    }
                }
                return value2
        },
        //开启添加编辑
        activePop(text,item){
            //编辑类
            if(item.WindowType == '2' || item.WindowType == '3'){
                 if(this.tableDataArr.length == 0){
                     this.tipsType = '0'
                     this.tipsShow = true
                 }else if(this.tableDataArr.length > 1 && item.WindowType == '2'){
                     this.tipsType='2'
                     this.tipsShow = true
                 }else{
                    this.popTitle = text
                    this.item = item
                    this.addShow = true
                    var editUrl = `COMmon/Common/RenderEditWindows?Page_ID=${this.id}&WindowType=2`
                    this.PopDomFun(editUrl).then(val =>{//请求编辑排版
                    var v = this.editVFun(item)
                    console.log('vvvvv',v)
                    var url = `${this.$store.state.dailog.url1}${item.PopupUrl}`
                            //请求编辑内容
                            this.$axios({
                                method: 'post',
                                url:url,
                                data:v
                            }).then(res => {
                                console.log('dataV==>',res)
                                var dataV = JSON.parse(res.data.resultdata)
                                this.$refs.addpop.Rendering(dataV,this.addData)
                                 resolve('成功了')
                            }).catch((err)=>{
                                console.log('err',err)
                            })
                        })
                 }
            }else if(item.WindowType == '1'){
                 //新增类
                 this.popTitle = text
                  this.item = item
                 this.addShow = true
                 var url = `/api/wms/page/render-field?id=${this.id}&windowType=1`
                this.PopDomFun(url).then(val =>{
                    this.$refs.addpop.addSelecFun(this.addData)
                })
            }
           
        },
        //调整
        jumpFun(data){
             if(this.tableDataArr.length == 0){
                     this.tipsType = '7'
                     this.tipsShow = true
                     this.textInfo = '请至少勾选一个'
                 }else if(this.tableDataArr.length > 1){
                     this.tipsType='7'
                     this.tipsShow = true
                     this.textInfo = '不可多选查看子菜单'
                 }else{

                     var value = this.editVFun(data)
                     this.$store.state.dailog.routerArr = value
                     if(data.Route.length != 0){
                         var aa = data.Route.trim()
                         this.$router.push({path:aa,query: {id:`${data.Btn_Text}`,name:`${data.ChildPageID}`,type:'2'}})
                     }else{
                          this.$router.push({path:`/konbi`,query: {id:`你好`,name:`2DC5DF27-E93D-41EC-8811-1BC6D53416BC`,type:'2'}})
                     }
                 }
        },
        //开启上传图片
        upImgPop(data){
              if(this.tableDataArr.length == 0){
                     this.tipsType = '7'
                     this.tipsShow = true
                     this.textInfo = '请至少勾选一个'
                 }else if(this.tableDataArr.length > 1){
                     this.tipsType='7'
                     this.tipsShow = true
                     this.textInfo = '不可多选编辑图片'
                 }else{
                     this.imgType = data.Btn_Type
                     this.imgdata = this.tableDataArr
                     this.upimgShow = true
                 }
        },
        //开启提示
        activeTips(text,item){
            console.log('tiem444',text,item)
            this.tipsShow = true
            this.tipsType = '4'
            this.TitleText = text
            this.item = item
        },
          //接收表格数据
        tabelFun(data){
            this.tableDataArr = data
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
    //文件导入中的loding
    importLoTrue(){
        this.loading2 = true
    },
    importLoFalse(){
        this.loading2 = false
    },
    //导入
    ImportExeFun(){
        
    }

    }
    
}
</script>
<style lang="less">
.box{
    .el-button--primary{
        background-color:#009688 !important;
    }
    .el-upload--text{
        border:none;
    }
    .el-button--primary:hover{
        background-color: #33DAC1 !important;
    }
    .table_box{
        .el-loading-mask{
            top:56px;
        }
        .el-table tbody tr:hover>td {
             background-color: #05A798 !important;
             color: #000; 
        }
    }
}
</style>
<style lang="less" scoped>
.box{
    width:100%;
    height: 100%;
    background: #fff;
    .table_box{
        width:100%;
        margin: auto;
        height: 674px;
    }
    .mask_box{
        position: absolute;
        top:0;
        bottom:0;
        left:0;
        right: 0;
        margin: auto;
        width: 100%;
        height: 100%;
        z-index: 9;
    }
}
</style>