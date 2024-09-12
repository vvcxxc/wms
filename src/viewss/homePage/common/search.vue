<!--
 * @Description: 这是通用列表页面搜索头（组件）
 * @Date: 2020-08-13 10:27:22
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:54:11
-->
<template>
    <div class="search_box">
          <div class="select">
            <el-select v-model="value"  @change="selectFun()" placeholder="请选择">
                <el-option
                    v-for="item in inputArr"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
         <div v-show="seleShow" class="select">
            <el-select v-model="value2" placeholder="请选择">
                <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div v-show="!seleShow" class="select">
              <el-date-picker
               @change="changeTime('state')"
                v-model="statetime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
        </div>
         <div v-show="!seleShow" class="select">
              <el-date-picker
               @change="changeTime('end')"
                v-model="endtime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
        </div>
        <div v-show="seleShow" class="input">
            <el-input type="text" @change="valueFun()" v-model="text" placeholder="请输入"></el-input>
        </div>
        <div @click="queryFun()" class="button green left">
            <div class="btnImg searchButton"></div>
            <div class="btnText">查询</div>
        </div>
        <div @click="clearFun()" class="button blue">
            <div class="btnImg refreshButton"></div>
            <div class="btnText">清空</div>
        </div>
        <div class="massage_box">
            <div class="massage" v-for="(item,index) in massageArr" :key="index">
                <el-alert
                    @close="alertClose(item)"
                    :title="item.value"
                    type="error"
                    effect="dark">
                </el-alert>
            </div>
         
        </div>
    </div>
</template>
<script>
 import moment from 'moment'

export default {
    data(){
        return{
            Symbols:{
                string:[{
                    value: '包含',
                    label: '包含',
                }],
                number: [{
                    value: '大于',
                    label: '大于',
                }, {
                    value: '等于',
                    label: '等于'
                }, {
                    value: '小于',
                    label: '小于'
                }]
            }, 
            value:'',   //第一个selece
            value2:'',  //第二个selece
            text:'',    //文本值
            statetime:'',
            oldstatetime:'', //之前的开始时间
            endtime:'',
            oldendtime:'', // 之前的结束时间
            options:[],  //第二个selece data
            inputArr:[], //第一个selece data
            axiosdata:[], //传参数组
            massageArr:[], //提示数组
            titleArr:[],   //提示数组是否重复
            seleShow:true,
            type:''
       
        }
    },
    props:['searchdata'],
     watch:{
         searchdata(n,o){
             this.init()
         }
    },
    created(){
       this.init()
      
    },
    methods:{
        init(){
            this.value=''
            this.value2=''
            this.text=''
            this.statetime=''
            this.endtime=''
            this.inputArr = []
            this.options = []
            this.massageArr = []
            if(this.searchdata.length==0){
                return
            } 
            console.log('searchdata',this.searchdata)
            //格式搜索头数据
            for(let i=0;i<this.searchdata.length;i++){
                var value ={
                    value:this.searchdata[i].FieldIndex,
                    label:this.searchdata[i].FieldIndex,
                    type:this.searchdata[i].FieldType
                }
                this.inputArr.push(value)
            }
           console.log('this.inputArr[0].type',this.inputArr[0].type)
            //搜索头对应条件
            if(this.inputArr[0].type == 'string'){
                    this.options = this.Symbols.string
                    this.type = 'string'
                    this.value2 = '包含'
                     this.seleShow = true
            }else if(this.inputArr[0].type == 'number'){
                    this.options = this.Symbols.number
                    this.type = 'number'
                    this.value2 = '大于'
                    this.seleShow = true
            }else{
                this.seleShow = false
                 this.type = 'datetime'
                 this.endtime = moment().format()
                 this.oldendtime = moment().format()
                 this.statetime = moment().add(-1, 'h').format()
                 this.oldstatetime = moment().add(-1, 'h').format()
            }
            // 值
            this.value = this.inputArr[0].value
        },
        //清除提示文本
         alertClose(item){
          var index = this.titleArr.indexOf(item.name)
          this.titleArr.splice(index,1)
          this.massageArr.splice(index,1)
          this.axiosdata.splice(index,1)
        },
        //选择类型
        selectFun(){
            this.value2 = ''
            this.text = ''
            this.statetime = ''
            this.endtime = ''
            //搜索头条件改变切换类型
            for(let i=0;i<this.searchdata.length;i++){
                if(this.value == this.searchdata[i].FieldIndex){
                    console.log('rrrff',this.searchdata[i].FieldType)
                    if(this.searchdata[i].FieldType == 'string'){
                       this.options = this.Symbols.string
                       this.type = 'string'
                       this.value2 = '包含'
                       this.seleShow = true
                    }else if(this.searchdata[i].FieldType == 'number'){
                         this.options = this.Symbols.number
                         this.type = 'number'
                         this.seleShow = true
                         this.value2 = '大于'
                    }else {
                        this.type = 'datetime'
                        this.seleShow = false
                        this.endtime = moment().format()
                        this.statetime = moment().add(-1, 'h').format()
                    }
                }
            }
        },
        //查询
        queryFun(){
            //有值最优先
            var id = this.$route.query.id
           if(this.type == 'string' || this.type == 'number'){
            //    if(this.text!=''&&this.value!=''){
                   //同样的类型不可以添加多个
                   var index =  this.titleArr.indexOf(this.value)
                      if(index == -1){
                          this.titleArr.push(this.value)
                          let text = this.value+ ' ' + this.value2 +'【' + this.text + '】'
                          let value = {
                              name:this.value,
                              value:text
                          }
                          //条件展示值存入数组
                          if(this.text!=''&&this.value!=''){
                              this.massageArr.push(value)
                          }
                          for(let i=0;i<this.searchdata.length;i++){
                              if(this.value == this.searchdata[i].FieldIndex){
                                  let logic = this.value2 == '大于'?'>':this.value2=='小于'?'<':this.value2=='等于'?'=':this.value2=='包含'?'%':''
                                  var value2 ={
                                      name:this.searchdata[i].FieldName,
                                      logic:logic,
                                      value:this.text
                                  }
                                  this.axiosdata.push(value2)
                              }
                          }
                          
                      }else{
                          this.axiosdata.splice(index,1)
                          this.titleArr.splice(index,1)
                          this.massageArr.splice(index,1)
                          this.titleArr.push(this.value)
                          let text = this.value + this.value2 +'【' + this.text+ '】'
                          let value = {
                              name:this.value,
                              value:text
                          }
                            //条件展示值存入数组
                            if(this.text!=''&&this.value!=''){
                                this.massageArr.push(value)
                            }
                          for(let i=0;i<this.searchdata.length;i++){
                              if(this.value == this.searchdata[i].FieldIndex){
                                  let logic = this.value2 == '大于'?'>':this.value2=='小于'?'<':this.value2=='等于'?'=':this.value2=='包含'?'%':''
                                  var value2 ={
                                      name:this.searchdata[i].FieldName,
                                      logic:logic,
                                      value:this.text
                                  }
                                  this.axiosdata.push(value2)
                              }
                          }
                      }
           }
           if(this.type == 'datetime'){
                   //同样的类型不可以添加多个
                   var index =  this.titleArr.indexOf(this.value)
                   if(index == -1){
                          this.titleArr.push(this.value)
                          let staTime = moment(this.statetime).format('YY-MM-DD HH:mm:ss');
                          let endTime = moment(this.endtime).format('YY-MM-DD HH:mm:ss');
                          let text = this.value + staTime +' | '+ endTime
                          let time = staTime +'|'+ endTime
                           let value = {
                              name:this.value,
                              value:text
                          }
                          //条件展示值存入数组
                          if(this.statetime!='' && this.endtime!=''){
                              this.massageArr.push(value)
                          }

                           for(let i=0;i<this.searchdata.length;i++){
                              if(this.value == this.searchdata[i].FieldIndex){
                                  let logic = 'date'
                                  var value2 ={
                                      name:this.searchdata[i].FieldName,
                                      logic:logic,
                                      value:time
                                  }
                                  this.axiosdata.push(value2)
                              }
                          }
                   }
           }
            var dd = JSON.stringify(this.axiosdata)
            this.$parent.SearchDataFun(this.axiosdata)
        },
        //清空
        clearFun(){
            this.value = ''
            this.value2 = ''
            this.text = ''
            this.statetime = ''
            this.endtime = ''
            this.titleArr =[]
            this.massageArr =[]
            this.axiosdata = []
        },
        changeTime(text){

            var sTime = this.$moment(this.statetime).format('YYYY-MM-DD HH:mm:ss')
            var eTime = this.$moment(this.endtime).format('YYYY-MM-DD HH:mm:ss')
            var diffs = moment(eTime).diff(moment(sTime), 'seconds')
            if(diffs<0){
                 this.$parent.tipsFun('1',`开始时间不能大于结束时间`)
                 this.statetime = this.oldstatetime
                 this.endtime = this.oldendtime
            }else if(diffs == 0){
                this.$parent.tipsFun('1',`开始时间不能等于结束时间`)
                this.statetime = this.oldstatetime
                this.endtime = this.oldendtime
            }else{
                if(text == 'state'){
                    this.oldstatetime = sTime
                }else{
                     this.oldendtime = eTime
                }
            }
            
        },
        //只能为数字
        valueFun(){
           if(this.type=="number"){
               this.text = parseInt(this.text)
               if(String(this.text) == 'NaN'){
                   this.text = ''
               }
           }
        }

    }
    
}
</script>
<style lang="less">
.search_box{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
        width:200px;
    }
    .el-alert--error{
        display: block !important;
    }
}
</style>
<style lang="less" scoped>
.search_box{
    width:100%;
    min-height:60px;
    padding-top:10px;
    box-sizing: border-box;
}
.select{
    float: left;
    width: 200px;
    height: 40px;
    margin-left:20px;
    margin-right:10px;
}
.green:hover{
    background: #33DAC1;
}
.blue:hover{
    background: #6FB4FA;
}
.input{
    float: left;
    width: 200px;
    height: 40px;
    margin-right:10px ;
     margin-left:20px;
}
.massage_box{
    width:100%;
    padding-left:10px;
    overflow:hidden;
    max-height:90px;
    overflow:auto
}
.massage{
    min-width:180px;
    float:left;
    margin:5px 5px 0 5px;
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
.left{
    float: left;
}
.right{
    float: right;
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
.btnText{
    float: left;
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
.addButton{
    background: url("../../../assets/img/icon_add.png");
    background-size: cover;
}
.editButton{
    background: url("../../../assets/img/icon_edit.png");
    background-size: cover;
}
.deleteButton{
    background: url("../../../assets/img/icon_delete.png");
    background-size: cover;
}
.searchButton{  
    background: url("../../../assets/img/icon_serch.png");
    background-size: cover;
}
.refreshButton{
    background: url("../../../assets/img/icon_refresh.png");
    background-size: cover;
}
</style>