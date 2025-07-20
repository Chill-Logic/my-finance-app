import { TTransaction } from './models';

export type TNewTransactionForm = {
	kind: TTransaction['kind'];
	description: string;
	value: string;
};

export type TSignUpForm = {
	nome: string;
	email: string;
	senha: string;
	confirmar_senha: string;
}
