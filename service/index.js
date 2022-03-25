import {TOKEN_KEY} from '../constants/token-const'

const token = wx.getStorageSync(TOKEN_KEY)

const BaseUrl = "http://123.207.32.32:9001/"

const LOGIN_BASE_URL = "http://123.207.32.32:3000"

class HYRequest {
    constructor(baseUrl,authHeader = {}){
        this.baseUrl = baseUrl
        this.authHeader = authHeader
    }
    request(url,method,params,isAuth = false ,header = {}){
        const finalHeader = isAuth ? {...this.authHeader,...header} : header
        return new Promise((resolve,reject)=>{
            wx.request({
                url:this.baseUrl + url,
                method,
                header:finalHeader,
                data:params,
                success:function(res){
                    resolve(res.data)
                },
                fail:reject
              })
        })
    }

    get(url,params,isAuth= false,header){
        return this.request(url,'GET',params,header,isAuth)
    }

    post(url,data,isAuth = false,header){
        return this.request(url,'POST',data,header,isAuth)
    }
}

const hyRequest = new HYRequest(BaseUrl)

const hyLoginRequest = new HYRequest(LOGIN_BASE_URL,{
    token
})

export default hyRequest
export {
    hyLoginRequest
}