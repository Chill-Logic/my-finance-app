import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import CurrentUserProvider from './src/context/current_user';
import RefreshProvider from './src/context/refresh';
import { ThemeProvider } from './src/context/theme';
import WalletUserProvider from './src/context/wallet';

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
		<SafeAreaProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<CurrentUserProvider>
						<RefreshProvider>
							<WalletUserProvider>
								<MainStack />
								<Toast />
							</WalletUserProvider>
						</RefreshProvider>
					</CurrentUserProvider>
				</ThemeProvider>
			</QueryClientProvider>
		</SafeAreaProvider>
	);
}

export default App;
