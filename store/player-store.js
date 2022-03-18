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
        id: 0,
        currentSong: {},
        duration: 0,
        lyricInfos: [],
        
        currentTime: 0,
        currentLyricIndex: 0,
        currentLyricText: "",

        isPlaying:false,

        playModeIndex:0, // 0 ：循环播放 1：单曲循环 2：随机播放

    },
    actions: {
        playMusicWitthSongIdAction(ctx, {
            id
        }) {

            // 修改播放状态
            ctx.isPlaying = true

            ctx.id = id
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
            this.dispatch("setupAudioContextListenerAction")
        },

        setupAudioContextListenerAction(ctx){
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
        },

        changeMusicPlayStatusAction(ctx){
            ctx.isPlaying = !ctx.isPlaying
            ctx.isPlaying ? audioContext.play() : audioContext.pause()
        }


    }

})

export {
    audioContext,
    playeStore
}