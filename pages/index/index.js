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
const QQMapWX = require('../../libs/qqmap-wx-jssdk.js');

//设置地址授权弹窗状态变量
const UNPROMPTED = 0; //未提示
const UNAUTHORIZED = 1;//未授权
const AUTHORIZED = 2;//已授权

// 用wx: if 替换 locationTip
// const UNPROMPTED_TIPS = "点击获取当前位置";
// const UNAUTHORIZED_TIPS = "点击开启位置权限";
// const AUTHORIZED_TIPS = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTemp: '', //当前温度
    nowWeather: '', //当前天气
    nowWeatherBackground: '',
    forecastList: [],
    minTemp: '', //最低温度
    maxTemp: '', //最高温度
    nowdate: '', //当前日期
    city: '上海市',//当前城市
    locationState: 0,
    //locationTip: '点击获取当前位置'
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getNow();
    this.qqmapsdk = new QQMapWX({
      key: 'MGCBZ-XC7KI-EGSGL-5E4F2-PNSGT-ODFL7'
    });
    //判断是否地址授权
    wx.getSetting({
      success:(res)=>{
        let auth = res.authSetting['scope.userLocation'];
        this.data.locationState = auth ? AUTHORIZED : (auth == false) ? UNAUTHORIZED : UNPROMPTED;
        // this.data.locationTip = auth ? AUTHORIZED_TIPS : (auth == false) ? UNAUTHORIZED_TIPS : UNPROMPTED_TIPS;
        if(auth){
          this.getLocation();
        }
      }
    })
  },

  //获取地理位置
  onTapLocation() {
    if (this.data.locationState === 1) { //未授权
      wx.openSetting({
          success: (res) => {
            let auth = res.authSetting['scope.userLocation'];
            //授权从无到有
            if (auth) {
              this.getLocation();
            }
          }
       //打开设置页面
      })
    }else {
      this.getLocation();
    }
  },
  getLocation() {
    wx.getLocation({
      success: (res) => {
        this.setData({
          locationState: AUTHORIZED,
          //locationTip: AUTHORIZED_TIPS
        })
        const latitude = res.latitude;
        const longitude = res.longitude;

        this.qqmapsdk.reverseGeocoder({
          location: {
            latitude,
            longitude
          },
          success: (res) => {
            let city = res.result.address_component.city;
            this.setData({
              city: city,
             // locationTip: ''
            });
            this.getNow();
          }
        })
      },
      fail: () => {
        this.setData({
          locationState: UNAUTHORIZED,
         // locationTip: UNAUTHORIZED_TIPS
        })
      }
    })
  },


  // 获取api数据
  getNow(callBack) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        let result = res.data.result;
        this.setNow(result);
        this.setFuture(result);
      },
      complete: () => {
        callBack && callBack();
      }
    })
  },
  setNow(result) { //获取当前天气
    let temp = result.now.temp;
    let weather = result.now.weather;
    let today = result.today;
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    this.setData({
      nowTemp: temp + 'º',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '../images/' + weather + '-bg.png',
      minTemp: today.minTemp + 'º',
      maxTemp: today.maxTemp + 'º',
      nowdate: year + '-' + month + '-' + day
    });

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: backgroundColor[weather],
    });
  },
  setFuture(result) { //获取未来天气
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
  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('index_onReady')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log('index_onShow')
  },

/**
 * 生命周期函数--监听页面隐藏
 */
onHide: function () {
  //console.log('index_onHide')
},

/**
 * 生命周期函数--监听页面卸载
 */
onUnload: function () {
  // console.log('index_onUnload')
},

/**
 * 页面相关事件处理函数--监听用户下拉动作
 */
onPullDownRefresh: function () {
  this.getNow(() => {
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