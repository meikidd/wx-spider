const http = require('http');
const socket = require('socket.io');
const spiderHistory = require('./spider');

module.exports = function(app) {
    var server = http.createServer(app.callback());
    var io = socket(server);
    io.on('connection', socket => {
        socket.on('retrive-article-list', msg => {
            spiderHistory(socket);
            console.log(socket.id);
        });
    });
}