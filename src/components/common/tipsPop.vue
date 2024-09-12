<!--
 * @Description: 这是【通用列表页提示弹窗页面】（组件）
 * @Date: 2020-08-10 17:20:29
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 11:46:04
-->
<template>
    <div  v-if="true" class="deletePop">
        <div class="title">
            <span class="title_i el-icon-warning"></span>
            <span class="text">提示</span>
        </div>

        <div class="delete_text">{{text}}</div>

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
            name:'删除',
            text:'',
            value:[]
        }
    },
    props:['title','data','tableDataArr','type','textInfo'],
    created(){ 
        this.init()
    },
    methods:{
        init(){
            //0、1、2为编辑，4为删除冻结  5为权限角色删除 7为提示信息
            if(this.type=='0'){
                 this.text = '请勾选编辑内容'
                 this.deleteShow = false
            }else if(this.type=='2'){
                this.text = '不可多项编辑内容'
                this.deleteShow = false
            }else if(this.type == '5'){
                this.text = '请勾选内容'
                this.deleteShow = false
            }
            if(this.type == '4'){
                if(this.tableDataArr.length == 0){
                    this.text = '请勾选内容'
                    this.deleteShow = false
                }else{
                    // IsMultipleChoice==0 不可以多选
                    if(this.data.IsMultipleChoice == 0){
                        console.log('tableDataArr',this.tableDataArr.length)
                        if(this.tableDataArr.length > 1){
                            this.text = '不可多选内容'
                            this.deleteShow = false
                            return
                        }
                    }

                    this.text = '是否确认' + this.title + '?'
                    var Params = this.data.Params
                    var paramData = []
                    this.value = []
                    for(let i=0;i<Params.length;i++){
                        paramData.push(Params[i].ParamName)
                    }
                    console.log('paramData',paramData)
                    if(this.tableDataArr != ''){
                        var data = []
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
                         console.log('ssscc',value2,this.value)
                    }
                    }else{
                        if(paramData.length!=0){
                            var value2 = {}
                            for(let i=0;i<paramData.length;i++){
                                var o = {};
                                var str = "o."+paramData[i]+"=''";
                                    eval(str);
                                    Object.assign(value2,o);
                            }
                            this.value.push(value2)
                        }
                    console.log('ssscc',value2,this.value)
                    }
                }
            }else if(this.type == '7'){
                 this.text = this.textInfo
                 this.deleteShow = false
            }
        },

        deleteBtn(num){
            if(num == '2'){
                 var url = this.data.SumbitUrl
                //  var url1 = `${this.$store.state.dailog.url1}${url}`
                this.$axios({
                    method: 'post',
                    url:url1,
                    data:this.value
                }).then(res => {
                    if(res.data.type==1){
                        this.$parent.cancelFun()
                        this.$parent.UptableFun() //刷新表单数据
                    }else{
                        console.log('弹窗文本',res)
                        this.text = res.data.message

                        this.deleteShow =false
                        this.$parent.UptableFun() //刷新表单数据
                    }
                }).catch(function(error) {
                            console.log(error);
                });

            }else{
                this.$parent.cancelFun()
            }
        },
      
    }

}
</script>
<style lang="less" scoped>
.deletePop{
        position: absolute;
        left:0;
        right:0;
        // bottom:0;
        top:200px;
        margin: auto;
        width:385px;
        min-height:205px;
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
            min-height:120px;
            display: flex;
            align-items: center;
            justify-content: center;
            white-space: normal;
            word-break: break-all;
            text-align: left;
            margin:auto;
            margin-top:10px;
            margin-bottom:10px;
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