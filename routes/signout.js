const express = require('express');

const checkLogin = require('../middlewares/check').checkLogin;

const router = express.Router();

// GET /signout 登出
router.get('/', checkLogin, (req, res, next) => {
  res.send(req.flash());
  // TODO:
});

module.exports = router;
