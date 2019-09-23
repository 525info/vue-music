<template>
  <transition name="slide">
    <div class="music-list">
      <div class="music-list-header" ref="header">
        <div class="back iconfont icon-fanhui" @click="back"></div>
        <span class="title">{{ headerTitle }}</span>
      </div>

      <Scroll
        :data="songs"
        class="list"
        @scroll="scroll"
        :probe-type="probeType"
        :listen-scroll="listenScroll"
        ref="list"
      >
        <div class="song-list-wrap">
          <div class="bg-img" :style="bgStyle" ref="bgImg">
            <div class="filter"></div>
            <div class="singerName">{{ title }}</div>
          </div>
          <div class="song-wrapper">
            <div class="sequence-play" @click="sequence" v-show="songs.length">
              <span class="iconfont icon-icon-test1 icon"></span>
              <div>
                播放全部
                <span class="text"> (共{{ this.songs.length }}首) </span>
              </div>
            </div>
            <song-list :songs="songs" @select="selectItem" />
          </div>
        </div>
        <div class="loading-container" v-show="!songs.length">
          <Loading />
        </div>
      </Scroll>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import SongList from "@/base/song-list/song-list";
import Loading from "@/base/loading/loading";
import { mapActions, mapGetters } from "vuex";
import { playlistMixin } from "@/common/js/mixin";
import { createSong } from "@/common/js/song";
const RESERVED_HEIGHT = 44;

export default {
  mixins: [playlistMixin],
  data() {
    return {
      songs: [],
      headerTitle: "排行榜",
      scrollY: 0
    };
  },
  components: {
    Scroll,
    SongList,
    Loading
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.topList.coverImgUrl})`;
    },
    // vuex 保存的当前排行榜信息
    ...mapGetters(["topList"]),
    title() {
      return this.topList.name;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImg.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT;
  },
  created() {
    if(!this.topList.id){
        this.$router.push('/rank')
        return
    }
    this.probeType = 3;
    this.listenScroll = true;
    this._normalizeSongs(this.topList.tracks);
  },
  methods: {
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? "60" : "";
      this.$refs.list.$el.style.bottom = bottom + "px";
    },
    sequence() {
      this.sequencePlay({
        list: this.songs,
        index: 0
      });
    },
    back() {
      this.$router.back();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },
    ...mapActions(["selectPlay", "sequencePlay"]),
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        ret.push(createSong(item));
      });
      this.songs = ret;
    }
  },
  watch: {
    scrollY(newY) {
      const percent = Math.abs(newY / this.imageHeight);
      if (newY < this.minTranslateY + RESERVED_HEIGHT - 20) {
        this.headerTitle = this.title;
      } else {
        this.headerTitle = "排行榜";
      }
      if (newY < 0) {
        this.$refs.header.style.background = `rgba(212, 68, 57, ${percent})`;
      } else {
        this.$refs.header.style.background = `rgba(212, 68, 57, 0)`;
      }
    }
  }
};
</script>

<style scoped lang="stylus">
.slide-enter-active, .slide-leave-active
  transition all .4s 
.slide-enter, .slide-leave-to
  transform translateX(50%)
  opacity 0

.music-list
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 110
  .music-list-header
    position fixed
    top 0
    width 100%
    height 44px
    line-height 44px
    color #fff
    z-index 100
    .back
      position absolute
      top 0
      left 0
      padding-left 5px
      width 25px
    .title
      position absolute
      left 33px
      line-height 44px
      font-size 16px
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background #f2f3f4
    .bg-img
      position relative
      width 100%
      padding-top 75%
      transform-origin top
      background-size cover
      background-position 0 30%
      top 0
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background #000
        opacity 0.2
      .singerName
        position absolute
        bottom 40px
        left 20px
        color #fff
        font-size 17px
        font-weight bolder
    .song-wrapper
      padding-top 41px
      border-radius 10px
      position relative
      top -20px
      bottom 20px
      background #f2f3f4
      .sequence-play
        position absolute
        top 0
        display flex
        align-items center
        width 100%
        height 40px
        border-bottom 1px solid #e4e4e4
        .icon
          width 50px
          text-align center
        .text
          color #757575
          font-size 13px
.loading-container
  position absolute
  top 50%
  width 100%
  transform translateY(-50%)
</style> 
