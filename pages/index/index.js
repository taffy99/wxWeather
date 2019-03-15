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
    nowWeatherBackground: '',
    forecastList:[],
    minTemp:'',
    maxTemp:'',
    nowdate:''
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getNow();
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
        // console.log(res.data);
        let result = res.data.result;
        this.setNow(result);
        this.setFuture(result);
      },
      complete:()=>{
        callBack && callBack();
      }
    })
  },
  setNow(result){ //获取当前天气
    let temp = result.now.temp;
    let weather = result.now.weather;
    let today = result.today;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();
    this.setData({
      nowTemp: temp + 'º',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '../images/' + weather + '-bg.png',
      minTemp:today.minTemp+'º',
      maxTemp:today.maxTemp+'º',
      nowdate:year+'-'+ month +'-'+day
    });

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: backgroundColor[weather],
    });
  },
  setFuture(result){ //获取未来天气
    let forecast = result.forecast;
    let nowHour = new Date().getHours();//获取当前时间
    let forecastList = [];
    for (let i = 0; i < 8; i++) {
      forecastList.push({
        time: (i * 3 + nowHour) % 24 + "时",
        iconpath: '../images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + 'º'
      })
    };
    forecastList[0].time = "现在";
    this.setData({ forecastList }); 
  }, 
  //点击当天天气
  onTapDayWeather(){
    wx.navigateTo({
      url: '/pages/list/list',
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