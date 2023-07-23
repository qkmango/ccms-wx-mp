// pages/list/list.js
import QRCode from '../../utils/weapp-qrcode';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        width: 512,
        height: 512,
        content: '0',
        size: {
            w: 0,
            h: 0,
        },
        logined: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (getApp().account()) {
            this.setData({
                logined: true,
            });
            wx.showLoading({
                title: '刷新中...',
                mask: true,
            });
            this.setData({ size: this.setCanvasSize() });
            this.setData({
                content: Date.now(),
            });
            this.drawQRCode();
            wx.hideLoading();
        }
    },

    //重新绘制二维码
    refresh: function () {
        //加载中
        wx.showLoading({
            title: '刷新中...',
            mask: true,
        });
        this.setData({
            content: Date.now(),
        });
        this.drawQRCode();
        wx.hideLoading();
    },

    //绘制二维码
    drawQRCode: function () {
        let that = this;
        new QRCode('qrcode', {
            text: that.data.content + '',
            width: this.data.size.w,
            height: this.data.size.h,
            correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        });
    },

    setCanvasSize: function () {
        let that = this;
        let size = {};
        try {
            let res = wx.getSystemInfoSync();
            let scale = 750 / res.windowWidth;
            let width = that.data.width / scale;
            let height = width;
            size.w = width;
            size.h = height;
        } catch (e) {
            console.log('获取设备信息失败' + e);
        }
        return size;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (getApp().account()) {
            this.drawQRCode();
            this.setData({
                logined: true,
            });
        } else {
            this.setData({
                logined: false,
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
