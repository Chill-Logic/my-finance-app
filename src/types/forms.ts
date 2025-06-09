import { TTransaction } from './models';

export type TNewTransactionForm = {
	type: TTransaction['type'];
	description: string;
	value: string;
};
