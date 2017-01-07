const Koa = require('koa');
const path = require('path');
const views = require('koa-views');
const htdocs = require('koa-static-cache');
const router = require('./router');
const co = require('co');

var app = new Koa();

app.use(co.wrap(function *(ctx, next) {
  try {
    yield next();
  } catch(error) {
    console.log('==========出错啦!!=========');
    console.log('Url:', ctx.url);
    console.log(error);
  }
}));

/* 访问日志，logger */
app.use(co.wrap(function *(ctx, next) {
  console.log((new Date()).toLocaleString(), 'url:', ctx.url);
  yield next();
}));

// static files
app.use(htdocs('./htdocs/build', {
  prefix: '/static'
}));

// views
app.use(views(path.resolve(__dirname, 'app/view'), {extension: 'ejs'}));

// router
router(app);

app.listen(7004, () => {
  console.log('server started on', 7004);
});
