const express = require('express');

const router = express.Router();

const checkLogin = require('../middlewares/check').checkLogin;
const checkUserLogin = require('../middlewares/check').checkUserLogin;

// GET /goods 所有用户或特定用户的商品列表
router.get('/', (req, res, next) => {
  res.send('商品信息');
  // TODO:
});

// POST /goods 录入一件商品
router.post('/', checkLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

// GET /goods/create 录入商品页
router.get('/create', checkLogin, (req, res, next) => {
  res.send(req.flash);
  // TODO:
});

// GET /goos/:goodsId 某件商品详情页
router.get('/:goodsId', (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

// GET /goods/:goodsId/edit 修改某件商品信息页
router.get('/:goodsId/edit', checkLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

// POST /goods/:goodsId/edit 提交修改后的商品信息
router.post('/:goodsId/edit', checkLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

// GET /goods/:goodsId/remove 删除某件商品
router.get('/:goodsId/remove', checkLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

// POST /goods/:goodsId/own 用户购买某件商品
router.post('/:goodsId/own', checkUserLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

// GET /goods/:goodsId/own/:ownID/remove 用户取消购买某件商品
router.get('/:goodsId/own/:ownId/remove', checkUserLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});


module.exports = router;
