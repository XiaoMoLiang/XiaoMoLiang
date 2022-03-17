// pages/music-player/index.js
import {
    getSongDetail,
    getSongLyric
} from '../../service/api_player'
import {
    audioContext
} from '../../store/player-store'
import {
    parseLyric
} from '../../utils/parse-lyric'
Page({

    data: {
        id: "",
        surrentSong: [],
        duration: 0,
        currentTime: 0,
        lyricInfos: [],
        currentLyricIndex: 0,
        currentLyricText: "",

        currentPage: 0,
        contentHeight: 0,
        isMusicLyric: true,
        sliderValue: 0,
        isSliderChaning: false
    },

    onLoad: function (options) {
        // 获取传入的id
        let id = options.id
        this.setData({
            id
        })

        // 根据id获取歌曲信息
        this.getPageData(id)

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

        // 使用audioContext播放歌曲
        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        // audioContext.autoplay = true

        this.setupAudioContextListener()
    },

    //  ==================== 网络请求  ====================
    getPageData(id) {
        getSongDetail(id).then(res => {
            this.setData({
                surrentSong: res.songs[0],
                duration: res.songs[0].dt
            })
        })

        getSongLyric(id).then(res => {
            const lyricString = res.lrc.lyric
            const lyrics = parseLyric(lyricString)
            this.setData({
                lyricInfos: lyrics
            })
        })
    },



    //  ====================  audio监听   ====================
    setupAudioContextListener() {
        audioContext.onCanplay(() => {
            // audioContext.play() // 播放
        })

        audioContext.onTimeUpdate(() => {
            // 获取当前时间
            const currentTime = audioContext.currentTime * 1000

            // 根据当前时间修改currentTIme/sliderValue
            if (!this.data.isSliderChaning) {
                const sliderValue = currentTime / this.data.duration * 100
                this.setData({
                    sliderValue,
                    currentTime
                })
            }

            // 根据当前时间去查找播放的歌词
            let i = 0
            for (; i < this.data.lyricInfos.length; i++) {
                const lyricInfo = this.data.lyricInfos[i]
                if (currentTime < lyricInfo.time) {
                    break
                }
            }

            // 设置当前歌词的索引和内容
            if (this.data.currentLyricIndex !== i - 1) {
                const currentLyricInfo = this.data.lyricInfos[i - 1]
                console.log(currentLyricInfo.text);
                this.setData({
                    currentLyricText: currentLyricInfo.text,
                    currentLyricIndex:i-1
                })
            }

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
            currentTime,
            sliderValue: value
        })

    },

    handleSiiderChang(e) {
        // 获取slider变化的值
        const value = e.detail.value

        // 计算需要播放的currentTime
        const currenTime = this.data.duration * value / 100

        // 设置context播放currenTIme位置的音乐
        audioContext.pause() // 先暂停一下以免异常
        audioContext.seek(currenTime / 1000) // 要传秒

        // 记录最新的sliderValue
        this.setData({
            sliderValue: value,
            isSliderChaning: false
        })
    },

})