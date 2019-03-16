Page({

  /**
   * 页面的初始数据
   */
  data: {
     futureWeather:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('list_onload')
    let city = options.city;//从index页面传入的city值
    this.getFutureWeather(city);
  },
  getFutureWeather(city,callBack){
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: city,
        time: new Date().getTime()
      },
      success: (res) => {
        // console.log(res.data);
        let result = res.data.result;
        let futureWeather = [];
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        const weekDay = {
          '0': '一',
          '1': '二',
          '2': '三',
          '3': '四',
          '4': '五',
          '5': '六',
          '6': '日'
        }
        for (let i = 0; i < result.length; i++) {
          futureWeather.push({
            weekDay: '星期' + weekDay[i],
            date: year + '-' + month + '-' + (day + i),
            minTemp: result[i].minTemp + 'º',
            maxTemp: result[i].maxTemp + 'º',
            weatherIcon: '../images/' + result[i].weather + '-icon.png'
          })
        };
        futureWeather[0].weekDay = "今天";
        this.setData({ futureWeather });
      },
      complete:()=>{
        callBack && callBack();
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('list_onReady');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('list_onShow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('list_onHide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('list_onUnload');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
     this.getFutureWeather(()=>{
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