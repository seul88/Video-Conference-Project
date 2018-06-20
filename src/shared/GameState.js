
export class GameState {
    constructor() {
        this.state = {}
        this.onChange = null;
    }

    rpc_replication(player, state) {
        if (state != this.state) {
            this.state = state;
            this.emitOnChange();
        }
    }

    emitOnChange() {
        console.log(this.state);

        if (this.onChange)
            this.onChange(this.state);
    }
}

