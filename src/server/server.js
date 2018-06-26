const express = require('express');
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const crypto = require("crypto");

import { GameServer } from './../shared/GameServer';
import { BombGame } from './../shared/games/BombGame';

class Server {
    constructor() {
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
        http.listen(process.argv[2], process.argv[3], () => {
            console.log('Server http running on ' + process.argv[3] + ':' + process.argv[2]);
        });
    }

    handleConnection(socket) {
        // Handle username from first packet
        socket.once('welcome', (message) => {
            console.log("User " + message.username + " connected.");

            let id = crypto.randomBytes(20).toString('hex');
            let username = message.username;

            let player = this.players[id] = {
                socket: socket,
                id: id,
                username: username,
                status: 0,
                ready:0,
                game: null
            };

            this.lobby.push(player);

            socket.on('send', (message) => {
                this.handleMessages(message, player);
            });

            socket.on('disconnect', () => {
                this.handleDisconnect(player);
            });

            socket.emit('send', {
                cmd: "welcome",
                motd: this.motd,
                username: username,
                id: id
            });

            this.matchLobby();
        })
    }

    handleDisconnect(player) {
        console.log("User " + player.username + " disconnected.");

        let playingGame = (player.game != null);

        // Close match
        if (playingGame)
            this.finishGame(player.game);

        // Delete from lobby
        this.removePlayerFromLobby(player);

        // Delete from players
        delete this.players[player.id];

        // Search new match
        if (playingGame)
            this.matchLobby();
    }

    createGame(player1, player2) {
        let state = new BombGame();
        state.init(player1.id, player2.id);

        let game = new GameServer(
            state,
            [player1, player2]
        );

        let msg = {
            cmd: "new_game"
        }

        for (let player of game.players) {
            player.game = game;
            player.socket.emit('send', msg);
        }

        game.start();
    }

    finishGame(game) {
        // Add players to lobby
        for (let player of game.players) {
            player.socket.emit('send', {
                cmd: "finish_game"
            });

            player.game = null;
            player.status = 0;
            this.lobby.push(player);
        }

        // Finish game
        game.finish();
    }

    removePlayerFromLobby(player) {
        let indexInLobby = this.lobby.indexOf(player);

        if (indexInLobby > -1) {
            this.lobby.splice(indexInLobby, 1);
        }
    }

    forPartners(player, callback) {
        if (player.game == null)
            throw "Player " + player.username + " does not have any active game";

        // Add players to lobby
        for (let partner of player.game.players) {
            if (player != partner)
                callback(partner);
        }
    }

    isGameReady(game)
    {
        for (let player of game.players) {
            if(player.status == 0)
                return false;
        }

        return true;
    }

    handleMessages(message, player) {
        //console.log("Message from client:", message);

        switch (message.cmd) {
            case "offer":
            case "answer":
            case "candidate":
                {
                    this.forPartners(player, (partner) => {
                        partner.socket.emit('send', message);
                    });

                    break;
                }

            case "ready":
                {
                    if (player.game != null)
                    {
                        player.status = 1;

                        if(this.isGameReady(player.game))
                        {
                            player.socket.emit('send', {
                                cmd: "connect"
                            });
                        }
                    }

                    break;
                }
            case "abandon":
                {
                    if (player.game != null)
                    {
                        this.finishGame(player.game);
                        this.matchLobby();
                    }

                    break;
                }
            case "ready_for_game":
            {
                console.log(player.username+" is ready for game")
                this.players[player.id].ready=1
                let bothReady = true
                for (var player in this.players) {
                    if (this.players.hasOwnProperty(player)) {
                        if(this.players[player].ready==0){
                            bothReady=false
                        }
                    }
                }

                if(bothReady){
                    for (var player in this.players) {
                        if (this.players.hasOwnProperty(player)) {
                            this.players[player].socket.emit('send', {
                                cmd: "go"
                            });
                        }
                    }
                }
                break;
            }

        }
    }

    matchLobby() {
        if (this.lobby.length >= 2) {
            this.createGame(this.lobby[0], this.lobby[1]);

            this.lobby.shift();
            this.lobby.shift();
        }
    }
}

// Turn on the server
const server = new Server();