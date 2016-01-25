var $ = require('jquery'),
    _ = require('underscore');
import {Player} from './player';


export class TicTacToe {

    constructor(players) {
        this.board = $('#board');
        this.positions = this.board.find('td');
        this.message = $('.msg');
        this.instructions = $('.instructions');
        this.newGameControls = $('.new-game-controls');
        this.resetControls = $('.reset-controls');
        this.activeGame = false;

        this.winningCombos = [
            // horizontal
            [1, 2, 3], [4, 5, 6], [7, 8, 9],

            // vertical
            [1, 4, 7], [2, 5, 8], [3, 6, 9],

            // diagonal
            [1, 5, 9], [3, 5, 7]
        ];

        this.sides = {
            x: '<i class="fa fa-remove"></i>',
            o: '<i class="fa fa-circle-o"></i>'
        };

        this.resetControls.find('.btn').on('click', (event) => {
            this.reset();
        });

        // set up players
        this.player = new Player();
        this.ai = new Player({ isAI: true });

        // click handler to choose side for human player
        // this.newGameControls.find('.btn').on('click', this.chooseSide);
        this.newGameControls.find('.btn').on('click', (event) => {
            this.chooseSide(event);
        });

        // click handler to select a position
        this.positions.on('click', (event) => {
            this.selectPosition(event);
        });

        this.reset();
    }

    reset() {
        this.deactivateGame();
        this.resetControls.hide();
        this.newGameControls.show();
        this.message.html('');
        this.instructions.html('');
        this.positions.html('').removeClass('selected win');

        this.player.reset();
        this.ai.reset();
        // this.play();
    }

    activateGame() {
        this.activeGame = true;
        this.board.addClass('active');
        this.resetControls.show();
        this.newGameControls.hide();
        this.activePlayer = this.player;
    }

    deactivateGame() {
        this.activeGame = false;
        this.board.removeClass('tie active');
    }

    toggleActivePlayer() {
        this.activePlayer = this.activePlayer === this.player ? this.ai : this.player;
    }

    chooseSide(event) {

        // only allow side to be chosen if there is not an active game
        if (!this.activeGame) {
            let target = $(event.currentTarget);
            this.player.side = target.val();
            this.ai.side = this.player.side == 'x' ? 'o' : 'x';
            this.activateGame();

            this.instructions.html(`Place an "${this.activePlayer.side}" in an open space by clicking or tapping on it.`);
        }
    }

    selectPosition(event) {
        if (this.activePlayer.side !== null) {
            let target = $(event.currentTarget);

            // if player has chosen a side and the space is available, mark it
            if (this.player.side !== null && !target.hasClass('selected')) {
                this.markPosition(target.data('position'));
            }
        }
    }

    aiTurn() {
        // determine which winning combination has the shortest number of remaining
        // positions for the opponent. If there is a shortest one, that is the one
        // closest to victory, so choose an empty position from that combination.
        // If there is more than one with the same number of remaining positions,
        // pick one at random, as the actual position is irrelevant.

        let comboIntersections = {};

        _.each(this.winningCombinations, function(combo) {
            let intersection = _.intersection(combo, this.player.positions),
                comboIntersection = comboIntersections[intersection.length],
                difference = _.difference(combo, intersection, this.ai.positions);

            if (difference.length > 0) {
                if (comboIntersection === undefined) {
                    comboIntersections[intersection.length] = [difference];
                }
                else {
                    comboIntersection.push(difference);
                }
            }
        });

        // get highest key of intersections, as that will be the array of the fewest
        // moves remaining to win for the player, then pick a random value from the
        // positions that would block the opposing player
        let keys = _.keys(comboIntersections),
            index = parseInt(keys.sort(function(a, b) { return a - b; })[keys.length - 1]),
            blockingPositions = _.flatten(_.difference(comboIntersections[index], this.player.positions, this.ai.positions)),
            aiNextPosition;

        // if there are two open positions in any blocking combinations...
        if (index === 1) {

            // ... and player has chosen middle, choose a corner...
            if (this.player.positions.length === 1 && this.player.positions[0] === 5) {
                aiNextPosition = _.sample(_.reject(blockingPositions, function(position) {
                    return position % 2 === 0;
                }));
            }
            else {
                // ... otherwise, pick at random. If the middle is available, choose it out of spite
                aiNextPosition = _.indexOf(blockingPositions, 5) > -1 ? 5 : _.sample(blockingPositions);
            }
        }
        else {
            // if there is a combo with only one position left to win, choose it
            for (var i = 0; i < this.winningCombinations.length; i++) {
                var combo = this.winningCombinations[i],
                    intersection = _.intersection(combo, this.ai.positions),
                    difference = _.difference(combo, intersection, this.player.positions);

                    if (intersection.length === 2 && difference.length == 1) {
                        aiNextPosition = difference[0];
                        break;
                    }
            }

            // otherwise, block the shortest winning combo of the player
            if (!aiNextPosition) {
                aiNextPosition = blockingPositions[0];
            }
        }

        // mark position and check for winner
        this.markPosition(aiNextPosition);
    }

    markPosition(position) {
        var target = $('[data-position="' + position + '"]');

        // set position as selected and add icon
        target.addClass('selected').html(this.sides[this.activePlayer.side]);

        // add position to player's positions
        this.activePlayer.positions.push(position);

        // check for winner
        this.checkWinner();
    }

    markWinningCombination(combo) {
        for (var i = 0; i < combo.length; i++) {
            $('[data-position="' + combo[i] + '"]').addClass('win');
        }
    }

    checkWinner() {
        // compare activePlayer positions to winning combinations
        for (var i = 0; i < this.winningCombinations.length; i++) {
            var combo = this.winningCombinations[i];

            if (_.intersection(combo, this.activePlayer.positions).length === 3) {
                this.activePlayer.winner = true;
                this.markWinningCombination(combo);
                this.deactivateGame();
                this.message.html(`${this.activePlayer.fullName} wins!`);
                break;
            }
        }

        // Tie
        if (this.player.positions.length > 4 || this.ai.positions.length > 4) {
            this.board.addClass('tie');
            this.deactivateGame();
            this.message.html('Tie Game');
            this.instructions.html('Please try again!');
        }

        // If not a winner, toggle the active player.
        if (!this.activePlayer.winner) {

            this.toggleActivePlayer();

            if (this.activePlayer.isAI) {
                this.aiTurn();
            }
        }
    }
}
