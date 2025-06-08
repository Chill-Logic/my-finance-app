import { useMutation } from '@tanstack/react-query';
import { getAxiosInstance } from '../../useAxiosInstance';

import {
  type TMutationParams,
  type SignUpBody,
  type SignUpResponse,
} from '../../../../types/api';

export const useSignUp = () => {
  return useMutation({
    mutationFn: async ({ body }: TMutationParams<SignUpResponse, SignUpBody>) => {
      const axios = await getAxiosInstance();
      const response = await axios.post<SignUpResponse>('/sign-up', body);
      return response.data;
    },
    onSuccess: (data, { onSuccess }) => {
      onSuccess?.(data);
    },
    onError: (error, { onError }) => {
      onError?.(error);
    },
  });
};
