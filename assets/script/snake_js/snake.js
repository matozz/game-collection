cc.Class({
  extends: cc.Component,
  properties: {
    DIFFPX: 15,
    canvas: {
      default: null,
      type: cc.Node,
    },
    snakebody: {
      default: null,
      type: cc.Prefab,
    },
    snakeHead: {
      default: null,
      type: cc.Prefab,
    },
    currScore: {
      default: null,
      type: cc.Label,
    },
    initLength: {
      default: 3,
      type: cc.Integer,
    },
  },
  onLoad() {
    // 创建蛇身体对象池 5
    this.snakeBodyPool = new cc.NodePool();
    const initCount = 5;
    for (let i = 0; i < initCount; ++i) {
      let snakeBody = cc.instantiate(this.snakebody);
      this.snakeBodyPool.put(snakeBody);
    }

    this.snakeArray = []; //代表蛇身体的数组
    for (let i = 0; i < this.initLength; i++) {
      let rect = null;
      if (this.snakeBodyPool.size() > 0) {
        rect = this.snakeBodyPool.get();
      } else {
        rect = cc.instantiate(this.snakebody);
      }
      this.node.addChild(rect);
      rect.setPosition(cc.v2(i * 15, 0));
      this.snakeArray.splice(0, 0, rect);
    }
    // 插入蛇头
    let snakeHead = cc.instantiate(this.snakeHead);
    this.node.addChild(snakeHead);
    snakeHead.setPosition(cc.v2(this.initLength * 15, 0));
    this.snakeArray.splice(0, 0, snakeHead);

    // 设置蛇头
    this.head = this.snakeArray[0];

    //初始位置向右
    this.direction = 39;

    // 触摸的初始位置
    this.touchX = 0;
    this.touchY = 0;

    // Game Obj
    this.game = this.canvas.getComponent("snake_game");

    // food node
    this.food = this.node.getComponent("food");

    // 触摸事件
    this.initEvent();
  },
  //蛇的移动方式
  snakeMove() {
    let rect = null;
    if (this.snakeBodyPool.size() > 0) {
      rect = this.snakeBodyPool.get();
    } else {
      rect = cc.instantiate(this.snakebody);
    }
    this.node.addChild(rect);

    rect.setPosition(cc.v2(this.head.x, this.head.y));
    this.snakeArray.splice(1, 0, rect);

    //37 左，38 上，39 右，40 下

    switch (this.direction) {
      case 37:
        this.head.x -= this.head.width;
        break;
      case 38:
        this.head.y -= this.head.height;
        break;
      case 39:
        this.head.x += this.head.width;
        break;
      case 40:
        this.head.y += this.head.height;
        break;
      default:
        break;
    }

    // console.log(this.head.x);

    if (this.isEat()) {
      this.game.score++;
      this.currScore.string = "score:" + this.game.score;
      this.food.releaseFood();
      this.food.foodPosShow();
    } else {
      let removePart = this.snakeArray.pop();
      this.snakeBodyPool.put(removePart);
    }

    // 撞墙
    if (
      this.head.x >= (this.node.width - 15) / 2 ||
      this.head.x < -this.node.width / 2 ||
      this.head.y >= this.node.height / 2 ||
      this.head.y < -this.node.height / 2
    )
      this.game.gameOver = true;

    for (let i = 1; i < this.snakeArray.length; i++)
      if (
        this.snakeArray[i].x == this.head.x &&
        this.snakeArray[i].y == this.head.y
      )
        this.game.gameOver = true;
  },

  initEvent() {
    this.node.on(
      cc.Node.EventType.TOUCH_START,
      (e) => {
        let startPoint = e.getLocation();

        let x = startPoint.x;
        let y = startPoint.y;

        this.touchX = x;
        this.touchY = y;
      },
      this
    );

    this.node.on(
      cc.Node.EventType.TOUCH_END,
      (e) => {
        let EndPoint = e.getLocation();

        let x = EndPoint.x;
        let y = EndPoint.y;

        let diffX = x - this.touchX;
        let diffY = y - this.touchY;

        if (diffX <= -this.DIFFPX && Math.abs(diffX) >= Math.abs(diffY)) {
          if (this.direction !== 39) this.direction = 37;
        } else if (diffX >= this.DIFFPX && Math.abs(diffX) >= Math.abs(diffY)) {
          if (this.direction !== 37) this.direction = 39;
        } else if (diffY <= -this.DIFFPX && Math.abs(diffY) > Math.abs(diffX)) {
          if (this.direction !== 40) this.direction = 38;
        } else if (diffY >= this.DIFFPX && Math.abs(diffY) > Math.abs(diffX)) {
          if (this.direction !== 38) this.direction = 40;
        }
      },
      this
    );
  },

  //是否吃到食物判断
  isEat() {
    if (this.head.x == this.food.foodX && this.head.y == this.food.foodY) {
      return true;
    } else {
      return false;
    }
  },
});
