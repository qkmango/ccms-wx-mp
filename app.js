// app.js
App({
    onLaunch() {
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || [];
        logs.unshift(Date.now());
        wx.setStorageSync('logs', logs);

        // 登录
        wx.login({
            success: (res) => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            },
        });
    },
    globalData: {
        host: 'http://localhost',
        oss:'http://192.168.0.100:9000/ccms/',
        account: null,
        token: null,
    },

    token: function (token) {
        //如果传入null则删除token
        if (token === null) {
            this.globalData.token = null;
            wx.removeStorageSync('token');
            return;
        }

        //如果传入token则保存token
        if (token) {
            this.globalData.token = token;
            wx.setStorageSync('token', token);
            return;
        }

        token = this.globalData.token;
        if (token) {
            return token.accessToken;
        }

        //如果全局变量没有再从本地存储中获取token
        token = wx.getStorageSync('token');
        //判断是否存在token
        if (!token) {
            return null;
        }

        // 先判断token是否过期
        if (token && token.expireIn > Date.now()) {
            this.globalData.token = token;
            return token.accessToken;
        }

        // 如果token过期则删除token
        wx.removeStorageSync('token');
        this.globalData.token = null;
        return null;
    },

    account: function (account) {
        //如果传入null则删除account
        if (account === null) {
            this.globalData.account = null;
            wx.removeStorageSync('account');
            return;
        }

        //如果传入account则保存account
        if (account) {
            this.globalData.account = account;
            wx.setStorageSync('account', account);
            return;
        }

        // 如果token不存在/失效则删除account
        const token = this.token();
        if (!token) {
            this.globalData.account = null;
            wx.removeStorageSync('account');
            return null;
        }

        //先从全局变量中获取account
        account = this.globalData.account;
        if (account) {
            return account;
        }

        //如果全局变量没有再从本地存储中获取account
        account = wx.getStorageSync('account');

        //判断是否存在account
        if (account) {
            //同步到全局变量中
            this.globalData.account = account;
            return account;
        }

        return null;
    },

    avatar: function (avatar) {
        //如果传入null则删除
        if (avatar === null) {
            this.globalData.avatar = null;
            wx.removeStorageSync('avatar');
            return;
        }

        //如果传入avatar则保存
        if (avatar) {
            this.globalData.avatar = avatar;
            wx.setStorageSync('avatar', avatar);
            return;
        }

        // 如果token不存在/失效则删除
        const token = this.token();
        if (!token) {
            this.globalData.avatar = null;
            wx.removeStorageSync('avatar');
            return null;
        }

        //先从全局变量中获取
        avatar = this.globalData.avatar;
        if (avatar) {
            return avatar;
        }

        //如果全局变量没有再从本地存储中获取
        avatar = wx.getStorageSync('avatar');

        //判断是否存在
        if (avatar) {
            //同步到全局变量中
            this.globalData.avatar = avatar;
            return avatar;
        }
        return null;
    },

    card: function (card) {
        //如果传入null则删除card
        if (card === null) {
            this.globalData.card = null;
            wx.removeStorageSync('card');
            return;
        }

        //如果传入card则保存card
        if (card) {
            this.globalData.card = card;
            wx.setStorageSync('card', card);
            return;
        }

        //先从全局变量中获取card
        card = this.globalData.card;
        if (card) {
            return card;
        }

        //如果全局变量没有再从本地存储中获取card
        card = wx.getStorageSync('card');

        //判断是否存在card
        if (card) {
            //同步到全局变量中
            this.globalData.card = card;
            return card;
        }

        return null;
    },

    getAccountInfo: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/auth/one/current-account-info.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: this.token(),
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        getApp().account(res.data.data);
                    }
                    resolve(res);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },

    getCardInfo: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}/api/card/one/current-card-info.do`,
                header: {
                    'content-type': 'application/x-www-form-urlencoded',
                    Authorization: this.token(),
                },
                timeout: 3000,
                success: (res) => {
                    if (res.data.success) {
                        getApp().card(res.data.data);
                    }
                    resolve(res);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },

    getAvatar: function () {
        return new Promise((resolve, reject) => {
            wx.request({
                url: `${getApp().globalData.host}:9000/ccms/avatar/头像.jpg`,
                method: 'GET',
                responseType: 'arraybuffer',
                success: (res) => {
                    let base64 = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res);
                    console.log(base64);
                    // getApp().avatar(base64);
                    resolve(base64);
                },
                fail: (res) => {
                    reject(res);
                },
            });
        });
    },
});
