require('isomorphic-fetch');

const Url = require('url');
const jqueryParam = require('jquery-param');
const Queue = require('../model/Queue.js');
const ArticleParser = require('../parser/ArticleParser.js');
const co = require('co');

co(function *() {
  const historyUrl = 'https://mp.weixin.qq.com/mp/getmasssendmsg?__biz=MzA5NjUwOTYwOA==&uin=Mjg4OTA1OTM1&key=ab9381747082d605212f92efac4aaa909551f2359e400eb4a8c7d94671c708a7ee9b7ce31137f97725a718009d5414c6203c9c1fcc6657980fb6980eff86b776117012e822c281c0b120f0bffb48ef91&devicetype=iOS10.1.1&version=16050321&lang=zh_CN&nettype=WIFI&ascene=3&fontScale=100&pass_ticket=pxa8QaYRvR9lZFy9Zxsb9W5fdaafYB9fRZ0cRAoSEce%2FLkVZkhs2KRaOXb6KHla1&wx_header=1';
  // const cookies = 'wap_sid=CM 14YkBEkBRdnNtMzR0bXlqczI2U2xYYzFMWjFGZURGWlo2dERRY0ZTY2xSVDdVT0lWeVpsbmR4cGJtdmh2Y2NUMXg4NWd1GAQg/REo0MHh9QgwitC wwU=; wap_sid2=CM 14YkBElxRb1A1bTc2QklkaEVyMlhHajBoVThrblhGLWlESjYtZGdsRUVQY2hhNllEb2pRN0k1WmFsOFkwZ2dfM0h1Mm95ZjY5X2llbW5mRXhnTnRycnNhTTVMSFlEQUFBfg==; RK=GH2Kjcd/U1; pt2gguin=o0466392519; ptcz=29d5119f080aa77b4b684c058f635456430c0baf7d0d37946842d7d5d057e759; pgv_pvid=65948818; sd_cookie_crttime=1482111254939; sd_userid=98581482111254939; tvfe_boss_uuid=f2e3801ed3167c1e';
  const cookies = 'pac_uid=1_466392519; mobileUV=1_1569dd2b927_ec429; tvfe_boss_uuid=76ee9c4f05753529; ts_uid=7831570572; pgv_pvi=7292570624; aboutVideo_v=0; noticeLoginFlag=1; remember_acct=meikidd%40qq.com; ua_id=jiOpzIM5Qyx6vKbzAAAAAH6LjLOw428Lyx-v65pJbRI=; xid=f9a53972b239a1a4436427c059e2d471; openid2ticket_oB_Rqw-RIHPvKSMCXduWya0hj02U=gksP199QTmd41frhMQFJYXN7T9sViLV7/XZTdsF2MD4=; RK=GG2KjcdnE3; ptcz=3724138a6e5cd74f00177acaad0f32d7e83ec23238991d56ec48cf59463a03e2; pt2gguin=o0466392519; sd_userid=59521483098526104; sd_cookie_crttime=1483098526104; pgv_pvid=9128862610; o_cookie=466392519; sig=h0108ec326227d2c9b0316a3150a0eb010056a099567709a72f924998da438c8dfd39257dee0a72566a; wap_sid=CM+14YkBEkA0MVBseXBMOXRrLVZucTF5TklzQWg2bG84djlXU3hFcWQybUNkNHNEbmxmM0FOSlllNXEtSWZlWDdUeF9neVVaGAQg/REoqPnDxAswrN++wwU=; wap_sid2=CM+14YkBElxCM0RsMzBzbFRkcTQtUFY3RTU4clFTempya014aE9ScEo1QUI3UTl0V1ZPT0lacGRRMG9Gbzh6b1ctYkJCWEIzRWVFX2RNQlFRVWtTZ3c1eXR6S2l3M1lEQUFBfg==';
  let frommsgid = 1000000169;
  let historyArticles = [];
  const {__biz, uin, key, pass_ticket} = Url.parse(historyUrl, true).query;
  // getHistoryList({__biz, uin, key, pass_ticket, frommsgid}, cookies);

  let isLastPage = 1;
  while(isLastPage) {
    let {list, isContinue, lastMsgId} = yield getHistoryArticle({__biz, uin, key, pass_ticket, frommsgid}, cookies);
    historyArticles = historyArticles.concat(list);
    isLastPage = isContinue;
    frommsgid = lastMsgId;

    // console.log(historyArticles)
    console.log('========')
    console.log(isContinue)
    console.log('========')
    console.log(frommsgid)
    console.log('===============结束===============')
  }
});

function getHistoryArticle(params, cookies) {

  let url = 'https://mp.weixin.qq.com/mp/getmasssendmsg';
  params = Object.assign({
    f: 'json',
    count: 10
  }, params);
  url = url + '?' + jqueryParam(params);

  // return new Promise(function(resolve, reject) {
  //   resolve({
  //     list: ['hello'],
  //     isContinue: 'dd',
  //     lastMsgId: 8908098
  //   });
  // });

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
  .then(function(response) {
    if (response.status !== 200) {
      throw new Error('Bad response from server');
    } else {
      return response.json();
    }
  })
  .then(function(data) {
    let listData = JSON.parse(data.general_msg_list);
    let list = [];

    listData.list.forEach(function(msg) {
      if(!msg.app_msg_ext_info) return;

      if(msg.app_msg_ext_info.is_multi) {
        msg.app_msg_ext_info.multi_app_msg_item_list.forEach(function(article) {
          list.push({
            author: article.author,
            content_url: article.content_url.replace(/&amp;/g, '&'),
            title: article.title,
            id: msg.comm_msg_info.id
          })
        });
      } else {
        list.push({
          author: msg.app_msg_ext_info.author,
          content_url: msg.app_msg_ext_info.content_url.replace(/&amp;/g, '&'),
          title: msg.app_msg_ext_info.title,
          id: msg.comm_msg_info.id
        });
      }
    });

    const lastMsgId = list[list.length - 1].id;
    const isContinue = data.is_continue;
    // console.log('历史文章:', list);
    // console.log('历史文章:', list.length);
    return {list, isContinue, lastMsgId};
  })
  .catch(function(error) {
    console.error('Url:', url);
    console.error(error);
  });
}
