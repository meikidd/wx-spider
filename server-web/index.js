const Koa = require('koa');
const path = require('path');
const views = require('koa-views');
const htdocs = require('koa-static-cache');
const router = require('./router');
const bodyParser = require('koa-bodyparser');
const color = require('colorful');
const co = require('co');

let app = new Koa();
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
app.use(htdocs(path.join(__dirname, 'static'), {
  prefix: '/static'
}));

// views
app.use(views(path.resolve(__dirname, 'view'), {extension: 'ejs'}));

// router
router(app);

exports.init = function(server) {
  server.listen(7004, () => {
    console.log(color.green('Server started on http://127.0.0.1:7004'));
  });
  return server;
}

exports.getInstance = function() {
  return app;
}

