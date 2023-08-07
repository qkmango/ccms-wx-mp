// pages/list/list.js
import QRCode from '../../utils/weapp-qrcode';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        width: 512,
        height: 512,
        // content: '0',
        qrcode: {
            code: null,
            account: null,
        },
        size: {
            w: 0,
            h: 0,
        },
        login: false,
        // 二维码是否已经绘制
        render: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (!getApp().account()) {
            return false;
        }

        this.setData({
            login: true,
        });

        wx.showLoading({
            title: '刷新中...',
            mask: true,
        });
        this.setData({ size: this.setCanvasSize() });

        this.createQrCode()
            .then((res) => {
                this.setData({
                    qrcode: res,
                });
                this.drawQRCode();
            })
            .finally(() => {
                wx.hideLoading();
            });
    },

    //重新绘制二维码
    refresh: function () {
        //加载中
        wx.showLoading({
            title: '刷新中...',
            mask: true,
        });

        this.createQrCode()
            .then((res) => {
                this.setData({
                    qrcode: res,
                });
                this.drawQRCode();
                // wx.hideLoading();
            })
            .finally(() => {
                wx.hideLoading();
            });
    },

    //绘制二维码
    drawQRCode: function () {
        let that = this;
        new QRCode('qrcode', {
            text: JSON.stringify(that.data.qrcode),
            width: this.data.size.w,
            height: this.data.size.h,
            correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
        });
        that.setData({
            render: true,
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
     * 获取二维码
     */
    createQrCode() {
        this.setData({
            render: false,
        });
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/pay/create-qrcode.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: getApp().token(),
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        // console.log(res.data.data);
                        // console.log(JSON.stringify(res.data.data));
                        resolve(res.data.data);
                    } else {
                        reject();
                    }
                },
                fail: (res) => {
                    reject();
                },
            });
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
        if (getApp().account()) {
            this.setData({
                login: true,
            });
        } else {
            this.setData({
                login: false,
            });
        }
        if (!this.render) {
            this.drawQRCode();
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
