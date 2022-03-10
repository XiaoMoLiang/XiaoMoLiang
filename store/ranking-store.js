import {
    HYEventStore
} from "hy-event-store" // 引入库

// 导入API
import {
    getRanKing
} from "../service/api_music"

const rankingMap = {0:"newRanking",1:"hotRanking",2:"originRanking",3:"upRanking"}

const rankingStore = new HYEventStore({
    state: {
        newRanking:{}, // 新歌榜
        hotRanking: {}, //热歌榜
        originRanking: {}, //原创榜
        upRanking: {}, //飙升榜

    },
    actions: {
        getRanKingDataAction(ctx) {
            // 0: 新歌榜 1:热歌榜 2：原创榜 3：飙升榜
            for (let i = 0; i < 4; i++) {
                getRanKing(i).then(res => {
                   const rankingName = rankingMap[i]
                   ctx[rankingName] = res.playlist
                    // switch (i) {
                    //     case 0:
                    //         ctx.newRanking = res.playlist
                    //         break;
                    //     case 1:
                    //         ctx.hotRanking = res.playlist
                    //         break;
                    //     case 2:
                    //         ctx.originRanking = res.playlist
                    //         break;
                    //     case 3:
                    //         ctx.upRanking = res.playlist
                    //         break;
                    // }
                })
            }

        }
    }
})

export {
    rankingStore,
    rankingMap
}