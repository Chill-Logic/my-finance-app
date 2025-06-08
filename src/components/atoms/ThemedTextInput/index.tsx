import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';

interface ThemedTextInputProps extends TextInputProps {
  error?: string;
}

export const ThemedTextInput = ({ style, error, ...props }: ThemedTextInputProps) => {
  const { colors } = useTheme();

  return (
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
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
});
