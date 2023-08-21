// pages/list/list.js
import QRCode from '../../utils/weapp-qrcode';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        width: 512,
        height: 512,
        qrcode: {
            code: null,
            account: null,
        },
        size: {
            w: 0,
            h: 0,
        },
        login: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //判断登陆
        let account = getApp().account();
        let card = getApp().card();

        //判断状态
        if (!(account && account.state === 'normal' && card && card.state === 'normal')) {
            return;
        }

        this.setData({ login: true, size: this.setCanvasSize() });
        wx.showLoading({
            title: '刷新中...',
            mask: true,
        });

        this.getQrCode()
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

        this.getQrCode()
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

    //绘制二维码
    drawQRCode: function () {
        let that = this;
        new QRCode('qrcode', {
            text: JSON.stringify(that.data.qrcode),
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
     * 获取二维码
     */
    getQrCode() {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/pay/system/create-qrcode.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: getApp().token(),
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
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
     * 生命周期函数--监听页面显示
     */
    onShow() {},
});
