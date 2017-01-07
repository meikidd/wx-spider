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
        wxId: '',
        url: '',
        sn: '',
        title: '',
        publishTime: '',
        content: ''
      };

      article.url = ArticleParser.getUrl(body);
      if(!article.url) {
        reject(new Error('ArticleParser: getUrl error.'));
        return;
      }

      article.sn = ArticleParser.getSN(article.url);
      if(!article.sn) {
        reject(new Error('ArticleParser: getSN error.'));
        return;
      }

      article.title = ArticleParser.getTitle(body);
      if(!article.title) {
        reject(new Error('ArticleParser: getTitle error.'));
        return;
      }

      article.publishTime = ArticleParser.getPublishTime(body);
      if(!article.publishTime) {
        reject(new Error('ArticleParser: getPublishTime error.'));
        return;
      }

      ArticleParser.getWxIdAndContent(body)
      .then(function(data) {
        article.content = data.content;
        article.wxId = data.wxId;
        resolve(article);
      })
      .catch(function(error) {
        reject(error);
      });
    });
  }

  // 获取公众号id和文章内容
  static getWxIdAndContent(body) {
    // console.log(body);
    const fs = require('fs');
    fs.writeFileSync('./temp.html', body);

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

        resolve({content, wxId});
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
}

module.exports = ArticleParser;
