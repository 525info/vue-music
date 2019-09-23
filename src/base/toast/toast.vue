<template>
  <transition name="toast">
    <div class="toast" ref="toast" v-if="isShow">
      <div class="toast-wrapper">
        <div class="content">{{ content }}</div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    content: {
      type: String,
      default: "请输入你的内容"
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  updated() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.isShow = false;
    }, 2600);
  },
  methods: {
    show() {
      this.isShow = true;
    }
  }
};
</script>
<style lang="stylus" scoped>
.toast-enter-active, .toast-leave-active
  transition opacity .4s
  opacity 1
.toast-enter, .toast-leave-to
  opacity 0
.toast
  position fixed
  left 50%
  bottom 120px
  z-index 300
  transform translateX(-50%)
  color #f1f1f1
  text-align center
  pointer-events none
  margin 0 auto
  .toast-wrapper
    height 100%
    padding 15px
    background-color rgba(0, 0, 0, 0.2)
    border-radius 15px
    font-size 14px
</style>