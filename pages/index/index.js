import { Notice } from '../../utils/api.js';

Page({
    data: {
        notices: [
            { id: 22, title: '2024年第一学期即将开学', content: '2024年第一学期即将开学', author: 1, createTime: 1690791965000 },
            { id: 21, title: '选课系统升级', content: '为了提高选课系统的稳定性和性能，教务处将', author: 1, createTime: 1670427181000 },
            { id: 20, title: '教学质量评估', content: '教务处正在进行教学质量评估，希望各位同学', author: 1, createTime: 1674905316000 },
            { id: 19, title: '留学生管理', content: '如果有留学生需要帮助，可以在教务系统中提', author: 1, createTime: 1674707234000 },
            { id: 18, title: '在线作业', content: '教务处将逐步推出在线作业，请同学们按时提', author: 1, createTime: 1670431797000 },
        ],
    },

    // onLoad: function () {
    //     Notice.list({
    //         page: 1,
    //         limit: 5,
    //     }).then((res) => {
    //         console.log(res);
    //     });
    // },
});
