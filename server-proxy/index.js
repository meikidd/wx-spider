const proxy = require('anyproxy');
const url = require('url');
const qs = require('querystring');

!proxy.isRootCAFileExists() && proxy.generateRootCA();

var options = {
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
                console.log(option.headers.cookie);
                console.log(query.__biz);
                console.log(query.pass_ticket);
                console.log('======================');
            }
            return option;
        }
    },
};
new proxy.proxyServer(options);