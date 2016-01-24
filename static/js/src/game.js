var $ = require('jquery');

export class TicTacToe {

    constructor() {
        this.board = $('#board');
        this.positions = this.board.find('td');
        this.message = $('.msg');
        this.instructions = $('.instructions');
        this.newGameControls = $('.new-game-controls');
        this.resetControls = $('.reset-controls');

        this.winningCombos = [
            // horizontal
            [1, 2, 3], [4, 5, 6], [7, 8, 9],

            // vertical
            [1, 4, 7], [2, 5, 8], [3, 6, 9],

            // diagonal
            [1, 5, 9], [3, 5, 7]
        ];

        TicTacToe.sides = {
            x: '<i class="fa fa-remove"></i>',
            o: '<i class="fa fa-circle-o"></i>'
        };

        this.resetControls.find('.btn').on('click', function() {
            this.reset();
        });

        this.reset();
    }

    reset() {
        this.resetControls.hide();
        this.newGameControls.show();
        this.board.removeClass('tie active');
        this.message.html('');
        this.instructions.html('');
        this.positions.html('').removeClass('selected win');
    }

}
