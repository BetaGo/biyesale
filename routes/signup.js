const express = require('express');
const fs = require('fs');
const path = require('path');
const sha1 = require('sha1');
const multer = require('multer'); // 仅用来处理 multipart/form-data 类型的表单数据.


const AdminModel = require('../models/admin');
const checkNotLogin = require('../middlewares/check').checkNotLogin;

const router = express.Router();

// 配置 multer 处理 multipart/form-data 类型的表单数据.
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, path.resolve(__dirname, '../public/images/avatar'));
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${req.body.name}`);
  },
});
const upload = multer({ storage });

// GET /signup 注册页
router.get('/', checkNotLogin, (req, res, next) => {
  res.render('signup');
});


// POST /signup 注册
router.post('/', checkNotLogin, upload.single('avatar'), (req, res, next) => {
  const name = req.body.name;
  const gender = req.body.gender;
  const bio = req.body.bio;
  const avatar = req.file.path.split(path.sep).pop();
  const password = req.body.password;
  const repassword = req.body.repassword;


  // 校验参数
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在 1-10 个字符');
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是 m、f 或 x');
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在 1-30 个字符');
    }
    if (!req.file.filename) {
      throw new Error('缺少头像');
    }
    if (password.length < 6) {
      throw new Error('密码至少 6 个字符');
    }
    if (password !== repassword) {
      throw new Error('两次输入密码不一致');
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.file.path);
    req.flash('error', e.message);
    res.redirect('/signup');
    return;
  }

  // 明文密码加密
  const securityPassword = sha1(password);

  // 待写入数据库的管理员信息
  let admin = {
    name,
    gender,
    bio,
    avatar,
    password: securityPassword,
  };

  // 管理员信息写入数据库
  AdminModel.create(admin)
    .then((result) => {
      // 此处 admin 是插入 mongodb 后的值， 包含 _id
      admin = result.ops[0];
      // 将管理员信息存入 session
      delete admin.password;
      req.session.admin = admin;
      // 写入 flash
      req.flash('success', '注册成功');
      // 跳转到首页
      res.redirect('/goods');
    })
    .catch((e) => {
      // 注册失败，异步删除上传的头像
      fs.unlink(req.file.path);
      // 用户名被占用则跳回注册页，而不是错误页
      if (e.message.match('E11000 duplicate key')) {
        req.flash('error', '用户名已被注册');
        res.redirect('/signup');
      }
      next(e);
    });
});


module.exports = router;
