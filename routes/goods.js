const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer'); // // 仅用来处理 multipart/form-data 类型的表单数据.

const router = express.Router();

const GoodsModel = require('../models/goods');
const checkLogin = require('../middlewares/check').checkLogin;
const checkUserLogin = require('../middlewares/check').checkUserLogin;

// 配置 multer 处理 multipart/form-data 类型的表单数据.
const extensionRegExp = /\.\w+$/;
const imgTypeArray = ['.png', '.jpg', '.gif', '.svg', '.jpeg'];
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images/cover'));
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${extensionRegExp.exec(file.originalname)[0]}`);
  },
});
const upload = multer({ storage });
/*
function fileFilter(req, file, cb) {
  // 这个函数应该调用 `cb` 用boolean值来
  // 指示是否应接受该文件
  if (['.png', '.jpg', '.gif', '.svg', '.jpeg'].indexOf(extensionRegExp.exec(file.originalname)) !== -1) {
    // 接受这个文件，使用`true`, 像这样:
    cb(null, true);
  } else {
    // 拒绝这个文件，使用`false`, 像这样:
    cb(null, false);
  }
  // 如果有问题，你可以总是这样发送一个错误:
  // cb(new Error('I don\'t have a clue!'));
}
const upload = multer({ storage, fileFilter });
*/


// GET /goods 所有用户或特定用户的商品列表
router.get('/', (req, res, next) => {
  const author = req.query.author;

  GoodsModel.getGoods(author)
    .then((goods) => {
      res.render('goods', {
        goods,
      });
    })
    .catch(next);
});

// POST /goods 录入一件商品
router.post('/', checkLogin, upload.single('cover'), (req, res, next) => {
  const author = req.session.admin._id;
  const name = req.body.name;
  const desc = req.body.desc;
  const price = req.body.price;
  const remain = req.body.remain;
  const cover = req.file.path.split(path.sep).pop();

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
    if (!req.file.filename) {
      throw new Error('请上传商品图片');
    }
    if (imgTypeArray.indexOf(extensionRegExp.exec(req.file.originalname)[0]) === -1) {
      // 检查 avatar 是否为图片
      throw new Error("请上传后缀名为'.png', '.jpg', '.gif', '.svg', '.jpeg' 的图片");
    }
  } catch (e) {
    // 上传失败，异步删除图片
    fs.unlink(req.file.path);
    req.flash('error', e.message);
    res.redirect('back');
    return;
  }

  let goods = {
    author,
    name,
    desc,
    cover,
    price: Number.parseFloat(price, 10), // 转换成数字类型
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
    .catch((e) => {
      // 录入失败，异步删除上传的图片
      fs.unlink(req.file.path);
      req.flash('error', '录入失败');
      next(e);
    });
});

// GET /goods/create 录入商品页
router.get('/create', checkLogin, (req, res, next) => {
  res.render('create');
});

// GET /goos/:goodsId 某件商品详情页
router.get('/:goodsId', (req, res, next) => {
  const goodsId = req.params.goodsId;

  GoodsModel.getGoodsById(goodsId)
    .then((result) => {
      const goods = [result];
      if (!goods[0]) {
        throw new Error('该商品不存在');
      }

      res.render('goods', {
        goods,
      });
    })
    .catch(next);
});

// GET /goods/:goodsId/edit 修改某件商品信息页
router.get('/:goodsId/edit', checkLogin, (req, res, next) => {
  const goodsId = req.params.goodsId;
  const author = req.session.admin._id;

  GoodsModel.getRawGoodsById(goodsId)
    .then((goods) => {
      if (!goods) {
        throw new Error('该文章不存在');
      }
      if (author.toString() !== goods.author._id.toString()) {
        throw new Error('权限不足');
      }
      res.render('edit', {
        goods,
      });
    });
});

// POST /goods/:goodsId/edit 提交修改后的商品信息
router.post('/:goodsId/edit', checkLogin, (req, res, next) => {
  const goodsId = req.params.goodsId;
  const author = req.session.admin._id;
  const name = req.body.name;
  const desc = req.body.desc;
  const price = req.body.price;
  const remain = req.body.remain;
  const cover = req.file.path.split(path.sep).pop();

  GoodsModel.updateGoodsById(goodsId, author, {
    author,
    name,
    desc,
    cover,
    price: Number.parseFloat(price, 10), // 转换成数字类型
    remain: Number.parseInt(remain, 10),
  })
  .then(() => {
    req.flash('success', '编辑商品信息成功');
  })
  .catch(next);
});

// GET /goods/:goodsId/remove 删除某件商品
router.get('/:goodsId/remove', checkLogin, (req, res, next) => {
  const goodsId = req.params.goodsId;
  const author = req.session.admin._id;

  GoodsModel.delGoodsById(goodsId, author)
    .then(() => {
      req.flash('success', '成功删除商品');
      // 删除成功后跳转到主页
      res.redirect('/goods');
    })
    .catch(next);
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
