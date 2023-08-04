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

    //跳转到登陆页面，登陆成功后跳转到当前页面
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
        let detail = getApp().account();
        if (detail) {
            this.setData({ detail });
        } else {
            this.setData({ detail: null });
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
        //判断是否登陆，如果未登录，就不执行下面的代码
        if (getApp().account() == null) {
            wx.stopPullDownRefresh();
            return;
        }

        getApp().getAccountDetail({
            before: () => {
                wx.showLoading({
                    title: '获取用户信息...',
                });
            },
            success: (res) => {
                wx.stopPullDownRefresh();
                if (res.data.success) {
                    // 获取用户信息成功
                    // 保存用户详细信息
                    res.data.data.avatarUrl = '/image/avatar.jpg';
                    if (res.data.data.account.role === 'user') {
                        getApp().account(res.data.data);
                        wx.showToast({
                            title: '获取用户信息成功',
                            icon: 'success',
                            duration: 2000,
                        });
                    } else {
                        wx.showToast({
                            title: '该账号不是用户',
                            icon: 'error',
                            duration: 2000,
                        });
                    }
                } else {
                    wx.showToast({
                        title: '获取用户信息失败',
                        icon: 'error',
                        duration: 2000,
                    });
                }
            },
            fail: (res) => {
                wx.stopPullDownRefresh();
                wx.showToast({
                    title: '获取用户信息失败',
                    icon: 'error',
                    duration: 2000,
                });
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
