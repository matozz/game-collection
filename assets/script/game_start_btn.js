const Utils = require("./utils.js");

cc.Class({
  extends: cc.Component,
  properties: {
    label: {
      default: null,
      type: cc.Label,
    },
  },
  loadGame() {
    if (Utils.isWxEnv) {
      if (Utils.Authorized) {
        const parentC = cc.find("startControler").getComponent("start_js");
        parentC.loadGames(this.url);
      } else {
        wx.showModal({
          title: "请授权",
          content: "授权以开始游戏",
          showCancel: false,
        });
      }
    } else {
      const parentC = cc.find("startControler").getComponent("start_js");
      parentC.loadGames(this.url);
    }
  },
  updateItem(idx, y, name, url) {
    this.index = idx;
    this.node.y = y;
    this.label.string = name;
    this.url = url;
  },
});
