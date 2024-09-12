<!--
 * @Description: 这是通用列表页新增/编辑页面（组件）
 * @Date: 2020-08-10 15:29:17
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:31
-->
<template>
     <div ref="scPopBox" class="scPopBox">

        <div class="scPopBox_c">
            <div v-drag class="head">{{popTitle}}
            <div @click="cancelFun()" class="headImg"></div>
            </div>
            <div class="popCenten_box">
            <div v-for="(item,index) in dataArr" :key="index" class="row_box" 
                :class="item.fieldtype=='textarea'?'textA':''">
                <div class="elemen_box" :class="item.fieldtype=='textarea'?'textB':''">
                    <el-input :disabled="item.isupdateavailable != '1'" @input="inputFun(item)" v-if="item.fieldtype=='nvarchar' || item.fieldtype=='num'" 
                        v-model="item.value" placeholder="请输入内容"></el-input>
                        <el-date-picker
                            :disabled="item.isupdateavailable != '1'"
                            v-if="item.fieldtype=='datetime'"
                            v-model="item.value"
                            type="datetime"
                            placeholder="选择日期时间">
                        </el-date-picker>
                        <el-select @change="selectChange(item)" :disabled="item.isupdateavailable != '1'" v-if="item.fieldtype=='selection'" v-model="item.value" placeholder="请选择">
                            <el-option
                            v-for="i in item.data"
                            :key="i.text"
                            :label="i.text"
                            :value="i.text">
                            </el-option>
                        </el-select>
                        <textarea :disabled="item.isupdateavailable != '1'" class="textarea" v-model="item.value" v-if="item.fieldtype=='textarea'"></textarea>
                </div>
                <span>{{item.fieldname}}:</span>
            </div>

            </div>
            <div class="fool_btn">
                <div @click="clearFun()" class="button right red">清空</div>
                <div @click="cancelFun()" class="button right yellow">取消</div>
                <div @click="conserve()" class="button right blue">保存</div>
            </div>
        </div>
        
    </div>
</template>

<script>
export default {
      data() {
        return {
            //内容数据
            Data:[],
            dataArr:null,
            GroupSelect:[], //下拉联动初始数据
            GroupSelectAll:[],//下拉全部数据
        }
      },
      props:['popTitle','data','axioData','tableDataArr'],
      watch:{
        data(n,o){
            this.init()
        }
      },
       directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                let box = document.querySelector('.scPopBox')
               
                    //算出鼠标相对元素的位置
                    let disX = e.clientX - dragBox.offsetLeft;
                    let disY = e.clientY - dragBox.offsetTop;
                    document.onmousemove = e => {
                        //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                        let left = e.clientX - (Number(disX));
                        let top = e.clientY - (Number(disY));
                        //移动当前元素
                        box.style.left = left + "px";
                        box.style.top = top + "px";
                    };
                    document.onmouseup = e => {
                          document.onmousemove = null;
                        document.onmouseup = null;
                    };
                };
            }
        },
      created(){
          //fieldtype : textarea  datetime  selection  nvarchar num
          //selection => data 
         this.init()
      },
      methods:{
          init(){
              this.GroupSelect = []
              this.GroupSelectAll = []
              this.dataArr=this.data
              // 1为添加
              if(this.axioData.WindowType == '1'){
                  for(let i=0;i<this.dataArr.length;i++){
                      if(this.dataArr[i].isAdd == 0){
                         this.dataArr.splice(i,1)
                         i--
                      }
                  }
                  //编辑
              }else if(this.axioData.WindowType == '2'){
                   for(let i=0;i<this.dataArr.length;i++){
                      if(this.dataArr[i].isUpdate == 0){
                         this.dataArr.splice(i,1)
                         i--
                      }
                  }
                   //多项编辑
              }else if(this.axioData.WindowType == '3'){
                  for(let i=0;i<this.dataArr.length;i++){
                      if(this.dataArr[i].isUpdate == 0){
                         this.dataArr.splice(i,1)
                         i--
                      }
                  }
              }
           
          },
          //下拉联动
          selectChange(item){
            if(item.childrenName.length){
                for(let i=0;i<this.GroupSelectAll.length;i++){
                    if(item.fieldID == this.GroupSelectAll[i].id){

                        let value = {
                            FieldID:item.fieldID,
                            data:this.GroupSelectAll[i].selection,
                            id:item.childrenName
                        }
                            let data = []
                            data.push(value)
                            this.selectDataFun(data)
                    }
                }
            }
          },
          //关闭
          cancelFun(){
                for(let i=0;i<this.dataArr.length;i++){
                    this.dataArr[i].value = ''
                }
                this.$parent.cancelFun()
          },
          //输入框
          inputFun(item){
              if(item.fieldtype=='num'){
                  item.value = parseInt(item.value)
                  if(String(item.value) == 'NaN'){
                      item.value = ''
                  }
              }
          },
          //清空
          clearFun(){
            for(let i=0;i<this.dataArr.length;i++){
                this.dataArr[i].value = ''
            }
          },

        //下拉框选择联动方法
        selectDataFun(arr){
           for(let j=0;j<arr.length;j++){
               var selectId
                for(let k=0;k<this.dataArr.length;k++){     //获取选择的id
                    if(this.dataArr[k].fieldID == arr[j].FieldID){
                        for(let f=0;f< arr[j].data.length;f++){
                            if(arr[j].data[f].value == this.dataArr[k].value){
                                selectId = arr[j].data[f].id
                            }
                        }
                    }
                }
               for(let i=0;i<this.dataArr.length;i++){    //重新赋值
                   let index = arr[j].id.indexOf(this.dataArr[i].fieldID)
                  if(index != -1){
                     for(let j=0;j<this.GroupSelectAll.length;j++){
                         if(this.dataArr[i].fieldID == this.GroupSelectAll[j].id){
                              let arr = []
                             for(let k=0;k<this.GroupSelectAll[j].selection.length;k++){
                                var parentidData = this.GroupSelectAll[j].selection[k]
                                if(parentidData.parentid == selectId){
                                    let value = {
                                        id:this.GroupSelectAll[j].selection[k].id,
                                        text:this.GroupSelectAll[j].selection[k].value
                                    }
                                    arr.push(value)
                                }
                             }
                             this.dataArr[i].data = arr
                             this.dataArr[i].value = arr[0].text
                             this.dataArr = JSON.parse(JSON.stringify(this.dataArr))
                             if(this.dataArr[i].childrenName.length){
                                 let value = {
                                    FieldID:this.dataArr[i].fieldID,
                                    data:this.GroupSelectAll[j].selection,
                                    id:this.dataArr[i].childrenName
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
          GroupSelectFun(FieldID){
               return new Promise((resolve, reject) => {
                     this.$axios({            //1为添加保存  
                          method: 'post',
                          url: `${this.$store.state.dailog.url1}Common/Base_Field/GetGroupSelect?FieldID=${FieldID}`,
                          FieldID:FieldID
                      }).then(res => {
                          var data = JSON.parse(res.data.resultdata)

                          var arr = []
                          if(data != null){
                              if(data.Grade == 1){
                                  let value = {
                                      data:data.selection,
                                      id:data.FieldID,
                                      FieldID:FieldID
                                  }
                                  this.GroupSelect.push(value)
                              }  //初始数据
                             data.id = FieldID
                              this.GroupSelectAll.push(data)  //全部数据
                              for(let i=0;i<data.selection.length;i++){
                                  var value = {
                                      id:data.selection[i].id,
                                      text:data.selection[i].value,
                                      parentid:data.selection[i].parentid,
                                      
                                  }
                                  arr.push(value)
                              }
                              let Arr = {
                                  id:data.FieldID,
                                  data:arr
                              }  
                              resolve(Arr)
                          }
                      })
               })
          },
          
          //单个下拉数据
          selectFun(url){
              return new Promise((resolve, reject) => {
                  this.$axios({            //1为添加保存  
                          method: 'post',
                          url: `${this.$store.state.dailog.url1}${url}`,
                      }).then(res => {
                          var selectData = JSON.parse(res.data.resultdata)
                          var arr = []
                          for(let i=0;i<selectData.length;i++){
                              var value = {
                                  id:selectData[i].ID,
                                  text:selectData[i].Value,
                              }
                              arr.push(value)
                          }
                         resolve(arr)
                      })
              })
          },
         
        //添加渲染下拉框
          addSelecFun(data){
              //渲染
                   for(let i=0;i<this.dataArr.length;i++){
                       if(this.dataArr[i].fieldtype == 'selection'){
                           if(this.dataArr[i].IsGroup != 'undefined'){
                               if(this.dataArr[i].IsGroup == 1){   //联动
                                  this.GroupSelectFun(this.dataArr[i].fieldID).then(val=>{
                                         this.dataArr[i].data = val.data
                                         this.dataArr[i].value = this.dataArr[i].data[0].text
                                         this.dataArr[i].childrenName = val.id
                                         this.dataArr = this.dataArr
                                         if(val.id.length == 0){
                                              for(let i=0;i<this.GroupSelect.length;i++){
                                                 this.selectDataFun(this.GroupSelect)
                                              }
                                         }
                                   })
     
                               }else{   //单个下拉
                                     this.selectFun(this.dataArr[i].Selection_Url).then(val=>{
                                         this.dataArr[i].data = val
                                         this.dataArr[i].value = this.dataArr[i].data[0].text
                                         this.dataArr = this.dataArr
                                     })
                               }
                           }else{  //单个下拉
                                this.selectFun(this.dataArr[i].Selection_Url).then(val=>{
                                     this.dataArr[i].data = val
                                     this.dataArr[i].value = this.dataArr[i].data[0].text
                                     this.dataArr = this.dataArr
                                 })
                           }
                       }
                   }
            
          },
          //初始化编辑渲染
          Rendering(data,htmlData){
              for(let i=0;i<this.dataArr.length;i++){
                  for(var item in data){
                      if(item == this.dataArr[i].fieldindex){
                            if(this.axioData.WindowType != 3){   //单个编辑
                                this.dataArr[i].value = data[item]
                                if(this.dataArr[i].fieldtype == 'selection'){  
                                    var itemName = item
                                    console.log('this.dataArr[i].IsGroup',this.dataArr[i].IsGroup)
                                    if(this.dataArr[i].IsGroup != 'undefined'){
                                        if(this.dataArr[i].IsGroup == 1){
                                             this.GroupSelectFun(this.dataArr[i].fieldID).then(val=>{
                                                        this.dataArr[i].data = val.data
                                                        this.dataArr[i].value = this.dataArr[i].data[0].text
                                                        this.dataArr[i].childrenName = val.id
                                                        this.dataArr = this.dataArr
                                                        if(val.id.length == 0){
                                                            for(let i=0;i<this.GroupSelect.length;i++){
                                                                this.selectDataFun(this.GroupSelect)
                                                            }
                                                        }
                                                })
                                        }else{
                                            console.log('进来了IsGroup',this.dataArr[i].IsGroup)
                                            this.selectFun(this.dataArr[i].Selection_Url).then(val=>{
                                            this.dataArr[i].data = val
                                            for(let j=0;j<this.dataArr[i].data.length;j++){
                                                    if(data[itemName] == this.dataArr[i].data[j].id){
                                                        this.dataArr[i].value = this.dataArr[i].data[j].text
                                                    }
                                                }
                                                this.dataArr = this.dataArr
                                            
                                            })
                                        }

                                    }else{
                                        this.selectFun(this.dataArr[i].Selection_Url).then(val=>{
                                        this.dataArr[i].data = val
                                        for(let j=0;j<this.dataArr[i].data.length;j++){
                                                if(data[itemName] == this.dataArr[i].data[j].id){
                                                    this.dataArr[i].value = this.dataArr[i].data[j].text
                                                }
                                            }
                                            this.dataArr = this.dataArr
                                        
                                        })
                                    }

                                    
                                }
                            }else{   //多项编辑
                              
                                  if(this.dataArr[i].fieldtype == 'selection'){

                                        if(this.dataArr[i].IsGroup != 'undefined'){
                                            if(this.dataArr[i].IsGroup == 1){
                                                this.GroupSelectFun(this.dataArr[i].fieldID).then(val=>{
                                                        this.dataArr[i].data = val.data
                                                        this.dataArr[i].value = this.dataArr[i].data[0].text
                                                        this.dataArr[i].childrenName = val.id
                                                        this.dataArr = this.dataArr
                                                        if(val.id.length == 0){
                                                            for(let i=0;i<this.GroupSelect.length;i++){
                                                                this.selectDataFun(this.GroupSelect)
                                                            }
                                                        }
                                                })
                                            }else{
                                                 this.selectFun(this.dataArr[i].Selection_Url).then(val=>{
                                                    this.dataArr[i].data = val
                                                    this.dataArr[i].value = this.dataArr[i].data[0].text
                                                    this.dataArr = this.dataArr
                                                })
                                            }

                                        }else{
                                             this.selectFun(this.dataArr[i].Selection_Url).then(val=>{
                                                    this.dataArr[i].data = val
                                                    this.dataArr[i].value = this.dataArr[i].data[0].text
                                                    this.dataArr = this.dataArr
                                                })
                                        }
                                  }
                            }
                            }
                        } 
                  }
          },
        //   获取批量编辑的参数
        editVFun(){  
             var Params = this.axioData.Params
                    var paramData = []
                    this.value = []
             for(let i=0;i<Params.length;i++){
                        paramData.push(Params[i].ParamName)
                    }
            for(let i=0;i<this.tableDataArr.length;i++){ 
                let value2 = {}
                for(let j=0;j<paramData.length;j++){
                    var lastName
                    for(var item1 in this.tableDataArr[i]){
                        lastName = item1
                    }
                    for(var item in this.tableDataArr[i]){
                        if(item  == paramData[j]){
                                var o = {};
                                var str = `o.${item}="${this.tableDataArr[i][item]}"`
                                eval(str);
                                Object.assign(value2,o);
                            break;
                        }
                    else{
                            if(lastName == item){
                                var o1 = {};
                                var str1 = "o1."+paramData[j]+"=''";
                                eval(str1);
                                Object.assign(value2,o1);
                                break;
                            }
                        }
                    }
                }
                this.value.push(value2)
            }
                  return this.value
        },
          //保存
          conserve(){
              var btnParams = this.editVFun()
              var nameArr=[]
              var valueArr=[]
              for(let i=0;i<this.dataArr.length;i++){
                  var va = this.dataArr[i].value
                  if(this.dataArr[i].fieldtype=='datetime'){
                     va = this.$moment(this.dataArr[i].value).format('YYYY-MM-DD hh:mm:ss')
                     if(va == 'Invalid date'){
                         va = ''
                     }
                     this.dataArr[i].value = va
                  }else if(this.dataArr[i].fieldtype == 'selection'){
                      if(this.dataArr[i].data.length){
                          for(let j=0;j<this.dataArr[i].data.length;j++){
                              if(this.dataArr[i].data[j].text == this.dataArr[i].value){
                                  va = this.dataArr[i].data[j].id
                                  this.dataArr[i].value = va
                              }
                          }
                      }
                  }
                    nameArr.push(this.dataArr[i].fieldindex)
                    valueArr.push(this.dataArr[i].value)
              }
               if(valueArr.length != 0){
                   var value2 = {}
                    for(let k=0;k<nameArr.length;k++){
                        var o = {};
                        var str = `o.${nameArr[k]}='${valueArr[k]===''?'""':valueArr[k]}'`
                        eval(str);
                        Object.assign(value2,o);
                    }
               }

               if(this.axioData.WindowType == '3'){
                   for(let i=0;i<btnParams.length;i++){
                    Object.assign(btnParams[i],value2);
                }
               }else if(this.axioData.WindowType == '2'){
                    for(let i=0;i<btnParams.length;i++){
                    Object.assign(btnParams[i],value2);
                }
               }

              //WindowType 1为添加 2为编辑 3为批量编辑
               if(this.axioData.WindowType == '1'){
                    var url = `${this.$store.state.dailog.url1}${this.axioData.SumbitUrl}`
                   this.$axios({            //1为添加保存  
                       method: 'post',
                       url: url,
                       data:value2
                   }).then(res => {
                       this.$parent.UptableFun() //表单刷新\
                   })
               }else{
                   if(this.axioData.WindowType == 3){
                       value2 = btnParams
                   }else{
                        value2 = btnParams[0]
                   }
                   console.log('value2',value2)
                   var url2 = `${this.$store.state.dailog.url1}${this.axioData.SumbitUrl}`
                   this.$axios({         //2为编辑保存        
                       method: 'post',
                       url: url2,
                       data:value2
                   }).then(res => {

                       this.$parent.UptableFun() //表单刷新\
                   })
               }
          }
      }
}
</script>
<style lang="less">
.scPopBox{
    .el-date-editor.el-input{
       width:150px;
    }
}

</style>
<style lang="less" scoped>
 .scPopBox{
        width:700px;
        height:650px;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0;
        bottom: 0;
        margin:auto;
        z-index: 10;
        .scPopBox_c{
            width:100%;
            background:rgba(238,238,238,1);
            box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        }
        .fool_btn{
            overflow: hidden;
            padding-bottom:20px;
            padding-top:15px;
        }
        .head{
            position: relative;
            line-height: 60px;
            text-align: center;
            width:700px;
            height:60px;
            background:#009688;
            font-size:18px;
            font-family:Microsoft YaHei;
            font-weight:bold;
            color:rgba(238,238,238,1);
            user-select: none;
            .headImg{
                position: absolute;
                right: 12px;
                top: 12px;
                width:36px;
                height: 36px;
                background:url('../../../assets/img/no.png') ;
                background-size:cover ;
                cursor: pointer;
            }
        }
        .popCenten_box{
            max-height:510px;
            width:100%;
            background: #EEEEEE;
            overflow: auto;
            padding-top:20px;
            .textA{
                width:100% !important;
                .textB{
                    width:85.5% !important;
                }
            }
           .row_box{
               width:46%;
               height:35px;
               margin-bottom:15px;
               float: left;
               box-sizing: border-box;
               span{
                   float:right;
                   margin-right:10px;
                   display: inline-block;
                   text-align: left;
                   width: 103px;
               }
               .elemen_box{
                    float:right;
                    width:150px;
                    height: 30px;
                    .textarea{
                        width:96%;
                        height: 80px;
                        padding:10px;
                        resize: none;
                    }
               }
           }
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
            text-align: center;
        }
        .left{
            float: left;
        }
        .right{
            float: right;
        }
        .yellow{
            background:#5F5F5F;
        }
        .red{
            background:rgba(230,98,98,1);
        }
        .blue{
            background:rgba(50,141,234,1);
        }
 }
</style>