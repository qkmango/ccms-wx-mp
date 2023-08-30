// pages/trade/trade.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        login: false,
        date: null,
        list: [
            { createTime: '2019-01-01', level1: 'out', amount: 180, description: '吃饭' },
            { createTime: '2019-01-01', level1: 'in', amount: 180, description: '吃饭' },
            { createTime: '2019-01-01', level1: 'in', amount: 180, description: '吃饭' },
            { createTime: '2019-01-01', level1: 'in', amount: 180, description: '吃饭' },
            { createTime: '2019-01-01', level1: 'in', amount: 180, description: '吃饭' },
            { createTime: '2019-01-01', level1: 'in', amount: 180, description: '吃饭' },
            { createTime: '2019-01-01', level1: 'in', amount: 180, description: '吃饭' },
        ],
    },

    bindDateChange(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            date: e.detail.value,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('trade onLoad');
        //判断登陆
        let account = getApp().account();
        let card = getApp().card();

        //判断状态
        if (!(account && account.state === 'normal' && card)) {
            return;
        }
        let date = new Date().toLocaleDateString();
        this.setData({ login: true, date });
        const _this = this;
        this.getTradeList(this.data.date).then((res) => {
            if (res.data.success) {
            }
        });
    },

    getTradeList(date) {
        let { startCreateTime, endCreateTime } = this.getStartAndEndTimestamps(date);
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/trade/pagination/list.do`,
                method: 'POST',
                header: {
                    Authorization: getApp().token(),
                },
                data: {
                    startCreateTime,
                    endCreateTime,
                },
                timeout: 3000,
                success: (res) => {
                    resolve(res);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
    getStartAndEndTimestamps(dateString) {
        let date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        let startCreateTime = date.getTime();
        date.setHours(23, 59, 59, 999);
        let endCreateTime = date.getTime();
        return { startCreateTime, endCreateTime };
    },
});
