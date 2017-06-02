const express = require('express');
const sha1 = require('sha1');

const AdminModel = require('../models/admin');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

const router = express.Router();

// GET /signin 登录页面
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signin');
});

// POST /signin 登录
router.post('/', checkNotLogin, (req, res, next) => {
  const name = req.fields.name;
  const password = req.fields.password;

  AdminModel.getAdminByName(name)
    .then((admin) => {
      if (!admin) {
        req.flash('error', '用户不存在');
        res.redirect('back');
        return;
      }
      // 检查密码是否匹配
      if (sha1(password) !== admin.password) {
        req.flash('error', '用户名或密码错误');
        res.redirect('back');
        return;
      }

      req.flash('success', '登陆成功');
      // 用户信息写入 session
      delete admin.password;
      req.session.admin = admin;
      // 跳转到主页
      res.redirect('/goods');
    })
    .catch(next);
});

module.exports = router;
