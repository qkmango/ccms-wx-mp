import { Auth } from '../../utils/api.js';

Page({
    data: {
        switchTab: '/pages/center/center',
    },

    loginSubmit: function (e) {
        const _this = this;
        wx.showLoading({
            title: '登陆中...',
        });
        const { id, password } = e.detail.value;
        // 请求登陆
        Auth.login(id, password)
            .then((res) => {
                getApp().token(res.data.token);
                getApp().account(res.data.account);
                wx.switchTab({
                    url: _this.data.switchTab,
                });
            })
            .catch((res) => {
                wx.showToast({
                    title: '登录失败',
                    icon: 'error',
                    duration: 2000,
                });
            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            switchTab: options.switchTab || '/pages/center/center',
        });
    },
});
