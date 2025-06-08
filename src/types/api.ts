import { IUser } from './models';

export type TSignInResponse = IUser & {
  token: string;
};


export type SignUpResponse = {
  message: string;
}

export type TSignInBody = {
  email: string;
  senha: string;
};

export type TMutationParams<TResponse, TBody> = {
  body: TBody;
  onSuccess?: (data: TResponse) => void;
  onError?: (error?: Error) => void;
};


export type SignUpBody = {
  nome: string;
  email: string;
  senha: string;
}
