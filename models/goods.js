const Goods = require('../lib/mongo').Goods;

module.exports ={
  // 新增一种商品
  create: function create(goods) {
    return Goods.create(goods);
  },
  // TODO:
};
