const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');  // 用来显示通知
const config = require('config-lite')(__dirname); // config-lite 会根据环境变量（NODE_ENV）的不同从当前执行进程目录下的 config 目录加载不同的配置文件。

const pkg = require('./package.json');

const index = require('./routes/index');
const goods = require('./routes/goods');
const signin = require('./routes/signin');
const signup = require('./routes/signup');
const signout = require('./routes/signout');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// session 中间件
app.use(session({
  name: config.session.key, // 设置 cookie 中保存 session id 的字段名称
  secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 设置为 false，强制创建一个 session 即使用户未登录
  cookie: {
    maxAge: config.session.maxAge, // 过期时间， 过期后 cookie 中的 session id 自动删除
  },
  store: new MongoStore({
    // 将 session 存储到 mongodb
    url: config.mongodb, // mongodb 地址
  }),
}));

// flash 中间件，用来显示通知
app.use(flash());

// 处理表单以及文件上传的中间件 express-formidable
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, '/public/images'), // 上传文件目录
  keepExtensions: true, // 保留后缀
}));

// 设置模板全局常量
app.locals.biyesale = {
  title: pkg.name,
  description: pkg.description,
};

// 添加模板必须的三个常量
app.use((req, res, next) => {
  res.locals.admin = req.session.admin;
  res.locals.success = req.flash('success').toString();
  res.locals.error = req.flash('error').toString();
  next();
});

app.use('/', index);
app.use('/goods', goods);
app.use('/signin', signin);
app.use('/signup', signup);
app.use('/signout', signout);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
