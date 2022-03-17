
import hyRequest from './index'

//获取热门搜索
export function getSearchHot(){
    return hyRequest.get('search/hot')
}

//获取搜索的建议歌单
export function getSearchSuggest(keywords){
    return hyRequest.get('search/suggest',{
        keywords,
        type:"mobile"
    })
}

//获取搜索的歌曲
export function getSearchValue(keywords){
    return hyRequest.get('search',{
        keywords
    })
}