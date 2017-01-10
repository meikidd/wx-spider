require('isomorphic-fetch');

const Url = require('url');
const fs = require('fs');
const jqueryParam = require('jquery-param');
const Queue = require('../model/Queue.js');
const ArticleParser = require('../parser/ArticleParser.js');
const co = require('co');

exports.start = function *(url, frommsgid, cookies) {
  // url = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzA5NjUwOTYwOA==&uin=Mjg4OTA1OTM1&key=03809db06f8cd9c20ae05c7dd8ed1fa697343ba3c17250e4ce7d6e3f2d51ab587309d650a20fa861cbf5522cbe53ca1e9d478fdad90db9aa8397691171b84e91b9aa500a6911b8f4b03ac683533cf573&devicetype=iOS10.1.1&version=16050321&lang=zh_CN&nettype=WIFI&ascene=3&fontScale=100&pass_ticket=WYdKRSo7vZ8DV7nV2P06sFUdtu7BfI%2FESY0e6tC3HgAwf86GkBNJfBzV1Uon5KaP&wx_header=1';
  // frommsgid = 203979588;
  cookies = 'wap_sid=CM+14YkBEkBNWFRKOS1JUDJmRnQ3a2FZWHBsODhQUmg1M1dqcGV2N25ZRDQyelJtOHp2TU95RFRnaVNjZ0YyQUtsMmFXS25sGAQg/BEo8ZfaxQsw96HTwwU=; wap_sid2=CM+14YkBElxZMHJQT3lyODBETFEyRVhxYlYxYjdoTTJDMWd0M1VYZnp5UTFPM3I1d2VjRzlPZVRTN1BlN0xOSHkzWlk4RUVQUHRqb2VwSVdLejl1MC1oWW9JYjdMM1lEQUFBfg==; wxticket=2805684311; wxticketkey=866f2420fb7cccdc959140a16e37c2519e958912f1e15a249c1655a44a5dbe3e; wxtokenkey=8b24abafcb5f0e2736c674b13894058f9e958912f1e15a249c1655a44a5dbe3e; pgv_pvi=9680819200; RK=GH2Kjcd/U1; pt2gguin=o0466392519; ptcz=29d5119f080aa77b4b684c058f635456430c0baf7d0d37946842d7d5d057e759; pgv_pvid=65948818; sd_cookie_crttime=1482111254939; sd_userid=98581482111254939; tvfe_boss_uuid=f2e3801ed3167c1e';
  let historyArticles = [];
  let waitForLastPage = 1;

  try {

    const {__biz, uin, key, pass_ticket} = Url.parse(url, true).query;

    while(waitForLastPage) {
      let response = yield getHistoryArticle({__biz, uin, key, pass_ticket, frommsgid}, cookies);
      if (response.status !== 200) {
        throw new Error(`网络请求失败status=${response.status}，请求微信公众号历史消息接口/mp/getmasssendmsg`);
      } else {
        let data = yield response.json();
        if(data.ret !== 0) {
          throw new Error('接口返回错误:' + JSON.stringify(data));
        } else {

          let list = [];
          let listData = JSON.parse(data.general_msg_list);
          listData.list.forEach(function(msg) {
            if(!msg.app_msg_ext_info) return;

            if(msg.app_msg_ext_info.is_multi) {
              msg.app_msg_ext_info.multi_app_msg_item_list.forEach(function(article) {
                let contentUrl = article.content_url.replace(/&amp;/g, '&');
                list.push({
                  author: article.author,
                  content_url: contentUrl,
                  sn: Url.parse(contentUrl).query.sn,
                  title: article.title,
                  msg_id: msg.comm_msg_info.id,
                  biz: __biz
                })
              });
            } else {
              let contentUrl = msg.app_msg_ext_info.content_url.replace(/&amp;/g, '&');
              list.push({
                author: msg.app_msg_ext_info.author,
                content_url: msg.app_msg_ext_info.content_url.replace(/&amp;/g, '&'),
                sn: Url.parse(contentUrl).query.sn,
                title: msg.app_msg_ext_info.title,
                msg_id: msg.comm_msg_info.id,
                biz: __biz
              });
            }
          });

          frommsgid = list[list.length - 1].msg_id;
          // 往数据库中记录frommsgid TODO
          waitForLastPage = data.is_continue;
          historyArticles = historyArticles.concat(list);
        }
      }
      console.log('lastMsgId:', frommsgid);
      // console.log({waitForLastPage, frommsgid});
      // console.log('======================');
    }
    // fs.writeFileSync('./test-data/historyUrls.js', JSON.stringify(historyArticles));
    return {
      error: null,
      articles:historyArticles,
      lastMsgId: frommsgid,
      isLastPage: !waitForLastPage
    };

  } catch(error) {
    return {
      error,
      articles:historyArticles,
      lastMsgId: frommsgid,
      isLastPage: !waitForLastPage
    };
  }

}

function *getHistoryArticle(params, cookies) {

  let url = 'https://mp.weixin.qq.com/mp/getmasssendmsg';
  params = Object.assign({
    f: 'json',
    count: 10
  }, params);
  url = url + '?' + jqueryParam(params);

  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Encoding': 'gzip, deflate, sdch',
      'Accept-Language': 'en-US,en;q=0.8,zh-CN;q=0.6,zh;q=0.4,ru;q=0.2,pt;q=0.2,es;q=0.2,zh-TW;q=0.2',
      'Host': 'mp.weixin.qq.com',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_1_1 like Mac OS X) AppleWebKit/602.2.14 (KHTML, like Gecko) Mobile/14B100 MicroMessenger/6.5.3 NetType/WIFI Language/zh_CN',
      'Cookie': cookies // cookie会过期
    }
  })
}
