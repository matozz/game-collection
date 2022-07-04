cc.Class({
  extends: cc.Component,
  properties: {
    foodPrefab: {
      default: null,
      type: cc.Prefab,
    },
  },
  onLoad() {
    // 创建食物对象池
    this.foodPool = new cc.NodePool();
    const initCount = 3;
    for (let i = 0; i < initCount; ++i) {
      let food = cc.instantiate(this.foodPrefab);
      this.foodPool.put(food);
    }

    this.foodInstance = null;

    this.isOnSnake = true;

    // snake node
    this.snake = this.node.getComponent("snake").snakeArray;

    // obstacle
    this.obstacleArr = this.node.getComponent("obstacle").obstacleInstance;

    this.foodX = 0;
    this.foodY = 0;

    // show first food
    this.foodPosShow();
  },

  // 根据范围获取随机数
  getNumberInRange(min, max) {
    let range = max - min;
    let r = Math.random() * 2 - 1;
    return Math.round(r * range + min);
  },

  foodPosShow() {
    this.isOnSnake = true;
    let indexX, indexY;
    while (this.isOnSnake) {
      this.isOnSnake = false;
      indexX = this.getNumberInRange(0, this.node.width / 30 - 1);
      indexY = this.getNumberInRange(0, this.node.height / 30 - 1);
      // 是否与🐍重合
      for (let i = 0; i < this.snake.length; i++) {
        if (this.snake[i].x == indexX * 15 && this.snake[i].y == indexY * 15) {
          //随机数重给
          this.isOnSnake = true;
          break;
        }
      }
      // 是否与障碍物重合
      if (!this.isOnSnake) {
        for (let i = 0; i < this.obstacleArr.length; i++) {
          if (
            indexX * 15 == this.obstacleArr[i].x &&
            indexY * 15 == this.obstacleArr[i].y
          ) {
            //随机数重给
            this.isOnSnake = true;
            break;
          }
        }
      }
      if (
        indexX * 15 < -this.node.width / 2 + 30 ||
        indexX * 15 > this.node.width / 2 - 30 ||
        indexY * 15 < -this.node.height / 2 + 30 ||
        indexY * 15 > this.node.height / 2 - 30
      )
        this.isOnSnake = true;
    }

    if (this.foodPool.size() > 0) {
      this.foodInstance = this.foodPool.get();
    } else {
      this.foodInstance = cc.instantiate(this.foodPrefab);
    }
    this.node.addChild(this.foodInstance);
    this.foodInstance.setPosition(cc.v2(indexX * 15, indexY * 15));

    // 设置食物的位置
    this.foodX = indexX * 15;
    this.foodY = indexY * 15;
  },

  // 回收食物
  releaseFood() {
    this.foodPool.put(this.foodInstance);
    this.foodInstance = null;
  },
});
