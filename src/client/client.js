const webrtc = require('webrtc-adapter');
const io = require('socket.io-client');

class Client {
    constructor() {
        this.socket = io.connect('http://localhost:3000');

        this.socket.emit('send', { message: "PING" });
        console.log("Client send: PING");

        this.socket.on('message', function (data) {
            console.log("Message from server:", data.message);
        });

        //this.connection = new RTCPeerConnection();

    }
}


window.onload = () => {
    console.log("HELLO FROM THE CLIENT!");
    let client = new Client();
};