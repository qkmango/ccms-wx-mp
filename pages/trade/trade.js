import { timeFormat } from '../../utils/util';
import { Trade } from '../../utils/api';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        login: false,
        date: null,
        data: { count: 0, list: [] },
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
        Trade.list(this.data.page).then((res) => {
            _this.setPageData(res.data, _this);
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
        // let date = new Date().toLocaleDateString();
        let date = '2023-09-01';
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
        Trade.list(this.data.page).then((res) => {
            _this.setPageData(res.data, _this);
        });
    },

    //设置页面数据
    setPageData(data, _this) {
        data.list.forEach((item) => {
            item.createTimeString = timeFormat(new Date(Number.parseInt(item.createTime)));
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
        Trade.list(this.data.page).then((res) => {
            _this.setPageData(res.data, _this);
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
        Trade.list(this.data.page).then((res) => {
            _this.setPageData(res.data, _this);
        });
    },
    toDetailPage(index) {
        let id = this.data.data.list[index].id;
        wx.navigateTo({
            url: '/pages/trade/detail/detail?id=' + id,
        });
    },
});
