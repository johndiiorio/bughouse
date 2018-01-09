export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const UPDATE_RESET_TOKEN = 'UPDATE_RESET_TOKEN';

/**
 * @param notification object containing { message, level, position, autoDismiss }
 * @returns {{type: string, notification: *}}
 */
export function sendNotification(notification) {
	return { type: SEND_NOTIFICATION, notification };
}

export function clearNotifications() {
	return { type: CLEAR_NOTIFICATIONS };
}

export function updateResetToken(resetToken) {
	return { type: UPDATE_RESET_TOKEN, resetToken };
}
