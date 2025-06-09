
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { TStackParam } from '../types/screen';

import HomeScreen from '../screens/home';
import AUTH_SCREENS from './auth';

const SCREENS: TStackParam[] = [
	{ name: 'Home', component: HomeScreen },
	...AUTH_SCREENS,
];

const Stack = createNativeStackNavigator();

const MainStack = () => {
	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName='SignIn' screenOptions={{ headerShown: false }}>
				{SCREENS.map((screen) => (
					<Stack.Screen
						key={screen.name}
						name={screen.name}
						component={screen.component}
					/>
				))}
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default MainStack;
