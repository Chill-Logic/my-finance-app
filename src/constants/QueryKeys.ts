enum MODELS {
	USER = 'user',
	transaction = 'transaction',
	wallet = 'wallet',
}

export const QUERY_KEYS = {
	[MODELS.transaction]: {
		get_all: 'get-all-transactions',
	},
	[MODELS.USER]: {
		get_current: 'get-current-user',
	},
	[MODELS.wallet]: {
		get_main: 'get-main-wallet',
	},
};
