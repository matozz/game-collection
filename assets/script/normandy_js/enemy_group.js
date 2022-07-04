const Gdt = require("globals");

let enemyG = cc.Class({
  name: "enemyG",
  properties: {
    name: "",
    freqTime: 0,
    initPoolCount: 0,
    prefab: cc.Prefab,
  },
});

cc.Class({
  extends: cc.Component,
  properties: {
    enemyG: {
      default: [],
      type: enemyG,
    },
    main: {
      default: null,
      type: require("main"),
    },
  },

  onLoad() {
    this.curState = Gdt.commonInfo.gameState.none;
    Gdt.common.batchInitObjPool(this, this.enemyG);
  },

  startAction() {
    this.curState = Gdt.commonInfo.gameState.start;

    // createEnemy
    for (let i = 0; i < this.enemyG.length; ++i) {
      let freqTime = this.enemyG[i].freqTime;
      let fName = "callback_" + i;
      this[fName] = function (e) {
        // console.log("level ", this.getLevel());
        this.getNewEnemy(this.enemyG[e]);
      }.bind(this, i);
      this.schedule(this[fName], freqTime);
    }
  },

  resumeAction() {
    this.enabled = true;
    this.curState = Gdt.commonInfo.gameState.start;
  },

  pauseAction() {
    this.enabled = false;
    this.curState = Gdt.commonInfo.gameState.pause;
  },

  getNewEnemy(enemyInfo) {
    const poolName = enemyInfo.name + "Pool";

    let newNode = Gdt.common.genNewNode(
      this[poolName],
      enemyInfo.prefab,
      this.node
    );
    let newV2 = this.getNewEnemyPositon(newNode);
    newNode.setPosition(newV2);
    newNode.getComponent("enemy").poolName = poolName;
    newNode.getComponent("enemy").init();
  },

  getNewEnemyPositon(newEnemy) {
    const randx =
        (Math.random() * 2 - 1) *
        (this.node.parent.width / 2 - newEnemy.width / 2),
      randy = this.node.parent.height / 2 + newEnemy.height / 2;
    return cc.v2(randx, randy);
  },

  enemyDiedGainScore(score) {
    if (parseInt(score) > 0) this.main.gainScore(score);
  },

  enemyDied(nodeinfo) {
    const poolName = nodeinfo.getComponent("enemy").poolName;
    Gdt.common.backObjPool(this, poolName, nodeinfo);
  },

  getScore() {
    return this.main.getScore();
  },

  getLevel() {
    return this.main.getLevel();
  },
});
