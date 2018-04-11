
import { GameState } from './../GameState'

export class BombGame extends GameState {

    constructor() {
        super();

        this.cables_order = [];
    }

    init(sapper, trainer)
    {
        this.state = {
            sapper: sapper,
            trainer: trainer,
            cut_cables: [],
            finished: false,
            defused: false
        }

        this.cables_order = [1, 2, 3, 4]; 
    }

    rpc_cutTheCable(player, number) {
        if (this.state.finished || this.cables_order == [])
            return;

        if (player != this.state.sapper)
            return;

        let next = this.cables_order.shift();

        if (next != number) {
            this.state.finished = true;
        }
        else {
            this.state.cut_cables.push(next);

            if (this.cables_order.length == 0) {
                this.state.finished = true;
                this.state.defused = true;
            }
        }

        this.emitOnChange();
    }

}