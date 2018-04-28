
import { NetworkGame } from './NetworkGame'

export class GameClient extends NetworkGame {
    constructor(state, socket, id) {
        super(state);
        this.state = state;
        this.socket = socket;
        this.id = id;
    }

    start() {
        super.start();

        this.subscribePlayer(this.id, this.socket);

        /*
        this.emit('cutTheCable', 1);
        this.state.rpc_cutTheCable(this.id, 1);

        this.emit('cutTheCable', 2);
        this.emit('cutTheCable', 3);
        this.emit('cutTheCable', 4);
        */
    }

    finish() {
        this.unsubscribePlayer(this.socket);

        super.finish();
    }

    do(procedure, args)
    {
        this.stamp();
        this.handleRPC(this.id, procedure, args);
        this.sendRPC(this.socket, procedure, args);
    }
}