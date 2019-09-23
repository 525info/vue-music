<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" ref="scroll">
      <div class="scroll-content">
        <div class="bg"></div>
        <Banner />
        <div v-if="recommendSongList.length">
          <p class="title">推荐歌单</p>
          <ul class="recommendSongList">
            <li
              v-for="(item, index) in recommendSongList"
              :key="index + item"
              class="recSongListItem"
              @click="selectSongList(item)"
            >
              <div class="item-top">
                <img v-lazy="item.picUrl" width="100%" class="img" />
                <span class="playCount iconfont icon-erji">
                  {{ item.playCount | formatPlayCount(item.playCount) }}
                </span>
              </div>
              <p class="name">{{ item.name }}</p>
            </li>
          </ul>
        </div>
        <div v-if="recommendSong.length">
          <p class="title">推荐歌曲</p>
          <ul class="recommendSong">
            <li
              class="recSongItem"
              v-for="(item, index) in recommendSong"
              :key="index + item"
              @click="selectSong(item)"
            >
              <div class="item-top">
                <img v-lazy="item.img" width="100%" class="img" />
              </div>
              <p class="name">{{ item.name }}</p>
              <p class="singer">{{ item.singer }}</p>
            </li>
          </ul>
        </div>

        <div class="loading-container" v-show="!recommendSongList.length">
          <Loading />
        </div>
      </div>
    </scroll>

    <router-view></router-view>
  </div>
</template>

<script>
import Banner from "components/recommend/banner";
import { getRecommendSongList, getRecommendSong } from "@/api/recommend";
import { createRecommendSong } from "@/common/js/song";
import { mapMutations, mapActions } from "vuex";
import scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { playlistMixin } from "@/common/js/mixin";
export default {
  mixins: [playlistMixin],
  name: "Recommend",
  data() {
    return {
      banner: [],
      recommendSongList: [],
      recommendSong: []
    };
  },
  created() {
    // 获取推荐歌单
    this._getRecommendSongList();
    this._getRecommendSong();
    // this._initSwiper();
  },
  methods: {
    ...mapMutations({
      setSongList: "SET_SONG_LIST"
    }),
    ...mapActions(['selectPlay']),
    selectSong(item){
      let list = [item]
      this.selectPlay({
        list: list,
        index: 0
      })
    },
    selectSongList(item) {
      this.$router.push({
        path: `/recommend/${item.id}`
      });
      this.setSongList(item);
    },
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? "60" : "";
      this.$refs.recommend.style.bottom = bottom + "px";
      this.$refs.scroll.refresh();
    },
    _getRecommendSongList() {
      getRecommendSongList().then(res => {
        this.recommendSongList = res.data.result;
      });
    },
    _getRecommendSong() {
      getRecommendSong().then(res => {
        this.recommendSong = this._normalizeSongs(res.data.result);
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createRecommendSong(item));
      });
      ret.splice(9)
      return ret;
    },
    _initSwiper() {
      new Swiper(".swiper-container", {
        autoplay: true,
        loop: true, // 循环模式选项
        pagination: {
          el: ".swiper-pagination"
        }
      });
    }
  },
  components: {
    Banner,
    scroll,
    Loading
  },
  filters: {
    formatPlayCount(count) {
      if (count > 99999999) {
        return (count / 100000000).toFixed(2) + "亿";
      }
      if (count > 99999) {
        return Math.ceil(count / 10000) + "万";
      }
      return count;
    }
  }
};
</script>

<style lang="stylus" scoped>
.bg
  position absolute
  top -180px
  background-color #d44439
  height 280px
  width 100%
  z-index -10
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
.recommend-content
  position relative
  .swiper-container
    width 96%
    margin 0 auto
    border-radius 5px
    overflow hidden
  overflow hidden
  height 100%
  .title
    position relative
    margin 20px 0
    padding-left 9px
    font-size 17px
    color #4a4a4a
    &::after
      content ''
      position absolute
      left 0
      top 0
      height 100%
      width 2px
      background-color #d33a31
  .recommendSongList
    width 100%
    display flex
    flex-wrap wrap
    .recSongListItem
      width 33%
      padding 0 1%
      box-sizing border-box
      font-size 12px
      margin-bottom 10px
      .item-top
        position relative
        .img
          border-radius 5px
        .playCount
          position absolute
          top 5px
          right 8px
          color #ffffff
          font-size 11px
      .name
        margin 8px 0 8px
        font-size 12px
        line-height 1.2
        height 30px
        width 100%
        display -webkit-box
        -webkit-box-orient vertical
        -webkit-line-clamp 2
        overflow hidden
      &:nth-child(3n)
        margin-right 0.5%
      &:nth-child(3n-2)
        margin-left 0.5%
  .recommendSong
    width 100%
    display flex
    flex-wrap wrap
    .recSongItem
      width 33%
      padding 0 1%
      box-sizing border-box
      font-size 12px
      margin-bottom 10px
      .item-top
        .img
          border-radius 5px
      .name
        margin 8px 0 3px 0
        font-size 12px
        height 16px
        line-height 16px
        width 100%
        text-overflow ellipsis
        white-space nowrap
        overflow hidden
      .singer
        font-size 11px
        line-height 11px
        width 100%
        text-overflow ellipsis
        white-space nowrap
        overflow hidden
        color #757575
      &:nth-child(3n)
        margin-right 0.5%
      &:nth-child(3n-2)
        margin-left 0.5%
.loading-container
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
</style>
