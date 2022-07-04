module.exports = {
  GD: null, //Global Data
  Authorized: false,
  isWxEnv: false,

  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  batchInitObjPool(ptO, objArray) {
    for (let i = 0; i < objArray.length; i++) {
      let objinfo = objArray[i];
      this.initObjPool(ptO, objinfo);
    }
  },

  initObjPool(ptO, objInfo) {
    let name = objInfo.name,
      poolName = name + "Pool";
    ptO[poolName] = new cc.NodePool();
    let initPoolCount = objInfo.initPoolCount;
    for (let i = 0; i < initPoolCount; ++i) {
      let nodeO = cc.instantiate(objInfo.prefab);
      ptO[poolName].put(nodeO);
    }
  },

  backObjPool(ptO, poolName, nodeinfo) {
    ptO[poolName].put(nodeinfo);
  },

  genNewNode(pool, prefab, nodeParent) {
    let newNode = null;
    if (pool.size() > 0) {
      newNode = pool.get();
    } else {
      newNode = cc.instantiate(prefab);
    }
    nodeParent.addChild(newNode);
    return newNode;
  },
};
