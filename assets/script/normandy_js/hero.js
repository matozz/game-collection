const Gdt = require("globals");

cc.Class({
  extends: cc.Component,
  properties: {
    moveRatio: 0.8,
    heroInitHp: 10,
    heroHp: 10,
    progressW: 60,
    hpProgressBar: {
      default: null,
      type: cc.Node,
    },
    main: {
      default: null,
      type: require("main"),
    },
    bulletGroup: {
      default: null,
      type: require("bullet_group"),
    },
    heroDropHpBg: {
      default: null,
      type: cc.Node,
    },
  },

  onLoad() {
    const manager = cc.director.getCollisionManager();
    manager.enabled = true;
    this.curState = Gdt.commonInfo.gameState.none;

    this.bulletLevel = 1;
    // this.currX = 0;
    this.onDrag();

    //DEFAULT POSITION
    this.node.x = 0;
    this.node.y = -(this.node.parent.height / 2) + this.node.height / 2 + 30;
    this.setHeroHpPregress();
  },

  //DRAG EVENT
  onDrag() {
    this.node.parent.on(cc.Node.EventType.TOUCH_START, this.dragStart, this);
    this.node.parent.on(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this);
  },

  offDrag() {
    this.node.parent.off(cc.Node.EventType.TOUCH_START, this.dragStart, this);
    this.node.parent.off(cc.Node.EventType.TOUCH_MOVE, this.dragMove, this);
  },

  dragStart(event) {
    const locationv = event.getLocation();
    this.currX = locationv.x;
    this.currY = locationv.y;
    // console.log(this.currX, this.currY);
  },

  //add y axis move
  dragMove(event) {
    let locationv = event.getLocation(),
      location = { x: this.node.x, y: this.node.y },
      minX = -this.node.parent.width / 2 + this.node.width / 2,
      minY = -this.node.parent.height / 2 + this.node.height / 2,
      maxX = -minX,
      maxY = -minY;

    // console.log(locationv, location);
    location.x += (locationv.x - this.currX) * this.moveRatio;
    location.y += (locationv.y - this.currY) * this.moveRatio;
    this.currX = locationv.x;
    this.currY = locationv.y;
    if (location.x < minX) location.x = minX;
    if (location.x > maxX) location.x = maxX;
    if (location.y < minY) location.y = minY;
    if (location.y > maxY) location.y = maxY;
    this.node.setPosition(location);
  },

  // hero hp progress
  setHeroHpPregress() {
    if (this.heroHp > 0) {
      this.hpProgressBar.width =
        (this.heroHp / this.heroInitHp) * this.progressW;
    } else {
      this.hpProgressBar.width = 0;
    }
  },

  heroHitByEnemyShowBlood() {
    this.heroDropHpBg.active = true;
    this.heroDropHpBg.opacity = 0;
    cc.tween(this.heroDropHpBg)
      .to(0.2, { opacity: 100 })
      .to(0.2, { opacity: 0 })
      .call(() => {
        this.heroDropHpBg.active = false;
      })
      .start();
  },

  //Collision
  onCollisionEnter(other, self) {
    //Colliding Buff
    if (other.node.group == "buff") {
      if (other.node.name == "buffBullet") {
        if (this.bulletLevel < 4) this.bulletLevel++;
        this.bulletGroup.changeBullet(other.node.name, this.bulletLevel);
      } else if (other.node.name == "buffBomb") {
        // this.main.getBuffBomb();
      } else if (other.node.name == "buffHeart") {
        if (this.heroInitHp - this.heroHp >= 5) {
          this.heroHp = this.heroHp + 5;
        } else {
          this.heroHp = this.heroInitHp;
        }
      }
    } else if (other.node.group == "enemy") {
      // Colliding Enemy
      const enemy = other.node.parent.getComponent("enemy");
      this.heroHp -= enemy.heroDropHp;
      other.node.group = "default"; //clean dead enemy's collision group
      if (this.heroHp > 0) this.heroHitByEnemyShowBlood();
    } else if (other.node.group == "enemyBullet") {
      const enemyBullet = other.node.getComponent("enemy_bullet");
      this.heroHp -= enemyBullet.hpDrop;
      if (this.heroHp > 0) this.heroHitByEnemyShowBlood();
    } else {
      return false;
    }

    // dead
    this.setHeroHpPregress();
    if (this.heroHp <= 0) {
      let animation = this.node.getComponent(cc.Animation);
      animation.play("blow_up");
      animation.on("finished", this.onFinished, this);
      this.main.gameOver();
    }
  },

  onFinished(event) {
    this.node.destroy();
  },
});
