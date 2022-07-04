cc.Class({
  extends: cc.Component,
  properties: {
    score: 0,
    gameContainer: {
      default: null,
      type: cc.Node,
    },
    gameInfo: {
      default: null,
      type: cc.Node,
    },
  },
  onLoad() {
    // container
    this.gameContainer.width = this.node.width;
    this.gameContainer.height = this.node.height;

    // default speed
    this.snakeMoveSpeed = 14;

    this.gameOver = false;

    this.frames = 0;
    // snake node
    this.snake = this.gameContainer.getComponent("snake");
  },
  showGameInfo() {
    this.gameInfo.active = true;
    this.gameInfo.opacity = 1;
    cc.tween(this.gameInfo).to(0.2, { opacity: 255 }).start();
  },
  // called every frame
  update(dt) {
    if (this.gameOver) {
      if (!this.gameInfo.active) this.showGameInfo();
      return;
    }
    // speed
    switch (this.score) {
      case 3:
        this.snakeMoveSpeed = 12;
        break;
      case 6:
        this.snakeMoveSpeed = 10;
        break;
      case 9:
        this.snakeMoveSpeed = 8;
        break;
      case 12:
        this.snakeMoveSpeed = 6;
        break;
      case 15:
        this.snakeMoveSpeed = 5;
        break;
      case 18:
        this.snakeMoveSpeed = 4;
        break;
      case 25:
        this.snakeMoveSpeed = 3;
        break;
      case 35:
        this.snakeMoveSpeed = 2;
        break;
    }
    this.frames++;
    if (this.frames % this.snakeMoveSpeed === 0) this.snake.snakeMove();
  },
});
