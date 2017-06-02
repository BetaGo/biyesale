const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

const GoodsModel = require('../models/goods');
const checkLogin = require('../middlewares/check').checkLogin;
const checkUserLogin = require('../middlewares/check').checkUserLogin;

// GET /goods 所有用户或特定用户的商品列表
router.get('/', (req, res, next) => {
  res.render('goods');
});

// POST /goods 录入一件商品
router.post('/', checkLogin, (req, res, next) => {
  const author = req.session._id;
  const name = req.fields.name;
  const desc = req.fields.desc;
  let price = req.fields.price;
  let remain = req.fields.remain;
  const cover = req.files.cover.path.split(path.sep).pop();

  // 校验参数
  try {
    if (!name.length) {
      throw new Error('请填写商品名称');
    }
    if (!desc.length) {
      throw new Error('请填写商品简介');
    }
    if (!price.length) {
      throw new Error('请填写商品价格');
    }
    if (Number.isNaN(Number.parseFloat(price, 10))) {
      throw new Error('商品价格必须为数字');
    }
    if (!remain.length) {
      throw new Error('请填写商品数量');
    }
    if (Number.isNaN(Number.parseInt(remain, 10))) {
      throw new Error('商品数量必须为整数');
    }
    if (!req.files.cover.name) {
      throw new Error('请上传商品图片');
    }
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('back');
    return;
  }

  let goods = {
    author,
    name,
    desc,
    cover,
    price: Number.parseFloat(price, 10),
    remain: Number.parseInt(remain, 10),
  };

  GoodsModel.create(goods)
    .then((result) => {
      // 此处 goods 是插入 mongodb 后的值，包含 _id
      goods = result.ops[0];
      req.flash('success', '录入成功');
      // 录入成功后跳转到该商品详情页
      res.redirect(`/goods/${goods._id}`);
    })
    .catch(next);
});

// GET /goods/create 录入商品页
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create');
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
