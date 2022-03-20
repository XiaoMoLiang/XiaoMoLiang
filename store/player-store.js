import {
    HYEventStore
} from 'hy-event-store'
import {
    getSongDetail,
    getSongLyric
} from '../service/api_player'
import {
    parseLyric
} from '../utils/parse-lyric'

const audioContext = wx.createInnerAudioContext()

const playeStore = new HYEventStore({
    state: {
        isFirstPlay:true,

        id: 0,
        currentSong: {},
        duration: 0,
        lyricInfos: [],

        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        isPlaying: false,

        playModeIndex: 0, // 0 ：循环播放 1：单曲循环 2：随机播放
        playListSongs: [],
        palyListIndex: 0


    },
    actions: {
        playMusicWitthSongIdAction(ctx, { id, isRefresh = false }) {
            if (id == ctx.id && !isRefresh ) {
                this.dispatch("changeMusicPlayStatusAction", true)
                return
            }
            ctx.id = id

            // 修改播放状态
            ctx.isPlaying = true
            ctx.currentSong = {}
            ctx.duration = 0
            ctx.lyricInfos = []
            ctx.currentTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ''

            // 请求歌曲详情
            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0]
                ctx.duration = res.songs[0].dt
            })

            // 请求歌词
            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric
                const lyrics = parseLyric(lyricString)
                ctx.lyricInfos = lyrics
            })

            // 使用audioContext播放歌曲
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = true

            // 监听audioContext一些事件
            if(ctx.isFirstPlay){
                this.dispatch("setupAudioContextListenerAction")
                ctx.isFirstPlay = false
            }
            
        },

        setupAudioContextListenerAction(ctx) {
            // 监听歌曲可以播放
            audioContext.onCanplay(() => {
                audioContext.play() // 播放
            })
            // 监听歌曲时间改变
            audioContext.onTimeUpdate(() => {
                // 获取当前时间
                const currentTime = audioContext.currentTime * 1000

                // 根据当前时间修改currentTIme/sliderValue
                ctx.currentTime = currentTime

                // 根据当前时间去查找播放的歌词
                if (!ctx.lyricInfos.length) return
                let i = 0
                for (; i < ctx.lyricInfos.length; i++) {
                    const lyricInfo = ctx.lyricInfos[i]
                    if (currentTime < lyricInfo.time) {
                        break
                    }
                }

                // 设置当前歌词的索引和内容
                const currentIndex = i - 1
                if (ctx.currentLyricIndex !== currentIndex) {
                    const currentLyricInfo = ctx.lyricInfos[currentIndex]
                    ctx.currentLyricIndex = currentIndex
                    ctx.currentLyricText = currentLyricInfo.text
                }

            })
            // 监听歌曲播放完成
            audioContext.onEnded(()=>{
                this.dispatch("changeNewMusicAction")
            })
        },

        changeMusicPlayStatusAction(ctx, isPlaying = true) {
            ctx.isPlaying = isPlaying
            ctx.isPlaying ? audioContext.play() : audioContext.pause()
        },

        // 播放下一首/上一首
        changeNewMusicAction(ctx,isNext = true) {
            // 获取索引
            let index = ctx.palyListIndex
            // 根据不同的播放模式，获取下一首的索引
            switch (ctx.playModeIndex) {
                case 0: //顺序播放
                    index = isNext ? index + 1 : index - 1
                    if (index === -1) index = ctx.playListSongs.length - 1
                    if (index === ctx.playListSongs.length) index = 0
                    break
                case 1: //单曲循环
                    break
                case 2: //随机播放
                    index = Math.floor(Math.random() * ctx.playListSongs.length)
                    break
            }

            // 获取歌曲
            let currentSong = ctx.playListSongs[index]
            if (!currentSong) {
                currentSong = ctx.currentSong
            }else{
                // 记录最新的索引
                ctx.palyListIndex = index
            }

            //播放新的歌曲
            this.dispatch("playMusicWitthSongIdAction", {
                id: currentSong.id,
                isRefresh:true
            })
        },

    }

})

export {
    audioContext,
    playeStore
}