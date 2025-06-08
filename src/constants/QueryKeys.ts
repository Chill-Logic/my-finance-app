enum MODELS {
  USER = 'user',
  transaction = 'transaction',
}

export const QUERY_KEYS = {
  [MODELS.transaction]: {
    get_all: 'get-all-transactions',
  },
};
