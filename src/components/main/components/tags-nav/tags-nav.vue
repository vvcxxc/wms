<template>
  <div class="tags-nav-li">
    <div class="btn-con left-btn">
      <el-button type="text" @click="handleScroll(240)">
        <i class="el-icon-arrow-left icon-size"></i>
      </el-button>
    </div>
    <div class="btn-con right-btn">
      <div class="right-btn-text">
      <el-button class="btn-style" type="text" @click="handleScroll(-240)">
        <i class="el-icon-arrow-right icon-size"></i>
      </el-button>
      <div class="right-btn-line"></div>
      </div>
    </div>
    <div class="btn-con close-tag">
      <el-button class="close-btn1" type="text" @click="closeTagList('other')">
        关闭其他
      </el-button>
      <el-button class="close-btn1" type="text" @click="closeTagList('all')" style="margin-left: 10px">
        关闭所有
      </el-button>
    </div>
    <div class="scroll-outer" ref="scrollOuter" @DOMMouseScroll="handlescroll" @mousewheel="handlescroll">
      <div ref="scrollBody" class="scroll-body" :style="{ left: tagBodyLeft + 'px' }">
        <el-tag v-for="(item, index) in tagList" :key="index" class="tag-li" closable type="info" :class="{ active: item.isActive }" @click="skipTag(item, index)" @close="closeTag(item, index)">
         <p class="tag-title"> {{ item.query.id }}</p>
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
import "./tags-nav.less";
export default {
  props: {
    tagList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      tagBodyLeft: 0,
    };
  },

  methods: {
    //关闭所有标签
    closeTagList(val) {
      this.$emit("close-tag-list", val);
    },
    //关闭标签
    closeTag(item, index) {
      let num = "";
      this.tagList.splice(index, 1);
      if (item.isActive) {
        if (index == 0) {
          num = index;
          if (this.tagList.length > 0) {
            this.$emit("skip-tag", this.tagList[num].index, "");
          } else {
            this.$emit("skip-tag", "", "");
          }
        } else {
          num = index - 1;
          this.$emit("skip-tag", this.tagList[num].index, "");
        }

      }
    },
    //标签跳转
    skipTag(item, index) {
      this.$emit("skip-tag", item.index, "");
    },
    handlescroll(e) {
      var type = e.type;
      let delta = 0;
      if (type === "DOMMouseScroll" || type === "mousewheel") {
        delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40;
      }
      this.handleScroll(delta);
    },
    handleScroll(offset) {
     
      const outerWidth = this.$refs.scrollOuter.offsetWidth;
      // const bodyWidth = this.$refs.scrollBody.offsetWidth;
      const bodyWidth = this.tagList.length*120;
      // console.log(outerWidth)
      // console.log(bodyWidth)
      if (offset > 0) {
        this.tagBodyLeft = Math.min(0, this.tagBodyLeft + offset);
      } else {
        if (outerWidth < bodyWidth) {
          if (this.tagBodyLeft < -(bodyWidth - outerWidth)) {
            this.tagBodyLeft = this.tagBodyLeft;
          } else {
            this.tagBodyLeft = Math.max(
              this.tagBodyLeft + offset,
              outerWidth - bodyWidth
            );
          }
        } else {
          this.tagBodyLeft = 0;
        }
      }
    },
  },
};
</script>

<style>
</style>
