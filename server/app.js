const Koa = require('koa');
const path = require('path');
const views = require('koa-views');
const htdocs = require('koa-static-cache');
const router = require('./router');
const bodyParser = require('koa-bodyparser');
const co = require('co');

var app = new Koa();

app.use(bodyParser());

app.use(async function (ctx, next) {
  try {
    await next();
  } catch(error) {
    console.log('==========', (new Date()).toLocaleString(), '出错啦!!=========');
    console.log('url:', ctx.url);
    console.log(error);
    console.log('================================================');
  }
});

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
app.use(views(path.resolve(__dirname, 'view'), {extension: 'ejs'}));

// router
router(app);

app.listen(7004, () => {
  console.log('server started on http://127.0.0.1:7004');
});

