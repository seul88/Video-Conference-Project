
export class Game {
    constructor() {
        this.players = [];
    }

    start(players)
    {
        if(!Array.isArray(players))
            throw "Players object must be array of players"

        this.players = players;
    }

    finish()
    {
        
    }


}

