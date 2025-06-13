import { createContext, useContext, useState, useCallback } from 'react';
import { RefreshControlProps } from 'react-native';

import { queryClient } from '../../App';
import { useCurrentUserContext } from './current_user';

interface RefreshContextData {
	isRefreshing: boolean;
	refresh: (queryKeys?: string[])=> Promise<void>;
	refreshControlProps: RefreshControlProps;
}

const RefreshContext = createContext<RefreshContextData>({} as RefreshContextData);

export const RefreshProvider = ({ children }: { children: React.ReactNode }) => {
	const [ isRefreshing, setIsRefreshing ] = useState(false);
	const { current_user } = useCurrentUserContext();

	const refresh = useCallback(async(queryKeys?: string[]) => {
		if (!current_user.data) {return;}

		setIsRefreshing(true);
		try {
			if (queryKeys && queryKeys.length > 0) {
				await Promise.all(
					queryKeys.map(key => queryClient.invalidateQueries({ queryKey: [ key ] })),
				);
			} else {
				await queryClient.clear();
			}
		} catch (error) {
			console.error('Erro ao atualizar dados:', error);
		} finally {
			setIsRefreshing(false);
		}
	}, [ current_user.data ]);

	const refreshControlProps: RefreshControlProps = {
		refreshing: isRefreshing,
		onRefresh: () => refresh(),
		colors: [ '#9Bd35A', '#689F38' ],
		tintColor: '#689F38',
	};

	return (
		<RefreshContext.Provider value={{
			isRefreshing,
			refresh,
			refreshControlProps,
		}}>
			{children}
		</RefreshContext.Provider>
	);
};

export const useRefresh = () => {
	const context = useContext(RefreshContext);
	if (!context) {
		throw new Error('useRefresh deve ser usado dentro de um RefreshProvider');
	}
	return context;
};

export default RefreshProvider;
