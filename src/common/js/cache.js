import storage from 'good-storage'

const SEARCH_KEY = '__search__';
const FAVORITE_KEY = '__favorite__';
const RECENT_PLAY_KEY = '__recentPlay__'
const SEARCH_MAX_LENGTH = 15;

function insertArray(arr,val,compare,maxLen){
  const index = arr.findIndex(compare)
  if(index === 0){
    return
  }
  if(index > 0){
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if(maxLen && arr.length > maxLen){
    arr.pop()
  }
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY,[])
  insertArray(searches, query, (item)=>{
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch(){
  return storage.get(SEARCH_KEY, [])
}

function deleteFromArray (arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export function deleteSearch (query) {
  // 首先获取
  let searches = storage.get(SEARCH_KEY, [])

  deleteFromArray(searches, (item) => {
    return item === query
  })

  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch () {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadFavorite(){
  return storage.get(FAVORITE_KEY, [])
}

export function saveFavorite(song) {
  let favorites = storage.get(FAVORITE_KEY,[])

  let index = favorites.findIndex(item=>{
    return item.id === song.id
  })
  if(index !== -1){
    favorites.splice(index, 1)
  }else{
    favorites.unshift(song)
  }
  storage.set(FAVORITE_KEY, favorites)
  return favorites
}

export function loadRecent(){
  return storage.get(RECENT_PLAY_KEY,[])
}

export function saveRcentPlay(song){
  let recentPlays = storage.get(RECENT_PLAY_KEY, []);
  insertArray(recentPlays, song, (item)=>{
    return song.id === item.id
  })
  storage.set(RECENT_PLAY_KEY, recentPlays)
  return recentPlays;
}

