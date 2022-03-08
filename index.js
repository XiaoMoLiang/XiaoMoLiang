const BASE_URL = "http://123.207.32.32:9001/"


class JHrequest {
    request(url,methos,pramas) {
        return new Promise((resolve,reject)=>{
            wx.request({
              url: BASE_URL + url,
              methos,
              pramas,
              success(res){
                resolve(res)
              },
              fail(err){
                  reject(err)
              }
            })
        })

    }

    get(url,pramas){
        return this.request(url,"GET",pramas)
    }

    post(url,data){
        return this.request(url,"POST",data)
    }
}

const jhrequest = new JHrequest

export default jhrequest