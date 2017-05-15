export const SEND_NOTIFICATION = 'SEND_NOTIFICATION';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
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
