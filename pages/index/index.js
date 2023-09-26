import { Notice } from '../../utils/api.js';
import { dateFormat } from '../../utils/util';

Page({
    data: {
        notices: [],
    },

    onLoad: function () {
        const _this = this;
        Notice.list({
            page: 1,
            limit: 5,
        }).then((res) => {
            let list = res.data.list;
            list.forEach((item) => {
                item.createTime = dateFormat(new Date(item.createTime));
            });

            _this.setData({
                notices: res.data.list,
            });
        });
    },
});
