const Api = {
    host: 'http://localhost',
};

const ApiOSS = {
    host: 'http://192.168.0.100:9000',

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
                    Authorization: getApp().token(),
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
                    reject();
                },
            });
        });
    },
};

module.exports = {
    Api,
    ApiOSS,
};
