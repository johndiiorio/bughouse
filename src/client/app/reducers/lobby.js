import * as lobbyActions from '../actions/lobby';

const defaultState = {
	displayedGames: [],
	selectedGame: {},
	modalDisplayedGame: {},
	modalDisplay: false,
	userWaitingForGameToStart: false
};

export default function lobby(state = defaultState, action) {
	switch (action.type) {
		case lobbyActions.UPDATE_SELECTED_GAME:
			return {
				...state,
				selectedGame: action.game
			};
		case lobbyActions.CLEAR_SELECTED_GAME:
			return {
				...state,
				selectedGame: {}
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
		case lobbyActions.TOGGLE_USER_WAITING_FOR_GAME_TO_START:
			return {
				...state,
				userWaitingForGameToStart: !state.userWaitingForGameToStart
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
