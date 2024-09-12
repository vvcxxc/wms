<!--
 * @Description: 这是库位地图页面（组件）
 * @Date: 2020-08-17 10:32:16
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:34:40
-->
<template>
    <div class="map_box" v-loading="loading">
        <div class="map_title">视觉切换</div>
        <div class="map_head">
            <div @click="viewsFun('1',$event)" class="btn left active btn2">俯视</div>
            <div @click="viewsFun('2',$event)" style="margin-right:3%" class="btn left btn2">侧视</div>
            <div class="map_select left map_textLeft1">
                <span class="map_text map_textLeft">排：</span>
                  <el-select v-model="value1" placeholder="请选择">
                    <el-option
                    v-for="item in rowValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="map_select left map_textLeft1">
                <span class="map_text">列：</span>
                  <el-select v-model="value2" placeholder="请选择">
                    <el-option
                    v-for="item in lineValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="map_select left map_textLeft1">
                <span class="map_text">层：</span>
                  <el-select v-model="value3" placeholder="请选择">
                    <el-option
                    v-for="item in PlieValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
             <div class="map_select left map_textLeft1">
                <span class="map_text">深度：</span>
                  <el-select v-model="value4" placeholder="请选择">
                    <el-option
                    v-for="item in DepathValue"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div style="width:14%;margin-left:1%" class="map_select left map_textLeft1">
                <span class="map_text">托盘号：</span>
                <div style="float:right;width:64%">
                  <el-input v-model="input" placeholder="请输入内容"></el-input>
                </div>
            </div>
            <div @click="query()" class="btn left active btn_left">查看</div>
        </div>

        <div class="map_conter">
                <div class="conter_head">
                    <div class="Colorbtn left yellow"></div>
                    <span class="conter_text left">空库位</span>
                    <div class="Colorbtn left green"></div>
                    <span class="conter_text left">满库位</span>
                    <div class="Colorbtn left orange"></div>
                    <span class="conter_text left">已锁定</span>
                    <div class="Colorbtn left red"></div>
                    <span class="conter_text left">已冻结</span>
                    <div class="Colorbtn2 left bigColor"></div>
                    <span class="conter_text left">大托盘</span>
                    <div class="Colorbtn2 left smallColor"></div>
                    <span class="conter_text left">小托盘</span>
                </div>
                <div class="conter_table">
                    <!-- 表单头部 -->
                    <div class="table_lineBox">
                        <div class="line_row gd"></div>
                        <div v-for="(item,index) in lineArr" :key="index" class="line_box gd">{{item}}{{itemText}}</div>
                    </div>
                    <!-- 表单内容 -->
                    <div v-for="(item,index) in allData" :style="'height:'+(Number(item.length==0?1:item.length)*80)  +'px !important'" :key="index" :class="index%2 == 0 ?'table_conten marbtm':'table_conten'">
                        <img :class="index%2 == 0 ?'marbtmBefore':'marbtmBefore2'" src="../../assets/img/车.png">
                        <div class="table_row gd" :style="'height:'+(Number(item.length==0?1:item.length)*80) + 'px !important;line-height:' + (Number(item.length==0?1:item.length)*80) + 'px'" 
                            :class="item.length?item[0][0].Row=='7'||item[0][0].Row=='8'?'bigColor':'':''">
                            <span class="row_title">{{rowText=='排'?item[0]!=undefined?item[0][0].Row:'':item[0]!=undefined?item[0][0].Plie:''}}{{rowText}}</span>  
                        </div>
                         <div v-for="(i,inde) in item" :key="inde">
                                 <el-tooltip v-for="(it,ind) in i" :key="ind" class="item" effect="dark" placement="top-start">
                                    <div slot="content">
                                        <span>托盘号：{{it.TrayNum}}</span><br/>
                                        <span>物料：{{it.Material}}</span><br/>
                                        <span>数量：{{it.Amount}}</span><br/>
                                        <span v-if="it.BoxCout">箱数：{{it.BoxCout}}</span>
                                    </div>
                                    <div  :id="it.ContainerID" class="table_box" :class="it.ISHold=='1'
                                        ?'red':it.ISLocked=='1'?'red':it.IsFull=='0'?'yellow':'green'">
                                        <span>{{it.ContainerNum}}</span><br/>
                                        <span>{{it.ContainerType_NoUse == null?'':it.ContainerType_NoUse}}</span>
                                    </div>
                                </el-tooltip>
                         </div>
                    </div>
                </div>
                <div style="text-align:center">
                    <el-pagination
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage1"
                        :page-size="19"
                        layout="prev, pager, next"
                        :total="totalNum">
                    </el-pagination>
                </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
          Name:'',
          PlieArr:[],
          lineArr:[],
          line:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
          lineAllNum:[],
          rowArr:[],
          data:[],
          PlieValue:[],
          lineValue:[],
          rowValue:[],
          DepathValue:[],
          Depath:[],
          allData:[],
          Alldata:[],
          value1: '',
          value2:'',
          value3:'',
          value4:'',
          input:'',
          rowText:'排',
          itemText:'列',
          currentPage1:1,
          leftNum:[],//左侧层或排数
          totalNum:0,
          staNum:'',
          endNum:'',
          typeNum:'',
          piePage:'',
          rowPage:1,
          mapData:[],
          loading:false
        
        }
    },
    created(){
       this.init()
    },
    mounted(){
        this.stopF5Refresh()
    },
    methods:{
        init(){
             //row为排 line为列 初始化层数、排数、列数
             this.loading = true
              var url1 = `${this.$store.state.dailog.url1}/WMSBusinessManage/WH_ContainerInfo/GetListJson`
                this.$axios({
                    method: 'post',
                    url: url1,
                }).then(res => {
                    this.loading = false
                    var data = JSON.parse(res.data.resultdata)
                    console.log('data',data)
                    this.mapData = data
                    this.PlieArr = []
                    this.rowArr = []
                    this.lineArr = []
                    this.lineValue = []
                    this.rowValue = []
                    this.PlieValue = []
                   
                    for(let i=0;i<this.mapData.length;i++){
                            this.PlieArr.push(this.mapData[i].Plie)
                            this.rowArr.push(this.mapData[i].RowNum)
                            this.lineArr.push(this.mapData[i].Line)
                            this.Depath.push(this.mapData[i].Depth)
                        }
                        this.PlieArr =new Set(this.PlieArr)
                        this.PlieArr = [...this.PlieArr]
                        this.PlieArr.sort(function(a,b){   //层数
                            return a - b;
                        })
                        this.rowArr =new Set(this.rowArr)
                        this.rowArr = [...this.rowArr]
                        this.rowArr.sort(function(a,b){   //排数
                            return a - b;
                        })
                        console.log('this.rowArr',this.rowArr)
                        this.lineArr =new Set(this.lineArr)
                        this.lineArr = [...this.lineArr]
                        this.lineArr.sort(function(a,b){   //列数
                            return a - b;
                        })
                        this.Depath =new Set(this.Depath)
                        this.Depath = [...this.Depath]
                        this.Depath.sort(function(a,b){   //深度
                            return a - b;
                        })

                        this.lineAllNum = this.lineArr
                        //初始化头部信息
                       for(let j=0;j<this.lineArr.length;j++){
                           let value = {
                                value: this.lineArr[j],
                                label: this.lineArr[j]
                           }
                           this.lineValue.push(value)          //层数
                       }
                        this.totalNum = this.lineValue.length   //分页总数
                        for(let j1=0;j1<this.rowArr.length;j1++){
                            let value = {
                                value: this.rowArr[j1],
                                label: this.rowArr[j1]
                            }
                            this.rowValue.push(value)           //排数 
                        }
                        for(let j2=0;j2<this.PlieArr.length;j2++){
                            let value = {
                                value: this.PlieArr[j2],
                                label: this.PlieArr[j2]
                            }
                            this.PlieValue.push(value)         //层数
                        }
                        
                         for(let j3=0;j3<this.Depath.length;j3++){
                            let value = {
                                value: this.Depath[j3],
                                label: this.Depath[j3]
                            }
                            this.DepathValue.push(value)         //深度
                        }
                     
                        this.value2 = '1'
                        this.value1 = '1'
                        this.value4 = '1'
                        this.value3 = this.PlieArr[this.PlieArr.length - 1]
                        this.piePage = this.PlieArr[this.PlieArr.length-1]
                        this.Overlooking('1',this.piePage,'stae')
                }).catch((err)=>{
                    this.loading = false
                    console.log('err',err)
                })
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
        //恢复默认border颜色
        borderFun(){
             var alldom = document.querySelectorAll('.table_box')
             for(var k=0;k<alldom.length;k++){
                alldom[k].style.border = '1px solid #e4e4e4'
             }
        },
        //查询
        query(){
            console.log('input',this.input)
            if(this.input != ''){
                var show = false
                for(let i=0;i<this.mapData.length;i++){
                    console.log('相等',this.mapData[i].ContainerID)
                    if(this.input == this.mapData[i].TrayNum){
                        show = true
                       if(this.typeNum == '1'){
                           this.Overlooking('1',this.mapData[i].Plie)
                       }else{
                           this.SideView('2',this.mapData[i].RowNum)
                       }
                        this.value1 = this.mapData[i].RowNum
                        this.value2 = this.mapData[i].Line
                        this.value3 = this.mapData[i].Plie
                        var val = Math.ceil(this.mapData[i].Line / 19)
                        this.currentPage1 = val
                        this.handleCurrentChange(val)
                         //定位
                         setTimeout(()=>{     
                            var id = this.mapData[i].ContainerID
                            var dom = document.getElementById(id)
                            var ltop = document.getElementById(id).offsetTop
                            document.querySelector('.conter_table').scrollTop = ltop - 220
                            this.borderFun()
                            dom.style.border = '2px solid red'
                        },500)

                       return
                    }else{
                        show = false
                    }
                }
                if(!show){
                    this.$message({
                        message: '没有该托盘号',
                        type: 'warning'
                    });
                }
                
            }else{
                if(this.value1 !='' && this.value2 != '' && this.value3 != '' && this.value4 != ''){
                     for(let i=0;i<this.mapData.length;i++){
                         if(this.value1 == this.mapData[i].RowNum && this.value2 == this.mapData[i].Line && this.value3 == this.mapData[i].Plie && this.value4 == this.mapData[i].Depth){

                            this.value1 = this.mapData[i].RowNum
                            this.value2 = this.mapData[i].Line
                            this.value3 = this.mapData[i].Plie
                            this.value4 = this.mapData[i].Depth
                            
                             if(this.typeNum == '1'){
                                 this.Overlooking('1',this.mapData[i].Plie)
                             }else{
                                 this.SideView('2',this.mapData[i].RowNum)
                             }

                            var val = Math.ceil(this.mapData[i].Line / 19)
                            this.currentPage1 = val
                            this.handleCurrentChange(val)
                            //定位
                            setTimeout(()=>{     
                                var id = this.mapData[i].ContainerID
                                var dom = document.getElementById(id)
                                var ltop = document.getElementById(id).offsetTop
                                document.querySelector('.conter_table').scrollTop = ltop - 220
                                this.borderFun()
                                dom.style.border = '2px solid red'
                            },500)
                            return
                         }else{
                             if(i == this.mapData.length-1){
                                 this.borderFun()
                                 this.$message({
                                    message: '查找不到该托盘',
                                    type: 'warning'
                                });
                             }
                         }
                     }
                }else{
                     this.$message({
                        message: '请填写完整',
                        type: 'warning'
                    });
                }
            }
        },
        //分页切换数据
        handleCurrentChange(val){
            this.allData = []
            this.staNum
            this.endNum
            if(val == 1){
                this.staNum = 1
                this.endNum = 19
            }else{
                this.staNum =((val - 1) * 19) + 1
                this.endNum =val * 19
            }
            this.borderFun()
            this.lineArr = []
            for(let k=this.staNum;k<=this.endNum;k++){
                if(k<=this.lineAllNum[this.lineAllNum.length - 1]){
                    this.lineArr.push(k)
                }
            }
            let data = JSON.parse(JSON.stringify(this.Alldata))
            for(let f=0;f<data.length;f++){
                var arr2 = []
                for(let i=0;i<data[f].length;i++){
                    let arr = []
                    for(let j=0;j<data[f][i].length;j++){
                        if(this.itemText == '列'){
                            if(data[f][i][j].Line >= this.staNum && data[f][i][j].Line <= this.endNum){
                                    arr.push(data[f][i][j])
                            }
                        }else{
                            if(data[f][i][j].Row >= this.staNum && data[f][i][j].Row <= this.endNum){
                                arr.push(data[f][i][j])
                            }
                        }
                    }
                    arr2.push(arr)
                }
                    this.allData.push(arr2)
            }
        },
        //点击切换俯视、侧视数据
        viewsFun(text,e){
            var btn2 = document.querySelectorAll('.btn2')
            
            document.querySelector('.conter_table').scrollTop = 0
            for(let i=0;i<btn2.length;i++){
                btn2[i].className = 'btn left btn2'
            }
            e.path[0].className = 'btn left active btn2'
            if(text == '1'){           //俯视
                 this.value4 = '1'
                this.Overlooking(text,this.piePage,'stae')
                 this.value2 = '1'
                 this.value1 = '1'
                 this.value3 = this.PlieValue.length
                 this.rowText='排'
                 this.itemText = '列'
                 
            }else{                     //侧视
                 this.value4 = '1'
                 this.SideView(text,this.rowPage,'stae')
                 this.value1 = '1'
                 this.value2 = '1'
                 this.value3 = '1'
                 this.rowText='层'
                 this.itemText = '列'
                 
            }
        },
        //获取俯视数据方法 num为层数
        Overlooking(text,num,stae){
            this.typeNum = text
            this.data = []
            this.allData = []
            this.Alldata = []
            this.currentPage1 = 1
            this.staNum = 1
            this.endNum = 19
            this.totalNum = this.lineValue.length
            this.borderFun()
            this.data= this.mapData.filter((value)=>{
                return value.Plie == num
            })
            this.rowArr =new Set(this.rowArr)
            this.rowArr = [...this.rowArr]
            this.rowArr.sort(function(a,b){
                return a-b;
            })
            this.leftNum = this.rowArr.length
            console.log('leftNum',this.leftNum)
            //同一排数据整合
            for(let k=0;k<this.rowArr.length;k++){
                let arr = []
                for(let k1=0;k1<this.data.length;k1++){
                    if(this.rowArr[k] == this.data[k1].RowNum){
                        arr.push(this.data[k1])
                    }
                }
                arr = arr.sort(this.compare('Line'))
                this.allData.push(arr)
            }
             this.lineArr = []
            if(this.lineValue.length>=19){
                this.lineArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
            }else{
                for(let i=0;i<this.lineValue.length;i++){
                    this.lineArr.push(i+1)
                }
            }
             this.$nextTick(()=>{
                 var dom = document.querySelectorAll('.marbtm')
                 var dom2 = document.querySelectorAll('.marbtmBefore')
                 for(let d=0;d<dom.length;d++){
                     dom[d].style.marginBottom = '65px'
                 }
                  for(let d1=0;d1<dom.length;d1++){
                     dom2[d1].style.display = 'block'
                 }
            })
          
               //深度整合
            var allData2 = JSON.parse(JSON.stringify(this.allData))
            for(let j=0;j<allData2.length;j++){
                var depth = []
                 for(let j1=0;j1<allData2[j].length;j1++){
                    depth.push(allData2[j][j1].Depth)
                 }
                 depth = new Set(depth)
                 depth = [...depth]
                 //深度1靠近巷道
                  if((j+1)%2 != 0){
                      depth.sort(function(a,b){
                            return b-a;
                        })
                  }else{
                       depth.sort(function(a,b){
                            return b-b;
                        })
                  }
                 var Darr = []
                 for(let j2=0;j2<depth.length;j2++){
                     var alldataChi = []
                    
                     for(let j3=0;j3<allData2[j].length;j3++){
                         if(depth[j2] == allData2[j][j3].Depth){
                             alldataChi.push(allData2[j][j3])
                         }
                     }
                     Darr.push(alldataChi)
                 }
                 allData2[j] = Darr
            }
            this.allData = allData2
            this.Alldata = this.allData
            console.log('俯视数据',this.allData)
            if(stae == 'stae'){
               this.handleCurrentChange(1)
            }
           
        },
        //获取侧视数据方法 num为最后列数
        SideView(text,num,stae){
            this.typeNum = text
            this.data = []
            this.allData = []
            this.Alldata = []
            this.PlieArr = []
            this.currentPage1 = 1
            this.staNum = 1
            this.endNum = 19
            this.totalNum = this.lineValue.length
            this.borderFun()
            this.data= this.mapData.filter((value)=>{
                return value.RowNum == num
            })

             for(let j=0;j<this.data.length;j++){
                this.PlieArr.push(this.data[j].Plie)
            }
            this.PlieArr =new Set(this.PlieArr)
            this.PlieArr = [...this.PlieArr]
            this.PlieArr.sort(function(a,b){
                return b - a;
            })
            this.leftNum = this.PlieArr.length

            for(let k=0;k<this.PlieArr.length;k++){
                let arr = []
                for(let k1=0;k1<this.data.length;k1++){
                    if(this.PlieArr[k] == this.data[k1].Plie){
                        arr.push(this.data[k1])
                    }
                }
                arr = arr.sort(this.compare('Line'))
                this.allData.push(arr)
            }
            this.lineArr = []
             if(this.rowValue.length>=19){
                this.lineArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
            }else{
                for(let i=0;i<this.lineValue.length;i++){
                    this.lineArr.push(i+1)
                }
            }
           
            this.$nextTick(()=>{
                  var dom = document.querySelectorAll('.marbtm')
                  var dom2 = document.querySelectorAll('.marbtmBefore')
                 for(let d=0;d<dom.length;d++){
                     dom[d].style.marginBottom = '3px'
                 }
                   for(let d1=0;d1<dom.length;d1++){
                     dom2[d1].style.display = 'none'
                 }
            })

            
             //深度整合
            var allData2 = JSON.parse(JSON.stringify(this.allData))
            for(let j=0;j<allData2.length;j++){
                 var Darr = []
                     var alldataChi = []
                     for(let j3=0;j3<allData2[j].length;j3++){
                         if(this.value4 == allData2[j][j3].Depth){
                             alldataChi.push(allData2[j][j3])
                         }else{
                             alldataChi.push([])
                         }
                     }
                     Darr.push(alldataChi)
                 allData2[j] = Darr
            }
            this.allData = allData2
            this.Alldata = this.allData
             console.log('测视数据',this.allData)
            
            if(stae == 'stae'){
               this.handleCurrentChange(1)
            }
        },
            //升序
        compare(property){
            return function(a,b){
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        }
    }
}
</script>
<style lang="less">
.map_box{
    .el-input--small .el-input__inner{
        height: 24px;
        line-height: 24px;
        width:100%;
    }
    .el-select{
        width:67%;
    }
}
</style>
<style lang="less" scoped>
.map_box{
    width:100%;
    height:98%;
    background: #E6E6E6;
    .left{
        float: left;
    }
    .map_text{
        font-size:14px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
        color:rgba(102,102,102,1);
    }
    .map_textLeft1{
        line-height: 26px;
        width:13%;
    }
    .btn_left{
        margin-left:20px;
    }
    .map_title{
        font-size:14px;
        font-family:Alibaba PuHuiTi;
        font-weight:400;
        color:rgba(0,150,136,1);
        margin:14px 0px 9px 34px; 
    }
    .map_head{
        height:26px;
        width:100%;
        padding-left:34px;
        box-sizing: border-box;
        overflow: hidden;
        .btn{
            width:80px;
            height:26px;
            background:rgba(208,208,208,1);
            border-radius:5px;
            font-size:14px;
            font-family:Alibaba PuHuiTi;
            font-weight:400;
            color:rgba(52,52,52,1);
            text-align: center;
            cursor: pointer;
            user-select: none;
            margin-right:10px;
            line-height: 26px;
        }
        .btn:hover{
            background: #aaa;
        }
         .active{
            color:#fff;
            background: #009688;
        }
        .active:hover{
            background: #33DAC1;
        }
    }
    .map_conter{
        width:98%;
        height:720px;
        overflow: hidden;
        margin:auto;
        margin-top:14px;   
        background: #fff;
        .conter_head{
            width:100%;
            height: 36px;
            padding-left:18px;
            margin-top:12px;
            box-sizing: border-box;
            .Colorbtn{
                width:20px;
                height:20px;
                border-radius:5px;
            }
            .Colorbtn2{
                width:30px;
                height:20px;
            }
            .conter_text{
                font-size:14px;
                font-family:Alibaba PuHuiTi;
                font-weight:400;
                color:rgba(52,52,52,1);
                margin-right:15px;
                margin-left:5px;
            }
            .yellow{
                background:rgba(247,247,202,1);
                border:1px solid rgba(112,112,112,1);
            }
            .violet{
                background:rgba(143,130,189,1);
                border:1px solid rgba(112,112,112,1);
            }
            .green{
                background:#A2D890;
                border:1px solid rgba(112,112,112,1);
            }
            .orange{
                background:rgba(245,154,36,1);
                border:1px solid rgba(112,112,112,1);
            }
            .bigColor{
                background: #F5B708 !important;
            }
            .smallColor{
                background: #009688;
            }
        }
           .smallColor{
               background: #009688;
           }
           .bigColor{
               background: #F5B708 !important;
           }
           .yellow{
                background:rgba(247,247,202,1);
            }
            .violet{
                background:rgba(143,130,189,1);
            }
            .green{
                background:#A2D890;
            }
            .orange{
                background:rgba(245,154,36,1);
            }
            .red{
                background:rgba(230,0,18,1);
            }
            .gd{
                background: #009688;
            }
        
        .conter_table{
            width:98%;
            margin:auto;
            height:636px;
            overflow: hidden;
            overflow-y: auto;
            .table_row{
                float: left;
                width:3.5%;
                height: 80px;
                border:1px solid #e4e4e4;
                border-right: none;
                box-sizing: border-box;
                line-height: 80px;
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                color:#fff;
            }
            .table_lineBox{
                width:100%;
                height: 40px;
                overflow: hidden;
                position: sticky;
                top: 0;
                z-index:999;
                .line_box{
                    float: left;
                    width:5%;
                    height: 40px;
                    border:1px solid #e4e4e4;
                    border-right: none;
                    text-align: center;
                    line-height: 40px;
                    font-size: 14px;
                    font-weight: bold;
                    color:#fff;
                    box-sizing: border-box;
                }
                .line_box:last-child{
                    border-right: 1px solid #e4e4e4;
                }
                .line_row{
                    width:3.5%;
                    height:40px;
                    float: left;
                    border:1px solid #e4e4e4;
                    border-right: none;
                    box-sizing: border-box;
                }
            }
            .marbtm{
                margin-bottom:65px;
                position: relative;
            }
            .marbtmBefore2{
                display: none;
            }
            .marbtmBefore{
                width: 98.5%;
                height: 65px;
                position: absolute;
                top: 80px;
                left: 0px;
                display: none;
                img{
                    width: 100%;
                    margin: auto;
                }
            }
            .table_conten{
                width:100%;
                height: 80px;
                margin-bottom:3px;
                .table_box{
                    float: left;
                    width:5%;
                    height:80px;
                    border:1px solid #e4e4e4;
                    border-right: none;
                    box-sizing: border-box;
                    text-align: center;
                    padding-top:20px;
                    box-sizing: border-box;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    span{
                        font-size: 12px;
                    }
                }
                .table_box:last-child{
                    border-right: 1px solid #e4e4e4;
                }
            }
        }
    }
}
</style>