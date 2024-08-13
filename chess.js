var board,
    game = new Chess();

var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd,
    viewOnly: false
};

function onDragStart (piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true) return false;

    if (piece.search(/^b/) !== -1) return false;
}

function makeBestMove () {
    var bestMove = getBestMove(game);
    game.move(bestMove);
    board.position(game.fen());
}

function onDrop (source, target) {
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // always promote to a queen for simplicity
    });

    removeGreySquares();
    renderMoveHistory(game.history());

    if (move === null) return 'snapback';

    updateStatus();
}

function onMouseoutSquare(square, piece) {
    removeGreySquares();
}

function onMouseoverSquare(square, piece) {
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    greySquare(square);

    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
}

function onSnapEnd () {
    board.position(game.fen());
}

function removeGreySquares () {
    $('#board .square-55d63').css('background', '');
}

function greySquare (square) {
    var squareEl = $('#board .square-' + square);

    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }

    squareEl.css('background', background);
}

function updateStatus () {
    var status = '';
    var moveColor = 'White';
    if (game.game_over()) {
        if (game.in_checkmate()) {
            status = 'Checkmate!';
        } else if (game.in_draw()) {
            status = 'Draw!';
        }
    } else {
        if (game.in_check()) {
            status = 'Check!';
        }
        status += ' ';
    }

    $('#status').html(status);
}

function getBestMove(game) {
    // Placeholder for actual AI move logic
    var possibleMoves = game.ugly_moves();
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
}

$(document).ready(function () {
    board = ChessBoard('board', cfg);

    $('#startBtn').on('click', board.start);
    $('#clearBtn').on('click', board.clear);
});
