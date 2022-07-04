const Gdt = require("globals");
let buffG = cc.Class({
  name: "buffG",
  properties: {
    name: "",
    initPoolCount: 0,
    probability: 0,
    prefab: {
      default: null,
      type: cc.Prefab,
    },
  },
});
cc.Class({
  extends: cc.Component,
  properties: {
    buffG: {
      default: [],
      type: buffG,
    },
  },

  onLoad() {
    this.curState = Gdt.commonInfo.gameState.start;
    Gdt.common.batchInitObjPool(this, this.buffG);
  },

  createHeroBuff(emInfo) {
    const theEnemy = emInfo.getComponent("enemy");
    // console.log(theEnemy);
    for (let i = 0; i < this.buffG.length; i++) {
      //randomly create buff
      if (theEnemy.buffType == this.buffG[i].name)
        if (Math.random() <= this.buffG[i].probability)
          this.getNewBuff(this.buffG[i], emInfo);
    }
  },

  getNewBuff(BuffInfo, emInfo) {
    const poolName = BuffInfo.name + "Pool",
      newNode = Gdt.common.genNewNode(
        this[poolName],
        BuffInfo.prefab,
        this.node
      ),
      emPos = emInfo.getPosition(),
      newPos = cc.v2(emPos.x, emPos.y);
    newNode.setPosition(newPos);
    newNode.getComponent("buff").poolName = poolName;
  },

  resumeAction() {
    this.enabled = true;
    this.curState = Gdt.commonInfo.gameState.start;
  },

  pauseAction() {
    this.enabled = false;
    this.curState = Gdt.commonInfo.gameState.pause;
  },

  buffDied(nodeinfo) {
    const poolName = nodeinfo.getComponent("buff").poolName;
    Gdt.common.backObjPool(this, poolName, nodeinfo);
  },
});
