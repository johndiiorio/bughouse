export const UPDATE_CURRENT_USER = 'UPDATE_CURRENT_USER';

export function updateCurrentUser(user) {
	return { type: UPDATE_CURRENT_USER, user };
}
