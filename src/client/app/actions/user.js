import axios from 'axios';

export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';
export const REQUEST_PROFILE_USER = 'REQUEST_PROFILE_USER';
export const RECEIVE_PROFILE_USER = 'RECEIVE_PROFILE_USER';

export function updateCurrentUser(user) {
	return { type: UPDATE_CURRENT_USER, user };
}

export function requestProfileUser() {
	return { type: REQUEST_PROFILE_USER };
}

export function receiveProfileUser(user) {
	return { type: RECEIVE_PROFILE_USER, user };
}

function shouldFetchProfileUser(state, username) {
	return !state.user.profileUsers[username] && !state.user.profileUserFetching;
}

export function fetchProfileUser(username) {
	return dispatch => {
		dispatch(requestProfileUser());
		return axios.get(`/api/users/profile/${username}`).then(response => dispatch(receiveProfileUser(response.data)));
	};
}

export function fetchProfileUserIfNeeded(username) {
	return (dispatch, getState) => {
		if (shouldFetchProfileUser(getState(), username)) {
			return dispatch(fetchProfileUser(username));
		}
		return Promise.resolve();
	};
}
