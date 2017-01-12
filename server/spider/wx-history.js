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
  cookies = 'wap_sid=CM+14YkBEkBYMDBKSFp0enVCcDVjVGZDNDRCRnYxT29GLS1pbFJEUWFlRFUyUF96ZUJxeTU0NkgxeE8zdHVmRzJneHlKNkZsGAQg/REoqPnDxAswyefdwwU=; wap_sid2=CM+14YkBElxZRG1Ob01NeWJvTGEzdEM2b1N3Z1M4OGZUMlFobTU1cWsySzYxUl94amhfWXZsM0tCdmtBUGtVUHlONkJnNWNGMm1vdzVaT1lWZWRjVXUxZnZSUFFoM2NEQUFBfg==; wxticket=1716458673; wxticketkey=23636149876a62f1fda00f1a588c77fcc593ae0b14c0a768d2645eb5e1a272ec; wxtokenkey=8102cbf14af02c4ffef14aaf94d3d7fec593ae0b14c0a768d2645eb5e1a272ec; pgv_pvi=9680819200; RK=GH2Kjcd/U1; pt2gguin=o0466392519; ptcz=29d5119f080aa77b4b684c058f635456430c0baf7d0d37946842d7d5d057e759; pgv_pvid=65948818; sd_cookie_crttime=1482111254939; sd_userid=98581482111254939; tvfe_boss_uuid=f2e3801ed3167c1e';
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
            if(!msg.app_msg_ext_info || !msg.app_msg_ext_info.content_url) return;

            let contentUrl = msg.app_msg_ext_info.content_url.replace(/&amp;/g, '&');
            list.push({
              author: msg.app_msg_ext_info.author,
              url: contentUrl,
              sn: Url.parse(contentUrl, true).query.sn,
              title: msg.app_msg_ext_info.title,
              msg_id: msg.comm_msg_info.id,
              biz: __biz
            });

            if(msg.app_msg_ext_info.is_multi) {
              msg.app_msg_ext_info.multi_app_msg_item_list.forEach(function(article) {
                let contentUrl = article.content_url.replace(/&amp;/g, '&');
                list.push({
                  author: article.author,
                  url: contentUrl,
                  sn: Url.parse(contentUrl, true).query.sn,
                  title: article.title,
                  msg_id: msg.comm_msg_info.id,
                  biz: __biz
                });
              });
            }
          });

          if(list.length) {
            frommsgid = list[list.length - 1].msg_id;
          }
          // 往数据库中记录frommsgid TODO
          historyArticles = historyArticles.concat(list);
          waitForLastPage = data.is_continue;
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
