// pages/account/account.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        account: null,
        // card: null,
        login: false,
    },

    //判断是否登陆
    // login: function () {
    //     return !(getApp().account() === null || getApp().account() === undefined);
    // },

    toSettingsPage: function () {
        wx.navigateTo({
            url: '/pages/settings/settings',
        });
    },

    //跳转到登陆页面，登陆成功后跳转到当前页面
    toLoginPage: function () {
        wx.navigateTo({
            url: '/pages/login/login?switchTab=/pages/center/center',
        });
    },

    // 跳转到部门页面
    toDeptPage: function () {
        wx.navigateTo({
            url: '/pages/dept/dept',
        });
    },

    //跳转到消费记录页面
    toConsumePage: function () {
        wx.navigateTo({
            url: '/pages/consume/consume',
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},

    // 判断是否登陆
    // assertLogin: function () {

    // },

    reloadAccountInfo() {
        wx.showLoading({
            title: '刷新中...',
        });
        getApp()
            .getAccountInfo()
            .then((res) => {
                if (res.data.success) {
                    this.setData({ account: res.data.data });
                }
            })
            .finally(() => {
                wx.hideLoading();
            });
    },
    reloadCardInfo() {
        wx.showLoading({
            title: '刷新中...',
        });
        getApp()
            .getCardInfo()
            .then((res) => {
                if (res.data.success) {
                    this.setData({ card: res.data.data });
                }
            })
            .finally(() => {
                wx.hideLoading();
            });
    },

    onShow() {
        if (getApp().token()) {
            this.setData({
                login: true,
                account: getApp().account(),
            });
        } else {
            wx.navigateTo({
                url: '/pages/login/login?switchTab=/pages/center/center',
            });
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
});
