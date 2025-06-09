import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useTheme } from '../../context/theme';

import { ThemedText } from '../atoms/ThemedText';
import { ThemedView } from '../atoms/ThemedView';

interface SettingsModalProps {
	visible: boolean;
	onClose: ()=> void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
	const { theme, themeMode, setThemeMode } = useTheme();

	const themeOptions = [
		{ label: 'Tema do Sistema', value: 'system' },
		{ label: 'Tema Claro', value: 'light' },
		{ label: 'Tema Escuro', value: 'dark' },
	];

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={onClose}
		>
			<View style={styles.modalOverlay}>
				<ThemedView style={styles.modalContent}>
					<View style={styles.header}>
						<ThemedText style={styles.title}>Configurações</ThemedText>
						<TouchableOpacity onPress={onClose}>
							<Icon name='close' size={24} color={theme.colors.text} />
						</TouchableOpacity>
					</View>

					<View style={styles.section}>
						<ThemedText style={styles.sectionTitle}>Tema</ThemedText>
						{themeOptions.map((option) => (
							<TouchableOpacity
								key={option.value}
								style={[
									styles.themeOption,
									themeMode === option.value && styles.selectedTheme,
								]}
								onPress={() => {
									setThemeMode(option.value as 'light' | 'dark' | 'system');
									onClose();
								}}
							>
								<ThemedText
									style={[
										styles.themeOptionText,
										themeMode === option.value && styles.selectedThemeText,
									]}
								>
									{option.label}
								</ThemedText>
								{themeMode === option.value && (
									<Icon name='check' size={20} color={theme.colors.text} />
								)}
							</TouchableOpacity>
						))}
					</View>
				</ThemedView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalOverlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalContent: {
		width: '90%',
		maxWidth: 400,
		borderRadius: 10,
		padding: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	section: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 18,
		marginBottom: 10,
	},
	themeOption: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 15,
		borderRadius: 8,
		marginBottom: 8,
	},
	selectedTheme: {
		backgroundColor: '#A328D6',
	},
	themeOptionText: {
		fontSize: 16,
	},
	selectedThemeText: {
		color: 'white',
	},
});
