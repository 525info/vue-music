<template>
   <div class="search-list-wrapper"> 
     <ul>
       <li class="search-list-item" v-for="(val, index) in searchHistory" :key="index" @click="select(val)">
         <span class="text">{{val}}</span>
         <span class="iconfont icon-guanbi" @click.stop="deleteOne(val)"></span>
       </li>
     </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  props: {
    searchHistory: {
      type: Array,
      default: []
    }
  },
  methods: {
    select(val){
      this.$emit('select',val)
    },
    deleteOne(val){
      this.$emit('delete',val)
    }
  },
}
</script>

<style scoped lang="stylus">
.search-list-item
  display flex
  font-size 14px
  height 30px
  overflow: hidden;
  .text
    flex 1

</style>