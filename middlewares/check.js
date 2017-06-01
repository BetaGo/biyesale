module.exports = {
  checkLogin: function checkLogin(req, res, next) {
    if (!req.session.admin) {
      req.flash('error', '未登录');
      res.redirect('/signin');
    }
  },

  checkNotLogin: function checkNotLogin(req, res, next) {
    if (req.session.admin) {
      req.flash('error', '已登录');
      res.redirect('back');
    }
  },

  checkUserLogin: function checkUserLogin(req, res, next) {
    if (!req.session.user) {
      res.send('error: not login');
    }
  },
};
