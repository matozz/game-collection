const Utils = require("../utils.js");

cc.Class({
  extends: cc.Component,
  properties: {
    canvas: {
      default: null,
      type: cc.Node,
    },
    scoreLabel: {
      default: null,
      type: cc.Label,
    },
    bestScore: {
      default: null,
      type: cc.Label,
    },
  },
  onLoad() {
    console.log(Utils.GD);
    // console.log(this.canvas.getComponent("snake_game"));

    // let bestScore = Utils.GD.userGameInfo.snakeBestScore || 0;

    let theScore = this.canvas.getComponent("snake_game").score;
    this.scoreLabel.string = "Score:" + theScore.toString();

    // if (theScore > bestScore) {
    //   bestScore = theScore;
    //   Utils.GD.setLocalStorageForGameInfo(bestScore);
    // }
    if (Utils.GD.wxEnv) {
      Utils.GD.addGameScore({
        score: theScore,
      })
        .then(() => {
          getGameScore().then((res) => {
            console.log(res);
          });
        })
        .catch(([code, msg]) => {
          console.log([code, msg]);
        });
    }

    // this.bestScore.string = "best:" + bestScore;
  },

  backToList() {
    cc.director.loadScene("startscene");
  },

  restart() {
    cc.tween(this.node)
      .to(0.2, { opacity: 0 })
      .call(() => {
        this.node.active = false;
        cc.director.loadScene("snake");
      })
      .start();
  },
});
