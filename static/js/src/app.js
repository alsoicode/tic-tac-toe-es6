var $ = require('jquery');
import {TicTacToe} from './game';
import {Player} from './player';

$(document).ready(function() {
    var game = new TicTacToe();
    console.log(game);
});
