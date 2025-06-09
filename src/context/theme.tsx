import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextData {
	theme: Theme;
	themeMode: ThemeMode;
	setThemeMode: (mode: ThemeMode)=> Promise<void>;
}

interface Theme {
	colors: {
		text: string;
		background: string;
		border: string;
		placeholder: string;
		error: string;
	};
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

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const systemColorScheme = useColorScheme();
	const [ themeMode, setThemeModeState ] = useState<ThemeMode>('system');

	useEffect(() => {
		loadThemeMode();
	}, []);

	const loadThemeMode = async() => {
		try {
			const savedThemeMode = await AsyncStorage.getItem('@theme_mode');
			if (savedThemeMode) {
				setThemeModeState(savedThemeMode as ThemeMode);
			}
		} catch (error) {
			console.error('Erro ao carregar tema:', error);
		}
	};

	const setThemeMode = async(mode: ThemeMode) => {
		try {
			await AsyncStorage.setItem('@theme_mode', mode);
			setThemeModeState(mode);
		} catch (error) {
			console.error('Erro ao salvar tema:', error);
		}
	};

	const theme = React.useMemo(() => {
		if (themeMode === 'system') {
			return systemColorScheme === 'dark' ? darkTheme : lightTheme;
		}
		return themeMode === 'dark' ? darkTheme : lightTheme;
	}, [ themeMode, systemColorScheme ]);

	return (
		<ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
	}
	return context;
};
