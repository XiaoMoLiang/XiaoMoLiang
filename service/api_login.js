import {hyLoginRequest} from './index'

export function getLoginCode(){
    return new Promise((resolve,reject)=>{
        wx.login({
          timeout: 1000,
          success:res=>{
              const code = res.code
              resolve(code)
          },
          fail:err=>{
            console.log(err);
            reject(err)
          }
        })
    })
}

export function sendCodeToToken(code){
   return hyLoginRequest.post("/login",{code})
}

export function checkToken(){
  return hyLoginRequest.post("/auth",{},true)
}

export function checkSession(){
  return new Promise((resolve)=>{
    wx.checkSession({
      success: () => {
        resolve(true)
      },
      fail:()=>{
        resolve(false)
      }
    })
  })
}

export function getUserInfo(){
  return new Promise((resolve,reject)=>{
     // 获取用户信息
     wx.getUserProfile({
      desc: '0.0',
      success: (res) => {
        resolve(res.userInfo);
      },
      fail:err=>{
        reject(err)
      }
  })
  })
}