const Api = {
    api: 'http://192.168.0.2',
    oss: 'http://192.168.0.100:9000',
};

const app = getApp();

// 卡相关信息
const Card = {
    // 修改卡状态
    updateState(state, version) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/card/update/current-state.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: app.token(),
                },
                method: 'post',
                data: {
                    state,
                    version,
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },

    // 获取卡信息
    getCardInfo: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/card/one/current-card-info.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: app.token(),
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        app.card(res.data.data);
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
};

// 账户相关信息
const Account = {
    getAccountInfo: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/auth/one/current-account-info.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: app.token(),
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        app.account(res.data.data);
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
};

const Auth = {
    login(id, password) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/auth/system-login.do`,
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'POST',
                data: {
                    id,
                    password,
                    authCarryType: 'ACCESS_TOKEN',
                },
                success: (res) => {
                    if (res.data.success) {
                        // 登陆成功
                        // 保存token
                        app.token(res.data.data.token);
                        app.account(res.data.data.account);
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
};

const OSS = {
    /**
     * 上传头像
     * @param {string} tempFilePaths 临时文件路径, 通过 wx.chooseMedia 获取
     * @returns {Promise} 返回 Promise 对象 resolve 时返回 base64 格式的图片, reject 时返回 res
     */
    uploadAvatar(tempFilePaths) {
        return new Promise((resolve, reject) => {
            wx.uploadFile({
                url: `${Api.host}/api/oss/upload/avatar.do`,
                filePath: tempFilePaths,
                name: 'avatar',
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: app.token(),
                },
                success: (res) => {
                    if (res.statusCode === 200 && JSON.parse(res.data).success) {
                        //读取文件转为base64
                        wx.getFileSystemManager().readFile({
                            filePath: tempFilePaths,
                            encoding: 'base64',
                            success(res) {
                                resolve('data:image/jpg;base64,' + res.data);
                            },
                        });
                        return;
                    }
                    reject(res);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },

    // 获取头像
    getAvatar: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.oss}/ccms/avatar/头像.jpg`,
                method: 'GET',
                responseType: 'arraybuffer',
                success: (res) => {
                    const base64 = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res);
                    resolve(base64);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
};

const Trade = {
    /**
     * 获取公告列表
     * @param {Object} page 分页信息
     * page: 1,
     * limit: 20,
     * param: {
     *
     * },
     * @returns
     */
    list(page) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/trade/pagination/list.do`,
                method: 'POST',
                header: {
                    Authorization: app.token(),
                },
                data: page,
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },

    detail(id) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/trade/one/detail.do?id=${id}`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: app.token(),
                },
                success(res) {
                    if (res.data.success) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail(res) {
                    reject(res);
                },
            });
        });
    },
};

const Notice = {
    // 获取公告列表
    list(page) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/notice/pagination/list.do`,
                method: 'POST',
                header: {
                    Authorization: app.token(),
                },
                data: page,
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
    record(id) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/notice/one/record.do?id=${id}`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: app.token(),
                },
                success(res) {
                    if (res.data.success) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail(res) {
                    reject(res);
                },
            });
        });
    },
};

const Dept = {
    chain() {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${Api.api}/api/department/one/chain.do`,
                header: { 'content-type': 'application/x-www-form-urlencoded' },
                method: 'get',
                success: (res) => {
                    if (res.data.success) {
                        resolve(res.data);
                    } else {
                        reject(res.data);
                    }
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
};

module.exports = {
    Api,
    OSS,
    Card,
    Auth,
    Trade,
    Dept,
    Notice,
    Account,
};
