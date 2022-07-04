const Gdt = require("globals");
const Utils = require("../utils.js");
cc.Class({
  extends: cc.Component,
  properties: () => ({
    pause: {
      default: null,
      type: cc.Button,
    },
    btnSprite: {
      default: [],
      type: cc.SpriteFrame,
    },
    hero: {
      default: null,
      type: require("hero"),
    },
    enemyGroup: {
      default: null,
      type: require("enemy_group"),
    },
    enemyBulletGroup: {
      default: null,
      type: require("enemy_bullet_group"),
    },
    buffGroup: {
      default: null,
      type: require("buff_group"),
    },
    bulletGroup: {
      default: null,
      type: require("bullet_group"),
    },
    gameSceneBg: {
      default: null,
      type: cc.Node,
    },
    scoreDisplay: {
      default: null,
      type: cc.Label,
    },
    // bombNoDisplay: {
    //   default: null,
    //   type: cc.Label,
    // },
    gameOverMask: {
      default: null,
      type: cc.Node,
    },
    maskBestScore: {
      default: null,
      type: cc.Label,
    },
    maskCurrScore: {
      default: null,
      type: cc.Label,
    },
    pauseBackMask: {
      default: null,
      type: cc.Node,
    },
    level: {
      default: null,
      type: cc.Label,
    },
  }),

  onLoad() {
    this.score = 0;
    // this.bombNo = 0;
    this.isGameOver = false;
    this.scoreDisplay.string = this.score;
    // this.bombNoDisplay.string = this.bombNo;
    this.curState = Gdt.commonInfo.gameState.start;
    this.curLevel = Gdt.commonInfo.level;
    // this.bestScore = Utils.GD.userGameInfo.aircraftWarBestScore || 0;
    // this.maskBestScore.string = "Best Score: " + this.bestScore;
    this.level.node.active = true;

    setTimeout(() => (this.level.node.opacity = 0), 2000);

    // setInterval(() => this.gainLevel(), 10000);

    this.levelUp = function () {
      this.gainLevel();
    };

    this.schedule(this.levelUp, 10, cc.macro.REPEAT_FOREVER);

    this.bulletGroup.startAction();
    this.enemyGroup.startAction();

    // this.bomb.on(cc.Node.EventType.TOUCH_START, this.bombOnclick, this);
  },

  // bombOnclick() {
  //   if (this.isGameOver) return;
  //   let bombNoLabel = this.bombNoDisplay;
  //   let bombNo = parseInt(bombNoLabel.string);
  //   if (bombNo > 0) {
  //     bombNoLabel.string = bombNo - 1;
  //     this.removeAllEnemy();
  //   }
  // },

  pauseClick() {
    if (!this.isGameOver) {
      if (this.curState == Gdt.commonInfo.gameState.pause) {
        this.resumeAction();
        this.curState = Gdt.commonInfo.gameState.start;
        this.showBackBtnPausing(false);
      } else if (this.curState == Gdt.commonInfo.gameState.start) {
        this.pauseAction();
        this.curState = Gdt.commonInfo.gameState.pause;
        this.showBackBtnPausing(true);
      }
    }
  },

  //show back start scene btn fn
  showBackBtnPausing(bool) {
    let action;
    this.pauseBackMask.active = bool;
    if (bool) {
      this.pauseBackMask.opacity = 0;
      this.pauseBackMask.scale = 0.95;
      cc.tween(this.pauseBackMask).to(0.2, { scale: 1, opacity: 255 }).start();
    }
  },

  resumeAction() {
    this.schedule(this.levelUp, 5, cc.macro.REPEAT_FOREVER);
    this.enemyGroup.resumeAction();
    this.enemyBulletGroup.resumeAction();
    this.bulletGroup.resumeAction();
    this.buffGroup.resumeAction();
    this.gameSceneBg.getComponent("gamescene_bg").resumeAction();
    this.hero.onDrag();
    this.pause.getComponent(cc.Sprite).spriteFrame = this.btnSprite[0];
  },

  pauseAction() {
    this.unscheduleAllCallbacks();
    this.curState = Gdt.commonInfo.gameState.pause;
    this.enemyGroup.pauseAction();
    this.enemyBulletGroup.pauseAction();
    this.bulletGroup.pauseAction();
    this.buffGroup.pauseAction();
    this.gameSceneBg.getComponent("gamescene_bg").pauseAction();
    this.hero.offDrag();
    this.pause.getComponent(cc.Sprite).spriteFrame = this.btnSprite[1];
  },

  gainScore(scoreno) {
    if (this.isGameOver) return;
    this.score += scoreno;
    this.scoreDisplay.string = this.score.toString();
  },

  getScore() {
    return parseInt(this.scoreDisplay.string);
  },

  gainLevel() {
    if (this.isGameOver) return;
    this.level.node.opacity = 255;
    this.curLevel++;
    this.level.string = "Level: " + this.curLevel.toString();
    setTimeout(() => (this.level.node.opacity = 0), 2000);
  },

  getLevel() {
    return parseInt(this.curLevel);
  },

  // removeAllEnemy() {
  //   const children = this.enemyGroup.node.children;
  //   for (let i = 0; i < children.length; i++) {
  //     let cidCpt = children[i].getComponent("enemy");
  //     cidCpt.hP = 0;
  //     cidCpt.enemyOver();
  //   }
  //   const enemyBulletChildren = this.enemyBulletGroup.node.children;
  //   for (let i = 0; i < enemyBulletChildren.length; i++)
  //     this.enemyBulletGroup.bulletDied(enemyBulletChildren[i]);
  // },

  // getBuffBomb() {
  //   let no = parseInt(this.bombNoDisplay.string);
  //   if (no < 3) this.bombNoDisplay.string = no + 1;
  // },

  gameOver() {
    this.isGameOver = true;
    this.pauseAction();
    this.gameOverMaskVis();
  },

  // game over mask
  gameOverMaskVis() {
    this.gameOverMask.active = true;
    this.gameOverMask.opacity = 1;
    cc.tween(this.gameOverMask).to(0.3, { opacity: 255 }).start();
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      // this.requestDbAircraftWarScore();
    }
    // this.maskCurrScore.string = "Current Score: " + this.score;
    // this.maskBestScore.string = "Best Score: " + this.bestScore;
  },

  playAgain() {
    cc.tween(this.gameOverMask)
      .to(0.3, { opacity: 0 })
      .call(() => {
        cc.director.loadScene("normandy");
      })
      .start();
  },

  backStartScene() {
    cc.director.loadScene("startscene");
  },

  //保存最高分数
  requestDbAircraftWarScore() {

  },
});
