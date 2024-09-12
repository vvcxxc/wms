<!--
 * @Description: 这是【看板界面1】（组件）
 * @Date: 2020-08-10 17:20:29
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 10:55:39
-->
<template>

 <div class="kanban_box">
     <div class="kanban_head float">
         <div class="head_icon left"></div>
         <div class="head_text text1 left">订单号:</div>
         <div class="head_text left">{{data.DeliverBill.BillNo}}</div>
     </div>

     <div class="kanban_logon"></div>
     
     <div class="kanban_name"></div>
     
     <div class="footBor"></div>
     <div class="kanban_conter float">
        <div class="kanban_left left">

            <el-table
            height="100%"
            :data="this.data.DeliverBill.Data"
            :row-class-name="tableRowClassName"
            :header-cell-style="headClass"
            style="width: 100%">
            <el-table-column
            prop="NO"
            :show-overflow-tooltip="true"
            label="序号"
            width="55">
            </el-table-column>
            <el-table-column
            prop="SupplierProduct"
            :show-overflow-tooltip="true"
            width="120"
            label="品番">
            </el-table-column>
            <el-table-column
            prop="SupplyPb"
            :show-overflow-tooltip="true"
             width="70"
            label="背番">
            </el-table-column>
             <el-table-column
            prop="InnerBoxAmount"
            :show-overflow-tooltip="true"
            width="180"
            label="收容数">
            </el-table-column>
            <el-table-column
            prop="PlanBoxCount"
            :show-overflow-tooltip="true"
             width="92"
            label="应备">
            </el-table-column>
             <el-table-column
            prop="FinshBoxCount"
            :show-overflow-tooltip="true"
             width="60"
            label="已备">
            </el-table-column>
             <el-table-column
            prop="NotFinshBoxCount"
            :show-overflow-tooltip="true"
            label="未备"
            width="60">
            </el-table-column>
        </el-table>

        </div>
        <div class="kanban_right right">
            <div class="kanban_right_top">
                <div class="right_top_bg"></div>
                <div class="kanban_name_text text1">供应商简称</div>
                <div class="kanban_name_text text2">供应商代码</div>
                <div class="kanban_name_text text3">路线便次</div>
                <div class="kanban_name_text text4">剩余分拣出库</div>
                <div class="kanban_name_text text5">操作人员</div>
                <div class="kanban_name_text text6">操作站台</div>

                <div class="kanban_name_value value1">{{data.DeliverBill.SupplierName}}</div>
                <div class="kanban_name_value value2">{{data.DeliverBill.SupplierNo}}</div>
                <div class="kanban_name_value value3">{{data.DeliverBill.LXBC}}</div>
                <div class="kanban_name_value value4">{{data.DeliverBill.ShengYuBoxCount}}</div>
                <div class="kanban_name_value value5">{{data.DeliverBill.UserCode}}</div>
                <div class="kanban_name_value value6">站台2</div>

            </div>
            <div class="kanban_right_bottom">

                <span class="lpArrow"></span> 
                <span class="rpArrow"></span> 
                <span class="lbArrow"></span> 
                <span class="rbArrow"></span> 
                <el-carousel class="img" :interval="2000" indicator-position="outside">
                    <el-carousel-item v-for="item in this.data.ImageList.Images" :key="item">
                    <img :src="item">
                    </el-carousel-item>
                </el-carousel>
            </div>
        </div>
     </div>
 </div>
    
</template>
<script>
import screenfull from 'screenfull'
// DeliverMainID 出库ID
// DeliverMainNum 出库主单号
// SupplierName 供应商简称
// SupplierNo 供应商编码
// SupplierProduct 品番
// SupplyPb 背番
// InnerBoxAmount 收容数
// PlanBoxCount 计划总箱数
// FinshBoxCount 完成箱数
// NotFinshBoxCount 未完成箱数
// BillState  单据状态

export default {
    data() {
        return {
            img :["http://img.aiimg.com/uploads/userup/0909/2Z64022L38.jpg","http://img.aiimg.com/uploads/userup/0909/2Z64022L38.jpg","http://img.aiimg.com/uploads/userup/0909/2Z64022L38.jpg"],
            data:null,
            tableData:[], 
            timer:''
        }
    },
    destroyed(){
      clearInterval(this.timer);
    },
    beforeDestroy(){
      clearInterval(this.timer);
    },
    mounted(){
        var endtime=0;
        document.onkeydown=(e)=>{
            if(e.keyCode==13){
                endtime++;
                if(endtime==2){
                    this.clickFullscreen();
                }
            }
            setTimeout(()=>{
                endtime=0;
            },600)}
},

    created(){ 
        this.data = {
            ImageList:{
                SupplyProduct:"物料品番A",
                Images:this.img
            },
            DeliverBill:{
                BillNo:"000001",
                CurSupplyProduct:"物料品番A",
                ShengYuBoxCount:5,
                SupplierName:'供应商简称',
                SupplierNo:'供应商编码',
                UserCode:"System",
                LXBC:'路线便次',
                Data:this.tableData  //表单数据
            }
        }
        this.timer = setInterval(()=>{
            this.init()
        },1000)
    },
    methods:{
        init(){
       
            this.$axios({       
                    method: 'get',
                    url: `${this.$store.state.dailog.url1}/KanBanManager/KB_FenJian/GetKanBanDataByStationNo?StationNo=2`,
                    StationNo:"2"
                }).then(res => {
                
                    this.data = res.data.resultdata
                    for(let i=0;i<this.data.DeliverBill.Data.length;i++){
                        this.data.DeliverBill.Data[i].NO = i+1
                    }
                    if(this.data.ImageList.Images.length== 0){
                     
                        // this.data.ImageList.Images = [require("../../assets/img/看板Logo.png")]
                    }
                }).catch((err)=>{
                    console.log('接口失败')
                   
                })
        },
        clickFullscreen(){
            if(!screenfull.isEnabled){
                this.$message({
                message:'you browser can not work',
                type:'warning'
            })
                return false
            }
                screenfull.toggle()
            },
        //表格样式
        tableRowClassName({row, rowIndex}) {
            console.log('row==>',row)
            if(row._BillState == '3'){
                return 'success-active';
            }
            if (rowIndex % 2 != 0) {
                return 'warning-row';
            } else{
                return 'success-row'
            }
            return '';
        },
        //表格样式
         headClass(){
             return 'background: #0883E3'
         },
    }

}
</script>
<style lang="less">
.kanban_box{
    .el-table{
        background: transparent;
    }
     .el-table td{
        border-bottom:1px solid #164499;
        border-right:1px solid #fff;
    }
    .el-carousel__item h3 {
        color: #475669;
        font-size: 16px;
        opacity: 0.75;
        line-height: 300px;
        margin: 0;
      }
      
      
      .el-carousel__item:nth-child(2n) {
        background-color: #99a9bf  !important;
      }
      
      .el-carousel__item:nth-child(2n+1) {
        background-color: #d3dce6 !important;
      }
      .el-carousel{
          height:100%;
      }
      .el-carousel__container{
          position: relative;
          height: 93% !important;
      }
      .el-table th, .el-table tr{
          height: 17.75px !important;
          text-align: center;
          font-size: 16px;
          font-family: Alibaba PuHuiTi;
          font-weight: 400;
          color: #FFFFFF;
      }
        .el-table .success-row{
           font-size: 13px !important;
       }
       .el-table tbody tr{
          font-size: 13px !important;
           pointer-events:none; 
      }
   
      .el-table .warning-row {
            background: #5373A7;
           
        }
        .el-table .success-row {
             background: #5373A7;
        }
         .el-table .success-active {
            // background: #079AB7;
             background: #52A21C;
        }
       .el-table--small td, .el-table--small th{
           padding:0px !important;
           border-right:1px solid #fff;
       }
       .el-table td, .el-table th{
           padding:0px !important;
       }
       .el-table .cell{
           line-height:21.99px !important;
       }
       .el-carousel__indicator{
           padding:0px !important;
       }
       .el-carousel__indicators--outside{
           position:absolute !important;
           top:172px;
       }
       .el-table__body, .el-table__footer, .el-table__header{
           background: #2D72D5 !important;
       }
}
</style>
<style lang="less" scoped>
.kanban_box{
    width:960px;
    height:540px;
    background: url("../../assets/img/看板背景.png");
    background-size:cover ;
    position: relative;
    padding:13px 12px 17px 14px;
    box-sizing: border-box;
    .left{
      float:left;
    }
    .right{
      float:right;    
    }
    .float:after{
      content: "";
      display: block;
      height: 0;
      clear:both;
      visibility: hidden;
    }
    .float{
      zoom: 1;
    }
    .footBor{
        position: absolute;
        top: 522px;
        left: 14px;
        width: 640px;
        height: 2px;
        background: #164499;
        z-index: 3;
    }
    .kanban_logon{
        position: absolute;
        top:0;
        left:800px;
        width:128px;
        height: 49px;
        // background: url('../../assets/img/看板logo.png');
        background-size:cover;
        z-index: 1;
        border-radius: 0 0 10px 10px;
    }
    .kanban_name{
        position: absolute;
        top:8px;
        left:682px;
        width:243px;
        height: 304px;
        background: url('../../assets/img/看板名字2.png');
        background-size: cover;
        z-index: 2;
    }
    .kanban_head{
        width:100%;
        height:20px;
        margin-bottom:6px;
        line-height: 20px;
        .head_icon{
            width:20px;
            height: 20px;
            background: url('../../assets/img/看板icon.png');
            background-size:cover ;
        }
        .head_text{
            font-size: 14px;
            font-family: Alibaba PuHuiTi;
            font-weight: 400;
            color: #FEBA36;
            line-height: 20px;
        }
        .text1{
            margin-right:15px;
            margin-left:9px;
        }
    }
    .kanban_conter{
        width:100%;
        height: 100%;
        .kanban_left{
            width:637px;
            height: 484px;
            margin-right:5px;
        }
        .kanban_right{
            width:291px;
            height: 484px;
            .kanban_right_top{
                width: 291px;
                height: 284px;
                border-radius: 4px;
                margin-bottom:9px;
                position: relative;
                .right_top_bg{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: #000000;
                    opacity: 0.28;
                }
                .kanban_name_value{
                    position: absolute;
                    font-size: 16px;
                    font-family: Helvetica LT Light;
                    font-weight: bold;
                    color: #00FFF0;
                    z-index: 1;
                }
                .value1{
                    top:58px;
                    left: 156px;
                }
                .value2{
                     top:94px;
                    left: 156px;
                }
                .value3{
                    top:128px;
                    left: 156px;
                }
                .value4{
                    top:164px;
                    left: 156px;
                }
                .value5{
                    top:200px;
                    left: 156px;
                }
                .value6{
                     top:236px;
                    left: 156px;
                }
                .kanban_name_text{
                    position: absolute;
                    font-size: 16px;
                    font-family: Source Han Sans CN;
                    font-weight: 400;
                    color: #FFFFFF;
                    z-index: 1;
                }
                .text1{
                    top:56px;
                    left:45px;
                }
                .text2{
                    left:45px;
                    top:91px;
                }
                .text3{
                    left:45px;
                    top:126px;
                }
                .text4{
                    left:45px;
                    top:163px;
                }
                .text5{
                    left:45px;
                    top:199px;
                }
                .text6{
                    left:45px;
                    top:236px;
                }
            }
            .kanban_right_bottom{
                width: 291px;
                height: 190px;
                background: #0C2E6E;
                border-radius: 4px;
                position: relative;
                .img{
                    position: absolute;
                    top: 4px;
                    left: 3px;
                    width: 285px;
                    height: 188px;
                }
                img{
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                }
                 span {
                    position: absolute;
                    width: 10px;
                    height: 10px;
                }
                .lpArrow { 
                    border-top: 1px solid #00F6E5;
                    border-left: 1px solid #00F6E5;
                }
                .rpArrow {
                    right: 0;
                    border-top: 1px solid #00F6E5;
                    border-right: 1px solid #00F6E5;
                }
                .lbArrow {
                    bottom: 0;
                    border-left: 1px solid #00F6E5;
                    border-bottom: 1px solid #00F6E5;
                }
                .rbArrow {
                    right: 0;
                    bottom:0;
                    border-right: 1px solid #00F6E5;
                    border-bottom: 1px solid #00F6E5;
                }
            }
        }
    }

}

</style>