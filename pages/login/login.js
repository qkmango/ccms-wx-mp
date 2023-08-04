// pages/login/login.js
Page({
    /**
     * 页面的初始数据
     */
    data: {},

    loginSubmit: function (e) {
        console.log('loginSubmit');
        wx.showLoading({
            title: '登陆中...',
        });
        const { id, password } = e.detail.value;
        // 请求登陆
        wx.request({
            url: `${getApp().globalData.host}/api/account/system-login.do`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'POST',
            data: {
                id,
                password,
            },
            success: (res) => {
                if (res.data.success) {
                    // 登陆成功
                    // 保存token
                    getApp().token(res.data.data);

                    wx.showToast({
                        title: '登录成功',
                        icon: 'success',
                        duration: 2000,
                    });

                    // 获取用户详细信息
                    // this.getAccountDetail();
                    getApp().getAccountDetail({
                        before: () => {
                            wx.showLoading({
                                title: '获取用户信息...',
                            });
                        },
                        success: (res) => {
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
                                        complete: () => {
                                            wx.switchTab({
                                                url: this.data.switchTab,
                                            });
                                        },
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
                    });
                } else {
                    wx.showToast({
                        title: '用户名或密码错误',
                        icon: 'error',
                        duration: 2000,
                    });
                }
            },
        });
    },

    // getAccountDetail: function () {
    //     getApp().getAccountDetail({
    //         before: () => {
    //             wx.showLoading({
    //                 title: '获取用户信息...',
    //             });
    //         },
    //         success: (res) => {
    //             if (res.data.success) {
    //                 // 获取用户信息成功
    //                 // 保存用户详细信息
    //                 res.data.data.avatarUrl = '/image/avatar.jpg';

    //                 if (res.data.data.account.role === 'user') {
    //                     getApp().account(res.data.data);
    //                     wx.showToast({
    //                         title: '获取用户信息成功',
    //                         icon: 'success',
    //                         duration: 2000,
    //                         complete: () => {
    //                             wx.switchTab({
    //                                 url: this.data.switchTab,
    //                             });
    //                         },
    //                     });
    //                 } else {
    //                     wx.showToast({
    //                         title: '该账号不是用户',
    //                         icon: 'error',
    //                         duration: 2000,
    //                     });
    //                 }
    //             } else {
    //                 wx.showToast({
    //                     title: '获取用户信息失败',
    //                     icon: 'error',
    //                     duration: 2000,
    //                 });
    //             }
    //         },
    //     });
    // },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            switchTab: options.switchTab || '/pages/account/account',
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

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
