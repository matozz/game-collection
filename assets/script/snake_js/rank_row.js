cc.Class({
  extends: cc.Component,
  properties: {
    rank: {
      default: null,
      type: cc.Label,
    },
    avatar: {
      default: null,
      type: cc.Node,
    },
    nickName: {
      default: null,
      type: cc.Label,
    },
    score: {
      default: null,
      type: cc.Label,
    },
  },
  updateItem(y, rank, avatarUrl, nickName, score) {
    this.node.y = y;
    this.rank.string = rank;
    this.loadImage(avatarUrl);
    this.nickName.string = nickName;
    this.score.string = score;
  },

  loadImage(avatarUrl) {
    let _this = this;
    cc.assetManager.loadRemote(
      avatarUrl,
      { ext: ".jpeg" },
      function (err, img) {
        console.log(img);
        var userAvatar = new cc.SpriteFrame(img);
        _this.avatar.getComponent(cc.Sprite).spriteFrame = userAvatar;
      }
    );
  },
});
