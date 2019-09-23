import axios from "axios";
import HOST from "@/common/js/config";

export function getBanner() {
  const url = HOST + "/banner?type=1";
  return axios.get(url);
}

export function getRecommendSongList() {
  const url = HOST + "/personalized";
  return axios.get(url);
}

export function getRecommendSong(){
  const url = HOST + '/personalized/newsong' 
  return axios.get(url)
}

export function getSongListDetail(id){
  const url = HOST + '/playlist/detail?id=' + id;
  return axios.get(url)
}
