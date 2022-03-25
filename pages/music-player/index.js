import {
    audioContext,
    playeStore
} from '../../store/player-store'

const playModeNames = ['order','repeat','random']
Page({

    data: {
        id: 0,

        surrentSong: [],
        duration: 0,
        lyricInfos: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        playModeIndex:0,
        playModeName:'order',

        isPlaying:false,
        playingName:'pause',

        currentPage: 0,
        contentHeight: 0,
        isMusicLyric: true,
        sliderValue: 0,
        isSliderChaning: false,
        lyricScrollTop: 0
    },

    onLoad: function (options) {
        // 获取传入的id
        let id = options.id
        this.setData({
            id
        })

        // 根据id获取歌曲信息
        this.setupPlayerStoreListener()

        // 动态计算内容高度
        const globalData = getApp().globalData
        const screenHeight = globalData.screenHeight
        const statusBarHeight = globalData.statusBarHeight
        const navBarHeight = globalData.navBarHeight
        const contentHeight = screenHeight - statusBarHeight - navBarHeight
        const deviceRadio = globalData.deviceRadio
        this.setData({
            contentHeight,
            isMusicLyric: deviceRadio <= 0.5
        })
    },

    //  ====================  事件处理   ====================
    handleSwiperChange(e) {
        const current = e.detail.current
        this.setData({
            currentPage: current
        })
    },

    handleliderChanging(e) {
        const value = e.detail.value
        const currentTime = this.data.duration * value / 100
        this.setData({
            isSliderChaning: true,
            currentTime
        })

    },

    handleSiiderChang(e) {

        // 获取slider变化的值
        const value = e.detail.value

        // 计算需要播放的currentTime
        const currenTime = this.data.duration * value / 100

        // 设置context播放currenTIme位置的音乐
        // audioContext.pause() // 先暂停一下以免异常
        if(!this.data.isPlaying){
            playeStore.dispatch("changeMusicPlayStatusAction",false)
        }
        audioContext.seek(currenTime / 1000) // 要传秒

        // 记录最新的sliderValue
        this.setData({
            sliderValue: value,
            isSliderChaning: false
        })
    },

    handleBackClick(){
        wx.navigateBack()
    },

    //播放模式
    handleModeBtnClick(){
        // 计算最新的playModeIndex
        let playModeIndex = this.data.playModeIndex + 1
        if(playModeIndex === 3) playModeIndex = 0
        // 设置playerStore中的playModeIndex
        playeStore.setState('playModeIndex',playModeIndex)
    },

    // 暂停开始
    handlePlayBtnClick(){
        playeStore.dispatch("changeMusicPlayStatusAction",!this.data.isPlaying)
    },

    // 上一首
    handlePrevBtnClick(){
        playeStore.dispatch("changeNewMusicAction",false)
    },
    // 下一首
    handleNextBtnClick(){
        playeStore.dispatch("changeNewMusicAction")
    },


    //  ====================  数据监听   ====================
    setupPlayerStoreListener() {
        // 监听currentSong、duration、lyricInfos
        playeStore.onStates(['currentSong', 'duration', 'lyricInfos'], ({
            currentSong,
            duration,
            lyricInfos
        }) => {
            if (currentSong) this.setData({
                surrentSong: currentSong
            })
            if (duration) this.setData({
                duration
            })
            if (lyricInfos) this.setData({
                lyricInfos
            })

        })

        // 监听currentTime/currentLyricIndex/currentLyricText
        playeStore.onStates(['currentTime','currentLyricIndex','currentLyricText'],({
            currentTime,
            currentLyricIndex,
            currentLyricText
        })=>{
            // 时间变化
            if(currentTime && !this.data.isSliderChaning) {
                const sliderValue = currentTime / this.data.duration * 100
                this.setData({ currentTime,sliderValue })
            } 
            // 歌词变化
            if(currentLyricIndex){
                this.setData({currentLyricIndex,lyricScrollTop:currentLyricIndex*35,})
            }
            if(currentLyricText){
                this.setData({currentLyricText})
            }
        })

        // 监听播放模式相关的数据
        playeStore.onStates(['playModeIndex','isPlaying'],({playModeIndex,isPlaying})=>{
            if(playModeIndex !== undefined){
                this.setData({
                    playModeIndex,
                    playModeName:playModeNames[playModeIndex]
                })
            }

            if(isPlaying !== undefined){
                this.setData({
                    isPlaying,
                    playingName:isPlaying ? 'pause' : 'resume'
                })
            }
            
        })
    }

})