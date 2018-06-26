
import { NetworkGame } from './NetworkGame'

export class GameServer extends NetworkGame {
    constructor(state, players) {
        super(state);
        this.state.rpc_replication = null;
        this.state.onChange = this.onGameChange.bind(this);
        this.players = players;
        this.accept_old = true;
    }

    start() {
        super.start();

        for (let player of this.players) {
            this.subscribePlayer(player.id, player.socket);
        }
    }

    finish() {
        super.finish();

        for (let player of this.players) {
            this.unsubscribePlayer(player.socket);
        }
    }

    onGameChange(state) {
        for (let player of this.players) {
            this.sendReplication(player);
        }
    }

    sendReplication(player) {
        this.sendRPC(player.socket, 'replication', this.state.getPlayerState(player.id));
    }
}