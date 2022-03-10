// pages/detail-serrch/index.js
import {getSearchHot,getSearchSuggest} from '../../service/api_search'

Page({

    data: {
        hotKeywords:[],
        suggestSongs:[],
        searchValue:""
    },

    onLoad: function (options) {
        // 获取页面数据
        this.getPageData()
    },

    onUnload: function () {

    },

    // 网络请求
    getPageData(){
        getSearchHot().then(res=>{
            this.setData({hotKeywords:res.result.hots})
        })
    },

    // 事件处理
    handSearchChang(e){
        // 获取输入的关键字
        const searchValue = e.detail

        // 保存关键字
        this.setData({searchValue})

        // 判断关键字为空字符的处理逻辑
        if(!searchValue.length) {
            this.setData({suggestSongs:[]})
            return
        }
        
        // 根据关键字进行搜索
        getSearchSuggest(searchValue).then(res=>{
            this.setData({suggestSongs:res.result.allMatch})
        })
    }

})
