// pages/card/card.js
import Decimal from '../../utils/decimal';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        card: null,
        balance: null,
        account: null,
        login: false,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        let account = getApp().account();
        if (account) {
            this.setData({ login: true });
        } else {
            this.setData({ login: false, card: null, account: null });
        }

        //如果已经登陆但是card和account信息为 null
        if (account && this.data.account === null) {
            this.setData({ account });
        }

        if (account && this.data.card === null) {
            const _this = this;
            getApp()
                .getCardInfo()
                .then((res) => {
                    if (res.data.success) {
                        let balanceDecimal = new Decimal(res.data.data.balance).dividedBy(new Decimal('100')).toFixed(2);
                        _this.setData({
                            card: res.data.data,
                            balance: balanceDecimal.toString(),
                        });
                    }
                });
        } else if (account && this.data.card != null) {
            let card = getApp().card();
            let balanceDecimal = new Decimal(card.balance).dividedBy(new Decimal('100')).toFixed(2);
            this.setData({
                card: card,
                balance: balanceDecimal.toString(),
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
    onPullDownRefresh() {
        getApp()
            .getCardInfo()
            .then((res) => {
                if (res.data.success) {
                    let balanceDecimal = new Decimal(res.data.data.balance).dividedBy(new Decimal('100')).toFixed(2);
                    this.setData({
                        card: res.data.data,
                        balance: balanceDecimal.toString(),
                    });
                }
            })
            .finally(() => {
                wx.stopPullDownRefresh();
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

    toLoginPage() {
        wx.navigateTo({
            url: '/pages/login/login?switchTab=/pages/card/card',
        });
    },
    toPayPage() {
        if (this.data.card.state === 'normal') {
            wx.navigateTo({
                url: '/pages/pay/pay',
            });
        } else {
            wx.showToast({
                title: '卡已挂失或注销',
                icon: 'none',
                duration: 2000,
            });
        }
    },
    updateCardState() {
        const _this = this;
        const state = this.data.card.state;
        wx.showActionSheet({
            itemList: ['解挂(正常)', '挂失(丢失)'],
            success(res) {
                console.log(res.tapIndex);
                //如果状态未更改，或者已经注销，则不进行操作
                if ((res.tapIndex === 0 && state === 'normal') || (res.tapIndex === 1 && state === 'loss') || state === 'canceled') {
                    return;
                }

                let updateState;
                switch (res.tapIndex) {
                    case 0:
                        updateState = 'normal';
                        break;
                    case 1:
                        updateState = 'loss';
                        break;
                }

                //修改状态
                wx.request({
                    url: `${getApp().globalData.host}/api/card/update/current-state.do`,
                    header: {
                        'content-type': 'application/x-www-form-urlencoded',
                        Authorization: getApp().token(),
                    },
                    method: 'post',
                    data: {
                        state: updateState,
                        version: _this.data.card.version,
                    },
                    timeout: 3000,
                    success: (res) => {
                        //修改成功
                        if (res.data.success) {
                            wx.showToast({
                                icon: 'success',
                                duration: 2000,
                            });

                            //重新获取数据
                            getApp()
                                .getCardInfo()
                                .then((res) => {
                                    if (res.data.success) {
                                        let balanceDecimal = new Decimal(res.data.data.balance).dividedBy(new Decimal('100')).toFixed(2);
                                        _this.setData({
                                            card: res.data.data,
                                            balance: balanceDecimal.toString(),
                                        });
                                    }
                                });
                        } else {
                            wx.showToast({
                                icon: 'error',
                                duration: 2000,
                            });
                        }
                    },
                    fail: (res) => {
                        wx.showToast({
                            icon: 'error',
                            duration: 2000,
                        });
                    },
                });
            },
        });
    },
});
