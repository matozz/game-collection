const Gdt = require("globals");
let enemyBPosition = cc.Class({
  name: "enemyBPosition",
  properties: {
    xAxis: {
      default: "",
    },
    yAxis: {
      default: "",
    },
  },
});
let enemybulletIfe = cc.Class({
  name: "enemybulletIfe",
  properties: {
    name: "",
    freqTime: 0,
    initPoolCount: 0,
    prefab: cc.Prefab,
    position: {
      default: [],
      type: enemyBPosition,
    },
  },
});
cc.Class({
  extends: cc.Component,
  properties: {
    enemybulletIfe: {
      default: null,
      type: enemybulletIfe,
    },
  },
  onLoad() {
    this.curState = Gdt.commonInfo.gameState.start;

    Gdt.common.initObjPool(this, this.enemybulletIfe);
  },

  enemyOpenFire(gteBEnemyInfo) {
    this.getNewbullet(this.enemybulletIfe, gteBEnemyInfo);
  },

  pauseAction() {
    this.enabled = false;
    this.curState = Gdt.commonInfo.gameState.pause;
  },

  resumeAction() {
    this.enabled = true;
    this.curState = Gdt.commonInfo.gameState.start;
  },

  getNewbullet(bulletInfo, gteInfo) {
    const poolName = bulletInfo.name + "Pool";
    for (let i = 0; i < bulletInfo.position.length; i++) {
      let newNode = Gdt.common.genNewNode(
        this[poolName],
        bulletInfo.prefab,
        this.node
      );
      let newV2 = this.getBulletPostion(bulletInfo.position[i], gteInfo);
      newNode.setPosition(newV2);
      let newNodeComp = newNode.getComponent("enemy_bullet");
      newNodeComp.poolName = poolName;
      //   newNodeComp.ySpeed = gteInfo.getComponent("enemy").ySpeed - 50;
    }
  },

  getBulletPostion(posInfo, gteInfo) {
    const hPos = gteInfo.getPosition(),
      newV2_x = hPos.x + parseFloat(posInfo.xAxis),
      newV2_y = hPos.y + parseFloat(posInfo.yAxis);
    return cc.v2(newV2_x, newV2_y);
  },

  bulletDied(nodeinfo) {
    const poolName = nodeinfo.getComponent("enemy_bullet").poolName;
    Gdt.common.backObjPool(this, poolName, nodeinfo);
  },
});
