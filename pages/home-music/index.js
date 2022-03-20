// pages/home-music/index.js
import {
  rankingStore,
  rankingMap,
  playeStore
} from "../../store/index"

import {
  getBanners,
  getSongMenu
} from '../../service/api_music'
import query_rect from '../../utils/query_rect'
import throttle from '../../utils/throttle'

const throttleQueryRect = throttle(query_rect,1000,{trailing:true})
Page({
  data: {
    swiperHeight: '',
    bannerList: [],
    recommendSongMenu: [],
    recommendSongs: [],
    playLists: [], // 推荐榜
    rankings: { 0: {}, 2: {}, 3: {} },
    currentSong:{},
    isPlaying:false,
    playAnimState:"paused"
  },

  onLoad: function (options) {
    playeStore.dispatch("playMusicWitthSongIdAction",{id:1842025914})
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
    this.setupPlayerStoreLiener()
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

  handlePlayBtnClick(){
    playeStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
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
      this.setData({swiperHeight: rect.height  })
    })
  },

  handleSongItemClick(e){
    let index = e.currentTarget.dataset.index
    playeStore.setState('playListSongs',this.data.recommendSongs)
    playeStore.setState('playListIndex',index)
  },

  setupPlayerStoreLiener(){
    // 排行榜监听
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

    // 播放器监听
    playeStore.onStates(['currentSong','isPlaying'],({currentSong,isPlaying})=>{
      if(currentSong) this.setData({currentSong})
      if(isPlaying != undefined ){
        this.setData({
          isPlaying,
          playAnimState:isPlaying?"running":"paused"
        })
      } 
    })
  },

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