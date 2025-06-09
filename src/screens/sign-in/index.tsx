import React, { useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { Alert } from 'react-native';

import { useSignIn } from '../../hooks/api/auth/useSignIn';

import { useCurrentUserContext } from '../../context/current_user';
import { LocalStorage } from '../../services/storage';

import { IScreenProps } from '../../types/screen';
import { StorageKeys } from '../../types/storage';

import { Loader } from '../../components/atoms/Loader';
import { ThemedText } from '../../components/atoms/ThemedText';
import { ThemedTextInput } from '../../components/atoms/ThemedTextInput';
import { ThemedView } from '../../components/atoms/ThemedView';
import ScreenLayout from '../../components/layouts/ScreenLayout';

const SignInScreen = ({ navigation }: IScreenProps<'SignIn'>) => {
	const { setCurrentUser } = useCurrentUserContext();

	const [ form, setForm ] = useState({ email: '', senha: '' });
	const { mutate: signInMutation, isPending: is_sign_in_pending } = useSignIn();

	const onChange = (key: string, value: string) => {
		setForm({ ...form, [key]: value });
	};

	const onSubmit = () => {
		const body = {
			email: form.email,
			senha: form.senha,
		};

		signInMutation({
			body,
			onSuccess: (data) => {
				LocalStorage.setItem(StorageKeys.TOKEN, data.token);
				setCurrentUser({ data });
				navigation.replace('Home');
			},
			onError: (err) => {
				console.log('err :>> ', err);
				Alert.alert('Erro', 'E-mail ou senha inválidos');
			},
		});
	};

	return (
		<ScreenLayout>
			<ThemedView style={styles.formContainer}>
				<ThemedTextInput
					style={styles.input}
					placeholder='E-mail'
					placeholderTextColor='#666'
					keyboardType='email-address'
					autoCapitalize='none'
					value={form.email}
					onChangeText={(value) => onChange('email', value)}
					editable={!is_sign_in_pending}
				/>
				<ThemedTextInput
					style={styles.input}
					placeholder='Senha'
					placeholderTextColor='#666'
					secureTextEntry
					autoComplete='password'
					value={form.senha}
					onChangeText={(value) => onChange('senha', value)}
					editable={!is_sign_in_pending}
				/>
				<TouchableOpacity
					style={[ styles.button, is_sign_in_pending && styles.buttonDisabled ]}
					onPress={onSubmit}
					disabled={is_sign_in_pending}
				>
					{is_sign_in_pending ? <Loader /> : <ThemedText style={styles.buttonText}>Entrar</ThemedText>}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.linkContainer}
				>
					<ThemedText style={styles.linkText}>Primeira vez? Cadastre-se!</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		</ScreenLayout>
	);
};

const styles = StyleSheet.create({
	formContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	input: {
		width: '100%',
		height: 48,
		backgroundColor: '#fff',
		borderRadius: 8,
		marginBottom: 16,
		paddingHorizontal: 16,
		fontSize: 16,
		color: '#000',
	},
	button: {
		width: '100%',
		height: 48,
		backgroundColor: '#A328D6',
		borderRadius: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonDisabled: {
		opacity: 0.7,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
	linkContainer: {
		marginTop: 30,
	},
	linkText: {
		color: '#fff',
		fontSize: 15,
		fontWeight: 'bold',
	},
});

export default SignInScreen;
