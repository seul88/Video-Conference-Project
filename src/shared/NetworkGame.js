
export class NetworkGame {
    constructor(state) {
        this.state = state;
    }

    start() {}

    finish() {}

    subscribePlayer(id, socket) {
        socket.on('game', (message) => {
            this.handleRPC(id, message.procedure, message.args);
        });
    }

    unsubscribePlayer(socket) {
        socket.on('game', () => {});
    }

    handleRPC(id, procedure, args) {
        this.state['rpc_' + procedure](id, args);
    }

    sendRPC(socket, procedure, args) {
        socket.emit('game', {
            procedure: procedure,
            args: args,
        });
    }
}