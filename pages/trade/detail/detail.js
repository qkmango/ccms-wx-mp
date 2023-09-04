// pages/trade/detail/detail.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        detail: {
            trade: {
                version: 1,
                id: '21001441977274368',
                account: 8,
                level1: 'in',
                level2: 'alipay',
                level3: 'recharge',
                state: 'success',
                creator: 2,
                amount: 100,
                createTime: '1693497736984',
                description: '一卡通充值',
            },
            payer: { id: 8, role: 'user', state: 'normal', department: 70 },
            creator: { id: 2, role: 'user', state: 'normal', department: 64 },
            payerDeptChain: [
                { id: 1, name: '学生部门', description: '教职工/学生部门', parent: 0, type: 'root' },
                { id: 4, name: '大数据与人工智能学院', description: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', parent: 1, type: 'middle' },
                { id: 14, name: '软件工程', description: '这是软件工程哦', parent: 4, type: 'middle' },
                { id: 70, name: '2022软件工程3班', description: '这是2022软件工程3班哦', parent: 14, addition: '2022', type: 'leaf' },
            ],
            creatorDeptChain: [
                { id: 1, name: '学生部门', description: '教职工/学生部门', parent: 0, type: 'root' },
                { id: 4, name: '大数据与人工智能学院', description: '哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈', parent: 1, type: 'middle' },
                { id: 13, name: '计算机应用技术', description: '这是计算机应用技术哦', parent: 4, type: 'middle' },
                { id: 64, name: '2020计算机应用技术1班', description: '这是2020计算机应用技术1班哦', parent: 13, addition: '2020', type: 'leaf' },
            ],
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {},

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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {},
});
