export type TUser = {
	nome: string;
	email: string;
	_id: string;
};

export type TTransaction = {
	date: string;
	description: string;
	transactionID: string;
	type: 'deposit' | 'spent';
	value: number;
};
