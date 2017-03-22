/*
  微信号wxId：myyjs_bud
  永久url：
  微信文章号sn：
  文章标题title：
  发布时间：
  文章内容：
*/

const jsdom = require('jsdom');
const Url = require('url');

class ArticleParser {
  static parse(body) {

    return new Promise(function(resolve, reject) {
      var article = {
        wx_id: '',
        url: '',
        sn: '',
        title: '',
        publish_time: '',
        content: ''
      };

      /* 各种异常情况 */
      // 违规文章
      if(ArticleParser.isViolation(body)) {
        console.log('有违规内容');
        resolve({
          type: 'violation',
          error: new Error('ArticleParser: 文章违规，无法获取内容.')
        });
      }

      article.url = ArticleParser.getUrl(body);
      if(!article.url) {
        resolve({
          type: 'url',
          error: new Error('ArticleParser: getUrl error.')
        });
        return;
      }

      article.sn = ArticleParser.getSN(article.url);
      if(!article.sn) {
        resolve({
          type: 'sn',
          error: new Error('ArticleParser: getSN error.')
        });
        return;
      }

      article.title = ArticleParser.getTitle(body);
      if(!article.title) {
        resolve({
          type: 'title',
          error: new Error('ArticleParser: getTitle error.')
        });
        return;
      }

      article.publish_time = ArticleParser.getPublishTime(body);
      if(!article.publish_time) {
        resolve({
          type: 'publish_time',
          error: new Error('ArticleParser: getPublishTime error.')
        });
        return;
      }

      ArticleParser.getWxIdAndContent(body)
      .then(function(data) {
        article.content = data.content;
        article.wx_id = data.wx_id;
        resolve(article);
      })
      .catch(function(error) {
        reject(error);
      });
    });
  }

  // 获取公众号id和文章内容
  static getWxIdAndContent(body) {

    return new Promise(function(resolve, reject) {
      jsdom.env(body, function(error, window) {
        const contentElm = window.document.getElementById('js_content');
        const content = contentElm ? contentElm.textContent.trim() : '';
        if(!content) {
          reject(new Error('ArticleParser: get content error'));
          window.close();
          return;
        }

        const wxIdElm = window.document.querySelector('#js_profile_qrcode .profile_meta_value');
        const wxId = wxIdElm ? wxIdElm.textContent.trim() : '';
        if(!wxId) {
          reject(new Error('ArticleParser: get wxId error'));
          window.close();
          return;
        }

        resolve({
          content,
          wx_id:wxId
        });
        window.close();
      })
    });
  }

  // 获取文章标题
  static getTitle(body) {
    const matches = body.match(/var msg_title = \"(.+)\"/);
    if(matches) {
      const title = RegExp.$1;
      return title;
    } else {
      return null;
    }
  }

  // 获取文章永久链接
  static getUrl(body) {
    const matches = body.match(/var msg_link = \"(.+)\"/);
    if(matches) {
      const url = RegExp.$1.replace(/\\x26amp;/g, '&');
      return url;
    } else {
      return null;
    }
  }

  // 获取文章的sn
  static getSN(url) {
    return Url.parse(url, true).query.sn;
  }

  // 获取文章发布时间
  static getPublishTime(body) {
    const matches = body.match(/var publish_time = \"([0-9-]+)\"/);
    if(matches) {
      const time = RegExp.$1;
      return time;
    } else {
      return null;
    }
  }

  // 判断文章是否违规
  static isViolation(body) {
    return body.match(/(此内容因违规无法查看|此内容被多人投诉，相关的内容无法进行查看)/);
  }
}

module.exports = ArticleParser;
