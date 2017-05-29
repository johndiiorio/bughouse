import _ from 'lodash';
import * as gameActions from '../actions/game';

const defaultState = {
	game: {},
	userPosition: null,
	moves: [],
	reserves: {
		leftWhite: [],
		leftBlack: [],
		rightWhite: [],
		rightBlack: []
	},
	pieceToDragFromReserve: {}
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case gameActions.UPDATE_MOVES:
			return {
				...state,
				moves: _.cloneDeep(action.moves)
			};
		case gameActions.UPDATE_RESERVES:
			return {
				...state,
				reserves: {
					leftWhite: action.leftWhite,
					leftBlack: action.leftBlack,
					rightWhite: action.rightWhite,
					rightBlack: action.rightBlack
				}
			};
		case gameActions.UPDATE_PIECE_TO_DRAG_FROM_RESERVE: {
			return {
				...state,
				pieceToDragFromReserve: action.piece
			};
		}
		case gameActions.RECEIVE_GAME_INFO: {
			const game = action.data;
			const userID = action.userID;
			let userPosition;
			if (game.player1.id === userID) {
				userPosition = 1;
			} else if (game.player2.id === userID) {
				userPosition = 2;
			} else if (game.player3.id === userID) {
				userPosition = 3;
			} else {
				userPosition = 4;
			}
			return {
				...state,
				game,
				userPosition
			};
		}
		default:
			return state;
	}
}
