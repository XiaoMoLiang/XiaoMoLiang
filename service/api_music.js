import hyRequest from "./index"

// 轮播图
export function getBanners(){
    return hyRequest.get('banner',{
        type:2
    })
}

// 推荐歌曲
export function getRanKing(idx){
    return hyRequest.get('top/list',{
        idx
    })
}

// 热门歌曲
export function getSongMenu(cat="全部",limit=6,offset=0){
    return hyRequest.get('top/playlist',{
        cat,
        limit,
        offset
    })
}