const path = require('path');
const loading = require('loading');
const router = require('koa-router')();

const controllerPath = path.resolve(__dirname, 'controller');

module.exports = function(app) {
  loading(controllerPath, {call:false}).into(app, 'controllers');

  const biz = app.controllers;

  router.get('/page/accounts_detail/:id', biz.page.accountsDetail.GET); // 微信公众号详情，基本信息，待爬文章
  router.get('/page/accounts_list', biz.page.accountsList.GET); // 微信公众号列表，管理收录的微信公众号
  router.post('/api/accounts', biz.api.accounts.POST); // 添加微信公众号
  router.delete('/api/accounts/:id', biz.api.accounts.DELETE); // 删除微信公众号

  // router.get('/get_history_url', biz.getHistoryUrl);
  // router.get('/get_article_content', biz.getArticleContent);
  // router.get('/task_article', biz.taskArticle);

  app.use(router.routes())
    .use(router.allowedMethods());
};
