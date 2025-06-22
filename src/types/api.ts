import { TUser, TTransaction } from './models';

export type TSignInResponse = TUser & {
	token: string;
};

export type TSignUpResponse = {
	message: string;
}

export type TListTransactionsResponse = {
	total: number;
	transactions: TTransaction[];
};

export type TSignInBody = {
	email: string;
	password: string;
};

export type TMutationParams<TResponse, TBody, TComplements = {}> = {
	id?: string | number;
	body?: TBody;
	onSuccess?: (data: TResponse)=> void;
	onError?: (error?: Error)=> void;
} & TComplements;

export type TSignUpBody = {
	name: string;
	email: string;
	password: string;
}
