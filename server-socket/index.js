const http = require('http');
const socketIO = require('socket.io');
const web = require('../server-web');
const spiderHistory = require('./spider/wx-history');

let io = null;

exports.init = function() {
    let webServer = web.getInstance();
    let server = http.createServer(webServer.callback());
    io = socketIO(server);
    io.on('connection', socket => {
        socket.on('start-retrive-article-list', msg => {
            // spiderHistory(socket, msg.id);
            console.log(socket.id);
        });
    });
    return server;
}

exports.getInstance = function() {
    return io;
}