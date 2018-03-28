const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


export class Main {

    constructor(port)
    {
        this.players = [];

        /*
            Send static page
        */
        app.use(express.static(__dirname + '/public'));


        /*
        Socket IO
        */
        io.on('connection', this.handleConnection);
        io.on('send', this.handleMessages);

        /*
            Start listening
        */
        http.listen(port, () => {
            console.log('Server http running on localhost:' + port);
        });
    }

    handleConnection(socket)
    {
        console.log(socket);

        //this.players
    }

    handleMessages(message)
    {

    }

}