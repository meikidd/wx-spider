const path = require('path');
const loading = require('loading');
const router = require('koa-router')();

const controllerPath = path.resolve(__dirname, 'controller');

module.exports = function(app) {
  loading(controllerPath, {call:false}).into(app, 'controllers');

  router.get('/page/wx_accounts', app.controllers.page.wxAccounts.GET); // 管理收录的微信公众号
  router.post('/page/wx_accounts', app.controllers.page.wxAccounts.POST); // 管理收录的微信公众号

  router.get('/get_history_url', app.controllers.getHistoryUrl);
  router.get('/get_article_content', app.controllers.getArticleContent);
  router.get('/task_article', app.controllers.taskArticle);

  app.use(router.routes())
    .use(router.allowedMethods());
};
