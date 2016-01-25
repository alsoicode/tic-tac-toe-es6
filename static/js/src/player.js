class Player {

    constructor(opts) {
        let options = opts || {
            fullName: 'Player 1',
            isAI: false
        };

        this.fullName = options.fullName;
        this.isAI = options.isAI;

        this.reset();
    }

    reset() {
        this.positions = [];
        this.side = null;
        this.winner = false;
    }

}

export default Player;
