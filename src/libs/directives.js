import Vue from 'vue';
//拖拽指令
Vue.directive("drag1", function (el) {
  var oDiv = el
  oDiv.onmousedown = function (ev) {
    var disX = ev.clientX - oDiv.offsetLeft;
    var disY = ev.clientY - oDiv.offsetTop;
    document.onmousemove = function (ev) {
      var l = ev.clientX - disX;
      var t = ev.clientY - disY;
      oDiv.style.left = l + 'px';
      oDiv.style.top = t + 'px';
    };
    document.onmouseup = function () {
      document.onmousemove = null;
      document.onmouseup = null;
    };

  }
});
//禁止拖拽
Vue.directive("stopdrag", function (el, binding, vnode) {
  let element = el;
  element.onmousedown = function (e) {
    e.stopPropagation()
  }
});