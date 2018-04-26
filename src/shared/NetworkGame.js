
export class NetworkGame {
    constructor(state) {
        this.state = state;
        this.timestamp = Date.now();
        this.accept_old = false;
    }

    start() { }

    finish() { }

    subscribePlayer(id, socket) {
        socket.on('game', (message) => {
            let isNew = message.timestamp >= this.timestamp;

            if (isNew || this.accept_old)
            {
                this.handleRPC(id, message.procedure, message.args);

                if(isNew)
                    this.timestamp = message.timestamp;
            }
        });
    }

    unsubscribePlayer(socket) {
        socket.on('game', () => { });
    }

    handleRPC(id, procedure, args) {
        this.state['rpc_' + procedure](id, args);
    }

    sendRPC(socket, procedure, args) {
        socket.emit('game', {
            procedure: procedure,
            args: args,
            timestamp: this.timestamp
        });
    }

    stamp() {
        this.timestamp = Date.now();
    }
}