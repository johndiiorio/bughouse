import axios from 'axios';
import _ from 'lodash';

export const REQUEST_LEADERBOARD = 'REQUEST_LEADERBOARD';
export const RECEIVE_LEADERBOARD = 'RECEIVE_LEADERBOARD';

function requestLeaderboard() {
	return { type: REQUEST_LEADERBOARD };
}

function receiveLeaderboard(data) {
	return { type: RECEIVE_LEADERBOARD, data };
}

function shouldFetchLeaderboard(state) {
	return _.isEmpty(state.leaderboard.data) && !state.leaderboard.isFetching;
}

function fetchLeaderboard() {
	return dispatch => {
		dispatch(requestLeaderboard);
		return axios.get('/api/leaderboard').then(response => dispatch(receiveLeaderboard(response.data)));
	};
}

export function fetchLeaderboardIfNeeded() {
	return (dispatch, getState) => {
		if (shouldFetchLeaderboard(getState())) {
			return dispatch(fetchLeaderboard());
		}
		return Promise.resolve();
	};
}
