require('isomorphic-fetch');

const jsdom = require('jsdom');
const SogouSearchParser = require('../parser/SogouSearchParser');
const HistoryParser = require('../parser/HistoryParser');
const Accounts = require('../model/Accounts.js');
const param = require('jquery-param');
const co = require('co');

co(function *() {
  var accounts = yield Accounts.list();
  accounts.forEach(account => {
    getLatestArticle(account);
  });
});

function getLatestArticle(account) {
  const url = 'http://weixin.sogou.com/weixin?'+param({
    type: 1,
    query: account.wxId,
    ie: 'utf8',
    _sug_: 'y',
    _sug_type_: '',
    w: 01019900,
    sut: 6635,
    sst0: 1483101196819,
    lkt: '2%2C1483101191700%2C1483101196717'
  });

  fetch(url) // 搜狗搜索微信公众号
  .then(function(response) {
    if (response.status !== 200) {
      throw new Error('Bad response from [sogou search].');
    } else {
      return response.text();
    }
  })
  .then(function(body) {
    return SogouSearchParser.parse(body);
  })
  .then(function(data) {
    const historyUrl = data.history; // 历史消息页面，最近10条群发消息
    console.log('历史消息页面url:', historyUrl);
    return fetch(historyUrl); // 请求历史消息页面
  })
  .then(function(response) {
    if (response.status !== 200) {
      throw new Error('Bad response from [wechat history page].');
    } else {
      return response.text();
    }
  })
  .then(function(body) {
    return HistoryParser.parse(body);
  })
  .then(function(data) {
    console.log('最近文章列表:', data);
  })
  .catch(function(error) {
    console.error(error);
  });
}
