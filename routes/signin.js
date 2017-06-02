const express = require('express');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

const router = express.Router();

// GET /signin 登录页面
router.get('/', checkNotLogin, (req, res, next) => {
  // req.send(req.flash());
  res.render('signin');
  // TODO:
});


// POST /signin 登录
router.post('/', checkNotLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

module.exports = router;
