const express = require('express');

const router = express.Router();

const GoodsModel = require('../models/goods');

// GET /api/goods 所有用户或特定用户的商品列表
router.get('/goods', (req, res, next) => {
  const author = req.query.author;

  GoodsModel.getGoods(author)
    .then((goods) => {
      res.json(goods);
    })
    .catch(next);
    // TODO:
});

// POST /api/goods 用户操作上传
router.post('/goods',(req, res, next) => {
  // TODO:
});

module.exports = router;

