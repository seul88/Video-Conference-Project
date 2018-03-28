const webrtc = require('webrtc-adapter');
const io = require('socket.io-client');
const adapter = require('webrtc-adapter');

class Client {
    constructor() {
        console.log("Client creating...");

        this.myUsername = Math.random();
        this.partnerUsername = null;

        console.log("Client username: " + this.myUsername);

        this.createIO();
        this.createRTC();

    }

    parseMessageIO(message)
    {
        console.log("Message from server:", message);

        switch(message.cmd)
        {
            case "welcome":
            {
                /*
                {
                    cmd: "welcome",
                    motd: "Hello from the server!",
                    username: "your_username"
                }
                */

                console.log(message.motd);
                this.myUsername = message.username;

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

            case "match":
            {
                /*
                {
                    cmd: "match",
                    partnerUsername: "someone_nick",
                    whoCaller: "someone_nick" // or "my_nick"
                }
                */

                this.partnerUsername = message.partnerUsername;

                // Who start
                if(message.whoCaller == this.myUsername)
                {
                    // Create offer message
                    this.RTCConnection.createOffer((offer) => {
                        let offerMessage = {
                            cmd: "offer",
                            data: offer
                        }

                        // Server must check for what user is that offer (from the match object)
                        this.socket.emit('send', offerMessage);

                        this.RTCConnection.setLocalDescription(offer);
                    });
                }

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

                this.RTCConnection.setRemoteDescription(new RTCSessionDescription(message.data));

                this.RTCConnection.createAnswer((answer) => {

                    this.RTCConnection.setLocalDescription(answer);

                    let answerMessage = {
                        cmd: "answer",
                        data: answer
                    }

                    // Server must check for what user is that answer (from the match object)
                    this.socket.emit('send', answerMessage);

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

                this.RTCConnection.setRemoteDescription(new RTCSessionDescription(message.data)); 

                break;
            }
        }
    }

    iceCandidateHandler(event)
    {
        if (event.candidate) { 
            // Create candidate message
            let candidateMessage = {
                cmd: "candidate",
                data: event.candidate
            }

            this.socket.emit('send', candidateMessage);
         } 

         // todo: on server - check for what user is that event 
    }

    createIO()
    {
        console.log("Creating IO connection...");

        this.socket = io.connect('http://localhost:3000');

        // Create init message
        let initMessage = {
            cmd: "welcome",
            username: this.myUsername
        }

        this.socket.emit('welcome', initMessage);

        // Subscribe messages from the server
        this.socket.on('send', this.parseMessageIO.bind(this));
    }

    createRTC()
    {
        let configuration = { 
            "iceServers": [{ "urls": "stun:stun.l.google.com:19302" }]
        }; 

        this.RTCConnection = RTCPeerConnection(configuration);

        //todo AddStream to connection

        this.RTCConnection.onicecandidate = this.iceCandidateHandler;
    }
}


window.onload = () => {
    let client = new Client();
};