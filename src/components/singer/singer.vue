<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singerList" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import ListView from "@/base/listview/listview";
import { getSingerList } from "@/api/singer";
import { mapMutations } from 'vuex'
import { playlistMixin } from "@/common/js/mixin";
let pinyin = require("pinyin");
const HOT_NAME = "热门";
const HOT_SINGER_LENGTH = 10;
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerList: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlaylist(playlist){
      let bottom = playlist.length > 0 ? '60' : '';
      this.$refs.singer.style.bottom = bottom + 'px';
    },
    selectSinger(singer){
      this.$router.push({
        path: `/singer/${singer.id}`
      })
      this.setSinger(singer)
    },

    // 获取歌手接口数据
    _getSingerList() {
      getSingerList().then(res => {
        let s = res.data.artists;
        s.forEach(item => {
          // 取得歌手name 转化拼音后的首字母
          let py = pinyin(item.name[0], {
            style: pinyin.STYLE_FIRST_LETTER
          });
          item.initial = py[0][0].toUpperCase();
        });
        this.singerList = this._normalizeSinger(s);
      });
    },
    _normalizeSinger(list) {
      // 把请求下来的数据改成我们想要的格式 (按歌手姓名顺序分类)
      // 所有我们需要的数据
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        // 把前10条放入热门歌手
        if (index < HOT_SINGER_LENGTH) {
          map.hot.items.push({
            id: item.id,
            name: item.name,
            singerImg: item.img1v1Url
          });
        }
        // 其余歌手   添加一个健值
        const key = item.initial;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        // push数据
        map[key].items.push({
          id: item.id,
          name: item.name,
          singerImg: item.img1v1Url,
          alias: item.alias[0]
        });
      });
      let hot = [],
        rest = [];
      for (const key in map) {
        let value = map[key];
        if (value.title.match(/[A-z]/)) {
          rest.push(value);
        } else if (value.title === HOT_NAME) {
          hot.push(value);
        }
      }
      rest.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(rest);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  
  },
  components: {
    ListView
  }
};
</script>

<style scoped lang='stylus'>
.singer
  width 100%
  position fixed
  top 88px
  bottom 0
</style>
