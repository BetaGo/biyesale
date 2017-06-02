module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.admin) {
      req.flash('error', '未登录');
      res.redirect('/signin');
      return;
    }
    next();
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.admin) {
      req.flash('error', '已登录');
      res.redirect('back');
      return;
    }
    next();
  },

  checkUserLogin: function checkUserLogin(req, res, next) {
    if (!req.session.user) {
      res.send('error: not login');
      return;
    }
    next();
  },
};
