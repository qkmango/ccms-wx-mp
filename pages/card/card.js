import Decimal from '../../utils/decimal';
import { Api, Card } from '../../utils/api.js';

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
    onLoad(options) {
        this.setData({
            card: getApp().card(),
        });
        console.log(this.data.card);
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        if (!getApp().token()) {
            wx.navigateTo({
                url: '/pages/login/login?switchTab=/pages/card/card',
            });
        }

        this.setData({
            login: true,
        });

        let card = this.data.card;
        if (this.data.card === null) {
            Card.getCardInfo().then((res) => {
                card = res.data;
            });
        }

        const balanceDecimal = new Decimal(card.balance).dividedBy(new Decimal('100')).toFixed(2);
        this.setData({
            balance: balanceDecimal.toString(),
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        Card.getCardInfo()
            .then((res) => {
                let balanceDecimal = new Decimal(res.data.balance).dividedBy(new Decimal('100')).toFixed(2);
                this.setData({
                    card: res.data,
                    balance: balanceDecimal.toString(),
                });
            })
            .finally(() => {
                wx.stopPullDownRefresh();
            });
    },

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

    toTradePage() {
        wx.navigateTo({
            url: '/pages/trade/trade',
        });
    },

    updateCardState() {
        const _this = this;
        const state = this.data.card.state;
        const version = this.data.card.version;
        wx.showActionSheet({
            itemList: ['解挂(正常)', '挂失(丢失)'],
            success(res) {
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

                // 修改状态
                Card.updateState(updateState, version)
                    .then((res) => {
                        //修改成功
                        wx.showToast({
                            icon: 'success',
                            duration: 2000,
                        });

                        Card.getCardInfo().then((res) => {
                            let balanceDecimal = new Decimal(res.data.balance).dividedBy(new Decimal('100')).toFixed(2);
                            _this.setData({
                                card: res.data,
                                balance: balanceDecimal.toString(),
                            });
                        });
                    })
                    .catch((res) => {
                        wx.showToast({
                            icon: 'error',
                            duration: 2000,
                        });
                    });
            },
        });
    },
});
