// pages/trade/trade.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        login: false,
        date: null,
        data: {
            code: 0,
            data: { count: 0, list: [] },
        },
        page: {
            page: 1,
            limit: 20,
            param: {
                startCreateTime: 0,
                endCreateTime: 0,
            },
        },
        currPage: 1,
        totalPage: 1,
    },

    bindDateChange(e) {
        let { startCreateTime, endCreateTime } = this.getStartAndEndTimestamps(e.detail.value);
        this.setData({
            date: e.detail.value,
            currPage: 1,
            totalPage: 1,
            page: {
                limit: 20,
                page: 1,
                param: {
                    startCreateTime,
                    endCreateTime,
                },
            },
        });

        //获取数据
        const _this = this;
        this.getTradeList(this.data.page).then((res) => {
            if (res.data.success) {
                let data = res.data.data;
                _this.setPageData(data, _this);
            }
        });

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //判断登陆
        let account = getApp().account();
        let card = getApp().card();

        //判断状态
        if (!(account && account.state === 'normal' && card)) {
            return;
        }
        let date = new Date().toLocaleDateString();
        let { startCreateTime, endCreateTime } = this.getStartAndEndTimestamps(date);
        this.setData({
            login: true,
            date,
            page: {
                limit: 20,
                page: 1,
                param: {
                    startCreateTime,
                    endCreateTime,
                },
            },
        });
        const _this = this;

        //获取数据
        this.getTradeList(this.data.page).then((res) => {
            if (res.data.success) {
                let data = res.data.data;
                _this.setPageData(data, _this);
            }
        });
    },

    getTradeList(page) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/trade/pagination/list.do`,
                method: 'POST',
                header: {
                    Authorization: getApp().token(),
                },
                data: page,
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

    //设置页面数据
    setPageData(data, _this) {
        data.list.forEach((item) => {
            item.createTimeString = new Date(Number.parseInt(item.createTime)).toLocaleDateString();
        });
        let totalPage = Math.ceil(data.count / _this.data.page.limit);
        _this.setData({ data, totalPage });
    },

    getStartAndEndTimestamps(dateString) {
        let date = new Date(dateString);
        date.setHours(0, 0, 0, 0);
        let startCreateTime = date.getTime();
        date.setHours(23, 59, 59, 999);
        let endCreateTime = date.getTime();
        return { startCreateTime, endCreateTime };
    },
    prevPage() {
        let { page } = this.data;
        if (page.page === 1) {
            return;
        }
        page.page--;
        this.setData({ page, currPage: page.page });
        //获取数据
        const _this = this;
        this.getTradeList(this.data.page).then((res) => {
            if (res.data.success) {
                let data = res.data.data;
                _this.setPageData(data, _this);
            }
        });
    },
    nextPage() {
        if (this.data.currPage === this.data.totalPage) {
            return;
        }
        let { page } = this.data;
        page.page++;
        this.setData({ page, currPage: page.page });
        //获取数据
        const _this = this;
        this.getTradeList(this.data.page).then((res) => {
            if (res.data.success) {
                let data = res.data.data;
                _this.setPageData(data, _this);
            }
        });
    },
});
