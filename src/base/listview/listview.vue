<template>
  <scroll
    class="listview"
    ref="listview"
    :listenScroll="listenScroll"
    @scroll="scroll"
    :probeType="probeType"
  >
    <ul>
      <li
        v-for="(group, index) in data"
        :key="index"
        class="group-item"
        ref="listGroup"
      >
        <h4 class="title">{{ group.title }}</h4>
        <ul>
          <li
            @click="selectItem(item)"
            v-for="(item, index) in group.items"
            :key="index"
            class="item"
          >
            <img v-lazy="item.singerImg" alt="" class="singerImg" />
            <span class="name">{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div
      class="sidebar"
      @touchstart="onShortcutStart"
      @touchmove.stop.prevent="onShortcutMove"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          class="shortcut-item"
          :data-index="index"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="loading-container" v-if="!data.length">
      <Loading />
    </div>
  </scroll>
</template>

<script>
import scroll from "@/base/scroll/scroll";
import { getData } from "@/common/js/dom.js";
import Loading from "@/base/loading/loading";

const ANCHOR_HEIGHT = 18;
export default {
  name: "listview",
  props: {
    data: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0
    };
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
    },
    refresh() {
      this.$refs.listview.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    onShortcutStart(e) {
      let anchorIndex = getData(e.target, "index");
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollTo(anchorIndex);
    },
    onShortcutMove(e) {
      let firshTouch = e.touches[0];
      this.touch.y2 = firshTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollTo(anchorIndex);
    },
    _scrollTo(index) {
      // 如果点击下面的空白区域，index为null 直接返回
      if (!index && index !== 0) {
        return;
      }
      // 超过最上面一个 和最下面一个
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        //-2 是得到最后一个列表的索引
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // console.log(newY)
      // newY y轴滚动距离
      const listHeight = this.listHeight;
      // 滚动到顶部
      if (newY > 0) {
        this.currentIndex = 0;
        return;
      }
      // 在中间部分滚动
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          return;
        }
      }
      // 滚动到底部
      this.currentIndex = listHeight.length - 2;
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    }
  },
  components: {
    scroll,
    Loading
  }
};
</script>

<style lang="stylus" scoped>
.listview
  position relative
  width 100%
  height 100%
  overflow hidden
  .group-item
    width 100%
    .title
      color #fff
      background-color rgba(0, 0, 0, 0.1)
      height 20px
      font-size 12px
      line-height 20px
      padding-left 10px
      margin 0 0 10px 0
    .item
      width 100%
      display flex
      align-items center
      margin 0 5px
      padding 5px 0
      box-sizing border-box
      height 60px
      border-bottom 1px solid rgb(238, 238, 238)
      &:last-child
        border none
        margin-bottom 10px
      .singerImg
        width 50px
        height 50px
        border-radius 5px
      .name
        margin-left 15px
        font-size 14px
.sidebar
  position absolute
  right 0
  top 0
  width 20px
  z-index 100
  padding-top 5px
  overflow hidden
  .shortcut-item
    width 18px
    height 18px
    font-size 11px
    text-align center
    line-height 20px
    color #757575
    &.current
      color #d44439
.loading-container
  position absolute
  width 100%
  top 50%
  transform translateY(-50%)
</style>
