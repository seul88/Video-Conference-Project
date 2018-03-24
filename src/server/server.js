const express = require('express');

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = 3000;

/*
Send static page
 */
app.use(express.static(__dirname + '/public'));


/*
Socket IO
 */
io.on('connection', function (socket) {

    socket.emit('message', { message: 'Welcome client on the server!' });

    socket.on('send', function (data) {
        io.emit('message', { message: 'PONG' });
    });
});



http.listen(PORT, function(){
    console.log('Server http running on localhost:' + PORT);
});