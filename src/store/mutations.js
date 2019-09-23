import * as types from "./mutation-types";
import { stat } from "fs";

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },

  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },

  [types.SET_FULL_SCREEN](state, flag){
    state.fullScreen = flag
  },

  [types.SET_PLAYLIST](state,list){
    state.playlist = list
  },

  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list
  },

  [types.SET_PLAY_MODE](state,mode){
    state.mode = mode
  },

  [types.SET_CURRENT_INDEX](state,index){
    state.currentIndex = index
  },

  [types.SET_SONG_LIST](state,songList){
    state.songList = songList
  },

  [types.SET_TOP_LIST](state, topList){
    state.topList = topList
  },

  [types.SET_SEARCH_HISTORY](state, history){
    state.searchHistory = history
  },

  [types.SET_FAVORITE_SONG](state,favoriteSong){
    state.favoriteSong = favoriteSong
  },

  [types.SET_RECENT_PLAY](state, recentPlay){
    state.recentPlay = recentPlay
  }
};



export default mutations;
