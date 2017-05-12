const express = require('express');
const Game = require('../models/Game');
const authentication = require('../services/authenticator');
const Bug = require('../services/bug');

const router = express.Router();

/* Get all games */
router.get('/', async (req, res) => {
	try {
		const rows = await Game.getAll();
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET all games: ${err}`);
		res.status(400).send({ error: 'Failed to get all games' });
	}
});

/* GET all open games */
router.get('/open', async (req, res) => {
	try {
		const rows = await Game.getAllOpen();
		res.json(rows);
	} catch (err) {
		console.error(`Error while performing GET all open games: ${err}`);
		res.status(400).send({ error: 'Failed to get all open games' });
	}
});

/* Get a single game */
router.get('/:id', async (req, res) => {
	try {
		const row = await Game.getByID(req.params.id);
		res.json(row);
	} catch (err) {
		console.error(`Error while performing GET game by id: ${err}`);
		res.status(400).send({ error: 'Failed to get game by id' });
	}
});

/* Update players for an open game */
router.put('/open/:id', async (req, res) => {
	try {
		await Game.updatePlayers(req.params.id, req.body.player1, req.body.player2, req.body.player3, req.body.player4);
		res.end();
	} catch (err) {
		console.error(`Error while performing PUT update players for open game: ${err}`);
		res.status(400).send({ error: 'Failed to update players for open game' });
	}
});

/* Start a game */
router.put('/start/:game_id', async (req, res) => {
	try {
		await Game.startGame(req.params.id);
		res.end();
	} catch (err) {
		console.error(`Error while performing PUT start game: ${err}`);
		res.status(400).send({ error: 'Failed to start game' });
	}
});

/* Create a new game */
router.post('/', async (req, res) => {
	try {
		const id = await Game.createGame(req.body.player1, req.body.player2, req.body.player3, req.body.player4, req.body.minutes, req.body.increment, req.body.ratingRange, req.body.mode, req.body.status, req.body.joinRandom);
		res.json({ id });
	} catch (err) {
		console.error(`Error while performing POST create new game: ${err}`);
		res.status(400).send({ error: 'Failed to create game' });
	}
});

// router.use(authentication);

/* Check if pawn promotion is possible */
router.put('/validate/pawnpromotion/:id', async (req, res) => {
	if (req.body.source === 'spare' || req.body.piece.charAt(1).toLowerCase() !== 'p' || (req.body.target.charAt(1) !== 1 && req.body.target.charAt(1) !== 8)) { // Not a valid promotion
		res.json({ valid: false });
		return;
	}
	try {
		const row = await Game.getByID(req.params.id);
		let game;
		if (req.body.fkNum === 1 || req.body.fkNum === 2) {
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
		console.error(`Error while performing PUT validate pawn promotion: ${err}`);
		res.status(400).send({ error: 'Failed to validate pawn promotion' });
	}
});

/* Update a game's moves */
router.put('/update/moves/:id', async (req, res) => {
	try {
		await Game.updateGameMoves(req.params.id, req.body.moves);
		res.end();
	} catch (err) {
		console.error(`Error while performing PUT update game's moves: ${err}`);
		res.status(400).send({ error: 'Failed to update moves' });
	}
});

/* Update a game's reserve */
router.put('/update/reserve/:id', async (req, res) => {
	try {
		await Game.updateGameReserve(req.params.id, req.body.reserve, req.body.pieces);
		res.end();
	} catch (err) {
		console.error(`Error while performing PUT update game's reserve: ${err}`);
		res.status(400).send({ error: 'Failed to update reserve' });
	}
});

module.exports = router;
