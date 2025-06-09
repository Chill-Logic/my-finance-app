import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';

import { useTheme } from '../../../hooks/useTheme';

import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

interface ThemedTextInputProps extends TextInputProps {
	error?: string;
	label?: string;
}

export const ThemedTextInput = ({ style, error, label, ...props }: ThemedTextInputProps) => {
	const { colors } = useTheme();

	return (
		<ThemedView style={styles.container}>
			{label && <ThemedText>{label}</ThemedText>}
			<TextInput
				style={[
					styles.input,
					{
						color: colors.text,
						borderColor: error ? colors.error : colors.border,
						backgroundColor: colors.background,
					},
					style,
				]}
				placeholderTextColor={colors.placeholder}
				{...props}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 5,
		width: '100%',
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderRadius: 5,
		padding: 10,
		marginTop: 5,
	},
});
