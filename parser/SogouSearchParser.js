/*
从搜狗搜索结果页解析出公众号历史消息页面的链接
*/

const jsdom = require('jsdom');

class SogouSearchParser {
  static parse(body) {
    return new Promise(function(resolve, reject) {
      jsdom.env(body, function(err, window) {
        const link = window.document.querySelector('p.tit a[uigs=main_toweixin_account_name_0]');
        if(link) {
          resolve({history: link.href});
        } else {
          reject(new Error('SogouSearchParser: Parse Sogou Search Result Error.'));
        }
        window.close();
      });
    });
  }
}

module.exports = SogouSearchParser;
