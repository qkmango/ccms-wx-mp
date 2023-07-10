// pages/account/account.js
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },

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
    
        let global_JSESSIONID = getApp().globalData.JSESSIONID;
        let global_userInfo = getApp().globalData.userInfo;
        let storage_JSESSIONID = wx.getStorageSync('JSESSIONID');

        if (global_JSESSIONID === null || global_JSESSIONID === undefined || global_JSESSIONID === '') {
            if (storage_JSESSIONID === null || storage_JSESSIONID === undefined || storage_JSESSIONID === '') {
                this.setData({ userInfo: null });
                return;
            } else {
                getApp().globalData.JSESSIONID = storage_JSESSIONID;
                global_JSESSIONID = storage_JSESSIONID;
            }
        }

        if (global_userInfo === null || global_userInfo === undefined || global_userInfo === '') {
            this.getUserInfo(global_JSESSIONID, (res, that) => {
                if (res.data.success) {
                    let userInfo = res.data.data;
                    userInfo.avatarUrl = '/image/avatar.jpg';
                    //添加到页面 data 中
                    that.setData({ userInfo });
                    //存储到全局变量
                    getApp().globalData.userInfo = userInfo;
                }
            });
        } else {
            this.setData({ userInfo: global_userInfo });
        }
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
    onPullDownRefresh() {
        console.log('onPullDownRefresh');

        //判断是否登陆，如果未登录，就不执行下面的代码
        if (this.data.userInfo == null) {
            wx.stopPullDownRefresh();
            return;
        }

        //重新获取用户信息
        this.getUserInfo(getApp().globalData.JSESSIONID, (res, that) => {
            if (res.data.success) {
                let userInfo = res.data.data;
                userInfo.avatarUrl = '/image/avatar.jpg';
                //添加到页面 data 中
                that.setData({ userInfo });
                //存储到全局变量
                getApp().globalData.userInfo = userInfo;
                // wx.hideLoading();
                wx.stopPullDownRefresh();
            }
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
});
