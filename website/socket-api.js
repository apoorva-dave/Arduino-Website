var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log('A user connected');
});

socketApi.sendNotification = function(data) {
    io.sockets.emit('data-update', {data: data});
}

module.exports = socketApi;