import { Fragment } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

import { useDeleteTransactions } from '../../../hooks/api/transactions/useDeleteTransactions';

import { useRefresh } from '../../../context/refresh';
import { DateUtils } from '../../../utils/date';
import { MoneyUtils } from '../../../utils/money';
import { TextUtils } from '../../../utils/text';

import { TListTransactionsResponse } from '../../../types/api';
import { TTransaction } from '../../../types/models';

import { ThemedText } from '../../atoms/ThemedText';
import { ThemedView } from '../../atoms/ThemedView';

import { QUERY_KEYS } from '../../../constants/QueryKeys';

type TTransactionsListProps = {
	data_transactions?: TListTransactionsResponse;
	onClickTransaction: (transaction: TTransaction)=> void;
}

const TransactionsList = (props: TTransactionsListProps) => {
	const { data_transactions, onClickTransaction } = props;
	const { refreshControlProps } = useRefresh({
		keys: [
			QUERY_KEYS.transaction.get_all,
		],
	});

	const { mutate: deleteTransaction } = useDeleteTransactions();

	const handleDeleteTransaction = (transaction: TTransaction) => {
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

	const renderTransactionItem = ({ item: transaction }: { item: TTransaction }) => (
		<TouchableOpacity
			style={styles.transactionItem}
			onPress={() => onClickTransaction(transaction)}
		>
			<ThemedView>
				<ThemedText style={styles.transactionDescription}>{TextUtils.truncate({ text: transaction.description, maxLength: 35 })}</ThemedText>
				<ThemedText style={styles.transactionDate}>{DateUtils.formatDate(transaction.transaction_date)}</ThemedText>
			</ThemedView>
			<ThemedView style={styles.transactionRight}>
				<ThemedText
					style={[
						styles.transactionValue,
						getTransactionColor(transaction.kind),
					]}
				>
					{MoneyUtils.formatMoney(transaction.value)}
				</ThemedText>
				<TouchableOpacity onPress={() => handleDeleteTransaction(transaction)}>
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
		<Fragment>
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
				<Fragment>
					<ThemedText style={styles.emptyMessage}>
						Não há registros de entrada ou saída
					</ThemedText>
				</Fragment>
			)}
		</Fragment>
	);
};

const styles = StyleSheet.create({
	transactionsList: {
		maxHeight: '95%',
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
});

export default TransactionsList;
