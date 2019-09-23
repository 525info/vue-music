import axios from "axios";
import HOST from "@/common/js/config";

export function getSingerList() {
  const url = HOST + "/top/artists?offset=0&limit=100";
  return axios.get(url);
}

export function getSingerDetail(singerId) {
  const url = HOST + "/artists?id=" + singerId;
  return axios.get(url);
}

export function getMusicUrl(id){
  const url = HOST + "/song/url?id=" + id;
  return axios.get(url)
}

export function getLyric(id){
  const url = HOST + '/lyric?id=' + id
  return axios.get(url)
}
