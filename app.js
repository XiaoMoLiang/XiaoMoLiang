// app.js
import {getLoginCode,sendCodeToToken,checkToken,checkSession} from './service/api_login'
import {TOKEN_KEY} from './constants/token-const'
App({
    globalData: {
        screenWidth: 0,
        screenHeight: 0,
        statusBarHeight: 0,
        navBarHeight: 44,
        deviceRadio: 0
    },
    onLaunch() {
        // 获取设备信息
        const info = wx.getSystemInfoSync()
        this.globalData.screenWidth = info.screenWidth
        this.globalData.screenHeight = info.screenHeight
        this.globalData.statusBarHeight = info.statusBarHeight

        let deviceRadio = (info.screenWidth / info.screenHeight)
        this.globalData.deviceRadio = deviceRadio

        // 让用户默认进行登录
        this.handleLogin()

       
        
    },
    async handleLogin(){
        const token = wx.getStorageSync(TOKEN_KEY)
        // token有没有过期
        
        const checkResult =await checkToken(token)
        // console.log(checkResult);
        
        // 判断session是否过期
        const isSessinoExpire = await checkSession()
        if(!token || checkResult.errorCode || !isSessinoExpire){
            this.loginAction()
        }
    },
    async loginAction() {
        // 获取code
        const code = await getLoginCode()
        // console.log(code);

        // 将code发送给服务器
        const result = await sendCodeToToken(code)
        // 获取token
        const token = result.token
        wx.setStorageSync(TOKEN_KEY, token)
    }
})