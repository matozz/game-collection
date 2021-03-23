module.exports = {
  GD: null, //Global Data

  //获取随机数
  random(min, max) {
    return Math.random() * (max - min) + min;
  },
};
