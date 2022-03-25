// pages/home-pro/index.js
import {getUserInfo} from '../../service/api_login'
Page({
    data: {

    },
    onLoad: function (options) {

    },
    async handleGetUser() {
       const userInfo = await getUserInfo()
       console.log(userInfo);
    }
}) 