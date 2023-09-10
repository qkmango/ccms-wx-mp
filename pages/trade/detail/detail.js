import { dateTimeFormat } from '../../../utils/util';
import Decimal from '../../../utils/decimal';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        detail: {
            trade: null,
            payer: null,
            creator: null,
            payerDeptChain: [],
            creatorDeptChain: [],
        },
        computed: {
            trade: {
                createTime: '',
                level1: '',
                level2: '',
                level3: '',
                state: '',
                amount: '',
            },
            payerDeptChain: '',
            creatorDeptChain: '',
            creator: {
                role: '',
                state: '',
            },
            payer: {
                role: '',
                state: '',
            },
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getTradeDetail(options.id).then((res) => {
            if (res.data.success) {
                this.setData({
                    detail: res.data.data,
                });
                this.computed();
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    computed() {
        let { createTime, level1, level2, level3, state } = this.data.detail.trade;
        let { payerDeptChain, creatorDeptChain } = this.data.detail;

        this.setData({
            // 'computed.trade.createTime': new Date(parseInt(createTime)).toLocaleString(),
            'computed.trade.createTime': dateTimeFormat(new Date(parseInt(createTime))),
            'computed.trade.level1': this.computedLevel1(level1),
            'computed.trade.level2': this.computedLevel2(level2),
            'computed.trade.level3': this.computedLevel3(level3),
            'computed.trade.state': this.computedTradeState(state),
            'computed.trade.amount': new Decimal(this.data.detail.trade.amount).dividedBy(new Decimal('100')).toFixed(2),
            'computed.payerDeptChain': payerDeptChain.map((item) => item.name).join(' > '),
            'computed.creatorDeptChain': creatorDeptChain.map((item) => item.name).join(' > '),
            'computed.creator.role': this.computedRole(this.data.detail.creator.role),
            'computed.creator.state': this.computedAccountState(this.data.detail.creator.state),
            'computed.payer.role': this.computedRole(this.data.detail.payer.role),
            'computed.payer.state': this.computedAccountState(this.data.detail.payer.state),
        });
    },

    computedTradeState(state) {
        switch (state) {
            case 'fail':
                return '失败';
            case 'success':
                return '成功';
            case 'refund':
                return '退款';
            case 'processing':
                return '处理中';
            case 'close':
                return '关闭';
            default:
                return '未知';
        }
    },

    computedLevel1(level1) {
        switch (level1) {
            case 'in':
                return '入账';
            case 'out':
                return '出账';
            default:
                return '未知';
        }
    },

    computedLevel2(level2) {
        switch (level2) {
            case 'qr':
                return '扫码';
            case 'card':
                return '刷卡';
            case 'system':
                return '系统';
            case 'alipay':
                return '支付宝';
            default:
                return '未知';
        }
    },

    computedLevel3(level3) {
        switch (level3) {
            case 'consume':
                return '消费';
            case 'payment':
                return '缴费';
            case 'refund':
                return '退费';
            case 'recharge':
                return '充值';
            case 'withdraw':
                return '提现';
            case 'other':
                return '其他';
            default:
                return '未知';
        }
    },
    computedRole(role) {
        switch (role) {
            case 'user':
                return '用户';
            case 'admin':
                return '管理员';
            case 'pos':
                return '刷卡机';
            default:
                return '未知';
        }
    },
    computedAccountState(state) {
        switch (state) {
            case 'normal':
                return '正常';
            case 'canceled':
                return '注销';
            case 'frozen':
                return '冻结';
            default:
                return '未知';
        }
    },
    getTradeDetail(id) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/trade/one/detail.do?id=${id}`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: getApp().token(),
                },
                success(res) {
                    resolve(res);
                },
                fail(err) {
                    reject(err);
                },
            });
        });
    },
});
