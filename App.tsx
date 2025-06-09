import React from 'react';
import Toast from 'react-native-toast-message';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CurrentUserProvider from './src/context/current_user';
import { ThemeProvider } from './src/context/theme';

import MainStack from './src/navigation';

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
			<ThemeProvider>
				<CurrentUserProvider>
					<MainStack />
					<Toast />
				</CurrentUserProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}

export default App;
