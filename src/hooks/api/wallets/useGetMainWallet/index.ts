import { useQuery } from '@tanstack/react-query';

import { TGetMainWalletResponse } from '../../../../types/api';

import { QUERY_KEYS } from '../../../../constants/QueryKeys';
import { getAxiosInstance } from '../../useAxiosInstance';

type TUseGetMainWalletParams = {
	enabled?: boolean;
}

export const useGetMainWallet = ({ enabled = false }: TUseGetMainWalletParams) => {
	return useQuery({
		queryKey: [ QUERY_KEYS.wallet.get_main ],
		queryFn: async() => {
			const axios = await getAxiosInstance();
			const response = await axios.get<TGetMainWalletResponse>('/wallets/main');
			return response.data;
		},
		enabled,
	});
};
