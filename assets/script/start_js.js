const SCENESLIST = [
  {
    title: " Snake",
    name: "snake",
  },
  {
    title: " Normandy",
    name: "normandy",
  },
  {
    title: " Flappy Bird",
    name: "flappy_bird",
  },
];

cc.Class({
  extends: cc.Component,
  properties: {
    gameTitle: {
      default: null,
      type: cc.Prefab,
    },
    gameBtnPfb: {
      default: null,
      type: cc.Prefab,
    },
    content: {
      default: null,
      type: cc.Node,
    },
    loadMask: {
      default: null,
      type: cc.Node,
    },
    progress: {
      default: null,
      type: cc.ProgressBar,
    },
    text: {
      default: null,
      type: cc.Label,
    },
  },
  onLoad() {
    this.isNav = false;
    let y = -160;
    let title = cc.instantiate(this.gameTitle);
    this.content.addChild(title);
    for (let i = 0; i < SCENESLIST.length; i++) {
      let btn = cc.instantiate(this.gameBtnPfb);
      let item = btn.getComponent("game_start_btn");
      this.content.addChild(btn);
      if (i > 0) y -= 65;
      item.updateItem(i, y, SCENESLIST[i].title, SCENESLIST[i].name);
    }
    this.content.height = Math.abs(y) + 55;
  },

  loadGames(url) {
    console.log(url);
    const _this = this;
    if (!_this.isNav) {
      _this.isNav = true;
      _this.text.string = "0" + "%";
      _this.progress.progress = 0;
      _this.loadMask.opacity = 0;
      _this.loadMask.active = true;
      cc.tween(_this.loadMask)
        .by(0.2, { opacity: 250 })
        .call(() => {
          // 预加载，第一个是场景名，第二个callback中3个参数，第三个callback是完成回调
          cc.director.preloadScene(
            url,
            (completedCount, totalCount, item) => {
              let p = completedCount / totalCount;
              _this.progress.progress = p;
              _this.text.string = parseInt(p * 100) + "%";
            },
            () => {
              cc.tween(_this.loadMask)
                .to(0.3, { opacity: 50 })
                .call(() => {
                  _this.isNav = false;
                  _this.loadMask.active = false;
                  cc.director.loadScene(url);
                })
                .start();
            }
          );
        })
        .start();
    }
  },
});
