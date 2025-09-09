import { Fragment, useState, useCallback } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import moment from 'moment';

import { useDeleteTransactions } from '../../../hooks/api/transactions/useDeleteTransactions';
import { useListTransactions } from '../../../hooks/api/transactions/useListTransactions';

import { useRefresh } from '../../../context/refresh';
import { useWallet } from '../../../context/wallet';
import { DateUtils } from '../../../utils/date';
import { MoneyUtils } from '../../../utils/money';
import { TextUtils } from '../../../utils/text';

import { TTransaction } from '../../../types/models';

import MonthYearSelector from '../../atoms/MonthYearSelector';
import Skeleton from '../../atoms/Skeleton';
import { ThemedText } from '../../atoms/ThemedText';
import { ThemedView } from '../../atoms/ThemedView';

import { QUERY_KEYS } from '../../../constants/QueryKeys';
import { TransactionFormModal } from '../TransactionFormModal';

const getBalanceColor = (value: number) => (
	value >= 0 ? styles.textGreen : styles.textRed
);

type TDateParams = {
	start_date: string;
	end_date: string;
};

const TransactionsList = () => {
	const { user_wallet } = useWallet();

	const [ date_params, setDateParams ] = useState<TDateParams | null>(null);

	const { data: data_transactions, isLoading: is_data_transactions_loading } = useListTransactions({
		params: {
			wallet_id: user_wallet.data?.id || '',
			...(date_params && {
				start_date: date_params.start_date,
				end_date: date_params.end_date,
			}),
		},
	});
	console.log('date_params :>> ', date_params);

	const handleDateChange = useCallback((month: number, year: number) => {
		setDateParams({
			start_date: moment(new Date(year, month, 1)).startOf('day').toISOString(),
			end_date: moment(new Date(year, month + 1, 0)).endOf('day').toISOString(),
		});
	}, []);

	const [ transaction, setTransaction ] = useState<TTransaction | null>(null);
	const [ is_modal_visible, setIsModalVisible ] = useState(false);

	const { refreshControlProps } = useRefresh({
		keys: [
			QUERY_KEYS.transaction.get_all,
		],
	});

	const { mutate: deleteTransaction } = useDeleteTransactions();

	const handleDeleteTransaction = () => {
		setTimeout(() => {
			Alert.alert(
				'Excluir Transação',
				'Deseja excluir esta transação?',
				[
					{
						text: 'Cancelar',
						style: 'cancel',
					},
					{
						text: 'Excluir',
						onPress: () => {
							if(!transaction){
								return;
							}

							deleteTransaction({
								id: transaction.id,
								onSuccess: () => {
									Toast.show({
										type: 'success',
										text1: 'Transação excluída com sucesso',
										text2: `A transação ${ transaction.description } foi excluída com sucesso`,
									});
								},
								onError: () => {
									Toast.show({
										type: 'error',
										text1: 'Erro ao excluir transação',
										text2: `Não foi possível excluir a transação ${ transaction.description }`,
									});
								},
							});
						},
					},
				],
			);
		}, 100);
	};

	const getTransactionColor = (type: string) => (
		type === 'deposit' ? styles.textGreen : styles.textRed
	);

	const renderTransactionItem = ({ item: transaction_item }: { item: TTransaction }) => (
		<TouchableOpacity
			style={styles.transactionItem}
			onPress={() => setTransaction(transaction_item)}
		>
			<ThemedView>
				<ThemedText style={styles.transactionDescription}>{TextUtils.truncate({ text: transaction_item.description, maxLength: 35 })}</ThemedText>
				<ThemedText style={styles.transactionDate}>{DateUtils.formatDate(transaction_item.transaction_date)}</ThemedText>
			</ThemedView>
			<ThemedView style={styles.transactionRight}>
				<ThemedText
					style={[
						styles.transactionValue,
						getTransactionColor(transaction_item.kind),
					]}
				>
					{MoneyUtils.formatMoney(transaction_item.value)}
				</ThemedText>
				<TouchableOpacity onPress={() => handleDeleteTransaction()}>
					<ThemedText style={styles.transactionDelete}>
						Excluir
					</ThemedText>
				</TouchableOpacity>
			</ThemedView>
		</TouchableOpacity>
	);

	const renderSeparator = () => (
		<ThemedView style={styles.transactionSeparator} />
	);

	return (
		<ThemedView
			style={styles.transactionsContainer}
		>
			<MonthYearSelector onChange={handleDateChange} />

			{is_data_transactions_loading && (
				<FlatList
					data={new Array(10).fill(null).map((_, index) => ({ id: `${ index }` }))}
					renderItem={() => <Skeleton height={50} />}
					keyExtractor={(item) => item.id}
					style={styles.transactionsList}
					showsVerticalScrollIndicator={false}
					removeClippedSubviews={true}
					windowSize={1}
					initialNumToRender={1}
					ItemSeparatorComponent={renderSeparator}
				/>
			)}

			{!is_data_transactions_loading && (
				<>
					{data_transactions?.transactions && data_transactions?.transactions.length > 0 ? (
						<Fragment>
							<FlatList
								data={data_transactions.transactions}
								renderItem={renderTransactionItem}
								keyExtractor={(item) => item.id}
								style={styles.transactionsList}
								refreshControl={<RefreshControl {...refreshControlProps} />}
								showsVerticalScrollIndicator={false}
								removeClippedSubviews={true}
								maxToRenderPerBatch={10}
								windowSize={10}
								initialNumToRender={10}
								ItemSeparatorComponent={renderSeparator}
							/>
						</Fragment>
					) : (
						<ThemedView style={styles.emptyContainer}>
							<ThemedText style={styles.emptyMessage}>
								Não há registros de entrada ou saída
							</ThemedText>
						</ThemedView>
					)}
				</>
			)}

			<ThemedView style={styles.balanceContainer}>
				{is_data_transactions_loading && <Skeleton height={50} />}
				{!is_data_transactions_loading && (
					<Fragment>
						<ThemedText style={styles.balanceLabel}>Saldo</ThemedText>
						<ThemedText style={getBalanceColor(Number(data_transactions?.total))}>
							{MoneyUtils.formatMoney(Number(data_transactions?.total))}
						</ThemedText>
					</Fragment>
				)}
			</ThemedView>

			<ThemedView style={styles.buttonsContainer}>
				<TouchableOpacity
					style={styles.actionButton}
					disabled={is_data_transactions_loading || !user_wallet.data?.id || data_transactions?.transactions?.length === 0}
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
	);
};

const styles = StyleSheet.create({
	transactionsList: {
		maxHeight: '95%',
		marginTop: 24,
	},
	transactionsContainer: {
		flex: 1,
		borderRadius: 5,
		justifyContent: 'space-between',
		alignItems: 'stretch',
	},
	transactionItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 12,
		borderRadius: 10,
		backgroundColor: '#121214',
	},
	transactionDate: {
		color: '#C6C6C6',
		marginRight: 10,
		backgroundColor: '#121214',
	},
	transactionDescription: {
		fontWeight: 'bold',
		backgroundColor: '#121214',
	},
	transactionRight: {
		flexDirection: 'column',
		alignItems: 'flex-end',
		backgroundColor: '#121214',
	},
	transactionDelete: {
		color: '#900',
	},
	transactionValue: {
		marginRight: 8,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 24,
	},
	emptyMessage: {
		color: '#868686',
		textAlign: 'center',
	},
	textGreen: {
		color: 'green',
	},
	textRed: {
		color: 'red',
	},
	transactionSeparator: {
		height: 10,
	},
	balanceContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 16,
		marginBottom: 16,
		paddingHorizontal: 4,
	},
	balanceLabel: {
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: 16,
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

export default TransactionsList;
