<!--
 * @Description: 这是提示弹窗组件页面（组件）
 * @Date: 2020-08-10 17:20:29
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-25 12:27:22
-->
<template>
    <div class="deletePop">
        <div v-drag class="title">
            <span class="title_i el-icon-warning"></span>
            <span class="text">提示</span>
        </div>

        <div class="delete_text">{{tipText}}</div>

        <div v-if="tipType!='1'" class="delete_btn">
            <div @click="deleteBtn('1')" class="no">否（NO）</div>
            <div @click="deleteBtn('2')" class="yes">是（YES）</div>
        </div>

          <div v-if="tipType=='1'" class="delete_btn">
            <div @click="deleteBtn('1')" class="deleteConfig">确认</div>
        </div>
    </div>
    
</template>
<script>
export default {
    data() {
        return {
           text:"222"
        }
    },
    props:['tipType','tipText','tipValue'],
    directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                let box = document.querySelector('.deletePop')
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
    },
    methods:{
        deleteBtn(text){
           if(this.tipValue == '编辑'){
                this.$parent.UptableFun() //表单刷新
           }
            this.$parent.cancelFun()
         
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
        height:225px;
        background: #fff;
        border:1px solid #eee;
        box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        z-index: 16;
        user-select: none;
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
             width:72%;
            height:70px;
            // text-align: center;
            margin-left:16%;
            margin-top:40px;
            margin-bottom:20px;
             display: flex;
            align-items:center;
            justify-content:center;
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
