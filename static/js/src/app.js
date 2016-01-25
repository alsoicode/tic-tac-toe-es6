var $ = require('jquery');
import {TicTacToe} from './game';
import {Player} from './player';


$(document).ready(function() {
    let player = new Player(),
        ai = new Player({ isAI: true, fullName: 'Computer' });

    var game = new TicTacToe(player, ai);
});
