const Goods = require('../lib/mongo').Goods;

module.exports = {
  // 新增一种商品
  create: function create(goods) {
    return Goods.create(goods);
  },
  // 通过商品 id 获取一件商品
  getGoodsById: function getGoodsById(goodsId) {
    return Goods
      .findOne({ _id: goodsId })
      .populate({ path: 'author', model: 'Admin' })
      .addCreatedAt()
      .exec();
  },

  // 通过录入时间降序获取所有商品，或某个特定管理员的所有商品
  getGoods: function getGoods(author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return Goods
      .find(query)
      .populate({ path: 'author', model: 'Admin' })
      .sort({ _id: -1 })
      .addCreatedAt()
      .exec();
  },

  // 通过商品 id 获取商品原始信息 （编辑商品)
  getRawGoodsById: function getRawGoodsById(goodsId) {
    return Goods
      .findOne({ _id: goodsId })
      .populate({ path: 'author', model: 'Admin' })
      .exec();
  },

  // 通过管理员 id 和 商品 id 更新商品信息
  updateGoodsById: function updateGoodsById(goodsId, author, data) {
    return Goods.update({ author, _id: goodsId }, { $set: data }).exec();
  },

  // 通过 管理员 id 和 商品 id 删除商品
  delGoodsById: function delGoodsById(goodsId, author) {
    return Goods.remove({ author, _id: goodsId }).exec();
  },
};
