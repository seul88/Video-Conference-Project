const webrtc = require('webrtc-adapter');
const io = require('socket.io-client');
const adapter = require('webrtc-adapter');

var button = document.getElementById("sendMessageButton");
var joinButton = document.getElementById("btn1");


/*
https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#Handling_the_invitation
*/

import { GameClient } from './../shared/GameClient';
import { BombGame } from './../shared/games/BombGame';
import { Renderer } from './renderer'

class Client {
    constructor(username) {
        console.log("Client creating...");

        this.socket = null;
        this.textChannel = null;
        this.username = username;
        this.id = null;

        //this.rendered = new Renderer();

        this.game = null;
        this.gameClient = null;

        /////////////////////////
        this.localStream = null;

        this.remoteVideo = document.getElementById("remoteVideo");
        this.localVideo = document.getElementById("localVideo");

        this.createIO();

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
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
                        cmd: "new_game"
                    }
                    */
                    this.createRTC();

                    /*
                    this.game = new BombGame();
                    this.game.onChange = (state) => {
                        console.log(state);
                    };
                    this.gameClient = new GameClient(this.game, this.socket, this.id);
                    this.gameClient.start();
                    */

                    break;
                }
            case "connect":
                {
                    /*
                    {
                        cmd: "connect",
                    }
                    */

                    // Create offer message
                    this.RTCConnection.createOffer({
                        offerToReceiveAudio: 1,
                        offerToReceiveVideo: 1
                    })
                        .then((offer) => {
                            this.RTCConnection.setLocalDescription(offer);

                            this.socket.emit('send', {
                                cmd: "offer",
                                data: this.RTCConnection.localDescription
                            });
                        })
                        .catch((reason) => {
                            console.log(reason);
                        });

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

                    this.RTCConnection.setRemoteDescription(message.data)
                        .then(() => {
                            return this.RTCConnection.createAnswer();
                        })
                        .then((answer) => {
                            this.RTCConnection.setLocalDescription(answer);

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

                    this.RTCConnection.setRemoteDescription(message.data)
                        .then(() => {
                            console.log("Answer applied to RemoteDescription")
                        })
                        .catch((error) => {
                            console.log(error);
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
        // Camera
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
            .then(stream => {
                this.localVideo.srcObject = stream;
                this.localStream = stream;

                let videoTracks = this.localStream.getVideoTracks();
                let audioTracks = this.localStream.getAudioTracks();

                this.RTCConnection = RTCPeerConnection(null);
                this.RTCConnection.onicecandidate = this.iceCandidateHandler.bind(this);
                this.RTCConnection.ontrack = this.gotRemoteStream.bind(this);

                this.localStream.getTracks().forEach(track => {
                    this.RTCConnection.addTrack(track, this.localStream);
                });

                this.socket.emit('send', {
                    cmd: "ready"
                });

            })
            .catch((e) => {
                alert('getUserMedia() error: ' + e.name);
            });
    }

    gotRemoteStream(e) {
        if (this.remoteVideo.srcObject !== e.streams[0]) {
            this.remoteVideo.srcObject = e.streams[0];
        }
    }


    closeRTC() {

        // remote
        if (this.remoteVideo.srcObject) {
            this.remoteVideo.srcObject.getTracks().forEach(track => track.stop());
            this.remoteVideo.srcObject = null;
        }

        // local
        if (this.localVideo.srcObject) {
            this.localVideo.srcObject.getTracks().forEach(track => track.stop());
            this.localVideo.srcObject = null;
            this.localStream = null;
        }

        this.RTCConnection.close();
        this.RTCConnection = null;
    
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