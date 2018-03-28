const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


export class Main {

    constructor(port)
    {
        this.motd = "Welcome on the server!";
        this.players = {};

        /*
            Send static page
        */
        app.use(express.static(__dirname + '/public'));


        /*
            Socket IO
        */
        io.on('connection', this.handleConnection.bind(this));

        /*
            Start listening
        */
        http.listen(port, () => {
            console.log('Server http running on localhost:' + port);
        });
    }

    handleConnection(socket)
    {
        // Handle username from first packet
        socket.once('welcome', (message) => {
            let username = message.username;

            this.players[username] = {
                socket: socket
            };

            console.log("User " + username + " connected.");

            socket.on('send', (message) => {
                this.handleMessages(message, username)
            });

            socket.on('disconnect', () => {
                this.handleDisconnect(username)
            });

            let initMessage = {
                cmd: "welcome",
                motd: this.motd,
                username: username
            }

            socket.emit('send', initMessage);
        })
    }

    handleDisconnect(username)
    {
        console.log("User " + username + " disconnected.");
        delete this.players[username];
    }

    handleMessages(message, username)
    {
        console.log("Message from client:", message);

        switch(message.cmd)
        {

        }
    }

}