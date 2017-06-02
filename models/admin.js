const Admin = require('../lib/mongo').Admin;

module.exports = {
  // 注册一个管理员
  create: function create(admin) {
    return Admin.create(admin).exec();
  },
};
