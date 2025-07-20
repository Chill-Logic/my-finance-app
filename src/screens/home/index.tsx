import { useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

import { useListTransactions } from '../../hooks/api/transactions/useListTransactions';

import { TTransaction } from '../../types/models';
import { IScreenProps } from '../../types/screen';

import { ThemedText } from '../../components/atoms/ThemedText';
import { ThemedView } from '../../components/atoms/ThemedView';
import AuthenticatedLayout from '../../components/layouts/AuthenticatedLayout';
import { TransactionFormModal } from '../../components/organisms/TransactionFormModal';
import TransactionsList from '../../components/organisms/TransactionList';

const HomeScreen = ({ navigation }: IScreenProps<'Home'>) => {
	const { data: data_transactions, isLoading: is_data_transactions_loading } = useListTransactions();

	const [ transaction, setTransaction ] = useState<TTransaction | null>(null);
	const [ is_modal_visible, setIsModalVisible ] = useState(false);

	const is_loading = is_data_transactions_loading;

	return (
		<AuthenticatedLayout navigation={navigation}>
			<ThemedView style={styles.container}>
				<ThemedView
					style={[
						styles.transactionsContainer,
						data_transactions?.transactions?.length
							? styles.transactionsContainerWithData
							: styles.transactionsContainerEmpty,
					]}
				>
					{is_loading && (
						<ThemedText>Carregando...</ThemedText>
					)}

					{!is_loading && (
						<TransactionsList
							data_transactions={data_transactions}
							onClickTransaction={(editable_transaction) => {
								setTransaction(editable_transaction);
								setIsModalVisible(true);
							}}
						/>
					)}
				</ThemedView>

				<ThemedView style={styles.buttonsContainer}>
					<TouchableOpacity
						style={styles.actionButton}
						onPress={() => {
							setTransaction(null);
							setIsModalVisible(true);
						}}
					>
						<ThemedText style={styles.actionButtonText}>
              Novo Registro
						</ThemedText>
					</TouchableOpacity>
				</ThemedView>

				<TransactionFormModal
					visible={is_modal_visible}
					onClose={() => {
						setIsModalVisible(false);
						setTransaction(null);
					}}
					transaction={transaction}
				/>

			</ThemedView>
		</AuthenticatedLayout>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	transactionsContainer: {
		flex: 1,
		borderRadius: 5,
	},
	transactionsContainerWithData: {
		justifyContent: 'space-between',
		alignItems: 'stretch',
	},
	transactionsContainerEmpty: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonsContainer: {
		flexDirection: 'row',
		gap: 15,
		marginTop: 15,
	},
	actionButton: {
		flex: 1,
		height: 50,
		backgroundColor: '#A328D6',
		borderRadius: 5,
		justifyContent: 'center',
		alignItems: 'center',
	},
	actionButtonText: {
		color: 'white',
		fontSize: 18,
	},
});

export default HomeScreen;
