import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export interface IScreenProps<T extends string> {
	navigation: NativeStackNavigationProp<any, T>;
}
