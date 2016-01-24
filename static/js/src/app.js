var $ = require('jquery');
import {TicTacToe} from './game';

$(document).ready(function() {
    var game = new TicTacToe();
    console.log(game);
});
