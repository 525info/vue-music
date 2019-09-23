<template>
  <div class="rank" ref="rank">
    <Scroll class="toplist">
      <ul>
        <li
          v-for="(item, index) in musicTopList"
          :key="item + index"
          class="item"
          @click="selectTopList(item)"
        >
          <div class="icon">
            <img v-lazy="item.coverImgUrl" width="100%" class="img" />
          </div>
          <ul class="songList">
            <li v-for="(song, index) in item.top" :key="index" class="song">
              <span>{{ index + 1 }}. </span>{{ song.name }} - {{ song.singer }}
            </li>
          </ul>
        </li>
      </ul>
    </Scroll>
    <router-view></router-view>
    <div class="loading-container" v-show="!musicTopList.length">
      <Loading />
    </div>
  </div>
</template>

<script>
import { getTopList } from "@/api/rank";
import Scroll from "@/base/scroll/scroll";
import { createTopListSong } from "@/common/js/song";
import {mapMutations} from 'vuex'
import { playlistMixin } from "@/common/js/mixin";
import Loading from '@/base/loading/loading'

const topListIdx = [3, 1, 2, 0, 4, 15, 17, 22,23];
export default {
  mixins: [playlistMixin],
  data() {
    return {
      musicTopList: []
    };
  },
  created() {
    this._getTopList();
  },
  components: {
    Scroll,
    Loading
  },
  methods: {
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    }),
    handlePlaylist(playlist){
      let bottom = playlist.length > 0 ? '60' : '';
      this.$refs.rank.style.bottom = bottom + 'px';
    },
    _getTopList() {
      for (let i = 0; i < topListIdx.length; i++) {
        getTopList(topListIdx[i]).then(res => {  
          let list = res.data.playlist;
          list.top = res.data.playlist.tracks.slice(0, 3);
          list.top = list.top.map(item=>{
            return createTopListSong(item)
          })
          this.musicTopList.push(list);
        });
      }
    },
    selectTopList(topList){
      this.$router.push({
        path: `/rank/${topList.id}`
      })
      this.setTopList(topList)
    }

  }
};
</script>

<style lang="stylus" scoped>
.rank
  position fixed
  width 100%
  top 88px
  bottom 0
  .toplist
    height 100%
    overflow hidden
  .item
    display flex
    box-sizing border-box
    padding 3px 0
    margin 0 10px
    border-bottom 1px solid #ddd
    .icon
      left 0 0 100px
      width 100px
      border-radius 5px
      .img
        border-radius 5px
    .songList
      display flex
      flex-direction column
      justify-content center
      padding 0 20px
      flex 1
      overflow hidden
      font-size 12px
      .song
        text-overflow ellipsis
        overflow hidden
        white-space nowrap
        line-height 30px
.loading-container
  position absolute
  top 50%
  transform translateY(-50%)
  width 100%
</style>