<!--
 * @Description: 这是图片页面（组件）
 * @Date: 2020-09-04 10:13:07
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2021-01-18 13:54:39
-->
<template>
    <div class="upImg_box">
        <div  v-drag class="head">{{typeTitle}}图片
           <div @click="cancelFun()" class="headImg"></div>
        </div>
        <div class="upImg_conten">
          <el-upload
            :disabled="isDisabled"
            :action="url"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            :on-change="handleChange"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :limit="3"
            :file-list="fileList"
            >
            <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return{
            dialogImageUrl: '',
            dialogVisible: false,
            url:'',
            imgId:'',
            typeTitle:'',
            isDisabled:true,//图片是否禁止操作
            fileList: []
        }      
    },
    directives: {
            drag: function(el) {
                let dragBox = el; //获取当前元素
                dragBox.onmousedown = e => {
                let box = document.querySelector('.upImg_box')
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
        props:['data','imgType'],
        created(){
            this.init()
            
        },
        methods:{
            init(){
                //4为新增图片 5为查看图片
                this.imgId = this.data[0].ID
                if(this.imgType == '4'){
                    this.$nextTick(()=>{
                        this.isDisabled = false
                        document.querySelector('.el-upload--picture-card').style.display = 'inline-block' 
                        this.url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Material/UploadImg?id=${this.imgId}`
                        this.typeTitle = '添加'
                    })
                }else{
                    this.$nextTick(()=>{
                        this.isDisabled = true
                        document.querySelector('.el-upload--picture-card').style.display = 'none'
                        this.typeTitle = '查看'
                    })
                }
               
                var url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Material/GetImg?id=${this.imgId}`
                this.$axios({       
                    method: 'get',
                    url: url,
                }).then(res => {
                    var data= JSON.parse(res.data.resultdata)
                    this.fileList = []
                    for(let i=0;i<data.length;i++){
                        if(data[i].length != 0){
                            var name = data[i].slice(5)
                            var value = {
                                name:name,
                                url: data[i]
                            }
                            this.fileList.push(value)
                        }
                    }
                    if(this.fileList.length >= 3){
                        document.querySelector('.el-upload--picture-card').style.display = 'none'
                    }
                })
             
             
            },
            //删除图片回调
            handleRemove(file, fileList) {
                if(fileList.length == 3){
                        document.querySelector('.el-upload--picture-card').style.display = 'none' 
                    }else{
                        document.querySelector('.el-upload--picture-card').style.display = 'inline-block' 
                }
                var url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Material/DeleteImg?id=${this.imgId}&filename=${file.name}`
                this.$axios({       
                    method: 'post',
                    url: url,
                }).then(res => {
                       console.log('getdelete==>',res)
                })
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            //上传成功的回调
            handleAvatarSuccess(res, file) {
                console.log('成功',res,file)
            },
            //上传前的回调
            beforeAvatarUpload(file) {
                this.url = `${this.$store.state.dailog.url1}/WMSBusinessManage/WMS_Material/UploadImg?id=${this.imgId}`
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 10     //这里做文件大小限制
                if (!isJPG && !isPNG)  {
                this.$message.error('上传头像图片只能是 JPG/NPG 格式!');
                }
                if(!isLt2M){
                    this.$message.error('图片不超过10M!');
                }
               
                return   isJPG || isPNG || isLt2M;
            },
            //值变化的回调
            handleChange(files,fileList){
                    if(fileList.length == 3){
                        document.querySelector('.el-upload--picture-card').style.display = 'none' 
                    }else{
                        document.querySelector('.el-upload--picture-card').style.display = 'inline-block' 
                    }
            },
                handleExceed(files, fileList) {
                    this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                },
            
            //关闭弹窗
            cancelFun(){
                this.$parent.cancelFun()
            }
        }
}
</script>
<style lang="less">
.upImg_box{
        .el-upload--text{
            width:84px;
            height: 35px;
        }
}
.avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
</style>
<style lang="less" scoped>
    .upImg_box{
        width:500px;
        height:400px;
        background:rgba(238,238,238,1);
        box-shadow:-7px 7px 50px 0px rgba(51,51,51,0.5);
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0;
        bottom: 0;
        margin:auto;
        z-index: 10;
        .head{
            position: relative;
            line-height: 60px;
            text-align: center;
            width:500px;
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
        .upImg_conten{
            width: 100%;
            height: 340px;
            padding:15px;
            box-sizing: border-box;
        }
    }

</style>