import * as gameActions from '../actions/game';

const defaultState = {
	game: {},
	moves: []
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case gameActions.UPDATE_MOVES:
			return {
				...state,
				moves: action.moves
			};
		case gameActions.RECEIVE_GAME_INFO:
			return {
				...state,
				game: action.data
			};
		default:
			return state;
	}
}
