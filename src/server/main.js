const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


export class Main {

    constructor(port)
    {
        this.motd = "Welcome on the server!";
        this.players = {};
        this.lobby = [];    // Players who are waitin' for a match

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
                socket: socket,
                game: null
            };

            this.lobby.push(username);

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
        // Close match
        if(this.players[username].game != null)
            this.finishGame(this.players[username].game);

        // Delete from lobby
        this.removePlayerFromLobby(username);

        // Delete from players
        delete this.players[username];

        console.log("User " + username + " disconnected.");
    }

    createGame(firstPlayer, secondPlayer)
    {
        let game = {
            firstPlayer: firstPlayer,
            secondPlayer: secondPlayer
        };

        this.players[game.firstPlayer].game = game;
        this.players[game.secondPlayer].game = game;

        let matchMessage = {
            cmd: "match",
            firstPlayer: firstPlayer,
            secondPlayer: secondPlayer,
            whoCaller: firstPlayer
        }

        this.players[game.firstPlayer].socket.emit('send', matchMessage);
        this.players[game.secondPlayer].socket.emit('send', matchMessage);

        return game;
    }

    finishGame(game)
    {
        // Unattach game from players
        this.players[game.firstPlayer].game = null;
        this.players[game.secondPlayer].game = null;

        // Add to lobby
        this.lobby.push(game.firstPlayer);
        this.lobby.push(game.secondPlayer);

        // todo: send packet with finish game information
    }

    removePlayerFromLobby(username)
    {
        let indexInLobby = this.lobby.indexOf(username);

        if (indexInLobby > -1) {
            this.lobby.splice(indexInLobby, 1);
        } 
    }

    getPartner(username)
    {
        let game = this.players[username].game;

        if(game == null) console.log("ERROR, player doesn't have active game");

        if(game.firstPlayer == username)
            return game.secondPlayer;
        else
            return game.firstPlayer;
    }

    handleMessages(message, username)
    {
        console.log("Message from client:", message);

        switch(message.cmd)
        {
            case "offer":
            case "answer":
            case "candidate":
            {
                let partner = this.players[this.getPartner(game)];
                partner.socket.emit('send', message);

                break;
            }

        }
    }

}