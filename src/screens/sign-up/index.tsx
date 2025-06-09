import React, { useState } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useSignUp } from '../../hooks/api/auth/useSignUp';

import { TSignUpBody } from '../../types/api';
import { IScreenProps } from '../../types/screen';

import { Loader } from '../../components/atoms/Loader';
import { ThemedText } from '../../components/atoms/ThemedText';
import { ThemedTextInput } from '../../components/atoms/ThemedTextInput';
import { ThemedView } from '../../components/atoms/ThemedView';
import ScreenLayout from '../../components/layouts/ScreenLayout';

const SignUpScreen = ({ navigation }: IScreenProps<'SignUp'>) => {
	const [ values, setValues ] = useState({ nome: '', email: '', senha: '' });
	const { mutate: signUpMutation, isPending: is_sign_up_pending } = useSignUp();

	const onChange = (key: string, value: string) => {
		setValues({ ...values, [key]: value });
	};

	const onSubmit = () => {
		const body: TSignUpBody = {
			nome: values.nome,
			email: values.email,
			senha: values.senha,
		};

		signUpMutation({
			body,
			onSuccess: (data) => {
				Toast.show({
					type: 'success',
					text1: 'Cadastro realizado com sucesso!',
				});
				navigation.replace('SignIn');
			},
			onError: (err) => {
				Toast.show({
					type: 'error',
					text1: 'Erro ao cadastrar usuário',
					text2: err?.message,
				});
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
					value={values.email}
					onChangeText={(value) => onChange('email', value)}
					editable={!is_sign_up_pending}
				/>
				<ThemedTextInput
					style={styles.input}
					placeholder='Senha'
					placeholderTextColor='#666'
					secureTextEntry
					autoComplete='password'
					value={values.senha}
					onChangeText={(value) => onChange('senha', value)}
					editable={!is_sign_up_pending}
				/>
				<TouchableOpacity
					style={[ styles.button, is_sign_up_pending && styles.buttonDisabled ]}
					onPress={onSubmit}
					disabled={is_sign_up_pending}
				>
					{is_sign_up_pending ? <Loader /> : <ThemedText style={styles.buttonText}>Entrar</ThemedText>}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.linkContainer}
					onPress={() => navigation.navigate('SignIn')}
				>
					<ThemedText style={styles.linkText}>Já possui uma conta? Faça login!</ThemedText>
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

export default SignUpScreen;
