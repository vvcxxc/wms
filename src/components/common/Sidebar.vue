<!--
 * @Description: 菜单栏页面（组件）
 * @Date: 2020-08-12 11:39:53
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-12-18 13:43:58
-->
<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :collapse="collapse"
      background-color="#20222A"
      text-color="rgba(255,255,255,.7)"
      :unique-opened="true"
      :router="true"
      :default-openeds="[menuNum]"
    >
      <template v-for="(item,index) in items">
      
        <template v-if="item.ChildrenPage">
          <el-submenu  :class="item.ChildrenPage.length>0?'':'iconaa'" @click.native="aa('1',item,$event)" :index="item.open" :key="index">
            <template style="padding-left:50px;position:relative" slot="title">
              <i style="position:absolute;top:19px;left:10px;z-index:2" :class="item.icon"></i>
              <span class="iName" style="padding-left:28px" slot="title">{{item.title}}</span>
              <div class="is-ac2"></div>
            </template>
            <template v-for="(subItem,ind) in item.ChildrenPage">
              <el-submenu v-if="subItem.ChildrenPage" @click.native="aa('1',subItem,$event)" :index="item.index" :key="ind">
                <template slot="title"><span class="iName" style="padding-left:20px !important">{{ subItem.title}}</span><div class="is-ac2"></div></template>
                
                <el-menu-item
                  v-for="(threeItem,i) in subItem.ChildrenPage"
                  :key="i"
                  @click.native="aa('2',threeItem,$event)"
                  :index="threeItem.index"
                >{{ threeItem.title }}
                <div class="is-ac2"></div>
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else @click.native="aa('3',subItem,$event)" :index="subItem.index" :key="ind">
                {{ subItem.title }}
                <div class="is-ac2"></div>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item @click.native="aa('4',item,$event)" :index="item.open" :key="index">
            <i :class="item.icon"></i>
            <span class="iName" slot="title">{{ item.title }}</span>
            <div class="is-ac2"></div>
          </el-menu-item>
        </template>
      </template>
    </el-menu>

  </div>
</template>

<script>
import bus from "../common/bus";

export default {
  data() {
    return {
      collapse: false,
      items: [],
      menuNum:''
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace("/", "");
    }
  },
  created() {
    this.init()
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on("collapse", msg => {
      this.collapse = msg;
    });

  },
  methods: {
    //默认展示路由第一个
    initChildren(data){
        if(data[0].ChildrenPage.length != 0){
           this.initChildren(data[0].ChildrenPage)
        }else{
          console.log('跳转页面',data)
          this.$router.push({path:`/${data[0].index}`,query: {id:`${data[0].title}`,name:`${data[0].Page_ID}`}})
        }
    },
    //处理数据
     ChildrenPage(data){
         data.forEach( (item)=> {
                item.index = item.RouteIndex==null?`${item.PageText}`:item.RouteIndex
                item.icon = 'el-icon-star-off'
                item.title = item.PageText
                if(item.ChildrenPage.length != 0){
                  this.ChildrenPage(item.ChildrenPage)
                }
        })
     },
    init(){
      //菜单信息
      var $this = this
        // var url1 = `${this.$store.state.dailog.url1}/AuthorizeManage/Base_Authorize/GetPageData`
        var url1 = `${this.$store.state.dailog.url1}/api/wms/page/menu`
            $this.$axios({
                method: 'get',
                url: url1,
            }).then(res => {
              var data1 = res.data.resultdata
              console.log("data1",data1);
              var data = data1
              $this.ChildrenPage(data)
              $this.powerFun(data)
              console.log(document.querySelectorAll('.el-submenu__title'))
              if(data.length != 0){
                $this.items = data
                $this.$store.state.dailog.AutorizedPageList = data
                // this.initChildren(this.items)  //默认展示路由第一个
                //默认展示工作空间页面
                for(let i=0;i<$this.items.length;i++){
                  $this.items[i].open = JSON.stringify(i)
                 if($this.items[i].ChildrenPage.length){
                   for(let f=0;f<$this.items[i].ChildrenPage.length;f++){
                       $this.items[i].ChildrenPage[f].open = JSON.stringify(i)
                   }
                 }
                  if($this.items[i].title == '工作空间'){
                    $this.$store.state.dailog.rouerName = $this.items[i].title
                    $this.$store.state.dailog.rouerId = $this.items[i].Page_ID
                    $this.$router.push({path:`/${$this.items[i].index}`,query: {id:`${$this.items[i].title}`,name:`${$this.items[i].Page_ID}`,type:'1'}})
                    $this.menuNum = JSON.stringify($this.items[i].open)
                  }
                }
              }else{
                    $this.$router.push({path:`/404}`})
              } 
              
              //初始化激活高亮工作空间
              let routerName = '工作空间'
              this.setActive(routerName)
              // this.$nextTick(()=>{
              //   var dom = document.querySelectorAll('.el-submenu__title')
              //   for(let i=0;i<dom.length;i++){
              //     var name = dom[i].getElementsByClassName('iName')[0].innerHTML
              //     if(name == '工作空间'){
              //       dom[i].classList.add('is-active')
              //       dom[i].childNodes[2].classList.add('is-active2')
              //       dom[i].childNodes[0].classList.add('icontext')
              //     }
              //   }
              // })
            }).catch((err)=>{
              console.log('菜单报错',err)
              localStorage.removeItem("ms_username");
              this.$router.push("/login");
            })
    },
    //初始化激活高亮工作空间以及点击tag激活侧边栏对应地址
    setActive (routerName) {
      this.$nextTick(()=>{
        var dom = document.querySelectorAll('.el-submenu__title')
        for(let i=0;i<dom.length;i++){
          var name = dom[i].getElementsByClassName('iName')[0].innerHTML
           if (dom[i].getAttribute("class").indexOf('is-active')) {
              dom[i].classList.remove('is-active')
            }
            if (dom[i].childNodes[1].getAttribute("class").indexOf('is-active2')) {
              dom[i].childNodes[1].classList.remove('is-active2')
            }
            if (dom[i].childNodes[2].getAttribute("class").indexOf('is-active2')) {
              dom[i].childNodes[2].classList.remove('is-active2')
            }
            if (dom[i].childNodes[0].getAttribute("class").indexOf('icontext')) {
              dom[i].childNodes[0].classList.remove('icontext')
            }
          if(name == routerName){
            dom[i].classList.add('is-active')
            dom[i].childNodes[2].classList.add('is-active2')
            dom[i].childNodes[0].classList.add('icontext')
          }
        }
      })
    },
    //数据筛选要展示的数据
    powerFun(data){
      for(let i=0;i<data.length;i++){
        if(data[i].ChildrenPage.length != 0){
               if(data[i].IsBrowse == 'N'){
                  data.splice(i,1)
                  i--
               }else{
                 this.powerFun(data[i].ChildrenPage)
               }
        }else{
           if(data[i].IsBrowse == 'N'){
             data.splice(i,1)
             i--
           }
        }
      }
    },
  
    //点击跳转页面
    aa(data,item,e){
      // //导航栏激活
      if (item.parentID != '0') { //判断为根节点时不对样式进行处理
        var aa = document.querySelectorAll('.el-submenu__title')     //背景颜色
        var bb = document.querySelectorAll('.is-ac2')                //文本颜色
        var cc = document.querySelectorAll('.icontext')              //icon颜色
        //颜色初始化
        for(let i1=0;i1<bb.length;i1++){
          bb[i1].classList.remove("is-active2")
        }
        for(let i=0;i<aa.length;i++){
          aa[i].classList.remove("is-active")
          aa[i].childNodes[2].classList.remove('is-active2')
        }
        for(let i2=0;i2<cc.length;i2++){
          cc[i2].classList.remove("icontext")
        }

        var name = e.target.getAttribute('class')
        // //点击激活
        this.$nextTick(() => {
          if(name == 'el-submenu__title'){    //点击背景
          e.target.classList.add('is-active')
          if(e.target.childNodes[2].getAttribute('class') == 'is-ac2'){
            e.target.childNodes[2].classList.add('is-active2')
            e.target.childNodes[0].classList.add('icontext')
          }else{
            e.target.childNodes[1].classList.add('is-active2')
          }
        }
        else if(name == 'iName'){          //点击文字
          e.target.parentNode.classList.add('is-active')
          e.target.nextElementSibling.classList.add('is-active2')
          if(e.target.previousSibling){
              e.target.previousSibling.classList.add('icontext')
          }
        }
        else if(name == 'el-icon-star-off'){     //点击icon
          e.target.parentNode.classList.add('is-active')
          e.target.nextElementSibling.nextElementSibling.classList.add('is-active2')
          e.target.classList.add('icontext')
        }
        })
      }
     //跳转页面（index不能为中文）
     var obj = item.index
     var is = true
      if(/.*[\u4e00-\u9fa5]+.*$/.test(obj)) { 
        is = false
      } 
      if(is){
        if(this.$route.query.id != item.title){
             this.$store.state.dailog.AutorizedBtnList = item.ButtonList  //保存按钮权限到vuex
            if(item.IsBrowse == 'N'){
              var txt = `该用户没有【${item.PageText}】权限`
               this.$parent.openFun(txt)
            }else{
              console.log('跳转页面',item)
              if(item.index == 'customTable'){
                this.$router.push({path:`/${item.index}`,query: {id:`${item.title}`,name:`${item.Page_ID}`,type:'1',tableID:`${item.TableID}`}})
              }else{
                this.$router.push({path:`/${item.index}`,query: {id:`${item.title}`,name:`${item.Page_ID}`,type:'1'}})
              }
            }
          }
      }
    }
  },

};
</script>
<style lang="less">
// .sidebar{
    .sidebar .el-menu-item:hover{
      background: #D1FAF7 !important;
      color:#29A095 !important;
    }
    .el-submenu__title:hover{
      background: #D1FAF7 !important;
      color:#29A095 !important;
    }
    .el-menu--vertical:hover{
      background: #D1FAF7 !important;
      color:#29A095 !important;
    }
    .sidebar .el-submenu__title:hover {
      background: #D1FAF7 !important;
      color:#29A095 !important;
    }
    .is-active {
      background: #D1FAF7 !important;
      color:#29A095 !important;
      overflow: hidden;
    }
    .icontext{
      color:#29A095 !important;
    }
    .is-active2{
      display: block;
      width: 9px;
      height: 66px;
      background:#009688;
      position: absolute;
      left: 0;
      top:0;

    }
    .iconaa .el-submenu__icon-arrow{
      display: none;
    }
// }
</style>

<style lang="less" scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  // top:7.2%;
  top:0;
  bottom: 0;
  overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
