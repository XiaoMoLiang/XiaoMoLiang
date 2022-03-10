// pages/detail-songs/index.js
import {
    rankingStore
} from '../../store/index'
import {getSongDetail} from "../../service/api_music"
Page({

    data: {
        type:"",
        ranking: "",
        songInfo: {},
    },

    onLoad: function (options) {
        const type = options.type
        this.setData({type:options.type})
        if (type === "menu") {
            const id = options.id
            getSongDetail(id).then(res=>{
                this.setData({songInfo:res.playlist})
            })
        } else if (type === "rank") {
            const ranking = options.ranking
            this.setData({ ranking})
            // 获取数据  //通过穿过来的值 指定葱onState获取指定的数据 如：ranking = :hotRanking 就会去State获取hotRanking的数据
            rankingStore.onState(ranking, this.getRankingDataHanlder)
        }
    },


    onUnload: function () {
        if(this.data.ranking){
            rankingStore.offState(this.data.ranking, this.getRankingDataHanlder)
        }
        
    },

    // 根据ranking 获取state的数据
    getRankingDataHanlder(res) {
        console.log(res);
        // 把获取到的数据传入data 然后页面展示
        this.setData({
            songInfo: res
        })
    }

})