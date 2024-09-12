<!--
 * @Description: 这是外部链接页面（组件）
 * @Date: 2020-09-07 18:12:01
 * @Author: Tao
 * @LastEditors: Tao
 * @LastEditTime: 2020-12-29 11:28:03
-->
<template>
<div>
    <Card style="width:700px;height:500px" shadow>
        <div style="min-height: 500px;width: 100%;">
            <iframe 
              id="iframeId" :src="url" frameborder="0" class="pc iframe"  scrolling="auto">
            </iframe>
        </div>
    </Card>
</div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      url: 'http://192.168.1.182:8806/',
    }
  },
  mounted () {
    this.stopF5Refresh()
  },
  methods: {
    init(){
        console.log('页面初始化')
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
<style lang='less'>
.iframe {
    position: absolute;
    left: 1%;
    right: 0;
    top: 64px;
    bottom: 0;
    width: 98%;
    height: 91%;
    background: #fff;
    overflow-y: hidden;
}
</style>