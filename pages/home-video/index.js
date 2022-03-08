// pages/home-videm/index.js
import {
    getTopMV
} from '../../service/api_video'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        topMVs: [],
        hasMore: true
    },

    /**
     * 生命周期函数--监听页面加载
     * async await
     */

    onLoad() {
        this.gettopMVs(0)
    },

    // 封装事件处理方法
    handleVideoItemClick(e){
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `../detail-video/index?id=${id}`,
        })
    },

    // 获取视频数据
    async gettopMVs(offset) {
        if (!this.data.hasMore) return
        // 展示刷新动画
        wx.showNavigationBarLoading()
        let res = await getTopMV(offset)
        let List = this.data.topMVs
        if (offset == 0) {
            List = res.data
        } else {
            List = List.concat(res.data)
        }
        this.setData({
            topMVs: List,
            hasMore: res.hasMore
        })
        wx.hideNavigationBarLoading()
        if (offset === 0) {
            wx.stopPullDownRefresh()
        }


    },

    //下拉刷新
    onPullDownRefresh: async function () {
        this.gettopMVs(0)
    },

    //底部刷新
    onReachBottom: async function () {
        this.gettopMVs(this.data.topMVs.length)
    }


})