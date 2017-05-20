import * as gameActions from '../actions/game';

const defaultState = {
	moves: []
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case gameActions.UPDATE_MOVES:
			return {
				...state,
				moves: action.moves
			};
		default:
			return state;
	}
}
