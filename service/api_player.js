import hyRequest from './index'

export function getSongDetail(ids){
    return hyRequest.get('song/detail',{
        ids
    })
}

// 歌词
export function getSongLyric(id){
    return hyRequest.get('lyric',{
        id
    })
}