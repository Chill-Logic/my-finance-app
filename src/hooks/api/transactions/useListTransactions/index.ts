import { useQuery } from '@tanstack/react-query';

import { type TListTransactionsResponse } from '../../../../types/api';

import { QUERY_KEYS } from '../../../../constants/QueryKeys';
import { getAxiosInstance } from '../../useAxiosInstance';

type TUseListTransactionsProps = {
	enabled?: boolean;
	params?: {
		wallet_id: string;
	};
}

export const useListTransactions = (props?: TUseListTransactionsProps) => {
	const { enabled = true, params } = props || {};

	return useQuery({
		queryKey: [ QUERY_KEYS.transaction.get_all, params?.wallet_id ],
		queryFn: async() => {
			const axios = await getAxiosInstance();
			const response = await axios.get<TListTransactionsResponse>('/transactions', {
				params,
			});
			return response.data;
		},
		enabled,
	});
};
