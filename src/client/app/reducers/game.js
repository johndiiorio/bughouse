import _ from 'lodash';
import * as gameActions from '../actions/game';

const defaultState = {
	game: {},
	userPosition: null,
	moves: [],
	clocks: [],
	reserves: {
		leftWhite: [],
		leftBlack: [],
		rightWhite: [],
		rightBlack: []
	},
	pieceToDragFromReserve: {},
	displayResignChoice: false,
	displayDrawChoice: false
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case gameActions.UPDATE_MOVES:
			return {
				...state,
				moves: _.cloneDeep(action.moves)
			};
		case gameActions.UPDATE_CLOCKS:
			return {
				...state,
				clocks: action.clocks
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
		case gameActions.UPDATE_DISPLAY_RESIGN_CHOICE: {
			return {
				...state,
				displayResignChoice: action.display
			};
		}
		case gameActions.UPDATE_DISPLAY_DRAW_CHOICE: {
			return {
				...state,
				displayDrawChoice: action.display
			};
		}
		case gameActions.RECEIVE_GAME_INFO: {
			return {
				...state,
				game: action.data,
				userPosition: action.userPosition
			};
		}
		default:
			return state;
	}
}
