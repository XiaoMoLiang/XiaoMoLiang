
import hyRequest from './index'

//获取热门搜索
export function getSearchHot(){
    return hyRequest.get('search/hot')
}

//获取搜索的结果
export function getSearchSuggest(keywords){
    return hyRequest.get('search/suggest',{
        keywords,
        type:"mobile"
    })
}