import HOST from "@/common/js/config";
import axios from 'axios';

export function getTopList(idx){
    const url = HOST + '/top/list?idx=' + idx
    return axios.get(url)
}