// pages/account/account.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        account: null,
        login: false,
        avatar: null,
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

    //获取用户头像失败后使用默认头像
    avatarLoadError() {
        console.log('avatar load error');
        this.setData({
            avatar: '/image/default_avatar.svg',
        });
    },

    onShow() {
        if (getApp().token()) {
            let account = getApp().account();
            this.setData({
                login: true,
                account,
                avatar: `${getApp().globalData.host}:9000/ccms/avatar/${account.id}.jpg`,
            });
        } else {
            wx.navigateTo({
                url: '/pages/login/login?switchTab=/pages/center/center',
            });
        }
    },
});
