// miniprogram/pages/goPage/goPage.js
let wxUtils = require('../../wxUtils/wxUtils.js');
const APP = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ac_id : '',//当前活动id
    ac_Name : '今天谁去拿外卖',
    needLog: true,//需要授权吗？
    hasShared : true,//是否已经分享过了
    showSharedPic : false,//分享图片弹窗开关
    shenhe: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //审核接口
    this.setData({
      shenhe: APP.shenhe
    });

    //如果是自己创建的活动，需要分享后才能打开，其他人不用(涉嫌诱导分享，审核阶段)
    if (options.creater && !this.data.shenhe) {
      this.setData({
        hasShared: false
      });
    }

    this.userLogin(); //用户是否需要授权

    let { ac_Name,ac_id} = options;
    this.setData({
      ac_id : ac_id,
      ac_Name: ac_Name
    });
    wx.setNavigationBarTitle({ title: ac_Name});

    //如果已经参与过了本次活动,直接跳转到结果页
    wxUtils.request('judgeHasJoined', { ac_id: ac_id},(res)=>{
      let hasJoined = res.result.code;
      if (hasJoined){
        wx.navigateTo({
          url: `/pages/result/result?ac_id=${ac_id}&ac_Name=${ac_Name}`,
        })
      }
    })
  },

  userLogin(){
    //判断此用户有没有在缓存留下用户信息
    wxUtils.hasUserInfo((hasUserInfo) => {
      this.setData({
        needLog: hasUserInfo ? false : true
      });
    });
  }, 

  getUserInfo(res) {
    if (res.detail.userInfo) {
      let userInfo = res.detail.userInfo;
      wxUtils.request('userLogin', userInfo, (res) => {
        if (res.result) {
          this.setData({
            needLog: false
          });
          wx.setStorageSync('userInfo', userInfo);
          this.joinGame();
        }
      })
    } else {
      wx.showToast({
        title: '授权才能使用哦',
        icon: 'loading'
      })
    }
  },

  joinGame(){
    if(this.data.hasShared){//涉及诱导分享 这个功能走不了 hasShared永远都是true
      wxUtils.request('joinGame', { ac_id: this.data.ac_id }, successFuc.bind(this), failFuc.bind(this), complete.bind(this));
    }else{
      wxUtils.showPopModel();
    }

    function successFuc(res){
      let self = this;
      let result = res.result;
      if (result && (result.code == 0 || result.code == 2)) {
        //加入房间异常
        wx.showModal({
          title: result.msg,
          content: `回首页重新发起抽签吧`,
          showCancel: false,
          confirmText: '去首页',
          success: (data) => {
            if (data.confirm) {
              wx.switchTab({
                url: '../index/index',
              })
            }
          }
        })
      } else {
        //加入房间成功 可能情况1、直接抽签  2、自己抽过签   3、抽签活动已满人 
        wx.navigateTo({
          url: `/pages/result/result?ac_id=${self.data.ac_id}&ac_Name=${self.data.ac_Name}`,
        })
      }
    }

    function failFuc(err){
      let self = this;
      // console.log('抽签请求错误', err)
    }
    function complete(){
      let self = this;
    }
  },

  getShareImage(e){
    // console.log('getImage');
    this.setData({
      hasShared : true,
      showSharedPic : true
    })
  },

  closeComponent(e){
    // console.log('close Component');
    this.setData({
      showSharedPic: false
    })
  },

  backIndex(e){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    // if(e.from == 'button'){
      this.setData({
        hasShared : true
      })

      return {
        title : `抽出那个幸运仔 : ${this.data.ac_Name}`,
        path: `pages/goPage/goPage?ac_id=${this.data.ac_id}&ac_Name=${this.data.ac_Name}`
      }
    // }
  }
})