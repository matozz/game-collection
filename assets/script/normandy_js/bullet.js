const Gdt = require("globals");

cc.Class({
  extends: cc.Component,
  properties: {
    xSpeed: 0,
    ySpeed: 0,
    hpDrop: 0, //Hp dropped per hero bullet
  },

  onLoad() {
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    this.bulletGroup = this.node.parent.getComponent("bullet_group");
  },

  onCollisionEnter(other, self) {
    this.bulletGroup.bulletDied(self.node);
  },

  update(dt) {
    if (this.bulletGroup.curState != Gdt.commonInfo.gameState.start) return;
    this.node.x += dt * this.xSpeed;
    this.node.y += dt * this.ySpeed;
    if (this.node.y > this.node.parent.height / 2)
      this.bulletGroup.bulletDied(this.node);
  },
});
