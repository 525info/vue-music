<template>
  <transition name="confirm">
    <div class="confirm" v-show="isShow" @click.stop>
      <div class="confirm-warpper">
        <div class="confirm-content">
          <p class="title">{{ title }}</p>
          <div class="operate">
            <div class="left" @click="cancle">{{ cancleBtnText }}</div>
            <div class="right" @click="confirm">{{ confirmBtnText }}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "我是标题"
    },
    confirmBtnText: {
      type: String,
      default: "确认"
    },
    cancleBtnText: {
      type: String,
      default: "取消"
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    },
    cancle() {
      this.hide();
      this.$emit("cancle");
    },
    confirm() {
      this.hide();
      this.$emit("confirm");
    }
  }
};
</script>

<style scoped lang="stylus">
.confirm-enter-active
  animation confirm-fade 0.3s
  .confirm-content
    animation confirm-zoom 0.4s
@keyframes confirm-zoom
  0%
    transform scale(0)
  50%
    transform scale(1.1)
  100%
    transform scale(1)
@keyframes confirm-fade
  0%
    opacity 0
  100%
    opacity 1
.confirm
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color rgba(0, 0, 0, 0.2)
  .confirm-warpper
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    .confirm-content
      width 270px
      border-radius 10px
      background-color #fff
      text-align center
      .title
        padding 15px 20px
      .operate
        display flex
        align-items center
        .left, .right
          flex 1
          padding 15px 0
          color #d44439
</style>