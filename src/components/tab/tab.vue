<template>
  <div class="tab">
    <router-link class="tab-item" tag="div" to="/recommend">
      <span>推荐</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/rank">
      <span>排行</span>
    </router-link>
    <router-link class="tab-item" tag="div" to="/singer">
      <span>歌手</span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style lang="stylus" scoped >
.tab
  color #ddd
  display flex
  background-color #d44439
  .tab-item
    line-height 44px
    flex 1
    text-align center
    font-size 14px
  .router-link-active
    span
      color #fff
      padding-bottom 3px
      border-bottom 2px solid #f1f1f1
      font-weight 700
</style>
