const MODULE_URL = 'private_chat';

export const CCPMEnum = {
	DISCONNECTED: 'disconnected',
	CONNECTING: 'connecting',
	CONNECTED: 'connected',
};

export default {
	MODULE_URL: MODULE_URL,
	SESSIONS_URL: MODULE_URL + '/sessions',
	SESSION_URL: MODULE_URL + '/session',

	SESSION_CREATED: 'private_chat_created',
	SESSION_REMOVED: 'private_chat_removed',
	SESSION_UPDATED: 'private_chat_updated',

	MESSAGE: 'private_chat_message',
	STATUS: 'private_chat_status',
};
