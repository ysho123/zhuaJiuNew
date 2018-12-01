const ald = require('./AldUtils/ald-stat.js')
const wxUtils = require('./wxUtils/wxUtils.js');


//app.js
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'real-7ac34f',
        traceUser: true,
      })

      this.shenhe();//审核接口
    }

    this.globalData = {}
  },

  shenhe(){
    wxUtils.request('shenhe',{},(res)=>{
      this.shenhe = res.result.data.shenhe ;
      console.log(this.shenhe);
    });
  }
  
})
