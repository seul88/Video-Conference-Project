
import { GameState } from './../GameState'

export class BombGame extends GameState {

    constructor() {
        super();

        this.cables_order = [];
    }

    init(sapper, trainer)
    {
        // It will be sent to users
        this.state = {
            sapper: sapper,
            trainer: trainer,
            cut_cables: [],
            finished: false,
            defused: false
        }

        this.cables_order = [1, 2, 3, 4]; 
    }

    checkWinState()
    {
        for(let i = 0; i < this.state.cut_cables.length; ++i)
        {
            if(this.state.cut_cables[i] != this.cables_order[i])
            {
                this.state.finished = true;
                break;
            }
        }

        if(!this.state.finished && this.state.cut_cables.length == this.cables_order.length)
        {
            this.state.finished = true;
            this.state.defused = true;
        }
    }

    rpc_cutTheCable(player, args) {
        if (this.state.finished)
            return;

        if (player != this.state.sapper)
            return;

        if(args.number in this.state.cut_cables || args.number > 4 || args.number < 0)
            return;

        this.state.cut_cables.push(args.number);

        if(this.cables_order.length != 0)
            this.checkWinState();

        this.emitOnChange();
    }



}