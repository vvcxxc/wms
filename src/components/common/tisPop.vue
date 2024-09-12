<!--
 * @Description: 这是提示弹窗页面（组件）
 * @Date: 2020-08-28 11:16:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 09:59:25
-->
<template>
<div class="tisPop">
   <div v-drag class="title">
            <span class="text">{{title}}</span>
            <div @click="cancelFun()" class="headImg"></div>
    </div>
    <div v-if="type=='1' || type=='4' || islast || type=='5' || type == '6' || type=='7' " class="tisText_box">
        <div class="tisText">{{titleText}}</div>
    </div>

    <div v-if="(type=='2'&&!islast) || (type=='3'&&!islast)" class="tisText_box">
        <div class="tisText_row">
            <div class="row_name">请输入新密码：</div>
            <div class="row_input">
                <el-input placeholder="请输入密码" v-model="newPassword" show-password></el-input>
            </div>
        </div>
         <div class="tisText_row">
            <div class="row_name">请确认新密码：</div>
            <div class="row_input">
                <el-input placeholder="请输入密码" v-model="password" show-password></el-input>
            </div>
        </div>
    </div>

    <div class="user_conter_box3">
        <div v-if="type!='4' &&!islast && type!='7'" @click="saveFun()" class="button orange left">确认</div>
        <div v-if="type!='4' &&!islast && type!='7'" @click="closeFun('1')"  class="button grey left">取消</div>

        <div v-if="islast || type == '4' || type == '7'" @click="closeFun()" class="button orange ml left">{{btntext}}</div>
    </div>
</div>
    
</template>
<script>
export default {
    data(){
        return{
            title:'',
            islast:false,
            titleText:'修改成功！点击确认按钮产线登陆系统',
            btntext:'确认',
            num:3,
            set:'',
            newPassword:'',
            password:''
        }
    },
    directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                let box = document.querySelector('.tisPop')
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
        props:['type','text','data'],
    created(){
        //1为用户删除 2为个人重置密码 3为账号重置密码 4为用户提示信息 5为权限岗位删除 6为权限部门删除 7为提示信息

       this.init()
    },
    methods:{
        init(){
             if(this.type=='1'){
                this.title = '删除'
                this.titleText = this.text
            }else if(this.type=='2' || this.type=='3'){
                this.title = '重置密码'
            }else if(this.type=='4' || this.type=='5' || this.type == '6' || this.type == '7'){
                this.title = '提示'
                this.titleText = this.text
            }
        },
        //关闭弹窗
        cancelFun(){
            this.$parent.closeFun()
        },
        //确认
        saveFun(){
            //2为重置个 //3为账号
            if(this.type == '2' || this.type == '3'){
                if(this.newPassword == '' || this.passoword == ''){
                     this.$message({
                        message: '请填写完整',
                        type: 'warning'
                    });
                }else if(this.newPassword != this.password){
                    this.$message({
                        message: '两次密码输入不一致',
                        type: 'warning'
                    });
                }else{
                    if(this.type == '2'){
                        var pass1 = {
                            UserId:'',
                            Password:this.password,
                        }      //重置个账号要重新登录
                        this.$parent.setPasswordFun2(pass1).then((val)=>{
                            this.btntext = '即将退出请重新登录！'+this.num
                            this.islast = true
                            this.titleText = '修改成功！点击确认按钮产线登陆系统' 
                            this.title = '提示'
                            this.set = setInterval(()=>{
                                this.num = this.num - 1
                                this.btntext = '即将退出请重新登录！'+this.num + 's'
                                if(this.num == 0){
                                    var url = `${this.$store.state.dailog.url1}Login/OutLogin`
                                    this.$axios({
                                        method: 'post',
                                        url: url,
                                    }).then(res => {
                                        localStorage.removeItem("ms_username");
                                        this.$router.push("/login");
                                    })
                                    clearInterval(this.set)
                                }
                            },1000)
                        })

                    }else{
                        var pass = {
                            UserId:this.data.UserId,
                            Password:this.password,
                        }
                        this.$parent.setPassWordFun(pass)
                    }
                }
            }else if(this.type=='5'){
                 this.DepartmentDelete('岗位')
            }else if(this.type == '6'){
                this.DepartmentDelete('部门')
            }else if(this.type == '1'){
                this.$parent.deletAxiosFun(this.data.UserId)
            }
        },
        //提示成功
        tispsrcc(){
             this.islast = true
            this.titleText = '修改成功！' 
            this.title = '提示'
        },
        //删除
        DepartmentDelete(text){
             var value
             var url 
             if(text == '部门'){
                 value = {
                         DepartmentId:this.data.DepartmentId,
                }
                url = `${this.$store.state.dailog.url1}BaseManage/Base_Department/RemoveForm`
             }else{
                 value = {
                     PostId:this.data.PostId
                 }
                 url = `${this.$store.state.dailog.url1}BaseManage/Base_Post/RemoveForm`
             }
                this.$axios({
                    method:"post",
                    url:url,
                    data:value
                }).then((res)=>{
                    this.$parent.closeFun()
                    this.$parent.init()
                })
        },

        //取消
        closeFun(text){
            if(this.type=='7'){
                this.$parent.closeFun('1')
            }else{
                this.$parent.closeFun()
                if(this.type == '2'){
                    if(text != '1'){
                        localStorage.removeItem("ms_username");
                        this.$router.push("/login");
                    }
                }
            }
        }
        
    }
}
</script>
<style>
</style>
<style lang="less" scoped>
.tisPop{
        position: absolute;
        left:0;
        right:0;
        bottom:0;
        top:0;
        margin: auto;
        width:480px;
        height:250px;
        background: #fff;
        border:1px solid #eee;
         box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        z-index: 12;
        .left{
            float: left;
        }
        .title{
            width:100%;
            height:40px;
            font-size: 18px;
            font-family: Microsoft YaHei;
            font-weight: 500;
            color: #FFFFFF;
            background: #FFBC3D;
            text-align: center;
            line-height: 40px;
            .title_i{
                color: #fff;
                margin-right:5px;
            }
            .headImg{
                position: absolute;
                right: 12px;
                top: 11px;
                width:20px;
                height: 20px;
                // background: url('../../../../assets/img/no.png');
                background: url('../../assets/img/no.png');
                background-size:cover ;
                cursor: pointer;
            }
        }
        .tisText_box{
            width: 100%;
            height: 160px;
            font-size: 16px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #333333;
            text-align: center;
            display: table;
            overflow: hidden;
            .tisText_row{
                width:100%;
                height: 36px;
                margin-top:10px;
            }
             .tisText_row:first-child{
                 margin-top:35px;
             }
            .tisText{
                vertical-align:middle;    
                display:table-cell;    
            }
            .row_name{
                width:120px;
                height: 34px;
                line-height: 34px;
                font-size: 16px;
                font-family: Microsoft YaHei;
                font-weight: 400;
                color: #333333;
                float: left;
                margin-left: 45px;
            }
            .row_input{
                width: 250px;
                height: 34px;
                float: left;
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
                background: #E6A23C;
                color: #fff;
                margin-left: 135px;
            }
             .grey{
                background: #EEEEEE;
                color: #666;
            }
            .ml{
                margin-left:176px;
                width: 162px;
            }
        }
}
</style>