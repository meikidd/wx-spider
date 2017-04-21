require('isomorphic-fetch');

const Url = require('url');
const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const jqueryParam = require('jquery-param');
const Queue = require('../../server-web/model/Queue.js');
const ArticleParser = require('../parser/ArticleParser.js');
const co = require('co');
const SocketServer = require('../../server-socket');
const Account = require('../../server-web/model/Accounts');

exports.start = async function(socket, accountId) {
  let account = await Account.get(accountId);
  if(account.history_complete) return;

  let fromMsgId = await Queue.getMinMsgIdByBizId(account.biz_id);
  let canContinue = true;
  try {
    while(canContinue) {
      let response = await getHistoryList(fromMsgId, account.cookie, account.biz_id, account.pass_ticket);
      if (response.status !== 200) {
        throw new Error(`网络请求失败status=${response.status}，请求微信公众号历史消息列表接口`);
      } else {
        let data = await response.json();
        canContinue = !!data.can_msg_continue;
        if(data.ret !== 0) {
          throw new Error('接口返回错误:' + JSON.stringify(data));
        } else {
          let list = JSON.parse(data.general_msg_list).list;
          let socketServer = SocketServer.getInstance();
          fromMsgId = await exports.insertArticle(list, fromMsgId, account.biz_id, socketServer);
        }
      }
    }
    account.history_complete = 1;
    await Account.update(account);
    console.log('=========爬取历史消息完毕=========');
  } catch(error) {
    console.log(error);
  }
  
}

exports.insertArticle = async function(list, fromMsgId, bizId, socketServer) {

  list = exports.transferHistoryList(list);
  for(let i = 0; i < list.length; i++) {
    let article = list[i];
    fromMsgId = article.msg_id;
    if(await Queue.isSnExist(article.sn)) {
      let msg = `队列中已存在 "${article.title}" `;
      socketServer.emit('proxy:queueInserted', {msg});
      console.log(msg);
    } else {
      await Queue.insert({
        state: 'new',
        url: article.content_url,
        title: article.title,
        msg_id: article.msg_id,
        sn: article.sn,
        biz_id: bizId
      });
      let msg = `插入队列 "${article.title}" ${article.msg_id}`;
      socketServer.emit('proxy:queueInserted', {msg});
      console.log(msg);
    }
  }
  return fromMsgId;
}

async function getHistoryList(fromMsgId, cookie, bizId, passTicket) {

  let url = 'https://mp.weixin.qq.com/mp/profile_ext';
  let params = {
    action: 'getmsg',
    __biz: bizId,
    f: 'json',
    frommsgid: fromMsgId,
    count: '30',
    scene: '124',
    is_ok: '1',
    uin: '777',
    key: '777',
    pass_ticket: passTicket,
    wxtoken: '',
    x5: '0',
  };
  url = url + '?' + jqueryParam(params);

  return fetch(url, {
    method: 'GET',
    headers: {
      'Host':'mp.weixin.qq.com',
      'Accept-Encoding': 'gzip',
      'Cookie': cookie, 
      'Connection': 'keep-alive',	
      'Accept': '*/*',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_2_1 like Mac OS X) AppleWebKit/602.4.6 (KHTML, like Gecko) Mobile/14D27 /MicroMessenger/6.5.7 NetType/WIFI Language/zh_CN',
      'Referer': `https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=${bizId}==&scene=124&devicetype=iOS10.2.1&/version=16050720&lang=zh_CN&nettype=WIFI&a8scene=3&fontScale=100&pass_ticket=${encodeURIComponent(passTicket)}&wx_header=1`,
      'Accept-Language': 'zh-cn',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
}

// 将嵌套结构的数据拉平，返回一维数组
// 并且每个数组项，增加sn/msg_id两个字段
exports.transferHistoryList = function(list) {
  let result = [];
  for(let i = 0; i < list.length; i++) {
    let appMsg = list[i].app_msg_ext_info;
    let msg_id = list[i].comm_msg_info.id;
    if(!appMsg) continue;
    
    // 记录 multi msg
    if(appMsg.is_multi) {
      let multiMsgs = appMsg.multi_app_msg_item_list;
      for(let j = 0; j < multiMsgs.length; j++) {
        let contentUrl = multiMsgs[j].content_url = multiMsgs[j].content_url.replace(/&amp;/g, '&');
        multiMsgs[j].title = multiMsgs[j].title.replace(/&nbsp;/g, ' ');
        let query = qs.parse(url.parse(contentUrl).query);
        let sn = query.sn || query.sign;
        if(!multiMsgs[j].content_url) continue;
        if(!sn) {
          console.log('取不到sn', multiMsgs[j]);
        }
        if(multiMsgs[j].title.includes('开团') || multiMsgs[j].title.startsWith('预告')) {
          console.log('跳过广告：', multiMsgs[j].title)
          continue;
        }
        result.push(Object.assign(multiMsgs[j], { msg_id, sn }));
      }
    }

    if(appMsg.title.includes('开团') || appMsg.title.startsWith('预告')) {
      console.log('跳过广告：', appMsg.title)
      continue;
    }
    delete appMsg.multi_app_msg_item_list;
    let contentUrl = appMsg.content_url = appMsg.content_url.replace(/&amp;/g, '&');;
    appMsg.title = appMsg.title.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
    let query = qs.parse(url.parse(contentUrl).query);
    let sn = query.sn || query.sign;
    if(!appMsg.content_url) continue;
    if(!sn) {
      console.log('取不到sn', appMsg);
    }
    result.push(Object.assign(appMsg, { msg_id, sn }));
  }

  return result;
}