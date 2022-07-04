const Utils = require("../utils.js");

cc.Class({
  extends: cc.Component,
  properties: {
    main: {
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
    RankPfb: {
      default: null,
      type: cc.Prefab,
    },
    RankContent: {
      default: null,
      type: cc.Node,
    },
  },
  onLoad() {
    console.log(Utils.GD);
    // console.log(this.canvas.getComponent("snake_game"));

    let bestScore = Utils.GD.userGameInfo.normandyBestScore || 0;

    let _this = this;

    let theScore = this.main.getComponent("main").getScore();

    this.scoreLabel.string = "Score:" + theScore.toString();

    // this.showRankList();

    if (Utils.GD.wxEnv) {
      Utils.GD.showWxLoading(true, "加载排行榜");

      Utils.GD.addGameScore("normandy", {
        nickName: Utils.GD.userInfo.nickName,
        avatarUrl: Utils.GD.userInfo.avatarUrl,
        score: theScore,
      })
        .then(() => {
          Utils.GD.getGameScore("normandy").then((res) => {
            console.log("GET: rankList", res);
            _this.showRankList(res.list);
          });
          Utils.GD.getUserScore("normandy").then((res) => {
            console.log("GET: userBest", res);
            _this.bestScore.string = "best:" + res[0].score;
          });
          setTimeout(() => Utils.GD.showWxLoading(false), 500);
          Utils.GD.showWxLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      // if (theScore > bestScore) {
      //   bestScore = theScore;
      //   Utils.GD.setLocalStorageForGameInfo(bestScore);
      // }
    }

    this.bestScore.string = "best:" + bestScore;
  },

  backToList() {
    cc.director.loadScene("startscene");
  },

  restart() {
    cc.tween(this.node)
      .to(0.2, { opacity: 0 })
      .call(() => {
        this.node.active = false;
        cc.director.loadScene("normandy");
      })
      .start();
  },

  showRankList(rankList) {
    // Test in Browser
    // let rank = cc.instantiate(this.RankPfb);
    // let item = rank.getComponent("rank_row");
    // this.RankContent.addChild(rank);
    // item.updateItem(y, "1", "1", "FJJJJJ", "1");

    console.log(this);
    if (Utils.GD.wxEnv) {
      let y = -30;
      console.log("rankList", rankList);
      for (let i = 0; i < rankList.length; i++) {
        let rank = cc.instantiate(this.RankPfb);
        let item = rank.getComponent("rank_row");
        this.RankContent.addChild(rank);

        console.log(item);
        if (i > 0) y -= 60;
        item.updateItem(
          y,
          i + 1,
          rankList[i]._id.avatarUrl,
          rankList[i]._id.nickName,
          rankList[i].maxScore
        );
      }
    }
  },
});
