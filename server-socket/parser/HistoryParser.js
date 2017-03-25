/*
从公众号历史消息页面的解析出最近的文章链接和标题
*/

const jsdom = require('jsdom');

class HistoryParser {
  static parse(body) {
    return new Promise(function(resolve, reject) {
      try {
        const matches = body.match(/var msgList = (.+);\s/);
        if(matches) {
          const list = JSON.parse(RegExp.$1);
          const articles = [];
          for (var i = 0; i < list.list.length; i++) {
            const article = list.list[i];
            if(article.app_msg_ext_info.is_multi) {
              article.app_msg_ext_info.multi_app_msg_item_list.forEach(function(item) {
                articles.push({
                  tempUrl: 'http://mp.weixin.qq.com' + item.content_url.replace(/&amp;/g, '&'),
                  title: item.title
                });
              });
            } else {
              articles.push({
                tempUrl: 'http://mp.weixin.qq.com' + article.app_msg_ext_info.content_url.replace(/&amp;/g, '&'),
                title: article.app_msg_ext_info.title
              });
            }
          }
          resolve(articles);
        } else {
          reject(new Error('ArticleParser: Parse Weixin article history error.'));
        }
      } catch(e) {
        console.log(e)
        reject(new Error('ArticleParser: Parse Weixin article msgList error.'));
      }
    });
  }
}

module.exports = HistoryParser;
