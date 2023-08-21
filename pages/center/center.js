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
    onLoad(options) {
        // this.assertLogin();
    },

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

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    // onShow2() {
    //     const _this = this;
    //     let account = getApp().account();
    //     if (account) {
    //         _this.setData({ account });
    //     } else {
    //         _this.setData({ account: null, card: null });
    //         return;
    //     }

    //     let card = getApp().card();
    //     if (card) {
    //         _this.setData({ card });
    //     } else {
    //         getApp()
    //             .getCardInfo()
    //             .then((res) => {
    //                 if (res.data.success) {
    //                     _this.setData({ card: res.data.data });
    //                 }
    //             });
    //     }
    // },
    onShow() {
        let account = getApp().account();
        if (account) {
            this.setData({ login: true });
        } else {
            this.setData({ login: false, account: null });
        }

        //如果已经登陆但是card和account信息为 null
        if (account && this.data.account === null) {
            this.setData({ account });
        }

        // if (account && this.data.card === null) {
        //     const _this = this;
        //     getApp()
        //         .getCardInfo()
        //         .then((res) => {
        //             if (res.data.success) {
        //                 _this.setData({
        //                     card: res.data.data,
        //                 });
        //             }
        //         });
        // } else if (account && this.data.card != null) {
        //     let card = getApp().card();
        //     this.setData({
        //         card: card,
        //     });
        // }
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
