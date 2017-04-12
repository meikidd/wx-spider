const proxy = require('anyproxy');
const url = require('url');
const qs = require('querystring');
const socket = require('../server-socket');

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
                    console.log('======================');
                    console.log('cookie', option.headers.cookie);
                    console.log('biz', query.__biz);
                    console.log('pass_ticket', query.pass_ticket);
                    socketServer = socket.getInstance();
                    socketServer.emit('proxy:sessionRefreshed', {
                        biz: query.__biz,
                        pass_ticket: query.pass_ticket,
                        cookie: option.headers.cookie
                    });
                    console.log('======================');
                }
                return option;
            }
        },
    };

    new proxy.proxyServer(options);
}