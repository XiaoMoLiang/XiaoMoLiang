// pages/detail-video/index.js
import {
    getMVURL,
    getMVDetail,
    getRelatedVideo
} from '../../service/api_video'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mvURLInfo: {},
        mvDetail: {},
        mvRelated: {}

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id
        
        // 获取页面数据
        this.getPageDate(id)

    },

    getPageDate(id) {
        // 获取播放地址
        getMVURL(id).then(res => {
            this.setData({
                mvURLInfo: res.data
            })
        })
        // 获取视频信息
        getMVDetail(id).then(res => {
            this.setData({
                mvDetail: res.data
            })
        })
        // 获取相关视频
        getRelatedVideo(id).then(res => {
            this.setData({
                mvRelated: res.data
            })
        })
    }


})