// 获取组件的属性（高度、宽度）
export default function ( select ){
  return new Promise((resolve)=>{
    const query = wx.createSelectorQuery()
    query.select(select).boundingClientRect()
    // query.exec(resolve) 简写
    query.exec((res)=>{
      // resolve(res)
    })
  })
    
}