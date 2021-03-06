// components/song-item-v1/index.js
import {
    playeStore
} from '../../store/index'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleSongItemClick() {
            let id = this.properties.item.id
            // 页面跳转
            wx.navigateTo({
                url: '/pages/music-player/index?id=' + id,
            })
            // 对歌曲的数据请求和其他操作
            playeStore.dispatch("playMusicWitthSongIdAction",{id})
            // 获取到播放列表/当前歌曲的索引
            
        }
    }
})