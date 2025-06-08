import { useMutation } from '@tanstack/react-query';
import { getAxiosInstance } from '../useAxiosInstance';

type TBody = {
  email: string;
  senha: string;
};

type TMutationParams = {
  body: TBody;
  onSuccess?: (data: TSignInResponse) => void;
  onError?: (error?: Error) => void;
};

type TSignInResponse = {
  email: string;
  nome: string;
  token: string;
  _id: string;
};

export const useSignIn = () => {
  return useMutation({
    mutationFn: async ({ body }: TMutationParams) => {
      const axios = await getAxiosInstance();
      const response = await axios.post<TSignInResponse>('/sign-in', body);
      return response.data;
    },
    onSuccess: (data, { onSuccess }) => {
      console.log('data :>> ', data);
      onSuccess?.(data);
    },
    onError: (error, { onError }) => {
      onError?.(error);
    },
  });
};
