Page({
    /**
     * 页面的初始数据
     */
    data: {
        departmentChain: [
            { id: 1, name: '学生部门', description: '教职工/学生部门', parent: 0, type: 'root' },
            { id: 4, name: '大数据与人工智能学院', description: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', parent: 1, type: 'middle' },
            { id: 14, name: '软件工程', description: '这是软件工程哦', parent: 4, type: 'middle' },
            { id: 70, name: '2022软件工程3班', description: '这是2022软件工程3班哦', parent: 14, addition: '2022', type: 'leaf' },
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        return;
        let accountDetail = getApp().account();
        //如果没有信息
        if (!accountDetail) {
            //弹窗提示
            wx.showToast({
                title: '未登录',
                icon: 'error',
                duration: 2000,
            });
            return;
        }

        //获取部门链
        let department = accountDetail.account.department;

        //获取部门链

        wx.request({
            url: `${getApp().globalData.host}/api/department/one/chain.do`,
            header: { 'content-type': 'application/x-www-form-urlencoded' },
            method: 'get',
            data: {
                id: department,
            },
            success: (res) => {
                if (res.data.success) {
                    console.log(res.data.data);
                    this.setData({
                        departmentChain: res.data.data,
                    });
                }
            },
        });

        console.log(accountDetail);
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
});
