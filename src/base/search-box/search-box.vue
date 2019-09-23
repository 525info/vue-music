<template>
  <div class="search-box">
    <input type="text" class="box" :placeholder="placeholder" v-model="query" autofocus="autofocus"/>
    <span class="iconfont icon-delete clear" v-show="query.length" @click="clear"></span>
  </div>
</template>

<script>
import {debounce} from '@/common/js/util';
export default {
  props: {
    placeholder: {
      type: String,
      default: '搜一下吧...'
    }
  },
  data(){
    return{
      query: ''
    }
  },
  created() {
    this.$watch('query',debounce((newQuery)=>{
      this.$emit('query',newQuery)
    }, 300))
  },
  methods: {
    clear(){
      this.query = ''
    },
    setQuery(query){
      this.query = query
    }
  },
};
</script>

<style scoped lang="stylus">
.search-box
  display flex
  align-items center
  box-sizing border-box
  width 100%
  height 24px
  border-bottom 1px solid rgba(235, 235, 235,.8)
  .box
    flex 1
    line-height 2px
    background #d44439
    color #fff
    font-size 14px
    border none
    outline none
    padding-left 5px
    &::placeholder
      color rgba(255, 255, 255, 0.6)
  .clear
    position absolute
    right 12px
    font-size 18px
    color rgba(255, 255, 255, 0.8)
</style>
