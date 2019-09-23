import HOST from '@/common/js/config'
import axios from 'axios'

export function getSearchHot(){
  const url = HOST + '/search/hot';
  return axios.get(url)
}

export function getSearch(keyword,limit,offset){
  const url = `${HOST}/search?keywords=${keyword}&limit=${limit}&offset=${offset}`;
  return axios.get(url)
}

export function getSearchSuggest(keywords){
  const url = HOST + '/search/suggest?keywords=' + keywords;
  return axios.get(url)
}

export function getSongDetail (id) {
  const url = HOST + `/song/detail?ids=${id}`
  return axios.get(url)
}