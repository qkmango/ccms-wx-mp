import { Notice } from '../../utils/api.js';

Page({
    data: {
        notices: [],
    },

    onLoad: function () {
        Notice.list({
            page: 1,
            limit: 5,
        }).then((res) => {
            console.log(res);
        });
    },
});
