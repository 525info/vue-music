<template>
  <transition name="list-wrapper">
    <div class="playlist" v-show="showList" @click="closeList">
      <div class="playlist-wrapper" @click.stop>
        <div class="playlist-header">
          <div class="text" @click="changeMode">
            <span class="iconfont" :class="iconMode"></span>
            <span>{{ modeText }}</span>
            <span class="count">({{ sequenceList.length }})</span>
          </div>
          <div class="header-right">
            <span
              class="iconfont icon-iconfontshanchu icon"
              @click="showConfirm"
            ></span>
          </div>
        </div>
        <Scroll class="playlist-content" ref="scroll">
          <transition-group name="list-item" tag="ul">
            <li
              class="playlist-item"
              v-for="(item, index) in sequenceList"
              :key="item.id"
              @click="selectItem(item, index)"
              ref="listItem"
            >
              <span :class="getCurrentIcon(item)"></span>
              <span class="text">{{ item.name }}</span>
              <span
                class="iconfont icon-guanbi icon"
                @click.stop="deleteOneSong(item)"
              ></span>
            </li>
          </transition-group>
        </Scroll>
        <div class="list-close" @click="closeList"><span>关闭</span></div>
      </div>
      <confirm
        ref="confirm"
        title="确定要清空播放列表？"
        @confirm="confirmClear"
      ></confirm>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";
import Confirm from "@/base/confirm/confirm";
export default {
  components: {
    Scroll,
    Confirm
  },
  computed: {
    ...mapGetters([
      "sequenceList",
      "currentSong",
      "currentIndex",
      "playlist",
      "mode"
    ]),
    modeText() {
      return this.mode === playMode.sequence
        ? "顺序播放"
        : this.mode === playMode.random
        ? "随机播放"
        : "单曲循环";
    },
    iconMode() {
      if (this.mode === playMode.sequence) {
        return "icon-xunhuanbofang";
      } else if (this.mode === playMode.loop) {
        return "icon-danquxunhuan";
      } else {
        return "icon-suijibofang";
      }
    }
  },
  data() {
    return {
      showList: false
    };
  },
  methods: {
    ...mapMutations({
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayState: "SET_PLAYING_STATE",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST"
    }),
    ...mapActions(["deleteSong", "deleteSongList"]),
    showConfirm() {
      this.$refs.confirm.show();
    },
    closeList() {
      this.showList = false;
    },
    show() {
      this.showList = true;
      setTimeout(() => {
        this.scrollToCurrent(this.currentSong);
      }, 20);
    },
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this.resetCurrentIndex(list);
      this.setPlayList(list);
    },
    resetCurrentIndex(list) {
      let index = list.findIndex(item => {
        // 返回 index
        return item.id === this.currentSong.id;
      });
      this.setCurrentIndex(index);
    },
    getCurrentIcon(item) {
      if (this.currentSong.id === item.id) {
        return "iconfont icon-volumeup nowPlay";
      }
      return "";
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        // 找到需要播放的歌曲在播放顺序里面的索引
        index = this.playlist.findIndex(song => {
          return song.id === item.id;
        });
      }
      this.setPlayState(true);
      this.setCurrentIndex(index);
    },
    deleteOneSong(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.closeList();
        this.$emit("stopMusic");
      }
    },
    deleteSonglist() {
      this.deleteSongList();
      this.closeList();
      this.$emit("stopMusic");
    },
    confirmClear() {
      this.deleteSonglist();
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex(song => {
        return current.id === song.id;
      });
      this.$refs.scroll.scrollToElement(this.$refs.listItem[index], 300);
    }
  }
};
</script>

<style scoped lang="stylus">
&.list-item-enter-active, &.list-item-leave-active
  transition all 0.1s
&.list-item-enter, &.list-item-leave-to
  height 0
.list-wrapper-enter-active, .list-wrapper-leave-active
  transition opacity 0.3s
  .playlist-wrapper
    transition all 0.3s
.list-wrapper-enter, .list-wrapper-leave-to
  opacity 0
  .playlist-wrapper
    transform translate3d(0, 100%, 0)
.playlist
  position fixed
  top 0
  bottom 0
  width 100%
  z-index 200
  background-color rgba(0, 0, 0, 0.2)
  .playlist-wrapper
    border-radius 8px
    position absolute
    left 0
    bottom 0
    width 100%
    background-color #f2f3f4
    .playlist-header
      height 50px
      padding 0 25px 0 20px
      box-sizing border-box
      border-bottom 0.2px solid #e7e7e7
      display flex
      align-items center
      .text
        flex 1
        .count
          font-size 14px
      .header-right
        flex 1
        text-align right
        .icon
          padding 5px
    .playlist-content
      max-height 240px
      overflow hidden
      .playlist-item
        height 40px
        padding 0 25px 0 20px
        font-size 14px
        display flex
        align-items center
        .nowPlay
          color #d44439
          margin-right 3px
          font-size 18px
        .text
          text-overflow ellipsis
          overflow hidden
          white-space nowrap
          flex 1
          line-height 20px
        .icon
          padding 5px
          box-sizing border-box
          color #d44439
    .list-close
      width 100%
      text-align center
      line-height 50px
      background #f2f3f4
      font-size 16px
      color #2e3030
</style>


