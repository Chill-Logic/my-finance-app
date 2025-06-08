import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../../../constants/QueryKeys';
import { getAxiosInstance } from '../../useAxiosInstance';
import { type TListTransactionsResponse } from '../../../../types/api';

const useListTransactions = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.transaction.get_all],
    queryFn: async () => {
      const axios = await getAxiosInstance();
      const response = await axios.get<TListTransactionsResponse>('/transactions');
      return response.data;
    },
  });
};

export default useListTransactions;
