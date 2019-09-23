<template>
  <ul>
    <li
      v-for="(song, index) in songs"
      :key="index"
      class="item"
      @click="selectItem(song, index)"
    >
      <p class="ranking">{{ index + 1 }}</p>
      <div class="content">
        <p class="name">{{ song.name }}</p>
        <p class="desc">{{ getDesc(song) }}</p>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer} - ${song.album}`;
    },
    selectItem(item,index){
      this.$emit('select', item, index)
    }
  }
};
</script>

<style scoped lang='stylus'>
.item
  width 100%
  position relative
  display flex
  align-items center
  height 60px
  border-bottom 1px solid #e4e4e4
  color #757575
  box-sizing border-box
  .ranking
    flex 0 0 50px
    width 50px
    text-align center
  .content
    flex 1
    line-height 20px
    overflow hidden
    .name
      margin-top 4px
      width 80%
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      color #2e3030
      font-size 16px
    .desc
      font-size 12px
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      width 80%
</style>