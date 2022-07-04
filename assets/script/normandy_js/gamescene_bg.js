const Gdt = require("globals");

cc.Class({
  extends: cc.Component,
  properties: {
    loopBg1: {
      default: null,
      type: cc.Node,
    },
    loopBg2: {
      default: null,
      type: cc.Node,
    },
    speed: 1,
  },

  start() {
    if (this.loopBg2) {
      this.loopBg2.active = true;
    }
    if (Gdt.loopBg) {
      this.loopBg1.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(
        Gdt.loopBg
      );
      this.loopBg2.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(
        Gdt.loopBg
      );
    }
  },

  pauseAction() {
    this.enabled = false;
    this.curState = Gdt.commonInfo.gameState.pause;
  },

  resumeAction() {
    this.enabled = true;
    this.curState = Gdt.commonInfo.gameState.start;
  },

  update(dt) {
    this.loopBg1.y += dt * this.speed;
    this.loopBg2.y += dt * this.speed;
    // console.log(this.loopBg1.y, this.node.parent.height);
    if (this.loopBg1.y < -this.node.parent.height + 10) {
      this.loopBg1.y = this.node.parent.height;
    }
    if (this.loopBg2.y < -this.node.parent.height + 10) {
      this.loopBg2.y = this.node.parent.height;
    }
  },
});
