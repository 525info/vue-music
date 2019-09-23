<template>
  <div>
    <div class="search-suggest" v-show="query && suggest.artists">
      <p class="title">你可能感兴趣</p>
      <div
        class="search-suggest-item"
        v-if="suggest.artists"
        @click="selectSinger(suggest.artists[0])"
      >
        <img :src="suggest.artists[0].img1v1Url" class="img" />
        <p class="singer">歌手：{{ suggest.artists[0].name }}</p>
      </div>
    </div>
    <div class="search-result" v-show="songs.length">
      <p class="search-title">单曲</p>
      <ul class="search-list">
        <li
          class="search-list-item"
          v-for="(item, index) in songs"
          :key="index"
          @click="selectSong(item)"
        >
          <p class="song">{{ item.name }}</p>
          <p class="singer">{{ item.singer }}</p>
        </li>
        <loading v-show="hasMore && query" />
      </ul>
    </div>
    <div v-show="!hasMore && !songs.length && query" class="no-result-wrapper">
      抱歉，暂无搜索结果
    </div>
  </div>
</template>

<script>
import { getSearch, getSearchSuggest, getSongDetail } from "@/api/search";
import { createSearchSong } from "@/common/js/song";
import Loading from "@/base/loading/loading";
import { mapMutations, mapGetters, mapActions } from "vuex";
import Singer from "@/common/js/singer";
export default {
  props: {
    query: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      songs: [],
      suggest: {},
      limit: 20,
      offset: 0,
      hasMore: true
    };
  },
  computed: {
    ...mapGetters(["singer", "playlist"])
  },
  components: {
    Loading
  },
  methods: {
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"]),
    selectSinger(item) {
      const singer = new Singer({
        id: item.id,
        name: item.name,
        singerImg: item.img1v1Url
      });
      this.$router.push({
        path: `/search/singer/${item.id}`
      });
      this.setSinger(singer);
      this.$emit("select");
    },
    selectSong(item) {
      // item里面没有歌曲图片，所以在请求一次
      getSongDetail(item.id).then(res => {
        item.img = res.data.songs[0].al.picUrl;
        this.insertSong(item);
        this.$emit("select");
      });
    },
    search() {
      this.hasMore = true;
      getSearch(this.query, this.limit, this.offset)
        .then(res => {
          if (!res.data.result.songs) {
            this.hasMore = false;
            return;
          }
          getSearchSuggest(this.query).then(res => {
            this.suggest = res.data.result;
          });
          let list = res.data.result.songs;
          let ret = [];
          list.forEach(item => {
            ret.push(createSearchSong(item));
          });
          this.songs = ret;
          this.offset += 20;
          this._check(res.data.result.songCount);
        })
        .catch(err => {
          console.error(err);
        });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      if (!this.songs.length) {
        return;
      }
      getSearch(this.query, this.limit, this.offset).then(res => {
        let list = res.data.result.songs;
        if (!res.data.result.songs) {
          this.hasMore = false;
          return;
        }
        let ret = [];
        list.forEach(item => {
          ret.push(createSearchSong(item));
        });
        this.songs = this.songs.concat(ret);
        this.offset += 20;
      });
    },
    _check(songCount) {
      if (this.songs.length >= songCount) {
        this.hasMore = false;
      }
    }
  },
  watch: {
    query(newQuery) {
      if (newQuery === "") {
        this.suggest = {};
        this.songs = [];
        this.hasMore = false;
        return;
      }
      this.suggest = {};
      this.songs = [];
      this.offset = 0;
      this.hasMore = true;
      this.search();
    }
  }
};
</script>

<style scoped lang="stylus">
.search-suggest
  padding-left 20px
  .title
    font-size 12px
    padding 10px 0 10px 0
.search-suggest-item
  display flex
  font-size 15px
  height 50px
  align-items center
  .img
    width 50px
    height 50px
    border-radius 50%
  .singer
    padding 0 20px
  .name
    padding 0 20px
.search-result
  padding 15px 0 10px 0
  .search-title
    padding-left 20px
    font-size 14px
    margin 5px 0
    font-weight bolder
  .search-list-item
    box-sizing border-box
    height 50px
    padding 0 0 0 20px
    border-bottom 0.5px solid #e7e7e7
    .song
      width 90%
      color #537695
      padding 10px 0 5px 0
      font-size 15px
      white-space nowrap
      text-overflow ellipsis
      overflow hidden
      box-sizing border-box
    .singer
      width 90%
      font-size 12px
      color #757575
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
.no-result-wrapper
  text-align center
  width 100%
  position absolute
  top 240px
  left 50%
  transform translateX(-50%)
</style>