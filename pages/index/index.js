// pages/index/index.js
const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};
const backgroundColor = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: ''

  },

  // 获取api数据
  getNow(callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: "上海市"
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let result = res.data.result;
        let temp = result.now.temp;
        let weather = result.now.weather;

        this.setData({
          nowTemp: temp,
          nowWeather: weatherMap[weather],
          nowWeatherBackground: './images/' + weather + '-bg.png'
        });

        wx.setNavigationBarColor({
          frontColor: '#000000',
          backgroundColor: backgroundColor[weather],
        });
      },
      complete:()=>{
        callBack && callBack();
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getNow();
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
    this.getNow(()=>{
      wx.stopPullDownRefresh();
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})