import { Api, OSS } from '../../utils/api.js';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        account: null,
        login: false,
        avatar: null,
    },

    toSettingsPage: function () {
        wx.navigateTo({
            url: '/pages/settings/settings',
        });
    },

    //跳转到登陆页面，登陆成功后跳转到当前页面
    toLoginPage: function () {
        wx.navigateTo({
            url: '/pages/login/login?switchTab=/pages/center/center',
        });
    },

    // 跳转到部门页面
    toDeptPage: function () {
        wx.navigateTo({
            url: '/pages/dept/dept',
        });
    },

    //跳转到消费记录页面
    toConsumePage: function () {
        wx.navigateTo({
            url: '/pages/consume/consume',
        });
    },

    reloadAccountInfo() {
        wx.showLoading({
            title: '刷新中...',
        });
        getApp()
            .getAccountInfo()
            .then((res) => {
                if (res.data.success) {
                    this.setData({ account: res.data.data });
                }
            })
            .finally(() => {
                wx.hideLoading();
            });
    },
    reloadCardInfo() {
        wx.showLoading({
            title: '刷新中...',
        });
        getApp()
            .getCardInfo()
            .then((res) => {
                if (res.data.success) {
                    this.setData({ card: res.data.data });
                }
            })
            .finally(() => {
                wx.hideLoading();
            });
    },

    // 修改头像
    updateAvatar() {
        const _this = this;
        this.chooseAvatar().then((res) => {
            //最大 128KB = 128 * 1024 B
            const maxSize = 128 * 1024;
            if (res.tempFiles[0].size > maxSize) {
                wx.showToast({
                    title: '图片过大',
                    icon: 'error',
                });
                return;
            }
            OSS.uploadAvatar(res.tempFiles[0].tempFilePath)
                .then((res) => {
                    _this.setData({
                        avatar: res,
                    });
                    wx.showToast({
                        title: '上传成功',
                        icon: 'success',
                    });
                })
                .catch((res) => {
                    wx.showToast({
                        title: '上传失败',
                        icon: 'error',
                    });
                });
        });
    },

    // 选择头像文件
    chooseAvatar() {
        return new Promise((resolve, reject) => {
            wx.chooseMedia({
                count: 1,
                mediaType: ['image'],
                sourceType: 'album',
                success: (res) => {
                    resolve(res);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },

    // 上传头像
    // uploadAvatar(tempFilePaths) {
    //     const _this = this;
    //     wx.showLoading({
    //         title: '上传中...',
    //     });
    //     wx.uploadFile({
    //         url: `${Api.host}/api/oss/upload/avatar.do`,
    //         filePath: tempFilePaths,
    //         name: 'avatar',
    //         header: {
    //             'content-type': 'application/x-www-form-urlencoded',
    //             Authorization: getApp().token(),
    //         },
    //         formData: {
    //             id: _this.data.account.id,
    //         },
    //         success: (res) => {
    //             if (res.statusCode === 200 && JSON.parse(res.data).success) {
    //                 wx.showToast({
    //                     title: '上传成功',
    //                     icon: 'success',
    //                 });
    //                 //读取文件转为base64
    //                 wx.getFileSystemManager().readFile({
    //                     filePath: tempFilePaths,
    //                     encoding: 'base64',
    //                     success(res) {
    //                         _this.setData({
    //                             avatar: 'data:image/jpg;base64,' + res.data,
    //                         });
    //                     },
    //                 });
    //                 return;
    //             }
    //             wx.showToast({
    //                 title: '上传失败',
    //                 icon: 'error',
    //             });
    //         },
    //         fail: (res) => {
    //             wx.showToast({
    //                 title: '上传失败',
    //                 icon: 'error',
    //             });
    //         },
    //         complete: () => {
    //             wx.hideLoading();
    //         },
    //     });
    // },

    //获取用户头像失败后使用默认头像
    avatarLoadError() {
        this.setData({
            avatar: '/image/default_avatar.svg',
        });
    },

    onShow() {
        if (getApp().token()) {
            let account = getApp().account();
            this.setData({
                login: true,
                account,
                avatar: `${Api.oss}/ccms/avatar/${account.id}.jpg`,
            });
        } else {
            wx.navigateTo({
                url: '/pages/login/login?switchTab=/pages/center/center',
            });
        }
    },
});
