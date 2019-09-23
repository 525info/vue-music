<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="fade">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <div class="filter"></div>
          <img :src="currentSong.img" width="100%" height="100%" />
        </div>
        <div class="top">
          <div class="back" @click="back">
            <span class="iconfont icon-xiala-"></span>
          </div>
          <h1 class="title">{{ currentSong.name }}</h1>
          <p class="singer-name">{{ currentSong.singer }}</p>
        </div>
        <div class="middle" @click="changeMiddle">
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper">
              <div class="cd" :class="cdClass">
                <img :src="currentSong.img" class="img" />
              </div>
            </div>
          </div>
          <Scroll
            class="middle-r"
            :style="middleRStyle"
            :data="currentLyric && currentLyric.lines"
            ref="lyricList"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p
                  ref="lyricLine"
                  class="lyric"
                  :class="{ current: index === currentLine }"
                  v-for="(line, index) in currentLyric && currentLyric.lines"
                  :key="index"
                >{{ line.txt }}</p>
              </div>
              <p class="nolyric" v-else>{{ upDatecurrentLyric }}</p>
            </div>
          </Scroll>
        </div>
        <div class="bottom">
          <div class="progress-wrapper">
            <span class="start">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper" @click.stop="progressClick" ref="progressBar">
              <div class="progress-inner">
                <div class="progress" ref="progress"></div>
                <div
                  class="dot"
                  @touchstart="start"
                  @touchmove.stop.prevent="move"
                  @touchend.stop.prevent="end"
                  ref="dot"
                ></div>
              </div>
            </div>
            <span class="end">{{ formatTime(duration) }}</span>
          </div>
          <div class="operators">
            <div class="icon left">
              <span class="iconfont size" :class="modeIcon" @click="changeMode"></span>
            </div>
            <div class="icon left">
              <span class="iconfont icon-shangyishoushangyige size" @click="previousMusic"></span>
            </div>
            <div class="icon center">
              <span class="iconfont size" ref :class="playIcon" @click="togglePlaying"></span>
            </div>
            <div class="icon right">
              <span class="iconfont icon-xiayigexiayishou size" @click="nextMusic"></span>
            </div>
            <div class="icon right">
              <span
                class="iconfont size"
                :class="favoriteIcon"
                @click="selectFavoriteSong(currentSong)"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="mini-player" v-show="!fullScreen" @click="open">
      <div class="icon" :class="cdClass">
        <img :src="currentSong.img" width="40" height="40" />
      </div>
      <div class="text">
        <p class="name">{{ currentSong.name }}</p>
        <p class="desc">{{ currentSong.singer }}</p>
      </div>
      <div class="control">
        <progress-circle :radius="30" :percent="percent">
          <span class="iconfont size mini" :class="miniPlayIcon" @click.stop="togglePlaying"></span>
        </progress-circle>
      </div>
      <div class="control">
        <span class="iconfont icon-caidan size" @click.stop="showPlaylist"></span>
      </div>
    </div>
    <audio
      id="music-audio"
      ref="audio"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @durationchange="getDuration"
      @ended="musicEnd"
    ></audio>
    <play-list ref="playlist" @stopMusic="stopMusic"></play-list>
    <toast :content="toastText" ref="toast"></toast>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import Lyric from "lyric-parser";
import ProgressCircle from "@/base/progress-circle/progress-circle";
import { getMusicUrl } from "@/api/singer";
import { getLyric } from "@/api/singer";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";
import Scroll from "@/base/scroll/scroll";
import PlayList from "@/components/playlist/playlist.vue";
import Toast from '@/base/toast/toast'

export default {
  computed: {
    ...mapGetters([
      "fullScreen",
      "playlist",
      "currentSong",
      "playing",
      "currentIndex",
      "mode",
      "sequenceList",
      "favoriteSong"
    ]),
    playIcon() {
      return this.playing ? "icon-icon-test" : "icon-icon-test1";
    },
    miniPlayIcon() {
      return this.playing ? "icon-bofangzanting" : "icon-bofang1";
    },
    cdClass() {
      return this.playing ? "play" : "play pause";
    },
    modeIcon() {
      if (this.mode === playMode.sequence) return "icon-xunhuanbofang";
      if (this.mode === playMode.loop) return "icon-danquxunhuan";
      else return "icon-suijibofang";
    },
    favoriteIcon() {
      let flag = this.favoriteSong.some(item => {
        return item.id === this.currentSong.id;
      });
      return flag ? "icon-xiai-tianchong" : "icon-xiai";
    },
    percent() {
      return this.currentTime / this.duration;
    },
    upDatecurrentLyric() {
      if (this.noLyric) {
        return "暂无歌词";
      } else {
        return "歌词加载中";
      }
    },
    toastText(){
      if (this.mode === playMode.sequence) return "顺序播放";
      if (this.mode === playMode.loop) return "单曲循环";
      else return "随机播放";
    }
  },
  components: {
    ProgressCircle,
    Scroll,
    PlayList,
    Toast
  },
  data() {
    return {
      songReady: false, // 歌曲是否加载好
      currentTime: 0, // 当前歌曲播放时间
      duration: 0, //当前歌曲的总时间长度
      touching: false, // 是否正在拖动进度条
      currentLyric: null, // 当前歌词
      currentLine: 0, // 歌词当前的行数
      noLyric: false,
      middleLStyle: { zIndex: 120, opacity: 1 },
      middleRStyle: { zIndex: 119, opacity: 0 },
      isPrevOrNext: false, // 点击上下曲的时候不改变中间显示区域
      isShow: false
    };
  },
  methods: {
    ...mapMutations({
      setFullScreen: "SET_FULL_SCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setcurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setPlayList: "SET_PLAYLIST",
      setFavoriteSong: "SET_FAVORITE_SONG"
    }),
    ...mapActions(["saveFavoriteList", "saveRecentPlay"]),
    selectFavoriteSong(song) {
      this.saveFavoriteList(song);
    },
    stopMusic() {
      this.$refs.audio.pause();
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    changeMiddle() {
      let temp = this.middleLStyle;
      this.middleLStyle = this.middleRStyle;
      this.middleRStyle = temp;
      temp = null;
    },
    changeMode() {
      let mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (playMode.random === mode) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      let index = list.findIndex(item => {
        return item.id === this.currentSong.id;
      });
      this.setcurrentIndex(index);
      this.setPlayList(list);
      this.$refs.toast.show()
    },
    musicEnd() {
      if (this.mode === playMode.loop) {
        //单曲循环
        this.loop();
      } else {
        this.nextMusic(); // 下一首
      }
    },
    loop() {
      this.currentTime = 0;
      this.$refs.audio.currentTime = this.currentTime;
      this.$refs.audio.play();
      if (this.currentLyric) {
        this.currentLyric.seek();
      }
    },
    // 开始拖动进度条
    start() {
      this.touching = true;
    },
    // 点的left / 进度条总长度  =  现在时间 / 总时间
    move(e) {
      let left = e.changedTouches[0].pageX - this.$refs.progressBar.offsetLeft;
      if (left <= 0) {
        left = 0;
      }
      if (left >= this.$refs.progressBar.offsetWidth - 15) {
        left = this.$refs.progressBar.offsetWidth - 15;
      }
      this.currentTime =
        (left / (this.$refs.progressBar.offsetWidth - 15)) * this.duration;
      this.$refs.dot.style.transform = `translateX(${left}px)`;
      this.$refs.progress.style.width = left + "px";
    },
    // 拖动进度条结束
    end() {
      this.$refs.audio.currentTime = this.currentTime;
      this.touching = false;
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    progressClick(e) {
      let x = e.pageX - this.$refs.progressBar.offsetLeft;
      this.currentTime =
        (x / (this.$refs.progressBar.offsetWidth - 15)) * this.duration;
      this.$refs.audio.currentTime = this.currentTime;
      if (this.currentLyric) {
        this.currentLyric.seek(this.currentTime * 1000);
      }
    },
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      const audio = this.$refs.audio;
      this.setPlayingState(!this.playing);
      this.playing ? audio.play() : audio.pause();
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    back() {
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
      this.middleLStyle = { zIndex: 120, opacity: 1 };
      this.middleRStyle = { zIndex: 119, opacity: 0 };
    },
    // 连续点击上/下一首 根据canplay来判断是否播放 防止加载发生错误
    ready() {
      this.songReady = true;
    },
    // 出错时(网络错误，url错误 )  点击无效
    error() {
      this.songReady = true;
    },
    updateTime(e) {
      if (!this.touching) {
        this.currentTime = e.target.currentTime;
      }
    },
    // 音乐url变化触发durationchange事件获取总时长
    getDuration(e) {
      this.duration = e.target.duration;
    },
    formatTime(time) {
      let minute = parseInt(time / 60);
      let second = parseInt(time % 60);
      if (second < 10) {
        second = "0" + second;
      }
      return minute + ":" + second;
    },
    _getMusicUrl(id) {
      getMusicUrl(id).then(res => {
        this.$refs.audio.src = res.data.data[0].url;
        this.$refs.audio.play();
        this._getLyric(this.currentSong.id);
      });
      
    },
    _getLyric(id) {
      if (this.currentLyric) {
        this.currentLyric.stop();
        this.currentLyric = null;
      }
      this.noLyric = false;
      getLyric(id)
        .then(res => {
          this.currentLyric = new Lyric(res.data.lrc.lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
            this.currentLine = 0;
          }
        })
        .catch(() => {
          this.currentLyric = null;
          this.noLyric = true;
          this.currentLineNum = 0;
        });
    },
    handleLyric({ lineNum, txt }) {
      this.currentLine = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
    },
    previousMusic() {
      if (!this.songReady) return;
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playlist.length - 1;
        }
        this.setcurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
      this.isPrevOrNext = true;
    },
    nextMusic() {
      if (!this.songReady) return;
      if (this.playlist.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index >= this.playlist.length) {
          index = 0;
        }

        this.setcurrentIndex(index);
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
      this.isPrevOrNext = true;
    }
  },
  watch: {
    // 从收藏和历史记录点进来虽然改变了playing状态，如果不watch， 还是不会播放
    playing(newState) {
      if (this.$refs.audio.src) {
        let audio = this.$refs.audio;
        newState ? audio.play() : audio.pause();
      }
    },
    currentSong(newSong, oldSong) {
      if (!newSong.id) return;
      if (newSong.id === oldSong.id) return;
      // 如果前面有歌词 则把歌词停止运动
      if (this.currentLyric) {
        this.currentLyric.stop();
      }
      // 如果不是上下曲点击，切换为cd显示
      if (!this.isPrevOrNext) {
        this.middleLStyle = { zIndex: 120, opacity: 1 };
        this.middleRStyle = { zIndex: 119, opacity: 0 };
      } else {
        this.isPrevOrNext = false;
      }

      this.duration = 0;
      this.$refs.audio.pause();
      this._getMusicUrl(newSong.id);
      
      this.saveRecentPlay(newSong);
    },
    // 监听现在播放时间使进度条移动
    percent(newPercent) {
      if (newPercent >= 0 && !this.touching) {
        let width = newPercent * (this.$refs.progressBar.clientWidth - 15);
        this.$refs.dot.style.transform = `translateX(${width}px)`;
        this.$refs.progress.style.width = width + "px";
      }
    }
  }
};
</script>

<style scoped lang="stylus">
.fade-enter-active, .fade-leave-active
  transition opacity 0.4s
.fade-enter, .fade-leave-to
  opacity 0
.normal-player
  position fixed
  top 0
  bottom 0
  left 0
  right 0
  z-index 150
  background-color #f2f3f4
  .background
    position absolute
    left -50%
    top -50%
    width 300%
    height 300%
    z-index -1
    opacity 0.6
    filter blur(30px)
    .filter
      position absolute
      width 100%
      height 100%
      background black
      opacity 0.6
    .filterR
      position absolute
      width 100%
      height 100%
      background black
      opacity 0.4
      &.filterR-enter-active, &.filterR-leave-active
        transition all 0.3s
      &.filterR-leave-to, &.filterR-enter
        opacity 0
      &.filterR-leave
        opacity 0.4
  .top
    text-align center
    color #f1f1f1
    position relative
    margin-bottom 25px
    .back
      position absolute
      left 0
      top 0
      padding 8px
      span
        font-size 30px
    .title
      width 70%
      font-size 18px
      line-height 20px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      margin 0 auto
      font-weight bolder
      padding 10px 0 0 0
    .singer-name
      width 70%
      margin 0 auto
      line-height 20px
      text-align center
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
      font-size 12px
  .middle
    display flex
    align-items center
    position fixed
    width 100%
    top 80px
    bottom 170px
    white-space nowrap
    .middle-l
      transition all 0.4s
      position relative
      width 100%
      height 0
      padding-top 70%
      .cd-wrapper
        position absolute
        width 70%
        height 100%
        top 0
        left 15%
        .cd
          position relative
          width 100%
          height 100%
          border 10px solid rgba(255, 255, 255, 0.1)
          border-radius 50%
          box-sizing border-box
          &.play
            animation rotate 20s linear infinite
          &.pause
            animation-play-state paused
          .img
            position absolute
            top 0
            left 0
            width 100%
            height 100%
            border-radius 50%
    .middle-r
      transition all 0.3s
      position absolute
      top 0
      width 100%
      height 100%
      overflow hidden
      .lyric-wrapper
        padding-top 30px
        width 80%
        margin 0 auto
        text-align center
        overflow hidden
        .lyric
          font-family Arial, Helvetica, sans-serif
          color rgba(255, 255, 255, 0.6)
          line-height 30px
          font-size 13px
          &.current
            color #fff
        .nolyric
          margin-top 120px
          line-height 40px
          color #c7c7c7
          font-size 14px
  .bottom
    position absolute
    bottom 30px
    width 100%
    .progress-wrapper
      width 80%
      margin 0 auto
      font-size 11px
      padding 10px 0
      display flex
      align-items center
      .start
        width 30px
        flex 0 0 0 30px
        text-align left
        color #f1f1f1
      .progress-bar-wrapper
        flex 1
        padding 10px 0
        .progress-inner
          position relative
          width 100%
          height 3px
          background-color rgba(0, 0, 0, 0.2)
          .progress
            width 0
            height 3px
            background-color #d44439
          .dot
            position absolute
            top -5px
            left 0
            width 15px
            height 15px
            border 5px solid #ccc
            background-color #d44439
            box-sizing border-box
            border-radius 50%
      .end
        width 30px
        flex 0 0 0 30px
        text-align right
        color #dbdbdb
    .operators
      color #f1f1f1
      display flex
      align-items center
      .icon
        flex 1
      .left
        text-align right
      .center
        text-align center
        padding 0 20px
        span
          font-size 50px
      .right
        text-align left
      .size
        font-size 30px
      .icon-xiai-tianchong
        color #f0746b
.mini-player
  width 100%
  height 60px
  position fixed
  left 0
  bottom 0
  z-index 180
  background-color rgba(255, 255, 255, 0.95)
  display flex
  align-items center
  .icon
    flex 0 0 40px
    width 50px
    padding 0 10px
    &.play
      animation rotate 20s linear infinite
    &.pause
      animation-play-state paused
    img
      border-radius 50%
  .text
    display flex
    justify-content center
    flex-direction column
    flex 1
    color #2e3030
    overflow hidden
    .name
      font-size 14px
      padding 3px 0
      margin-bottom 3px
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
    .desc
      font-size 11px
      text-overflow ellipsis
      overflow hidden
      white-space nowrap
  .control
    flex 0 0 30px
    width 30px
    padding 0 10px
    color rgba(18, 18, 18, 0.8)
    .size
      font-size 30px
    .mini
      position absolute
      left 7px
      top 7px
      font-size 16px
@keyframes rotate
  from
    transform rotate(0)
  to
    transform rotate(360deg)
</style>
