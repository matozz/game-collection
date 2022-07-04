const Utils = require("./utils.js");

cc.Class({
  extends: cc.Component,
  properties: {},

  onLoad() {
    cc.game.addPersistRootNode(this.node);
    console.log(cc.sys.platform);
    if (cc.sys.platform === cc.sys.WECHAT_GAME) {
      wx.cloud.init({
        env: "spider-0gcimxmud967e480",
        traceUser: true,
      });
      this.db = wx.cloud.database();
      this.db.$ = this.db.command.aggregate;
      this.db._ = this.db.command;
      this.openid = "";
      this.wxEnv = true;
      Utils.isWxEnv = true;
    } else {
      this.wxEnv = false;
      Utils.isWxEnv = false;
    }

    console.log(this);

    // let width = this.node.parent.width;
    // let height = this.node.parent.height;
  },

  start() {
    this.userGameInfo = {
      snakeBestScore: 0, //snake best score
      normandyBestScore: 0,
    };

    if (this.wxEnv) {
      this.login();
      this.getWxUserInfo().then(() => {
        Utils.GD = this;
        console.log(this);
      });
    } else {
      this.setLocalStorageForGameInfo();
      Utils.GD = this;
      console.log(this);
    }
  },

  login() {
    const _this = this;
    _this.showWxLoading(true, "授权中");
    wx.cloud.callFunction({
      name: "login",
      success: (res) => {
        _this.openid = res.result.openid;
        console.log(res.result.openid);
        _this.showWxLoading(false);
      },
      fail: (err) => {
        _this.showWxLoading(false);
        console.log(err);
      },
    });
  },

  /**
   * 设置localstorage userGameInfo
   * @param  {Object} data
   */
  setLocalStorageForGameInfo(score) {
    if (localStorage) {
      let gameInfo = localStorage.getItem("userGameInfo");
      if (score) {
        console.log("update local storage");
        localStorage.setItem(
          "userGameInfo",
          JSON.stringify({
            snakeBestScore: score, //snake best score
          })
        );
      } else {
        if (!gameInfo) console.log("set default local storage");
        localStorage.setItem(
          "userGameInfo",
          JSON.stringify({
            snakeBestScore: 0, //snake best score
          })
        );
      }
    }
  },

  /**
   * 显示WxLoading
   * @param  {Boolean} bool
   */
  showWxLoading(bool, title) {
    if (this.wxEnv) {
      if (bool) {
        wx.showLoading({
          title: title || "请稍候",
          mask: true,
        });
      } else {
        wx.hideLoading();
      }
    }
  },

  addGameScore(collection, data) {
    if (this.wxEnv) {
      return new Promise((resolve, reject) => {
        this.db
          .collection(collection)
          .add({
            data: {
              ...data,
              createTime: new this.db.serverDate(),
            },
          })
          .then((res) => {
            resolve(res.data);
          })
          .catch((err) => reject(err));
      });
    }
  },

  getGameScore(collection) {
    if (this.wxEnv) {
      return new Promise((resolve, reject) => {
        this.db
          .collection(collection)
          .aggregate()
          .group({
            _id: {
              _openid: "$_openid",
              nickName: "$nickName",
              avatarUrl: "$avatarUrl",
            },
            maxScore: this.db.$.max("$score"),
          })
          .sort({
            maxScore: -1,
          })
          .end()
          .then((res) => {
            resolve(res);
          })
          .catch((err) => reject(err));
      });
    }
  },

  getUserScore(collection) {
    if (this.wxEnv) {
      return new Promise((resolve, reject) => {
        this.db
          .collection(collection)
          .where({
            _openid: this.openid,
          })
          .orderBy("score", "desc")
          .limit(1)
          .get()
          .then((res) => {
            // console.log(res.data)
            resolve(res.data);
          })
          .catch((err) => reject(err));
      });
    }
  },

  /**
   * 获取wx用户信息
   * @returns Promise
   */
  getWxUserInfo() {
    let windowH, windowW;
    let _this = this;
    return new Promise((resolve, reject) => {
      if (this.wxEnv) {
        wx.getSystemInfo({
          success: (res) => {
            windowW = res.windowWidth;
            windowH = res.windowHeight;
          },
        });

        wx.getSetting({
          success(res) {
            console.log(res);
            if (!res.authSetting["scope.userInfo"]) {
              let button = wx.createUserInfoButton({
                type: "text",
                text: "授权",
                style: {
                  left: windowW / 2 - 100,
                  top: windowH / 2 + 140,
                  width: 200,
                  height: 40,
                  lineHeight: 40,
                  backgroundColor: "rgba(16, 16, 16, 0.7)",
                  color: "#EBBB57",
                  textAlign: "center",
                  fontSize: 16,
                  borderRadius: 4,
                },
              });
              button.onTap((res) => {
                if (res.errMsg === "getUserInfo:fail auth deny") {
                  wx.showModal({
                    title: "请授权",
                    content: "授权以开始游戏",
                    showCancel: false,
                  });
                } else {
                  console.log(res.userInfo);
                  button.destroy();
                  _this.userInfo = res.userInfo;
                  Utils.Authorized = true;
                  resolve();
                }
              });
            } else {
              wx.getUserInfo({
                success: (res) => {
                  console.log(res.userInfo);
                  _this.userInfo = res.userInfo;
                  Utils.Authorized = true;
                  resolve();
                },
              });
            }
          },
        });
      }
    });
  },
});
