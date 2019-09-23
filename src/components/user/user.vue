<template>
  <div class="user" ref="user">
    <div class="back" @click="back">
      <span class="iconfont icon-fanhui"></span>
    </div>
    <div class="header-wrapper">
      <div class="header">
        <div
          class="header-item"
          :class="{active: currentShow === 'favorite'}"
          @click="showFavorite"
        >我的收藏</div>
        <div
          class="header-item"
          :class="{active: currentShow === 'recent'}"
          @click="showRecent"
        >最近播放</div>
      </div>
    </div>
    <div class="sequence-play" @click="sequence">
      <span class="iconfont icon-icon-test1 icon"></span>
      <span>播放全部</span>
      <span class="length">(共{{length}}首)</span>
    </div>
    <scroll class="scroll">
      <div class="list">
        <ul>
          <li
            v-for="(item,index) in showData"
            :key="item+index"
            class="list-item"
            @click="selectItem(item)"
          >
            <span class="num">{{index + 1}}</span>
            <div class="content">
              <p class="song">{{item.name}}</p>
              <p class="singer">{{item.singer}}</p>
            </div>
          </li>
        </ul>
      </div>
    </scroll>

    <div class="no-result" v-show="showNoResult">
      <div>
        <span class="iconfont icon-yinle icon"></span>
      </div>
      <div>去发现更多好听的MUSIC吧~</div>
    </div>
  </div>
</template>


<script>
import { mapGetters, mapActions } from "vuex";
import { playlistMixin } from "@/common/js/mixin";
import Scroll from "@/base/scroll/scroll";
export default {
  mixins: [playlistMixin],
  computed: {
    ...mapGetters(["favoriteSong", "recentPlay"]),
    length() {
      if (this.currentShow === "favorite") {
        return this.favoriteSong.length;
      } else {
        return this.recentPlay.length;
      }
    },
    showData() {
      if (this.currentShow === "favorite") {
        return this.favoriteSong;
      } else {
        return this.recentPlay;
      }
    },
    showNoResult() {
      if (this.currentShow === "favorite" && this.favoriteSong.length === 0) {
        return true;
      }
      if (this.currentShow === "recent" && this.recentPlay.length === 0) {
        return true;
      }
      return false;
    }
  },
  data() {
    return {
      currentShow: "favorite"
    };
  },
  methods: {
    ...mapActions(["insertSong", "sequencePlay"]),
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? "60" : "";
      this.$refs.user.style.bottom = bottom + "px";
    },
    showFavorite() {
      this.currentShow = "favorite";
    },
    showRecent() {
      this.currentShow = "recent";
    },

    back() {
      this.$router.back();
    },
    sequence() {
      let list = null
      if(this.currentShow === 'favorite'){
        list = this.favoriteSong
      }else{
        list = this.recentPlay
      }
      this.sequencePlay({
        list: list,
        index: 0
      });
    },
    selectItem(item) {
      this.insertSong(item);
    }
  },
  components: {
    Scroll
  }
};
</script>
<style lang="stylus" scoped>
.user
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background-color #f1f1f1
  .back
    position absolute
    top 0
    left 0
    padding 10px 10px
    span
      font-size 24px
      color #fff
  .header-wrapper
    height 44px
    background-color #d44439
    .header
      height 100%
      display flex
      align-items center
      text-align center
      position relative
      width 240px
      margin 0 auto
      .header-item
        color #f1f1f1
        flex 1
        margin 0 20px
        padding 5px
      .active
        border-bottom 2px solid #eee
  .sequence-play
    width 100%
    display flex
    align-items center
    position absolute
    top 44px
    height 40px
    border-bottom 1px solid #e6e6e6
    box-sizing border-box
    .icon
      flex 0 0 50px
      width 50px
      font-size 20px
      text-align center
    .length
      font-size 14px
      color #757575
      margin-left 3px
  .list
    .list-item
      display flex
      align-items center
      height 60px
      border-bottom 0.5px solid #e6e6e6
      .num
        width 50px
        flex 0 0 50px
        text-align center
      .content
        flex 1
        overflow hidden
        .song
          white-space nowrap
          text-overflow ellipsis
          overflow hidden
          padding 5px 0
        .singer
          white-space nowrap
          text-overflow ellipsis
          overflow hidden
          font-size 14px
          color #757575
  .no-result
    width 250px
    position absolute
    top 50%
    left 50%
    transform translate(-50%, -50%)
    font-size 14px
    color #757575
    text-align center
    .icon
      display inline-block
      margin-bottom 20px
      font-size 70px
      color #dbdbdb
.scroll
  width 100%
  position absolute
  top 84px
  left 0
  right 0
  bottom 0
  overflow hidden
</style>