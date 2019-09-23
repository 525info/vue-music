<template>
  <transition name="search">
    <div class="search">
      <div class="search-box-wrapper">
        <div class="back" @click="back">
          <span class="iconfont icon-fanhui"></span>
        </div>
        <search-box ref="searchBox" @query="onQueryChange" />
      </div>
      <Scroll
        class="scroll-wrapper"
        :pullup="pullup"
        @scrollToEnd="searchMore"
        ref="scroll"
      >
        <div class="scroll-content">
          <div class="hot-search" v-show="!query">
            <p class="title">热门搜索</p>
            <div>
              <span
                class="hot-search-item"
                v-for="(item, index) in searchHot"
                :key="index"
                @click="addQuery(item.first)"
                >{{ item.first }}</span
              >
            </div>
          </div>
          <div
            class="search-history"
            v-if="searchHistory.length && query.length === 0"
          >
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span
                class="iconfont icon-iconfontshanchu"
                @click="removeSearch"
              ></span>
            </h1>
            <SearchList
              :searchHistory="searchHistory"
              @select="addQuery"
              @delete="deleteOneHistory"
            ></SearchList>
          </div>
          <Suggest
            :query="query"
            v-show="query"
            ref="suggest"
            @select="saveSearch"
          ></Suggest>
        </div>
      </Scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import Scroll from "@/base/scroll/scroll";
import SearchBox from "@/base/search-box/search-box";
import Suggest from "@/components/suggest/suggest";
import SearchList from "@/base/search-list/search-list";

import { mapActions, mapGetters } from "vuex";
import { getSearchHot } from "@/api/search";
import { playlistMixin } from "@/common/js/mixin";

export default {
  mixins: [playlistMixin],
  components: {
    SearchBox,
    Suggest,
    Scroll,
    SearchList
  },
  data() {
    return {
      searchHot: [],
      query: "",
      pullup: true
    };
  },
  created() {
    this._getSearchHot();
  },
  computed: {
    ...mapGetters(["searchHistory"])
  },
  methods: {
    ...mapActions([
      "saveSearchHistory",
      "deleteSearchHistory",
      "removeSearchHistory"
    ]),
    handlePlaylist(playlist) {
      let bottom = playlist.length > 0 ? "60" : "";
      this.$refs.scroll.$el.style.bottom = bottom + "px";
    },
    back() {
      this.$router.back();
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    onQueryChange(query) {
      this.query = query;
    },
    searchMore() {
      this.$refs.suggest.searchMore();
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    deleteOneHistory(val) {
      this.deleteSearchHistory(val);
    },
    removeSearch() {
      this.removeSearchHistory();
    },
    _getSearchHot() {
      getSearchHot().then(res => {
        this.searchHot = res.data.result.hots;
      });
    }
  }
};
</script>

<style scoped lang="stylus">
.search-enter-active, .search-leave-active
  transition all 0.3s
.search-enter, .search-leave-to
  transform translate3d(50%, 0, 0)
  opacity 0
.search
  width 100%
  position fixed
  top 0
  bottom 0
  z-index 150
  background-color #f1f1f1
  .search-box-wrapper
    height 44px
    box-sizing border-box
    padding 10px 10px 10px 43px
    background #d44439
    .back
      position absolute
      left 0
      top 3px
      padding 3px 10px
      font-size 30px
      color #fff
      span
        font-size 20px
  .hot-search
    width 100%
    padding 15px 20px 0 20px
    box-sizing border-box
    .title
      width 90%
      font-size 13px
      color #999
      margin 0 0 15px 0
    .hot-search-item
      display inline-block
      background-color rgba(80, 80, 80, 0.1)
      padding 3px 8px
      border-radius 15px
      margin 5px 5px 5px 2px
      font-size 14px
      line-height 18px
  .search-history
    margin 20px 25px 10px 25px
    .title
      display flex
      font-size 12px
      height 30px
      .text
        flex 1
.scroll-wrapper
  position fixed
  top 44px
  bottom 0
  width 100%
  overflow hidden
</style>