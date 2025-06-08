import { useMutation } from '@tanstack/react-query';
import { getAxiosInstance } from '../useAxiosInstance';

interface SignUpBody {
  nome: string;
  email: string;
  senha: string;
}

interface SignUpResponse {
  message: string;
}

interface SignUpOptions {
  body: SignUpBody;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ body }: SignUpOptions) => {
      const axios = await getAxiosInstance();
      const response = await axios.post<SignUpResponse>('/sign-in', body);
      return response.data;
    },
  });
};
