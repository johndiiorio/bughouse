import * as lobbyActions from '../actions/lobby';

const defaultState = {
	gameID: null
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case lobbyActions.RECEIVE_CREATE_GAME:
			return {
				...state,
				gameID: action.data.id
			};
		default:
			return state;
	}
}
