import { useColorScheme } from 'react-native';

interface ThemeColors {
	text: string;
	background: string;
	border: string;
	placeholder: string;
	error: string;
}

interface Theme {
	colors: ThemeColors;
}

const lightTheme: Theme = {
	colors: {
		text: '#000000',
		background: '#FFFFFF',
		border: '#CCCCCC',
		placeholder: '#999999',
		error: '#FF0000',
	},
};

const darkTheme: Theme = {
	colors: {
		text: '#FFFFFF',
		background: '#121212',
		border: '#333333',
		placeholder: '#666666',
		error: '#FF4444',
	},
};

export const useTheme = (): Theme => {
	const colorScheme = useColorScheme();
	return colorScheme === 'dark' ? darkTheme : lightTheme;
};
