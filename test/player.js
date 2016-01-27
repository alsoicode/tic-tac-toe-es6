import Player from '../static/js/src/player';


describe('Player functional tests', () => {

    var player;

    beforeAll(() => {
        player = new Player();
    });

    describe('when resetting a player', () => {

        it('should have no positions, side should be null and winner should be false', () => {
            player.positions.push(1);
            player.side = 'x';
            player.winner = true;

            player.reset();

            expect(player.positions).toEqual([]);
            expect(player.side).toBe(null);
            expect(player.winner).toBe(false);
        });

    });

});
