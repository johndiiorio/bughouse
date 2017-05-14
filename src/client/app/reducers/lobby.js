import * as lobbyActions from '../actions/lobby';

const defaultState = {
	displayedGames: [],
	selectedGame: {},
	modalDisplayedGame: {},
	modalDisplay: false
};

export default function user(state = defaultState, action) {
	switch (action.type) {
		case lobbyActions.UPDATE_SELECTED_GAME:
			return {
				...state,
				selectedGame: action.game
			};
		case lobbyActions.UPDATE_MODAL_DISPLAYED_GAME:
			return {
				...state,
				modalDisplayedGame: action.game
			};
		case lobbyActions.TOGGLE_MODAL_DISPLAY:
			return {
				...state,
				modalDisplay: !state.modalDisplay
			};
		case lobbyActions.RECEIVE_GAMES_INFO:
			return {
				...state,
				displayedGames: action.data
			};
		default:
			return state;
	}
}
