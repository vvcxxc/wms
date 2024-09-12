<!--
 * @Description: 这是***页面（组件）
 * @Date: 2020-09-15 10:43:03
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-09-25 16:28:46
-->
<template>
    <div class="alert_box">
        <div>报警未与PLC对接</div>
    </div>
</template>
<script>
export default {
    data(){
        return{

        }
    },
    created(){
       
    },
    mounted(){
        this.stopF5Refresh()
    },
    methods:{
       init(){
           console.log('初始化')
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
    }
}
</script>
<style lang="less">

</style>
<style lang="less" scoped>
    .alert_box{
        background: #fff;
        width:100%;
        height: 98%;
    }
</style>