/**
 * id：歌曲id
 * name： 歌曲名称
 * singer： 歌手
 * al： 专辑
 * img： 歌曲图片
 */
class Song{
    constructor({id,name,singer,album,alia,img}){
        this.id = id;
        this.name = name;
        this.singer = singer;
        this.album = album;
        this.img = img
    }
}


/**
 * 把多个歌手名字变成我们想要的格式（ / 分开)
 * @param {*} arr 
 */
function singerName(arr){
    let name =[];
    name = arr.map(item=>{
        return item.name 
    })
    return name.join('/')
}

export function createRecommendListSong(music){
    return new Song({
        id: music.id,
        name: music.name,
        img: music.al.picUrl,
        singer: singerName(music.ar),
        album: music.al.name
    })
}

export function createRecommendSong(music){
    return new Song({
        id: music.id,
        name: music.name,
        img: music.song.album.picUrl,
        singer: singerName(music.song.artists),
        album: music.song.album.name
    })
}

export function createSong(music){
    return new Song({
        id: music.id,
        name: music.name,
        img: music.al.picUrl,
        singer: singerName(music.ar),
        album: music.al.name
    })
}

export function createTopListSong(music){
    return new Song({
        id: music.id,
        name: music.name,
        img: music.al.picUrl,
        singer: singerName(music.ar),
        album: music.al.name,
    })
}

export function createSearchSong (music) {
    return new Song({
      id: music.id,
      name: music.name,
      singer: singerName(music.artists),
      album: music.album.name,
    })
  }
  



