const BaseUrl = "http://123.207.32.32:9001/"

class HYRequest {
    request(url,method,params){
        return new Promise((resolve,reject)=>{
            wx.request({
                url:BaseUrl + url,
                method,
                data:params,
                success:function(res){
                    resolve(res.data)
                },
                fail:reject
              })
        })
    }

    get(url,params){
        return this.request(url,'GET',params)
    }

    post(url,data){
        return this.request(url,'POST',data)
    }
}

const hyRequest = new HYRequest

export default hyRequest