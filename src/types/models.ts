type TModelFields = {
	id: string;
	created_at: string;
	updated_at: string;
};

export type TUser = TModelFields & {
	name: string;
	email: string;
};

export type TTransaction = {
	date: string;
	description: string;
	transactionID: string;
	type: 'deposit' | 'spent';
	value: number;
};
