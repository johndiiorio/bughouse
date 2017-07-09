const express = require('express');
const Game = require('../models/Game');
const Bug = require('../services/bug');
const jwt = require('jsonwebtoken');
const secretToken = require('../config').secretToken;

const router = express.Router();

/* Get all games */
router.get('/', async (req, res) => {
	try {
		const rows = await Game.getAll();
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET all games: ${err}`);
		res.status(500).send({ error: 'Failed to get all games' });
	}
});

/* Create a new game */
router.post('/', async (req, res) => {
	try {
		if (req.body.minutes < 1 || req.body.minutes > 20 || req.body.increment < 0 || req.body.increment > 30) {
			throw new Error('Invalid minutes or increment');
		}
		const id = await Game.createGame(req.body.player1, req.body.player2, req.body.player3, req.body.player4, req.body.minutes, req.body.increment, req.body.ratingRange, req.body.mode, req.body.status, req.body.joinRandom);
		res.json({ id });
	} catch (err) {
		console.error(`Error while performing POST create new game: ${err}`);
		res.status(400).send({ error: 'Failed to create game' });
	}
});

/* GET all open games */
router.get('/open', async (req, res) => {
	try {
		const rows = await Game.getAllOpen();
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET all open games: ${err}`);
		res.status(500).send({ error: 'Failed to get all open games' });
	}
});

/* Get a single game */
router.get('/:id', async (req, res) => {
	try {
		const row = await Game.getByID(req.params.id);
		res.json(row);
	} catch (err) {
		console.error(`Error while performing GET game by id: ${err}`);
		res.status(500).send({ error: 'Failed to get game by id' });
	}
});

/* Get a single game with users information, include user's position */
router.put('/withUsers/:id', async (req, res) => {
	try {
		const row = await Game.getGameWithUsersByID(req.params.id);
		if (req.body.token) {
			jwt.verify(req.body.token, secretToken, (err, decoded) => {
				if (err) {
					res.json({ showGame: false });
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
		console.error(`Error while performing GET game by id: ${err}`);
		res.status(400).send({ error: 'Failed to get game with users by id' });
	}
});

/* Get if a user should be shown game or overview component */
router.put('/showGameOrOverview/:id', async (req, res) => {
	try {
		const token = req.body.token;
		if (req.params.id === 'undefined' || !token) {
			throw new Error('No id or token given');
		}
		const row = await Game.getGameWithUsersByID(req.params.id);
		if (row.status !== 'playing') {
			res.json({ showGame: false });
		} else {
			jwt.verify(token, secretToken, (err, decoded) => {
				if (err) {
					res.json({ showGame: false });
				} else {
					if (row.player1.id === decoded.id || row.player2.id === decoded.id || row.player3.id === decoded.id || row.player4.id === decoded.id) {
						res.json({ showGame: true });
					} else {
						res.json({ showGame: false });
					}
				}
			});
		}
	} catch (err) {
		console.error(`Error while performing GET if user should be shown game or overview component by id: ${err}`);
		res.status(400).send({ showGame: false });
	}
});

/**
 * Update player for an open game
 *
 * @param {string} id Game ID
 * @param {string} playerPosition Can be either player1, player2, player3, player4
 * @param {int} player Player ID
 */
router.put('/open/:id', async (req, res) => {
	try {
		const result = await Game.updatePlayer(req.params.id, req.body.playerPosition, req.body.player);
		if (!result) {
			res.status(400).send({ error: 'Failed to update player for open game' });
		} else {
			res.end();
		}
	} catch (err) {
		console.error(`Error while performing PUT update players for open game: ${err}`);
		res.status(500).send({ error: 'Failed to update players for open game' });
	}
});

/* Fetch game state */
router.get('/state/:id', async (req, res) => {
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
		const state = {};
		state.leftReserveWhite = convertReserveToSparePieces(game.left_reserve_white);
		state.leftReserveBlack = convertReserveToSparePieces(game.left_reserve_black);
		state.rightReserveWhite = convertReserveToSparePieces(game.right_reserve_white);
		state.rightReserveBlack = convertReserveToSparePieces(game.right_reserve_black);
		state.moves = game.moves;
		state.leftFen = game.left_fen;
		state.rightFen = game.right_fen;
		res.json(state);
	} catch (err) {
		console.error(`Error while performing fetch game state: ${err}`);
		res.status(500).send({ error: 'Failed to fetch game state' });
	}
});

// TODO use authentication with router.use(authentication)
/* Check if pawn promotion is possible */
router.put('/validate/pawnpromotion/:id', async (req, res) => {
	if (req.body.source === 'spare' || req.body.piece.role.charAt(0).toLowerCase() !== 'p' || (req.body.target.charAt(1) !== '1' && req.body.target.charAt(1) !== '8')) { // Not a valid promotion
		res.json({ valid: false });
		return;
	}
	try {
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
			console.log('Move does not exist');
			res.json({ valid: false, fen: game.fen() });
		}
	} catch (err) {
		console.error(`Error while performing PUT validate pawn promotion: ${err}`);
		res.status(400).send({ error: 'Failed to validate pawn promotion' });
	}
});

module.exports = router;
