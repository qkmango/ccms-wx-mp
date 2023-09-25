import { Dept } from '../../utils/api.js';

Page({
    data: {
        departmentChain: [],
        computed: {
            departmentChain: '',
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let token = getApp().token();
        if (!token) {
            return;
        }
        let account = getApp().account();
        const _this = this;

        //获取部门链
        let department = account.department;

        Dept.chain().then((res) => {
            _this.setData({
                departmentChain: res.data,
            });
            _this.computed();
        });
    },

    computed() {
        let departmentChain = this.data.departmentChain;
        let chain = departmentChain.map((item) => item.name).join(' > ');
        this.setData({
            'computed.departmentChain': chain,
        });
    },
});
