// pages/account/account.js
Page({
    /**
     * 页面的初始数据
     */
    data: {},

    //微信授权登陆
    login: function () {
        wx.getUserProfile({
            desc: '登陆授权',
            success: (res) => {
                getApp().globalData.userInfo = res.userInfo;
            },
            fail: (res) => {
                console.log('授权失败');
                console.log(res);
            },
        });
    },

    /**
     * 获取用户信息
     * @param {string} JSESSIONID
     * @param {function} callback
     * @returns
     */
    getUserInfo: function (JSESSIONID, callback) {
        console.log('JSESSIONID', JSESSIONID);
        if (!JSESSIONID) {
            console.error('JSESSIONID is null');
            return;
        }

        const that = this;

        wx.request({
            url: `${getApp().globalData.host}/account/one/info.do`,
            method: 'GET',
            header: {
                'content-type': 'application/json',
                cookie: JSESSIONID,
            },
            success: (res) => {
                callback && callback(res, that);
            },
        });
    },

    toSettingsPage: function () {
        wx.navigateTo({
            url: '/pages/settings/settings',
        });
    },

    toLoginPage: function () {
        wx.navigateTo({
            url: '/pages/login/login?switchTab=/pages/account/account',
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.assertLogin();
    },

    // 判断是否登陆
    assertLogin: function () {
        let JSESSIONID = getApp().globalData.JSESSIONID;
        getApp().globalData.host;

        // 如果 globalData 中没有 JSESSIONID，再看看缓存中有没有
        if (JSESSIONID === null || JSESSIONID === undefined || JSESSIONID === '') {
            JSESSIONID = wx.getStorageSync('JSESSIONID');
            getApp().globalData.JSESSIONID = JSESSIONID;
            // 如果缓存中也没有，说明没有登陆
            this.setData({ userInfo: null });
            return;
        }

        // 代码执行到这里，说明 globalData 中有 JSESSIONID，获取用户信息
        this.getUserInfo(JSESSIONID, (res, that) => {
            if (res.data.success) {
                let userInfo = {
                    nickName: res.data.data.account.name,
                    avatarUrl: '/image/avatar.jpg',
                };
                //添加到页面 data 中
                that.setData({ userInfo });
                //存储到全局变量
                getApp().globalData.userInfo = that.data.userInfo;
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log('onShow');
        this.assertLogin();
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
