// pages/account/account.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        detail: null
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
        this.assertLogin();
    },

    // 判断是否登陆
    assertLogin: function () {
        let account = getApp().account();
        if (account) {
            this.setData({ detail: { account } });
        } else {
            this.setData({ detail: null });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        let card = getApp().card();
        const _this = this;
        if (card) {
            this.setData({
                detail: {
                    card,
                },
            });
        } else {
            getApp().getCardInfo({
                success: (res) => {
                    if (res.data.success) {
                        // 获取卡片信息成功
                        // 保存卡片信息
                        getApp().card(res.data.data);
                    }
                },
            });
        }
    },

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
            },
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
