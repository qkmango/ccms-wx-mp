Page({
    /**
     * 页面的初始数据
     */
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
        wx.request({
            url: `${getApp().globalData.host}/api/department/one/chain.do`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'get',
            data: {
                id: department,
            },
            success: (res) => {
                if (res.data.success) {
                    _this.setData({
                        departmentChain: res.data.data,
                    });
                    _this.computed();
                }
            },
        });
    },

    computed() {
        let departmentChain = this.data.departmentChain;
        let chain = departmentChain.map((item) => item.name).join(' > ');
        this.setData({
            "computed.departmentChain": chain,
        });
    },
});
