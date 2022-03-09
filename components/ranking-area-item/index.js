// components/ranking-item/index.js
import query_rect from "../../utils/query_rect"
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            value: {},
            swiperHeight:""
        }
    },
    created() {
        this.handLeSwiper()
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
        // 获取图片高度
        handLeSwiper() {
            query_rect('.right').then(res => {
                const rect = res[0]
                console.log(rect,111);
                this.setData({
                    swiperHeight: rect.height
                })
            })
        },
    }
})