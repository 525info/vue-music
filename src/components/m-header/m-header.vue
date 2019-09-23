<template>
  <div class="header">
    <router-link tag="div" class="user" to='/user'>
      <span class="iconfont icon-caidan1" ></span>
    </router-link>
    MUSIC
    <router-link tag="div" class="search" to='/search'>
      <span class="iconfont icon-sousuo"></span>
    </router-link>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang="stylus">

.header
  position relative
  width 100%
  height 44px
  line-height 44px
  font-size 20px
  color #f1f1f1
  letter-spacing 3px
  background-color #d44439
  text-align center
  .user
    position absolute
    top 0
    left -1px
    padding 0 10px
    span 
      font-size 20px!important
  .search
    position absolute
    top 0
    right -1px
    padding 0 5px 0 10px
    span 
      font-size 28px
</style>
