import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SignInScreen from './src/screens/sign-in';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';

import HomeScreen from './src/screens/home';
import CurrentUserProvider from './src/context/current_user';
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
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignIn" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      <Toast />
      </CurrentUserProvider>
    </QueryClientProvider>
  );
}


export default App;
