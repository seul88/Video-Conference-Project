const webrtc = require('webrtc-adapter');
const io = require('socket.io-client');
const adapter = require('webrtc-adapter');
var button = document.getElementById("sendMessageButton");


/*
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#Handling_the_invitation
*/

import { GameClient } from './../shared/GameClient';
import { BombGame } from './../shared/games/BombGame';
import { Renderer } from './renderer'

class Client {
    constructor() {
        console.log("Client creating...");

        this.socket = null;
        this.textChannel = null;
        this.username = 'Test_player';
        this.id = null;

        this.createIO();
        this.rendered = new Renderer();
        
        this.game = null;
        this.gameClient = null;
    }

    parseMessageIO(message) {
        console.log("Message from server:", message);

        switch (message.cmd) {
            case "welcome":
                {
                    /*
                    {
                        cmd: "welcome",
                        motd: "Hello from the server!",
                        username: "your_username",
                        id: "generated_id"
                    }
                    */

                    console.log(message.motd);
                    this.username = message.username;
                    this.id = message.id;

                    break;
                }

            case "new_game":
                {
                    /*
                    {
                        cmd: "new_game",
                        caller: 'id'
                    }
                    */
                   this.createRTC();

                    // Who start?
                    if (message.caller == this.id) {
                        console.log("I am caller!");

                        // Create offer message
                        this.RTCConnection.createOffer().then((offer) => {
                            return this.RTCConnection.setLocalDescription(offer);
                        })
                            .then(() => {
                                this.socket.emit('send', {
                                    cmd: "offer",
                                    data: this.RTCConnection.localDescription
                                });
                            })
                            .catch((reason) => {
                                console.log(reason);
                            });
                    }

                    this.game = new BombGame();
                    this.game.onChange = (state) => {
                        console.log(state);
                    };
                    this.gameClient = new GameClient(this.game, this.socket, this.id);
                    this.gameClient.start();

                    break;
                }
            case "finish_game":
                {
                    /*
                    {
                        cmd: "finish_game",
                    }
                    */
                    this.closeRTC(); 

                    break;
                }
            case "candidate":
                {
                    /*
                    {
                        cmd: "candidate",
                        data: {...} // ice object
                    }
                    */

                    this.RTCConnection.addIceCandidate(new RTCIceCandidate(message.data));

                    break;
                }

            case "offer":
                {
                    /*
                    {
                        cmd: "offer",
                        data: {...} // offer object
                    }
                    */

                    this.RTCConnection.setRemoteDescription(message.data).then(() => {
                        //return navigator.mediaDevices.getUserMedia(mediaConstraints);
                    })
                        .then((stream) => {
                            //document.getElementById("local_video").srcObject = stream;
                            //return myPeerConnection.addStream(stream);
                        })
                        .then(() => {
                            return this.RTCConnection.createAnswer();
                        })
                        .then((answer) => {
                            this.RTCConnection.setLocalDescription(answer);
                            return answer;
                        })
                        .then((answer) => {
                            // Send the answer to the remote peer using the signaling server
                            this.socket.emit('send', {
                                cmd: "answer",
                                data: answer
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    break;
                }

            case "answer":
                {
                    /*
                    {
                        cmd: "answer",
                        data: {...} // offer object
                    }
                    */

                    this.RTCConnection.setRemoteDescription(message.data).then(() => {
                        console.log("Answer applied to RemoteDescription")
                    });

                    break;
                }
        }
    }

    createIO() {
        console.log("Creating IO connection...");

        this.socket = io.connect(document.location.origin);

        // Create init message
        let initMessage = {
            cmd: "welcome",
            username: this.username
        }

        this.socket.emit('welcome', initMessage);

        // Subscribe messages from the server
        this.socket.on('send', this.parseMessageIO.bind(this));
    }

    createRTC() {
        let configuration = {
            "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }]
        };

        this.RTCConnection = RTCPeerConnection(configuration);

        // text channel for test
        this.textChannel = this.RTCConnection.createDataChannel("chat", { negotiated: true, id: 0 });
        this.textChannel.onopen = (event) => {
            this.textChannel.send('Hi you! Message from ' + this.id);
        }
        this.textChannel.onmessage = (event) => {
            $('#messages').append($('<li>').text(event.data));
        }


        this.RTCConnection.onicecandidate = this.iceCandidateHandler.bind(this);

        button.onclick = (event) => {
            this.sendMessage();
        }
    }

    sendMessage(){

        let message = $('#m').val();
        $('#m').val('');

        this.textChannel.send(this.username+': '+message);
        $('#messages').append($('<li>').text(this.username+': '+message));

    }

    closeRTC() {
        if (this.RTCConnection) {

            /*
            var remoteVideo = document.getElementById("received_video");
            var localVideo = document.getElementById("local_video");
      
            if (remoteVideo.srcObject) {
                remoteVideo.srcObject.getTracks().forEach(track => track.stop());
                remoteVideo.srcObject = null;
            }

            if (localVideo.srcObject) {
                localVideo.srcObject.getTracks().forEach(track => track.stop());
                localVideo.srcObject = null;
            }
            */

            this.RTCConnection.close();
            this.RTCConnection = null;
        }
    }

    iceCandidateHandler(event) {
        if (event.candidate) {
            // Create candidate message
            let candidateMessage = {
                cmd: "candidate",
                data: event.candidate
            }

            this.socket.emit('send', candidateMessage);
        }
    }

}


window.onload = () => {
    let client = new Client();
};