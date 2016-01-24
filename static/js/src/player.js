export class Player {

    constructor(data) {
        this.fullName = data.fullName || 'Player 1';
        this.isAI = data.isAI || false;
        this.positions = [];
        this.side = null;
        this.winner = false;
    }

}
