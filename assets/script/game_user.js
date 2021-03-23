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
      this.openid = "";
      this.wxEnv = true;
    } else {
      this.wxEnv = false;
    }

    this.userGameInfo = {
      snakeBestScore: 0, //snake best score
    };

    // let width = this.node.parent.width;
    // let height = this.node.parent.height;

    let windowH, windowW;

    if (this.wxEnv) {
      wx.getSystemInfo({
        success: (res) => {
          windowW = res.windowWidth;
          windowH = res.windowHeight;
        },
      });

      wx.getSetting({
        success(res) {
          if (!res.authSetting["scope.userInfo"]) {
            let button = wx.createUserInfoButton({
              type: "text",
              text: "授权",
              style: {
                left: windowW / 2 - 100,
                top: windowH / 2 + 100,
                width: 200,
                height: 40,
                lineHeight: 40,
                backgroundColor: "rgba(129, 129, 129, 0.8)",
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
                this.userInfo = res.userInfo;
              }
            });
          }
        },
      });
    }
  },

  start() {
    if (this.wxEnv) {
      this.login();
    } else {
      this.setLocalStorageForGameInfo();
    }
    Utils.GD = this;
    console.log(Utils.GD);
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
   * @param  {Object} data 设置值的对象
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

  addGameScore(data) {
    if (this.wxEnv) {
      return new Promise((resolve, reject) => {
        console.log("1");
        db.collection("scores")
          .add({
            data: {
              ...data,
              createTime: new db.serverDate(),
            },
          })
          .then((res) => {
            resolve(res.data);
          })
          .catch((code, msg) => reject([code, msg]));
      });
    }
  },

  getGameScore() {
    if (this.wxEnv) {
      return new Promise((resolve, reject) => {
        db.collection("scores")
          .aggregate()
          .group({
            _id: {
              _openid: "$_openid",
              nickName: "$nickName",
              avatarUrl: "$avatarUrl",
            },
            maxScore: $.max("$score"),
          })
          .sort({
            maxScore: -1,
          })
          .end()
          .then((res) => {
            resolve(res);
          })
          .catch((code, msg) => reject([code, msg]));
      });
    }
  },
});
