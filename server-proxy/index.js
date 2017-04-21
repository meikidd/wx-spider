const proxy = require('anyproxy');
const url = require('url');
const qs = require('querystring');
const socket = require('../server-socket');

const Accounts = require('../server-web/model/Accounts');
const Queue = require('../server-web/model/Queue');
const spiderHistory = require('../server-socket/spider/wx-history');


exports.init = function() {
    !proxy.isRootCAFileExists() && proxy.generateRootCA();

    var options = {
        summary: '解析微信请求，获取 cookie 和 pass_ticket',
        type: "http",
        port: 8001,
        hostname: "localhost",
        interceptHttps: true,
        rule: {
            shouldInterceptHttpsReq: function(req) {
                if(req.headers.host == "mp.weixin.qq.com") {
                    return true;
                } else {
                    return false;
                }
            },
            replaceRequestOption: function(req, option) {
                let query = qs.parse(url.parse(req.url).query);
                if(req.url.startsWith('/mp/profile_ext?action=home')) {
                    // 记录下cookie/__biz/pass_ticket
                    // console.log('======================');
                    // console.log('cookie', option.headers.cookie);
                    // console.log('biz', query.__biz);
                    // console.log('pass_ticket', query.pass_ticket);
                    
                    // console.log('======================');
                    let cookie = option.headers.cookie;
                    Accounts.getByBizId(query.__biz)
                    .then(account => {
                        account.cookie = cookie;
                        account.pass_ticket = query.pass_ticket;
                        return Accounts.update(account);
                    }).then(account => {
                        console.log('=====公众号', account.name, '更新 cookie 完毕=====');
                        let socketServer = socket.getInstance();
                        socketServer.emit('proxy:sessionRefreshed', {
                            id: account.id,
                            name: account.name,
                            msg: `=====公众号 ${account.name} 更新 cookie 完毕=====`
                        });
                    }).catch(err => {
                        console.error('=====公众号', account.name, '更新 cookie 出错=====', err);
                        let socketServer = socket.getInstance();
                        socketServer.emit('proxy:sessionRefreshed', {
                            id: account.id,
                            name: account.name,
                            msg: `=====公众号 ${account.name} 更新 cookie 出错=====`
                        });
                    });
                }
                return option;
            },
            replaceServerResDataAsync: function(req, res, serverResData, callback) {
                callback(serverResData);
                if(!req.url.startsWith('/mp/profile_ext?action=home')) return;
                let latestArticle = [];
                let matched = serverResData.toString().match(/var msgList = \'(.*)\';/);
                if(matched && matched.length >= 2) {
                    matchedString = matched[1];
                    matchedString = matchedString.replace(/&quot;/g, '"')
                                                 .replace(/&amp;/g, '&')
                                                 .replace(/&amp;/g, '&')
                                                 .replace(/\\\//g, '/');
                    latestArticle = JSON.parse(matchedString);
                }

                let socketServer = socket.getInstance();
                let query = qs.parse(url.parse(req.url).query);
                spiderHistory.insertArticle(latestArticle.list, 0, query.__biz, socketServer);
                

                // for(let i = 0; i < latestArticle.list.length; i++) {
                //     let appMsg = latestArticle.list[i].app_msg_ext_info;
                //     let msg_id = latestArticle.list[i].comm_msg_info.id;
                //     if(!appMsg) continue;
                //     let sn = qs.parse(url.parse(appMsg.content_url).query).sn;
                //     Queue.isSnExist(sn)
                //     .then(isExist => {
                //         return isExist ? null : Queue.insert({
                //             state: 'new',
                //             url: appMsg.content_url,
                //             title: appMsg.title,
                //             msg_id,
                //             biz_id: query.__biz,
                //             sn
                //         });
                //     }).then(article => {
                //         let msg = '';;
                //         if(article) {
                //             msg = `插入队列 "${appMsg.title}" `;
                //         } else {
                //             msg = `队列中已存在 "${appMsg.title}" `;
                //         }
                //         let socketServer = socket.getInstance();
                //         socketServer.emit('proxy:queueInserted', {msg});
                //         // console.log('已插入待爬队列', appMsg.title);
                //     }).catch(error => {
                //         console.error('插入待爬队列出错', appMsg, error);
                //         let socketServer = socket.getInstance();
                //         socketServer.emit('proxy:queueInserted', {
                //             msg: `[出错]: 插入队列出错 "${appMsg.title}" , biz: ${query.__biz}`
                //         });
                //     });
                //     if(appMsg.is_multi) {
                //         let multiMsgs = appMsg.multi_app_msg_item_list;
                //         // 记录 multi msg
                //         for(let j = 0; j < multiMsgs.length; j++) {
                //             let multiSn = qs.parse(url.parse(multiMsgs[j].content_url).query).sn
                //             Queue.isSnExist(multiSn)
                //             .then(isExist => {
                //                 return isExist ? null : Queue.insert({
                //                     state: 'new',
                //                     url: multiMsgs[j].content_url,
                //                     title: multiMsgs[j].title,
                //                     msg_id,
                //                     biz_id: query.__biz,
                //                     sn: multiSn
                //                 });
                //             }).then(article => {
                //                 let msg = '';;
                //                 if(article) {
                //                     msg = `插入队列 "${multiMsgs[j].title}" `;
                //                 } else {
                //                     msg = `队列中已存在 "${multiMsgs[j].title}" `;
                //                 }
                //                 let socketServer = socket.getInstance();
                //                 socketServer.emit('proxy:queueInserted', {msg});
                //                 // console.log('已插入待爬队列', appMsg.title);
                //             }).catch(error => {
                //                 console.error('插入待爬队列出错', multiMsgs[j], error);
                //                 let socketServer = socket.getInstance();
                //                 socketServer.emit('proxy:queueInserted', {
                //                     msg: `[出错]: 插入队列出错 "${multiMsgs[j].title}", biz: ${query.__biz}`
                //                 });
                //             });
                //         }
                //     }
                // }
            }
        },
    };

    new proxy.proxyServer(options);
}