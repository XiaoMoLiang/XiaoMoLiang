// pages/home-music/index.js
import {
  rankingStore,
  rankingMap
} from "../../store/index"

import {
  getBanners,
  getSongMenu
} from '../../service/api_music'
import query_rect from '../../utils/query_rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(query_rect)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperHeight: '',
    bannerList: [],
    recommendSongMenu: [],
    recommendSongs: [],
    playLists: [], // 推荐榜
    rankings: { 0: {}, 2: {}, 3: {} }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取轮播图数据
    this.getMusicBanner()
    getSongMenu().then(res => {
      this.setData({
        playLists: res.playlists
      })
    })

    //获取热门歌单
    getSongMenu().then(res => {
      this.setData({
        playLists: res.playlists
      })
    })

    // 获取推荐歌单
    getSongMenu('华语').then(res => {
      this.setData({
        recommendSongMenu: res.playlists
      })
    })

    // 发起共享数据的请求
    rankingStore.dispatch('getRanKingDataAction')

    //从store获取共享的数据   推荐歌单
    rankingStore.onState('hotRanking', (res) => {
      if (!res.tracks) return
      const recommendSongs = res.tracks.slice(0, 6)
      this.setData({
        recommendSongs
      })
    })
    rankingStore.onState("newRanking", this.getRankingHandler(0)) //新歌
    rankingStore.onState("originRanking", this.getRankingHandler(2)) // 原创
    rankingStore.onState("upRanking", this.getRankingHandler(3)) // 飙升
  },

  // 事件处理
  headClickInput() {
    wx.navigateTo({
      url: '/pages/detail-serrch/index',
    })
  },

  // 子组件的方法
  handMoreClick() {
    this.navigateToDetailSongPage("hotRanking")
  },

  handRankingClick(e) {
    const idx = e.currentTarget.dataset.idx;
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongPage(rankingName)
  },

  navigateToDetailSongPage(rankingName) {
    wx.navigateTo({
      url:`/pages/detail-songs/index?ranking=${rankingName}&type=rank`
    })
  },

  // 获取轮播图数据
  async getMusicBanner() {
    let res = await getBanners()
    this.setData({
      bannerList: res.banners
    })
  },

  // 获取图片高度
  handLeSwiper() {
    throttleQueryRect('.image').then(res => {
      const rect = res[0]
      // console.log(rect);
      this.setData({
        swiperHeight: rect.height
      })
    })
  },

  // onUnload(){
  //   rankingStore.onState("newRanking",this.getNewRankingHandler)
  // },

  // 从state获取新歌榜数据
  // getNewRankingHandler(res) {
  //   // console.log(res);
  //   if (Object.keys(res).length === 0) return
  //   const name = res.name
  //   const couverImgUrl = res.coverImgUrl
  //   const songList = res.tracks.slice(0,3)
  //   const rankingObj = {name,couverImgUrl,songList}
  //   const originRankings =[... this.data.rankings]
  //   originRankings.push(rankingObj)

  //   this.setData({ 
  //     rankings:originRankings
  //    })
  // },

  getRankingHandler(idx) {
    return (res) => {
      if (Object.keys(res).length === 0) return
      const name = res.name
      const couverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {
        name,
        couverImgUrl,
        songList,
        playCount
      }
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}

      this.setData({
        rankings: newRankings
      })
    }
  },

})