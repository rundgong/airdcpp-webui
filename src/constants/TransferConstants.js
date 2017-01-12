const MODULE_URL = 'transfers';

export const StatusEnum = {
	WAITING: 'waiting',
	RUNNING: 'running',
	FAILED: 'failed',
	FINISHED: 'finished',
};

export default {
	MODULE_URL: MODULE_URL,
	TRANSFER_URL: MODULE_URL + '/transfer',
	
	TRANSFERRED_BYTES_URL: MODULE_URL + '/tranferred_bytes',
	STATISTICS_URL: MODULE_URL + '/stats',

	STATISTICS: 'transfer_statistics'
};
