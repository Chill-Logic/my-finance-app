import { Fragment } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedView } from '../atoms/ThemedView';
import { ThemedText } from '../atoms/ThemedText';
import { TListTransactionsResponse } from '../../types/api';
import { TTransaction } from '../../types/models';

type TTransactionsListProps = {
  data_transactions?: TListTransactionsResponse
  handleDeleteTransaction: (id: string) => void
  onClickTransaction: (transaction: TTransaction) => void
}

const TransactionsList = (props: TTransactionsListProps) => {
  const { data_transactions, handleDeleteTransaction, onClickTransaction } = props;

  const formatValue = (value: number) => {
    return Math.abs(value).toFixed(2).replace('.', ',');
  };

  const getTransactionColor = (type: string) => (
    type === 'deposit' ? styles.textGreen : styles.textRed
  );

  const getBalanceColor = (value: number) => (
    value >= 0 ? styles.textGreen : styles.textRed
  );

  return (
    <Fragment>
      {data_transactions?.transactions && data_transactions?.transactions.length > 0 ? (
        <Fragment>
          <ScrollView style={styles.transactionsList}>
            {data_transactions.transactions.map((transaction) => (
              <TouchableOpacity key={transaction.transactionID} style={styles.transactionItem} onPress={() => onClickTransaction(transaction)}>
                <ThemedView>
                  <ThemedText style={styles.transactionDate}>{transaction.date}</ThemedText>
                  <TouchableOpacity onPress={() => {}}>
                    <ThemedText style={styles.transactionDescription}>{transaction.description}</ThemedText>
                  </TouchableOpacity>
                </ThemedView>
                <ThemedView style={styles.transactionRight}>
                  <ThemedText style={[
                    styles.transactionValue,
                    getTransactionColor(transaction.type),
                  ]}>
                    {formatValue(transaction.value)}
                  </ThemedText>
                  <TouchableOpacity onPress={() => handleDeleteTransaction(transaction.transactionID)} />
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ThemedView style={styles.balanceContainer}>
            <ThemedText style={styles.balanceLabel}>Saldo</ThemedText>
            <ThemedText style={getBalanceColor(Number(data_transactions?.total))}>
              {formatValue(Number(data_transactions?.total))}
            </ThemedText>
          </ThemedView>
        </Fragment>
      ) : (
        <ThemedText style={styles.emptyMessage}>
          Não há registros de entrada ou saída
        </ThemedText>
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
    marginBottom: 8,
  },
  transactionDate: {
    color: '#C6C6C6',
    marginRight: 10,
  },
  transactionDescription: {
    fontWeight: 'bold',
  },
  transactionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transactionValue: {
    marginRight: 8,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  balanceLabel: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
});

export default TransactionsList;
