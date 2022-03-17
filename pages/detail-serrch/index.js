// pages/detail-serrch/index.js
import {
    getSearchHot,
    getSearchSuggest,
    getSearchValue
} from '../../service/api_search'
import debounce from '../../utils/debounce'
import stringToNodes from '../../utils/string2nodes'

const debounceGetSearchSuggest = debounce(getSearchSuggest)

Page({

    data: {
        hotKeywords: [],
        suggestSongs: [],
        suggestNades: [],
        resultSongs: [],
        searchValue: "",

    },

    onLoad: function (options) {
        // 获取页面数据
        this.getPageData()
    },

    // 网络请求
    getPageData() {
        getSearchHot().then(res => {
            this.setData({
                hotKeywords: res.result.hots
            })
        })
    },

    // 事件处理
    handSearchChang(e) {
        // 1 获取输入的关键字
        const searchValue = e.detail

        // 2 保存关键字
        this.setData({ searchValue:searchValue })

        // 3 判断关键字为空字符的处理逻辑
        if (!searchValue.length) {
            this.setData({ suggestSongs: [], resultSongs: [], })
            debounceGetSearchSuggest.cancel() //取消调用
            return
        }

        // 4 根据关键字进行搜索
        debounceGetSearchSuggest(searchValue).then(res => {
            // 1 获取建议的关键字歌曲
            const suggestSongs = res.result.allMatch
            this.setData({ suggestSongs })
            if(!suggestSongs) return

            // 2 转成noces节点
            const suggestKeywords = suggestSongs.map(item => item.keyword)
            const suggestNades = []
            for (const keyword of suggestKeywords) {
                const nodes = stringToNodes(keyword, searchValue)
                suggestNades.push(nodes)
            }
            this.setData({
                suggestNades
            })
        })
    },

    handleSearchAction() {
        // 保存一下searchValue
        const searchValue = this.data.searchValue

        getSearchValue(searchValue).then(res => {
            this.setData({
                resultSongs: res.result.songs
            })
        })
    },
    handleSuggestItemClick(e) {
        // 获取建议搜索点击的关键字
        const index = e.currentTarget.dataset.index
        const keyword = this.data.suggestSongs[index].keyword

        //   将关键字设置到searchValue中
        this.setData({
            searchValue: keyword
        })

        // 发送网络请求
        this.handleSearchAction()
    },
    handleTagItemClick(e) {
        // 获取热门搜索点击的关键字
        const keyword = e.currentTarget.dataset.keyword

        //   将关键字设置到searchValue中
        this.setData({
            searchValue: keyword
        })

        // 发送网络请求
        this.handleSearchAction()

    }

})