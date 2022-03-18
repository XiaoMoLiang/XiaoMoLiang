// components/song-item-v2/index.js
import {
    playeStore
} from '../../store/index'

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        index:{
            type:Number,
            value:0
        },
        // 接受父组件传过来的数据
        item:{
            type:Object,
            value:{}
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
        handleSongItemClick(){
            let id = this.properties.item.id
            wx.navigateTo({
              url: '/pages/music-player/index?id='+ id,
            })
            playeStore.dispatch("playMusicWitthSongIdAction",{id})
        }
    }
})
