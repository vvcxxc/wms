<!--
 * @Description: 这是通用列表页按钮页面（组件）
 * @Date: 2020-08-12 16:34:23
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:53:51
-->
<template>
    <div class="buttom">

        <div @click="btnClick(item)" v-for="(item,index) in btnData" :key="index" :class="item.type=='delete'
            ?'button red right':'button green right'">
            <div class="btnText">{{item.Btn_Text}}</div>
            
        </div>

           <!-- 导入按钮 -->
            <!-- <el-upload
                 class="button green right"
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-success="successFun"
                :on-error="errorFun"
                :on-change="handleChange">
                <el-button size="small" type="primary">导入</el-button>
            </el-upload> -->
      

    </div>
</template>
<script>
export default {
    data(){
        return{
          value:'',
          options:null,
        }
    },
    props:['btnData','btnPowerData'],
    methods:{
        btnClick(item){
            console.log('iitteemm',item)
            this.btnPowerArr = []
            //按钮权限
            if(this.btnPowerData.length != 0){
                for(let i=0;i<this.btnPowerData.length;i++){
                    if(this.btnPowerData[i].Btn_ID == item.Btn_ID){
                            if(this.btnPowerData[i].IsAuthorized == 'N'){
                                this.$parent.$parent.openFun(`没有【${item.Btn_Text}】权限`)
                                return
                            }
                        }
                }
            }
            //0 为删除冻结类-类型3-1  2 为跳转类-类型5  1为弹窗类-类型3-2  3为导出-类型3-1  4/5为图片 //6为导入-类型3-1
            if(item.Btn_Type=='1'){
                let text = item.Btn_Text
                this.$parent.activePop(text,item)
            }else if(item.Btn_Type=="2"){
               this.$parent.jumpFun(item)
            }else if(item.Btn_Type=='0'){
                 let text = item.Btn_Text
                 this.$parent.activeTips(text,item)
            }else if(item.Btn_Type=='3'){
                this.$parent.getexcel()
            }else if(item.Btn_Type == '4' || item.Btn_Type == '5'){
                this.$parent.upImgPop(item)
            }
        },
        //文件导入
        handleChange(){
           this.$parent.importLoTrue()
        },
        //文件导入失败
        errorFun(err, file, fileList){
            this.$parent.importLoFalse()
            this.$message.error('导入失败');
        },
        //文件导入成功
        successFun(response, file, fileList){
            this.$parent.importLoFalse()
              this.$message({
                message: '导入成功',
                type: 'success'
              });
        },
}
}
</script>
<style lang="less">
.buttom{
    .el-upload--text{
        width:82px;
        height:34px;
    }
    .el-upload-list{
        display: none;
    }
  .el-button--small{
      width:100%;
  }
    
}
</style>
<style lang="less" scoped>
 .buttom{
     width:100%;
     height:60px;
     padding-top:10px;
     box-sizing: border-box;
 }
 .select{
    float: left;
    width: 200px;
    height: 40px;
    margin-right: 20px;
    margin-left:20px;
}
.input{
    float: left;
    width: 200px;
    height: 40px;
    margin-right:10px ;
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
    line-height: 30px;
    overflow: hidden;
    margin-right:10px;
    text-align: center;
}
.button:hover{
    background: #33DAC1;
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
    display: inline-block;
}
.green{
    background:#009688;
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
</style>
