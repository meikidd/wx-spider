const socket = require('./server-socket');
const proxy = require('./server-proxy');
const web = require('./server-web');

let server = socket.init();
web.init(server);
proxy.init();