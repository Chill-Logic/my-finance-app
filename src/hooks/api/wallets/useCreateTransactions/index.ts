import { useMutation } from '@tanstack/react-query';

import { TMutationParams, TListTransactionsResponse } from '../../../../types/api';
import { TTransaction } from '../../../../types/models';

import { queryClient } from '../../../../../App';
import { QUERY_KEYS } from '../../../../constants/QueryKeys';
import { getAxiosInstance } from '../../useAxiosInstance';

export const useCreateTransactions = () => {
	return useMutation({
		mutationFn: async({ body }: TMutationParams<TListTransactionsResponse, Pick<TTransaction, 'kind' | 'description' | 'value'>>) => {
			const axios = await getAxiosInstance();
			const response = await axios.post<TListTransactionsResponse>('/transactions', body);
			return response.data;
		},
		onSuccess: (data, { onSuccess }) => {
			queryClient.invalidateQueries({ queryKey: [ QUERY_KEYS.transaction.get_all ] });
			onSuccess?.(data);
		},
		onError: (error, { onError }) => {
			onError?.(error);
		},
	});
};
