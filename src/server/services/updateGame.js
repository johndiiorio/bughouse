const Game = require('../models/Game');
const Bug = require('./bug');
const database = require('../models/database');

const db = database.db;

function newMoveString(moves, userPosition, game) {
	if (!moves) moves = '';
	let moveCount;
	let lastPlayerLetter;
	if (userPosition === 1) lastPlayerLetter = moves.lastIndexOf('A.');
	else if (userPosition === 2) lastPlayerLetter = moves.lastIndexOf('a.');
	else if (userPosition === 3) lastPlayerLetter = moves.lastIndexOf('B.');
	else lastPlayerLetter = moves.lastIndexOf('b.');
	if (lastPlayerLetter === -1) moveCount = 1;
	else {
		const lastSpace = moves.substring(0, lastPlayerLetter).lastIndexOf(' ');
		const loopSubstring = moves.substring(lastSpace + 1, lastPlayerLetter);
		let beginNum = 0;
		for (; beginNum < loopSubstring.length; beginNum++) {
			if (!isNaN(loopSubstring[beginNum])) break;
		}
		moveCount = parseInt(moves.substring(lastSpace + beginNum + 1, lastPlayerLetter)) + 1;
	}
	if (userPosition === 1) {
		moves += `${moveCount}A. ${game.history()} `;
	} else if (userPosition === 2) {
		moves += `${moveCount}a. ${game.history()} `;
	} else if (userPosition === 3) {
		moves += `${moveCount}B. ${game.history()} `;
	} else {
		moves += `${moveCount}b. ${game.history()} `;
	}
	return { moves: moves, moveNum: moveCount };
}

function convertReserveToSparePieces(reserve) {
	return JSON.parse(reserve).map(row => {
		const letters = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };
		return {
			role: letters[row.type],
			color: row.color === 'w' ? 'white' : 'black'
		};
	});
}

function convertPieceToSANLetter(piece) {
	const mapping = { pawn: 'P', knight: 'N', bishop: 'B', rook: 'R', queen: 'Q' };
	return mapping[piece];
}

module.exports = async (data, socket, gameSocket, clearRoom) => {
	try {
		const row = await Game.getByID(data.id);
		const currentTime = Date.now();
		row.left_reserve_white = row.left_reserve_white ? JSON.parse(row.left_reserve_white) : [];
		row.left_reserve_black = row.left_reserve_black ? JSON.parse(row.left_reserve_black) : [];
		row.right_reserve_white = row.right_reserve_white ? JSON.parse(row.right_reserve_white) : [];
		row.right_reserve_black = row.right_reserve_black ? JSON.parse(row.right_reserve_black) : [];
		row.left_promoted_pieces = row.left_promoted_pieces ? JSON.parse(row.left_promoted_pieces) : [];
		row.right_promoted_pieces = row.right_promoted_pieces ? JSON.parse(row.right_promoted_pieces) : [];
		row.left_fens = row.left_fens.split(',');
		row.right_fens = row.right_fens.split(',');
		let game;
		let move;
		if (data.userPosition === 1 || data.userPosition === 2) { // Create game for left board
			game = new Bug(row.left_fens[row.left_fens.length - 1]);
			game.setReserves(row.left_reserve_white, row.left_reserve_black);
			game.setPromotedPieceSquares(row.left_promoted_pieces);
		} else { // Create game for right board
			game = new Bug(row.right_fens[row.right_fens.length - 1]);
			game.setReserves(row.right_reserve_white, row.right_reserve_black);
			game.setPromotedPieceSquares(row.right_promoted_pieces);
		}
		let lastMove = [data.move.target];
		if (data.move.source === 'spare') {
			move = game.move(`${convertPieceToSANLetter(data.move.piece.role)}@${data.move.target}`);
		} else {
			move = game.move({
				from: data.move.source,
				to: data.move.target,
				promotion: data.move.promotion
			});
			lastMove.push(data.move.source);
		}
		lastMove = JSON.stringify(lastMove);
		if (move) { // Not an illegal move
			const queryString =
				'UPDATE Games SET $1~ = $2, $3~ = $4, $5~ = $6, ' +
				'$7~ = $8, $9~ = $10, $11~ = $12, $13~ = $14, ' +
				'$15~ = $16, $17~ = $18, $19~ = $20, $21~ = $22 WHERE id = $23';
			let argsQuery;
			let boardNum;
			let emitData;
			let diffTime;
			const isPromotion = data.move.promotion !== null;
			let argOtherReserveWhite = [];
			let argOtherReserveBlack = [];
			let leftPromotedPieces = row.left_promoted_pieces;
			let rightPromotedPieces = row.right_promoted_pieces;
			const turn = game.turn() === 'w' ? 'white' : 'black';
			let capture = false;
			if (game.history()[0].indexOf('x') !== -1) { // Move is a capture
				capture = true;
			}
			const newReserves = game.getReserves();
			const moveInfo = newMoveString(row.moves, data.userPosition, game);
			const argMoves = moveInfo.moves;
			const moveNum = moveInfo.moveNum;
			const argReserveWhite = JSON.stringify(newReserves.reserve_white);
			const argReserveBlack = JSON.stringify(newReserves.reserve_black);
			// clocks in database represent number of milliseconds for each players clock
			// i.e. 32000 of a 5 minute game means 32 seconds have elapsed for that player, clock should display 4:28
			// can be negative from increment, i.e. -3000 of a 5 minute game means the player's clock should display 5:03
			const arrClocks = row.clocks.split(',').map(Number);
			row.increment *= 1000; // convert seconds to milliseconds
			if (data.userPosition === 1 || data.userPosition === 2) {
				boardNum = 1;
				argOtherReserveWhite = JSON.stringify(row.right_reserve_white.concat(newReserves.other_reserve_white));
				argOtherReserveBlack = JSON.stringify(row.right_reserve_black.concat(newReserves.other_reserve_black));
				row.left_fens.push(game.fen());
				const argFen = row.left_fens.join();

				// don't change clock if white's first move
				diffTime = moveNum === 1 && turn === 'black' ? row.increment : currentTime - row.left_last_time;
				if (data.userPosition === 1) {
					arrClocks[0] += diffTime - row.increment;
				} else {
					arrClocks[1] += diffTime - row.increment;
				}

				// If there was a promotion, add that square to the promotion list
				// Otherwise if there was a capture that involved a square in the promoted pieces, remove it from the list
				// Otherwise update the list if the promoted piece moves
				if (isPromotion) {
					leftPromotedPieces.push(data.move.target);
				} else if (capture && leftPromotedPieces.includes(data.move.target)) {
					leftPromotedPieces = leftPromotedPieces.filter(item => item !== data.move.target);
				} else if (leftPromotedPieces.includes(data.move.source)) {
					leftPromotedPieces = leftPromotedPieces.filter(item => item !== data.move.source);
					leftPromotedPieces.push(data.move.target);
				}


				argsQuery = [
					'left_fens', argFen,
					'left_reserve_white', argReserveWhite,
					'left_reserve_black', argReserveBlack,
					'right_reserve_white', argOtherReserveWhite,
					'right_reserve_black', argOtherReserveBlack,
					'left_last_time', currentTime,
					'moves', argMoves,
					'clocks', arrClocks.join(),
					'left_last_move', lastMove,
					'left_color_to_play', turn,
					'left_promoted_pieces', JSON.stringify(leftPromotedPieces),
					data.id
				];
				emitData = {
					fens: row.left_fens,
					leftReserveWhite: convertReserveToSparePieces(argReserveWhite),
					leftReserveBlack: convertReserveToSparePieces(argReserveBlack),
					rightReserveWhite: convertReserveToSparePieces(argOtherReserveWhite),
					rightReserveBlack: convertReserveToSparePieces(argOtherReserveBlack),
					turn,
					boardNum,
					capture,
					move: data.move,
					moves: argMoves,
					clocks: arrClocks
				};
			} else {
				boardNum = 2;
				argOtherReserveWhite = JSON.stringify(row.left_reserve_white.concat(newReserves.other_reserve_white));
				argOtherReserveBlack = JSON.stringify(row.left_reserve_black.concat(newReserves.other_reserve_black));
				row.right_fens.push(game.fen());
				const argFen = row.right_fens.join();

				// don't change clock if white's first move
				diffTime = moveNum === 1 && turn === 'black' ? row.increment : currentTime - row.right_last_time;
				if (data.userPosition === 3) {
					arrClocks[2] += diffTime - row.increment;
				} else {
					arrClocks[3] += diffTime - row.increment;
				}

				// If there was a promotion, add that square to the promotion list
				// Otherwise if there was a capture that involved a square in the promoted pieces, remove it from the list
				// Otherwise update the list if the promoted piece moves
				if (isPromotion) {
					rightPromotedPieces.push(data.move.target);
				} else if (capture && rightPromotedPieces.includes(data.move.target)) {
					rightPromotedPieces = rightPromotedPieces.filter(item => item !== data.move.target);
				} else if (rightPromotedPieces.includes(data.move.source)) {
					rightPromotedPieces = rightPromotedPieces.filter(item => item !== data.move.source);
					rightPromotedPieces.push(data.move.target);
				}

				argsQuery = [
					'right_fens', argFen,
					'right_reserve_white', argReserveWhite,
					'right_reserve_black', argReserveBlack,
					'left_reserve_white', argOtherReserveWhite,
					'left_reserve_black', argOtherReserveBlack,
					'moves', argMoves,
					'right_last_time', currentTime,
					'clocks', arrClocks.join(),
					'right_last_move', lastMove,
					'right_color_to_play', turn,
					'right_promoted_pieces', JSON.stringify(rightPromotedPieces),
					data.id
				];
				emitData = {
					fens: row.right_fens,
					leftReserveWhite: convertReserveToSparePieces(argOtherReserveWhite),
					leftReserveBlack: convertReserveToSparePieces(argOtherReserveBlack),
					rightReserveWhite: convertReserveToSparePieces(argReserveWhite),
					rightReserveBlack: convertReserveToSparePieces(argReserveBlack),
					turn,
					boardNum,
					capture,
					moveNum,
					move: data.move,
					moves: argMoves,
					clocks: arrClocks
				};
			}
			// update database
			await db.none(queryString, argsQuery);
			// update everyone in game
			gameSocket.in(socket.room).emit('update game', emitData);

			if (game.game_over()) {
				let termination = null;
				if (game.in_checkmate()) {
					if (data.userPosition === 1 || data.userPosition === 4) {
						termination = 'Checkmate, Team 1 is victorious';
					} else {
						termination = 'Checkmate, Team 2 is victorious';
					}
				} else if (game.in_stalemate) {
					termination = 'Drawn by stalemate';
				} else if (game.in_threefold_repetition) {
					termination = 'Drawn by three-fold repetition';
				} else {
					termination = 'Drawn by the 50 move rule';
				}
				await Game.endGame(row, termination, socket, gameSocket, clearRoom);
			}
		} else { // illegal move
			socket.emit('snapback move', { fen: game.fen() });
		}
	} catch (err) {
		socket.emit('snapback move', { fen: null });
	}
};
