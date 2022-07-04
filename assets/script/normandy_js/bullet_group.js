const Gdt = require("globals");

//Bullet Pos
let bPosition = cc.Class({
  name: "bPosition",
  properties: {
    xAxis: {
      default: "",
    },
    yAxis: {
      default: "",
    },
  },
});

//Infinite group
let bulletInfinite = cc.Class({
  name: "bulletInfinite",
  properties: {
    name: "",
    freqTime: 0,
    initPoolCount: 0,
    prefab: cc.Prefab,
    position: {
      default: [],
      type: bPosition,
    },
  },
});

//Finite group 0
let bulletInfiniteG = cc.Class({
  name: "bulletFiniteG",
  extends: bulletInfinite,
  properties: {
    finiteTime: 0,
    orginName: "",
  },
});

//Finite group 1
let bulletFiniteG = cc.Class({
  name: "bulletFiniteG",
  extends: bulletInfinite,
  properties: {
    finiteTime: 0,
    orginName: "",
  },
});

//Finite group 1
let bulletFiniteG2 = cc.Class({
  name: "bulletFiniteG2",
  extends: bulletInfinite,
  properties: {
    finiteTime: 0,
    orginName: "",
  },
});

//Finite group 1
let bulletFiniteG3 = cc.Class({
  name: "bulletFiniteG2",
  extends: bulletInfinite,
  properties: {
    finiteTime: 0,
    orginName: "",
  },
});

cc.Class({
  extends: cc.Component,
  properties: {
    main: cc.Node,
    bulletInfinite: {
      default: null,
      type: bulletInfinite,
    },
    bulletInfiniteG: {
      default: [],
      type: bulletFiniteG,
    },
    bulletFiniteG: {
      default: [],
      type: bulletFiniteG,
    },
    bulletFiniteG2: {
      default: [],
      type: bulletFiniteG2,
    },
    bulletFiniteG3: {
      default: [],
      type: bulletFiniteG3,
    },
    hero: {
      default: null,
      type: cc.Node,
    },
  },

  onLoad() {
    this.curState = Gdt.commonInfo.gameState.none;
    this.isDeadBullet = false;

    // Gdt.common.initObjPool(this, this.bulletInfinite);

    Gdt.common.batchInitObjPool(this, this.bulletInfiniteG);
    Gdt.common.batchInitObjPool(this, this.bulletFiniteG);
    Gdt.common.batchInitObjPool(this, this.bulletFiniteG2);
    Gdt.common.batchInitObjPool(this, this.bulletFiniteG3);
  },

  startAction() {
    this.curState = Gdt.commonInfo.gameState.start;

    for (let i = 0; i < this.bulletInfiniteG.length; i++) {
      this.bICallback = function (e) {
        this.getNewbullet(this.bulletInfiniteG[e]);
      }.bind(this, i);
      this.schedule(
        this.bICallback,
        this.bulletInfiniteG[i].freqTime
        // this.bulletFiniteG[i].finiteTime
      );
    }

    // this.getNewbullet(this.bulletInfinite);
    // this.bICallback = function () {
    //   this.getNewbullet(this.bulletInfinite);
    //   this.isDeadBullet = false;
    // }.bind(this);
    // this.schedule(this.bICallback, this.bulletInfinite.freqTime);
  },

  pauseAction() {
    this.enabled = false;
    this.curState = Gdt.commonInfo.gameState.pause;
  },

  resumeAction() {
    this.enabled = true;
    this.curState = Gdt.commonInfo.gameState.start;
  },

  changeBullet(BuffBullet, BulletLevel) {
    if (this.isDeadBullet) return;
    console.log(BulletLevel);
    // this.unschedule(this.bICallback);
    // this.unschedule(this.bFCallback);
    // this.unschedule(this.bFCallback2);
    // this.unschedule(this.bFCallback3);
    // console.log(BulletLevel);
    if (BulletLevel == 2) {
      for (let i = 0; i < this.bulletFiniteG.length; i++) {
        // console.log(this.bulletFiniteG);
        if (this.bulletFiniteG[i].orginName == BuffBullet) {
          // crazy bullets
          this.bFCallback = function (e) {
            this.getNewbullet(this.bulletFiniteG[e]);
            // this.isDeadBullet = true;
          }.bind(this, i);
          this.schedule(
            this.bFCallback,
            this.bulletFiniteG[i].freqTime
            // this.bulletFiniteG[i].finiteTime
          );
        }
        // // back to normal bullets
        // let delay =
        //   this.bulletFiniteG[i].freqTime * this.bulletFiniteG[i].finiteTime;
        // this.schedule(
        //   this.bICallback,
        //   this.bulletInfinite.freqTime,
        //   cc.macro.REPEAT_FOREVER,
        //   delay
        // );
      }
    } else if (BulletLevel == 3) {
      console.log(BulletLevel);
      for (let i = 0; i < this.bulletFiniteG2.length; i++) {
        // console.log(this.bulletFiniteG2);
        if (this.bulletFiniteG2[i].orginName == BuffBullet) {
          // crazy bullets
          this.bFCallback2 = function (e) {
            this.getNewbullet(this.bulletFiniteG2[e]);
            // this.isDeadBullet = true;
          }.bind(this, i);
          this.schedule(
            this.bFCallback2,
            this.bulletFiniteG2[i].freqTime
            // this.bulletFiniteG2[i].finiteTime
          );
        }
      }
    } else if (BulletLevel == 4) {
      for (let i = 0; i < this.bulletFiniteG3.length; i++) {
        // console.log(this.bulletFiniteG3);
        if (this.bulletFiniteG3[i].orginName == BuffBullet) {
          // crazy bullets
          this.bFCallback3 = function (e) {
            this.getNewbullet(this.bulletFiniteG3[e]);
            this.isDeadBullet = true;
          }.bind(this, i);
          this.schedule(
            this.bFCallback3,
            this.bulletFiniteG3[i].freqTime
            // this.bulletFiniteG3[i].finiteTime
          );
        }
      }
    }
  },

  getNewbullet(bulletInfo) {
    const poolName = bulletInfo.name + "Pool";
    for (let bc = 0; bc < bulletInfo.position.length; bc++) {
      let newNode = Gdt.common.genNewNode(
        this[poolName],
        bulletInfo.prefab,
        this.node
      );
      let newV2 = this.getBulletPostion(bulletInfo.position[bc]);
      newNode.setPosition(newV2);
      newNode.getComponent("bullet").poolName = poolName;

      // level
      this.curLevel = this.main.getComponent("main").curLevel;
      this.decreaseHpDrop(newNode, this.curLevel);
    }
  },

  getBulletPostion(posInfo) {
    const hPos = this.hero.getPosition(),
      newV2_x = hPos.x + parseFloat(posInfo.xAxis),
      newV2_y = hPos.y + parseFloat(posInfo.yAxis);
    return cc.v2(newV2_x, newV2_y);
  },

  decreaseHpDrop(nodeInfo, level) {
    // console.log(nodeInfo.getComponent("bullet").hpDrop);
    if (nodeInfo.getComponent("bullet").hpDrop < 0.2) return;
    nodeInfo.getComponent("bullet").hpDrop = 1 - 0.1 * (level - 1);
  },

  bulletDied(nodeinfo) {
    const poolName = nodeinfo.getComponent("bullet").poolName;
    Gdt.common.backObjPool(this, poolName, nodeinfo);
  },
});
