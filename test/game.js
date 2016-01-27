var jsdom = require('mocha-jsdom'),
    _ = require('underscore');

import TicTacToe from '../static/js/src/game';
import Player from '../static/js/src/player';


describe('Tic Tac Toe functional tests', () => {

    var $,
        player,
        ai,
        game;

    jsdom();

    beforeAll(() => {
        $ = require('jquery');
        window.jQuery = $;
        player = new Player();
        ai = new Player({ isAI: true, fullName: 'Computer' });
        game = new TicTacToe(player, ai);
    });

    beforeEach(() => {
        game.reset();
    });

    describe('When initializing a new game', () => {

        it('Should assign players without errors', () => {
            expect(game.player.isAI).toBe(false);
            expect(game.ai.isAI).toBe(true);
            expect(game.player.positions).toEqual([]);
            expect(game.ai.positions).toEqual([]);
            expect(game.player.winner).toBe(false);
            expect(game.ai.winner).toBe(false);
        });

    });

    describe('When resetting a game', () => {
        it('Should re-assign player data', () => {
            game.player.positions = [1,2,3];
            game.player.side = 'x';
            game.player.winner = true;
            game.ai.positions = [4,5,6,7];
            game.ai.side = 'o';
            game.reset();

            expect(game.player.positions).toEqual([]);
            expect(game.player.side).toBe(null);
            expect(game.player.winner).toBe(false);

            expect(game.ai.positions).toEqual([]);
            expect(game.ai.side).toBe(null);
            expect(game.ai.winner).toBe(false);
        });
    });

    describe('When checking for a winner, and the player has positions in the combos', () => {
        it('Should set the player as the winner', () => {
            game.activePlayer = player;

            _.each(game.winningCombinations, (winningCombo) => {
                game.player.positions = winningCombo;
                game.checkWinner();

                expect(game.player.winner).toBe(true);
            });
        });
    });

    describe('When checking for a winner and both players have exhausted all positions', () => {
        it('should indicate a tie', () => {
            game.activePlayer = ai;
            game.player.positions = [1, 2, 6, 7, 8];
            game.ai.positions = [3, 4, 5, 9];
            game.checkWinner();

            expect(game.player.winner).toBe(false);
            expect(game.ai.winner).toBe(false);
        });
    });

    describe('When the player selects his first position and it isn\'t the center', () => {
        it('should result in the AI picking the center position', () => {
            game.activePlayer = player;
            game.markPosition(1);

            expect(game.ai.positions).toEqual([5]);
        });
    });

    describe('When the player selects the middle position on their first turn', () => {
        it('Should result in the AI picking a spot at random', () => {
            game.activePlayer = player;
            game.markPosition(5);

            expect(game.ai.positions.length).toBeGreaterThan(0);
            expect(game.ai.positions[0]).not.toBe(5);
        });
    });

    describe('When the player has two positions of a winning combo and the AI does not', () => {
        it('should result in the AI picking the blocking position', () => {

            _.each(game.winningCombinations, (combo) => {
                for (i = 0; i < combo.length; i++) {
                    game.activePlayer = player;
                    game.player.positions = _.without(combo, combo[i]);
                    game.checkWinner();

                    expect(game.ai.positions).toEqual([combo[i]]);

                    game.reset();
                }
            });

        });
    });

    describe('When the AI has two postions of a winning combo and the player does not', () => {
        it('should result in the AI choosing the winning position', () => {

            _.each(game.winningCombinations, (combo) => {
                for (i = 0; i < combo.length; i++) {
                    game.activePlayer = ai;
                    game.ai.positions = _.without(combo, combo[i]);
                    game.checkWinner();

                    expect(_.difference(game.ai.positions, combo)).toEqual([]);

                    game.reset();
                }
            });

        });
    });

});
