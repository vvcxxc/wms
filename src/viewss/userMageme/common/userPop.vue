<!--
 * @Description: 这是用户信息页弹窗提示页面（组件）
 * @Date: 2020-08-28 11:16:38
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:40:05
-->
<template>
<div class="userPop">
         <div v-drag class="head">{{popTitle}}
           <div @click="cancelFun()" class="headImg"></div>
        </div>
        <div class="user_conter">
            <div class="user_conter_box">
                <div class="conter_box_name left">姓名：</div>
                <div class="conter_box_input ml left">
                    <el-input v-model="name" autocomplete="off" placeholder="请输入内容"></el-input>
                </div>
                <div class="conter_box_name left">账号：</div>
                <div class="conter_box_input left">
                    <el-input v-model="number" autocomplete="off" placeholder="请输入内容"></el-input>
                </div>
            </div>
              <div class="user_conter_box">
                <div class="conter_box_name left">部门：</div>
                <div class="conter_box_input ml left">
                    <el-select @change="departFun()" v-model="department" placeholder="请选择">
                        <el-option
                        v-for="item in DepartmentArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="conter_box_name left">岗位：</div>
                <div class="conter_box_input left">
                    <el-select v-model="post" placeholder="请选择">
                        <el-option
                        v-for="item in PostArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
              <div class="user_conter_box" v-if="type=='1'">
                <div class="conter_box_name left">登录密码：</div>
                <div class="conter_box_input ml left">
                    <el-input autocomplete="off" type=password v-model="password" placeholder="请输入内容" show-password></el-input>
                </div>
                <div class="conter_box_name left">确认密码：</div>
                <div class="conter_box_input left">
                    <el-input autocomplete="off" type=password v-model="password2" placeholder="请输入内容" show-password></el-input>
                </div>
            </div>

             <div class="user_conter_box">
                <div class="conter_box_name left">联系方式：</div>
                <div class="conter_box_input2 left">
                    <el-input v-model="phone" @input="phoneVeriFun()" autocomplete="off" placeholder="请输入内容"></el-input>
                </div>
                <div ref="tips" class="tips">请输入正确的手机或座机格式</div>
            </div>

             <div class="user_conter_box2">
                <div class="conter_box_name left">备注</div>
                <div class="conter_box_input3 left">
                    <textarea v-model="remarksV" style="resize: none;"></textarea>
                </div>
            </div>

              <div class="user_conter_box3">
                  <div @click="saveFun()" class="button green left">确认</div>
                  <div @click="cancelFun()" class="button grey left">取消</div>
              </div>
             
        </div>
</div>
</template>
<script>
export default {
    data(){
        return{
            name:'',
            number:'',
            password2:'',
            password:'',
            post:'',
            department:'',
            phone:'',
            phonegs:false,
            remarksV: '' ,
            popTitle:'',
            PostArr:''
        }
    },
    props:['type','PostAllArr','DepartmentArr','data'],
      directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                let box = document.querySelector('.userPop')
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
        this.init()
    },
    methods:{
        //1 添加用户  2为编辑
        init(){
            if(this.type=="1"){
                this.popTitle = '添加用户'
            }else if(this.type=='2'){
                this.popTitle = '编辑用户'
                this.name = this.data.RealName
                this.number = this.data.EnCode
                this.post = this.data.PostName
                this.department = this.data.DepartmentFullName
                this.phone = this.data.Telephone
                this.remarksV = this.data.Remark
            }
        },
        cancelFun(){

        },
        //部门岗位数据
        dataFun(data,text){
            for(let i=0;i<data.length;i++){
                if(text == data[i].value){
                   return data[i].id
                }
            }
        },
        //筛选部门-岗位（DepartmentId可能有变）
        departFun(){
            this.PostArr = []
            for(let i=0;i<this.DepartmentArr.length;i++){
                if(this.DepartmentArr[i].value == this.department){
                    for(let j=0;j<this.PostAllArr.length;j++){
                        if(this.PostAllArr[j].ParentId == this.DepartmentArr[i].id){
                            this.PostArr.push(this.PostAllArr[j])
                        }
                    }
                }
            }
            if(this.PostArr.length != 0){
                this.post = this.PostArr[0].value
            }else{
                this.post = ''
            }
        },
        //保存接口
        addAxios(data){
            var url = `${this.$store.state.dailog.url1}/BaseManage/Base_User/SaveForm`
             this.$axios({          //查询信息
                    method: 'post',
                    url: url,
                    data:data
                }).then(res => {
                   if(res.data.type==1){
                      this.$parent.closeFun()
                      this.$parent.allAxiosFun()
                   }else{

                      this.$parent.tipsFun(res.data.message)
                   }
                }).catch((err)=>{
                    console.log('err',err)
                })
        },
        saveFun(){

            var value
            var DepartmentId = this.dataFun(this.DepartmentArr,this.department)
            var PostId = this.dataFun(this.PostArr,this.post)
         
        if(this.type == 1){
            value = {
                RealName:this.name,
                EnCode:this.number,
                Telephone:this.phone,
                Password:this.password,
                Account:this.number,
                PostId:PostId,
                DepartmentId:DepartmentId,
                Remark:this.remarksV
            }
        }else{
            value = {
                UserId:this.data.UserId,
                RealName:this.name,
                EnCode:this.number,
                Account:this.number,
                Telephone:this.phone,
                PostId:PostId,
                DepartmentId:DepartmentId,
                Remark:this.remarksV
            }
        }
            if(this.name == ''){
                this.$parent.tipsFun('请填写姓名')
                return
            }else if(this.number == ''){
                this.$parent.tipsFun('请填写账号')
                return
            }else if(this.department == ''){
                 this.$parent.tipsFun('请选择部门')
                 return
            }else if(this.post == ''){
                this.$parent.tipsFun('请选择岗位')
                return
            }else if(this.password == ''){
                if(this.type == '1'){
                    this.$parent.tipsFun('请输入密码')
                    return
                }
            }else if(this.password2 == ''){
                if(this.type=='1'){
                    this.$parent.tipsFun('请再次确认密码')
                    return
                }
            }else if(this.password != this.password2){
                if(this.type=='1'){
                    this.$parent.tipsFun('两次密码不一致')
                    return
                }
            }else if(this.phone == ''){
                this.$parent.tipsFun('联系方式不能为空')
                return
            }else if(this.phonegs == false){
                this.$parent.tipsFun('请输入正确的手机或座机格式')
                return
            }
                this.addAxios(value) 
        },
        phoneVeriFun(){
            var RegExpa = /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/;
            var aa = RegExpa.test(this.phone)
            if(aa == false){
                this.$refs.tips.style.display='block'
                this.phonegs = false
            }else{
                this.$refs.tips.style.display='none'
                this.phonegs = true
            }
        },
        //关闭弹窗
        cancelFun(){
            this.$parent.closeFun()
        }
        
    }
}
</script>
<style>
</style>
<style lang="less" scoped>
.userPop{
        width:629px;
        height:480px;
        background:#fff;
        box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0;
        bottom: 0;
        margin:auto;
        z-index: 11;
        .left{
            float: left;
        }
        .head{
            position: relative;
            line-height: 50px;
            text-align: center;
            width:629px;
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
        .user_conter{
            width:100%;
            height: 430px;
            padding:29px 29px 29px 25px;
            box-sizing: border-box;
            .user_conter_box,.user_conter_box2,.user_conter_box3{
                // overflow: hidden;
                width:100%;
                height: 34px;
                margin-bottom:16px;
                position: relative;
                .conter_box_input{
                    width:186px;
                    height: 34px;
                }
                .tips{
                    display: none;
                    color:red;
                    position: absolute;
                    bottom: -14px;
                    left: 0;
                    font-size: 12px;
                }
                .conter_box_input2{
                    width:495px;
                    height: 34px;
                }
                .conter_box_input3{
                    width:495px;
                    height: 120px;
                    textarea{
                        width: 99%;
                        height: 98%;
                    }
                }
                .ml{
                    margin-right:42px ;
                }
                .conter_box_name{
                    width:80px;
                    height: 34px;
                    line-height: 34px;
                    text-align: left;
                    font-size: 16px;
                    font-family: Microsoft YaHei;
                    font-weight: 400;
                    color: #333333;
                }
            }
        .user_conter_box2{
            height: 120px;
        }
        .user_conter_box3{
            height: 36px;
            position: absolute;
            bottom: 0;
        }
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
            margin-right:10px;
            text-align: center;
            user-select: none;
        }
        .green{
            background: #009688;
            color: #fff;
            margin-left: 200px;
        }
        .grey{
            background: #EEEEEE;
            color: #666;
        }
        }
}
</style>