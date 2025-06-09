import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';

import { useCreateTransactions } from '../../../hooks/api/transactions/useCreateTransactions';
import { useUpdateTransactions } from '../../../hooks/api/transactions/useUpdateTransactions';

import { formatMoney, unformatMoney } from '../../../utils/formatMoney';

import { TNewTransactionForm } from '../../../types/forms';
import { TTransaction } from '../../../types/models';

import { Loader } from '../../atoms/Loader';
import SelectInput from '../../atoms/SelectInput';
import { ThemedText } from '../../atoms/ThemedText';
import { ThemedTextInput } from '../../atoms/ThemedTextInput';
import { ThemedView } from '../../atoms/ThemedView';

interface TransactionModalProps {
	visible: boolean;
	onClose: ()=> void;
	transaction?: TTransaction | null;
}

export const TransactionFormModal = (props: TransactionModalProps) => {
	const { visible, onClose, transaction } = props;

	const { mutate: createTransactionMutation, isPending: is_create_transaction_pending } = useCreateTransactions();
	const { mutate: updateTransactionMutation, isPending: is_update_transaction_pending } = useUpdateTransactions();
	const [ values, setValues ] = useState<TNewTransactionForm>({
		type: 'deposit',
		description: '',
		value: '',
	});

	const handleClose = () => {
		setValues({
			type: 'deposit',
			description: '',
			value: '',
		});
		onClose();
	};

	const handleSave = () => {
		const value = Number(unformatMoney(values.value)) / 100;

		if(transaction){
			updateTransactionMutation({
				body: {
					type: values.type,
					description: values.description,
					value,
				},
				id: transaction.transactionID,
				onSuccess: () => {
					Toast.show({
						type: 'success',
						text1: 'Transação atualizada!',
						text2: 'Sua transação foi atualizada com sucesso',
					});
					handleClose();
				},
				onError: () => {
					Toast.show({
						type: 'error',
						text1: 'Erro ao atualizar transação!',
						text2: 'Ocorreu um erro ao atualizar a transação',
					});
				},
			});

		} else {
			createTransactionMutation({
				body: {
					type: values.type,
					description: values.description,
					value,
				},
				onSuccess: () => {
					Toast.show({
						type: 'success',
						text1: 'Transação criada!',
						text2: 'Sua transação foi criada com sucesso',
					});
					handleClose();
				},
				onError: () => {
					Toast.show({
						type: 'error',
						text1: 'Erro ao criar transação!',
						text2: 'Ocorreu um erro ao criar a transação',
					});
				},
			});
		}
	};

	const is_submit_disabled = is_create_transaction_pending  || is_update_transaction_pending || !values.value || !values.description || !values.type;

	useEffect(() => {
		if (transaction) {
			setValues({
				type: transaction.type,
				description: transaction.description,
				value: formatMoney((transaction.value * 100).toString()),
			});
		}
	}, [ transaction ]);

	return (
		<Modal
			visible={visible}
			transparent
			animationType='slide'
			onRequestClose={handleClose}
		>
			<ThemedView style={styles.modalOverlay}>
				<ThemedView style={styles.modalContent}>
					<ThemedText style={styles.title}>{transaction ? `Editar ${ transaction.type === 'deposit' ? 'Entrada' : 'Saída' }` : 'Nova Transação'}</ThemedText>

					<ThemedView style={styles.formGroup}>
						<SelectInput
							label='Tipo'
							options={[
								{ label: 'Entrada', value: 'deposit' },
								{ label: 'Saída', value: 'spent' } ]}
							value={values.type}
							onChange={(value) => setValues({ ...values, type: value as TTransaction['type'] })}
						/>
					</ThemedView>

					<ThemedView style={styles.formGroup}>
						<ThemedTextInput
							label='Descrição'
							value={values.description}
							onChangeText={(text) => setValues({ ...values, description: text })}
							placeholder='Digite a descrição'
						/>
					</ThemedView>

					<ThemedView style={styles.formGroup}>
						<ThemedTextInput
							label='Valor'
							value={values.value}
							onChangeText={(text) => {
								const formattedValue = formatMoney(text);
								setValues({ ...values, value: formattedValue });
							}}
							placeholder='R$ 0,00'
							keyboardType='numeric'
						/>
					</ThemedView>

					<ThemedView style={styles.buttonContainer}>
						<TouchableOpacity disabled={(is_create_transaction_pending || is_update_transaction_pending )} style={[ styles.button, styles.cancelButton ]} onPress={handleClose}>
							<ThemedText style={styles.buttonText}>Cancelar</ThemedText>
						</TouchableOpacity>
						<TouchableOpacity disabled={is_submit_disabled} style={[ styles.button, is_submit_disabled ? styles.saveButtonDisabled : styles.saveButton ]} onPress={handleSave}>
							<ThemedText style={styles.buttonText}>{(is_create_transaction_pending || is_update_transaction_pending ) ? <Loader /> : 'Salvar'}</ThemedText>
						</TouchableOpacity>
					</ThemedView>
				</ThemedView>
			</ThemedView>
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
		padding: 20,
		borderRadius: 10,
		elevation: 5,
	},
	title: {
		fontSize: 24,
		marginBottom: 20,
		textAlign: 'center',
	},
	formGroup: {
		marginBottom: 15,
	},
	pickerContainer: {
		borderWidth: 1,
		borderColor: '#ccc',
		borderRadius: 5,
		marginTop: 5,
	},
	picker: {
		height: 50,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 20,
	},
	button: {
		flex: 1,
		padding: 15,
		borderRadius: 5,
		marginHorizontal: 5,
	},
	cancelButton: {
		backgroundColor: '#f16f6f',
	},
	saveButton: {
		backgroundColor: '#A328D6',
	},
	buttonText: {
		color: 'white',
		textAlign: 'center',
		fontSize: 16,
	},
	saveButtonDisabled: {
		backgroundColor: '#ccc',
	},
});
