import axios from 'axios';
import _ from 'lodash';

export const REQUEST_LEADER_BOARD = 'REQUEST_LEADER_BOARD';
export const RECEIVE_LEADER_BOARD = 'RECEIVE_LEADER_BOARD';

function requestLeaderBoard() {
	return { type: REQUEST_LEADER_BOARD };
}

function receiveLeaderBoard(data) {
	return { type: RECEIVE_LEADER_BOARD, data };
}

function shouldFetchLeaderBoard(state) {
	return _.isEmpty(state.leaderboard.data) && !state.leaderboard.isFetching;
}

export function fetchLeaderBoardIfNeeded() {
	return (getState, dispatch) => {
		if (shouldFetchLeaderBoard(getState())) {
			dispatch(requestLeaderBoard);
			axios.get('/api/leaderboard').then(response => dispatch(receiveLeaderBoard(response.data)));
		}
	};
}
