<template>
  <div id="app">
    <m-header />
    <m-tab />
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player />
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import MTab from "components/tab/tab";
import Player from "@/components/player/player";
import "@/common/font/iconfont.css";
import "@/common/css/reset.css";

export default {
  components: {
    MHeader,
    MTab,
    Player
  },
  data() {
    return {
      stop: false
    };
  },
  // 解决移动端一些浏览器不能自动播放
  mounted() {
    let m = document.querySelector("#app");
    m.addEventListener("touchend", this.firstPlay);
  },
  methods: {
    firstPlay() {
      let music = document.querySelector("#music-audio");
      music.play();
      if (music.src !== "") {
        this.stop = true;
      }
    }
  },
  watch: {
    stop() {
      let m = document.querySelector("#app");
      m.removeEventListener("touchend", this.firstPlay);
    }
  }
};
</script>

<style lang="stylus">
body
  background #f2f3f4
  color #2e3030
  font-family PingFang SC, STHeitiSC-Light, Helvetica-Light, arial, sans-serif
</style>
