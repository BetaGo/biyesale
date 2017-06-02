const Admin = require('../lib/mongo').Admin;

module.exports = {
  // 注册一个管理员
  create: function create(admin) {
    return Admin.create(admin).exec();
  },

  // 通过用户名获取用户信息
  getAdminByName: function getAdminByName(name) {
    return Admin
      .findOne({ name })
      .addCreatedAt()
      .exec();
  },
};
