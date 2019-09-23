import * as types from "./mutation-types";
import { playMode } from "@/common/js/config";
import { shuffle } from "@/common/js/util";
import {saveSearch, deleteSearch, clearSearch, saveFavorite, saveRcentPlay} from '@/common/js/cache';

let findIndex = function(arr,song){
  return arr.findIndex(item=>{
    return item.id === song.id
  })
}

export const selectPlay = function({ commit, state }, { list, index }) {
  // 已经是随机播放，重新选择播放列表之后，还是要打乱随机播放
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    /* index = randomList.findIndex(item=>{
      return item.id === list[index].id
    }) */
    index = findIndex(randomList,list[index])
    commit(types.SET_PLAYLIST, randomList);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
 
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const sequencePlay = function({ commit, state }, { list, index }) {
  commit(types.SET_PLAY_MODE, playMode.sequence);
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAYLIST, list);
  commit(types.SET_CURRENT_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playlist[currentIndex]
  // 查找当前列表中是否有带插入的歌曲，并返回银锁
  let fpIndex = findIndex(playlist, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入歌曲
  playlist.splice(currentIndex, 0, song)
  // 如果已经包含这首歌
  if (fpIndex > -1) {
    // 如果当前插入的序号大于列列表中的序号
    if (currentIndex > fpIndex) {
      // 删掉
      playlist.splice(fpIndex, 1)
      // 因为删除后数组前移，所以 Index--
      currentIndex--
    } else {
      playlist.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fpIndex, 1)
    } else {
      sequenceList.splice(fpIndex + 1, 1)
    }
  }
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const saveSearchHistory = function({commit}, query){
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearchHistory = function({commit}, val){
  commit(types.SET_SEARCH_HISTORY, deleteSearch(val))
}

export const removeSearchHistory = function({commit}){
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playlist, song)
  playlist.splice(pIndex, 1)
  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playlist.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  const playingState = playlist.length > 0
  // 如果歌曲删除完毕，那么 播放停止
  commit(types.SET_PLAYING_STATE, playingState)
}

export const deleteSongList= function({commit,state}) {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYING_STATE, false)

}

export const saveFavoriteList = function({commit, state}, song){
  commit(types.SET_FAVORITE_SONG, saveFavorite(song))
}

export const saveRecentPlay = function({commit, state}, song){
  commit(types.SET_RECENT_PLAY, saveRcentPlay(song))
}