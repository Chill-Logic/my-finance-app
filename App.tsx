import React from 'react';
import Toast from 'react-native-toast-message';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CurrentUserProvider from './src/context/current_user';

import MainStack from './src/navigation';

const Stack = createNativeStackNavigator();
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
		},
	},
});

function App(): React.JSX.Element {

	return (
		<QueryClientProvider client={queryClient}>
			<CurrentUserProvider>
				<MainStack />
				<Toast />
			</CurrentUserProvider>
		</QueryClientProvider>
	);
}

export default App;
