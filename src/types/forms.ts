import { TTransaction } from './models';

export type TNewTransactionForm = {
	type: TTransaction['type'];
	description: string;
	value: string;
};

export type TSignUpForm = {
	nome: string;
	email: string;
	senha: string;
	confirmar_senha: string;
}
