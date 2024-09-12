<!--
 * @Description: 这是用户信息新增页面（组件）
 * @Date: 2020-08-28 17:44:03
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:31:21
-->
<template>
    <div class="add_box">
        <div  v-drag class="head">{{popTitle}}
            <div @click="cancelFun()" class="headImg"></div>
        </div>

        <div class="add_conter">
            
            <div class="add_name">{{addName}}：</div>
            <div class="add_input">
                <el-input v-model="input" placeholder="请输入内容"></el-input>
            </div>
        </div>

        <div class="user_conter_box3">
            <div  @click="saveFun()" class="button orange left">确认</div>
            <div  @click="closeFun()"  class="button grey left">取消</div>
        </div>

    </div>
</template>
<script>
export default {
    data(){
        return{
            popTitle:'',
            input:'',
            addName:''
        }
    },
     directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                let box = document.querySelector('.add_box')
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
        props:['text','type','data','id'],
    created(){
        //5为删除、添加岗位 6为删除、添加部门 7为编辑岗位 8为编辑部门
        this.init()
    },
    methods:{
        init(){
            if(this.type == 5){
                this.popTitle = this.text
                this.addName = '岗位名称'
            }else if(this.type == 6){
                this.popTitle = this.text
                this.addName = '部门名称'
            }else if(this.type==7){
                this.addName = '岗位名称'
                this.popTitle = this.text
                this.input = this.data.PostName
            }else if(this.type==8){
                this.addName = '部门名称'
                this.popTitle = this.text
                this.input = this.data.DepartmentFullName
            }

        },
        //取消
        closeFun(){
            this.$parent.closeFun()
        },
        //添加编辑岗位方法
        postAxios(text,type,id){
            var value = {
                DepartmentId:id,
                PostCode:"",
                PostName:text,
                ParentId:0
            }
            if(type == '编辑'){
                value.PostId = this.data.PostId
            }
            var url = `${this.$store.state.dailog.url1}BaseManage/Base_Post/SaveForm`
             this.$axios({
                method:"post",
                url:url,
                data:value
            }).then((res)=>{
                this.$parent.init()
            })
        },
        //添加编辑部门方法
        DepartmentAxios(text,type){
            var value = {
                DepartmentSortNam:text,
                DepartmentFullName:text,
                ParentId:0
            }
            if(type == '编辑'){
                value.DepartmentId = this.data.DepartmentId
            }
            var url = `${this.$store.state.dailog.url1}BaseManage/Base_Department/SaveForm`
            this.$axios({
                method:"post",
                url:url,
                data:value
            }).then((res)=>{
                this.$parent.init()
            })
        },

        //保存
        saveFun(){
            if(this.type == '5'){
                // 添加岗位
                if(this.input == ''){
                    this.$message.error('请填写岗位名称');
                    return
                }
                this.postAxios(this.input,'添加',this.id)
              
            }else if(this.type == '6'){
                // 添加部门
                if(this.input == ''){
                    this.$message.error('请填写部门名称');
                    return
                }
                this.DepartmentAxios(this.input,'添加')
            }else if(this.type == '7'){
                // 编辑岗位
                 if(this.input == ''){
                    this.$message.error('请填写岗位名称');
                    return
                }
                this.postAxios(this.input,'编辑',this.id)
            }else if(this.type == '8'){
                // 编辑部门
                if(this.input == ''){
                    this.$message.error('请填写部门名称');
                    return
                }
                 this.DepartmentAxios(this.input,'编辑')
            }
            this.$parent.closeFun()
        },
        //关闭弹窗
        cancelFun(){
            this.$parent.closeFun()
        }
    }
}
</script>
<style lang="less" scoped>
.add_box{
        width:500px;
        height:270px;
        background:#fff;
        box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0;
        bottom: 0;
        margin:auto;
        z-index: 10;
         .left{
            float: left;
        }
        .head{
            position: relative;
            line-height: 50px;
            text-align: center;
            width:500px;
            height:50px;
            background:#009688;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: bold;
            color: #FFFFFF;
            user-select: none;
            .headImg{
                position: absolute;
                right: 12px;
                top: 16px;
                width:20px;
                height: 20px;
                background: url('../../../assets/img/no.png');
                background-size:cover ;
                cursor: pointer;
            }
        }
        .user_conter_box3{
            overflow: hidden;
            width:100%;
            height: 34px;
            height: 36px;
            position: absolute;
            bottom: 25px;
             .button{
                width:100px;
                height:36px;
                border-radius:5px;
                font-size:14px;
                font-family:Source Han Sans CN;
                font-weight:400;
                cursor: pointer;
                line-height: 36px;
                overflow: hidden;
                margin-right:20px;
                text-align: center;
                user-select: none;
            }
            .orange{
                background: #009688;
                color: #fff;
                margin-left: 135px;
            }
             .grey{
                background: #EEEEEE;
                color: #666;
            }
            .ml{
                margin-left:195px;
            }
        }
        .add_conter{
            width:100%;
            height: 36px;
            overflow: hidden;
            margin-top:62px;
            margin-left:117px;
            line-height: 36px;
            .add_name{
                float: left;
                
            }
            .add_input{
                float: left;
                width: 190px;
                height: 34px;
            }
        }

}

</style>