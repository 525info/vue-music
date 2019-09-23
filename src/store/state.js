import {
  playMode
} from '@/common/js/config'
import {
  loadSearch,
  loadFavorite,
  loadRecent
} from '@/common/js/cache';

const state = {
  singer: {}, // 点击歌手时保存当前歌手信息
  playing: false, // 歌曲现在是否播放
  fullScreen: false, // 播放器是否全屏
  playlist: [], // 当前播放列表
  sequenceList: [], // 顺序播放列表
  mode: playMode.sequence, //播放模式
  currentIndex: -1,
  songList: {}, // 点击推荐歌单时保存的当前歌单信息
  topList: {}, // 点击排行歌单时保存的当前歌单信息
  searchHistory: loadSearch(),
  favoriteSong: loadFavorite(),
  recentPlay: loadRecent()
}

export default state
