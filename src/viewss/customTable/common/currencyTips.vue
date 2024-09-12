<!--
 * @Description: 这是【通用列表页提示弹窗页面】（组件）
 * @Date: 2020-08-10 17:20:29
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-12-17 18:39:18
-->
<template>
    <div v-if="true" class="deletePop">
        <div class="title">
            <span class="title_i el-icon-warning"></span>
            <span class="text">提示</span>
        </div>

        <div class="delete_text">{{tipsText}}</div>

        <div v-if="deleteShow" class="delete_btn">
            <div @click="deleteBtn('1')" class="no">否（NO）</div>
            <div @click="deleteBtn('2')" class="yes">是（YES）</div>
        </div>

          <div v-if="!deleteShow" class="delete_btn">
            <div @click="deleteBtn('1')" class="deleteConfig">确认</div>
        </div>
    </div>
    
</template>
<script>
export default {
    data() {
        return {
            deleteShow:true,
        }
    },
    props:['tipsText','tipsType','tipsValue'],
    created(){ 
        this.init()
    },
    methods:{
        init(){
           if(this.tipsType == '1'){
               this.deleteShow = false
           }else{
               this.deleteShow = true
           }
        },

        deleteBtn(num){
            if(num == '1'){
                if(this.tipsValue == '添加成功'){
                    this.$parent.tableDataFun()
                    this.$parent.closeFun()
                }else if(this.tipsValue == '编辑成功'){
                    this.$parent.tableDataFun()
                    this.$parent.closeFun()
                }else{
                    this.$parent.closeFun()
                }
            }else{
                console.log('tipsValue',this.tipsValue)
                if(this.tipsValue == '删除'){
                    this.$parent.$refs.homePage.deleteAxios()
                   
                }
            }
        }
    }

}
</script>
<style lang="less" scoped>
.deletePop{
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        top:0;
        margin: auto;
        width:385px;
        height:205px;
        background: #fff;
        border:1px solid #eee;
         box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        z-index: 10;
        .title{
            width:100%;
            height:40px;
            background: #FFBC3D;
            text-align: center;
            line-height: 40px;
            color:#fff;
            .title_i{
                color: #fff;
                margin-right:5px;
            }
        }
        .delete_text{
            width:70%;
            height:120px;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: normal;
            word-break: break-all;
            text-align: left;
            margin:auto;
        }
        .delete_btn{
            width:100%;
            height:45px;
            .no{
                float: left;
                width:160px;
                height:30px;
                background: #E0E0E0;
                color:#737373;
                text-align: center;
                 line-height: 30px;
                 margin-left:33px;
                 margin-right:5px;
                 cursor: pointer;
            }
            .yes{
                float: left;
                 width:160px;
                height:30px;
                background: #F3E3AD;
                color:#EBA241;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
            }
            .deleteConfig{
                width:315px;
                height:30px;
                background: #F3E3AD;
                color:#EBA241;
                text-align: center;
                line-height: 30px;
                cursor: pointer;
                margin-left:35px;
            }
        }
    }
</style>