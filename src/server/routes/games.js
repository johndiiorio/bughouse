const express = require('express');
const Game = require('../models/Game');
const Bug = require('../services/bug');
const jwt = require('jsonwebtoken');
const validate = require('jsonschema').validate;
const secretToken = require('../config').secretToken;

const router = express.Router();

/* Create a new game */
router.post('/', async (req, res) => {
	const validReq = {
		type: 'object',
		maxProperties: 9,
		required: ['minutes', 'increment', 'ratingRange', 'mode', 'joinRandom'],
		properties: {
			minutes: { type: 'integer' },
			increment: { type: 'integer' },
			player1: { type: ['integer', null] },
			player2: { type: ['integer', null] },
			player3: { type: ['integer', null] },
			player4: { type: ['integer', null] },
			ratingRange: { type: 'string' },
			mode: { type: 'string' },
			joinRandom: { type: 'boolean' },
		}
	};
	try {
		if ((!validate(req.body, validReq).valid)
			|| (req.body.mode !== 'Rated' && req.body.mode !== 'Casual')
			|| (req.body.minutes < 1)
			|| (req.body.minutes > 20)
			|| (req.body.increment < 0)
			|| (req.body.increment > 30)
			|| (req.body.ratingRange.split(' - ').length === 1)
			|| (parseInt(req.body.ratingRange.split(' - ')[0]) < 0)
			|| (parseInt(req.body.ratingRange.split(' - ')[1]) > 3000)) {
			res.sendStatus(400);
		} else {
			const id = await Game.createGame(req.body.player1, req.body.player2, req.body.player3, req.body.player4, req.body.minutes, req.body.increment, req.body.ratingRange, req.body.mode, req.body.joinRandom);
			res.json({ id });
		}
	} catch (err) {
		res.status(400).send({ error: 'Failed to create game' });
	}
});

/* GET all open games */
router.get('/open', async (req, res, next) => {
	try {
		const rows = await Game.getAllOpen();
		res.json(rows);
	} catch (err) {
		next(err);
	}
});

/* Get a single game */
router.get('/:id', async (req, res, next) => {
	try {
		if (req.params.id) {
			const row = await Game.getByID(req.params.id);
			res.json(row);
		} else {
			const err = new Error();
			err.status = 401;
			throw err;
		}
	} catch (err) {
		next(err);
	}
});

/* Get a single game with users information, include user's position
 * Note that the users ratings are relative to the start of the game, not their current rating
 */
router.put('/withUsers/:id', async (req, res) => {
	try {
		const row = await Game.getGameWithUsersByID(req.params.id);
		if (req.body.token) {
			jwt.verify(req.body.token, secretToken, (err, decoded) => {
				if (err) {
					row.userPosition = 1;
				} else {
					if (row.player2.id === decoded.id) row.userPosition = 2;
					else if (row.player3.id === decoded.id) row.userPosition = 3;
					else if (row.player4.id === decoded.id) row.userPosition = 4;
					else row.userPosition = 1;
				}
				res.json(row);
			});
		} else {
			row.userPosition = 1;
			res.json(row);
		}
	} catch (err) {
		res.status(400).send({ error: 'Failed to get game with users by id' });
	}
});

/* Get if a user is a game player or an observer */
router.put('/userIsPlayingOrObserving/:id', async (req, res) => {
	try {
		const token = req.body.token;
		if (req.params.id === 'undefined' || !token) {
			throw new Error('No id or token given');
		}
		const row = await Game.getGameWithUsersByID(req.params.id);
		if (!Object.prototype.hasOwnProperty.call(row, 'id')) {
			throw new Error('Invalid id');
		}
		if (row.status !== 'playing') {
			res.json({ isPlaying: false });
		} else {
			jwt.verify(token, secretToken, (err, decoded) => {
				if (err) {
					res.json({ isPlaying: false });
				} else {
					if (row.player1.id === decoded.id || row.player2.id === decoded.id || row.player3.id === decoded.id || row.player4.id === decoded.id) {
						res.json({ isPlaying: true });
					} else {
						res.json({ isPlaying: false });
					}
				}
			});
		}
	} catch (err) {
		res.status(400).send({ isPlaying: false });
	}
});

/**
 * Update player for an open game
 *
 * @param {string} id Game ID
 * @param {string} playerPosition Can be either player1, player2, player3, player4
 * @param {int} player Player ID
 */
router.put('/open/:id', async (req, res, next) => {
	try {
		const result = await Game.updatePlayer(req.params.id, req.body.playerPosition, req.body.player);
		if (!result) {
			res.status(400).send({ error: 'Failed to update player for open game' });
		} else {
			res.end();
		}
	} catch (err) {
		next(err);
	}
});

/* Fetch game state */
router.get('/state/:id', async (req, res, next) => {
	function convertReserveToSparePieces(reserve) {
		if (!reserve) return [];
		return JSON.parse(reserve).map(row => {
			const letters = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };
			return {
				role: letters[row.type],
				color: row.color === 'w' ? 'white' : 'black'
			};
		});
	}
	try {
		const game = await Game.getByID(req.params.id);
		res.json({
			leftReserveWhite: convertReserveToSparePieces(game.left_reserve_white),
			leftReserveBlack: convertReserveToSparePieces(game.left_reserve_black),
			rightReserveWhite: convertReserveToSparePieces(game.right_reserve_white),
			rightReserveBlack: convertReserveToSparePieces(game.right_reserve_black),
			moves: game.moves,
			leftFen: game.left_fen,
			rightFen: game.right_fen,
			leftLastMove: JSON.parse(game.left_last_move),
			rightLastMove: JSON.parse(game.right_last_move),
			leftColorToPlay: game.left_color_to_play,
			rightColorToPlay: game.right_color_to_play,
			clocks: game.clocks.split(',').map(Number),
			leftLastTime: parseInt(game.left_last_time),
			rightLastTime: parseInt(game.right_last_time),
			resignState: game.resign_state,
			drawState: game.draw_state,
			termination: game.termination
		});
	} catch (err) {
		next(err);
	}
});

/* Check if pawn promotion is possible */
router.put('/validate/pawnpromotion/:id', async (req, res) => {
	try {
		if (!(req.body.source && typeof req.body.piece.role === 'string' && typeof req.body.target === 'string' && req.params.id)) {
			res.json({ valid: false });
			return;
		}
		if (req.body.source === 'spare' || req.body.piece.role.charAt(0).toLowerCase() !== 'p' || (req.body.target.charAt(1) !== '1' && req.body.target.charAt(1) !== '8')) { // Not a valid promotion
			res.json({ valid: false });
			return;
		}
		const row = await Game.getByID(req.params.id);
		let game;
		if (req.body.userPosition === 1 || req.body.userPosition === 2) {
			game = new Bug(row.left_fen);
		} else {
			game = new Bug(row.right_fen);
		}
		const move = game.move({
			from: req.body.source,
			to: req.body.target,
			promotion: 'q' // doesn't matter the promotion, user will decide later
		});
		if (move) {
			res.json({ valid: true });
		} else {
			res.json({ valid: false, fen: game.fen() });
		}
	} catch (err) {
		res.status(400).send({ error: 'Failed to validate pawn promotion' });
	}
});

module.exports = router;
