// pages/home-music/index.js
import {getBanners} from '../../service/api_music'
import query_rect from '../../utils/query_rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(query_rect)
Page({

    /**
     * 页面的初始数据
     */
    data: {
      swiperHeight:'',
      bannerList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getMusicBanner()
    },

    // 事件处理
    headClickInput(){
        wx.navigateTo({
          url: '/pages/detail-serrch/index',
        })
    },

    // 获取轮播图数据
    async getMusicBanner(){
      let res = await getBanners()
      this.setData({bannerList:res.banners})
    },
    
    // 获取图片高度
    handLeSwiper(){
      throttleQueryRect('.image').then(res=>{
        const rect = res[0]
        console.log(rect);
        this.setData({swiperHeight:rect.height})
      })
    }
    
})