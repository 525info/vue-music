<template>
  <div class="swiper-container" v-if="bannerArr.length">
    <div class="swiper-wrapper">
      <div
        class="swiper-slide"
        v-for="(item, index) in bannerArr"
        :key="index"
      >
        <img :src="item.pic" width="100%" />
      </div>
    </div>
    <!-- 如果需要分页器 -->
    <div class="swiper-pagination"></div>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import Swiper from "swiper";
import { getBanner } from "api/recommend";
export default {
  name: "Banner",
  data() {
    return {
      bannerArr: []
    };
  },
  created() {
    this._getBanner();
    this.setSwiper();
  },
  methods: {
    _getBanner() {
      getBanner().then(res => {
        this.bannerArr = res.data.banners;
      });
    },
    setSwiper() {
      /* eslint-disable no-new */
      new Swiper(".swiper-container", {
        loop: true,
        autoplay: {
          disableOnInteraction: false
        },
        pagination: {
          el: ".swiper-pagination"
        }
      });
    }
  },
  watch: {
    bannerArr() {
      this.$nextTick(() => {
        // 创建swiper的实例
        this.setSwiper();
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.swiper-container
  border-radius 8px
  margin 0 2%
  .swiper-wrapper
    .swiper-slide
      width 100%
      pointer-events auto
</style>
