import { TouchableOpacity, StyleSheet } from 'react-native';
import ScreenLayout from '../../components/layouts/ScreenLayout';
import { ThemedText } from '../../components/atoms/ThemedText';
import useListTransactions from '../../hooks/api/transactions/useListTransactions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useCurrentUserContext } from '../../context/current_user';
import { IScreenProps } from '../../types/screen';
import { LocalStorage } from '../../services/storage';
import { StorageKeys } from '../../types/storage';
import { ThemedView } from '../../components/atoms/ThemedView';
import TransactionsList from '../../components/organisms/TransactionsList';
import { NewTransactionModal } from '../../components/organisms/NewTransactionModal';
import { useState } from 'react';
import { TTransaction } from '../../types/models';

const HomeScreen = ({ navigation }: IScreenProps<'Home'>) => {
  const { current_user, setCurrentUser } = useCurrentUserContext();
  const { data: data_transactions, isLoading: is_data_transactions_loading } = useListTransactions();

  const [transaction, setTransaction] = useState<TTransaction | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleLogout = () => {
    LocalStorage.deleteItem(StorageKeys.TOKEN);
    setCurrentUser({ data: null });
    navigation.replace('SignIn');
  };

  return (
    <ScreenLayout>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.title}>Olá, {current_user?.data?.nome}</ThemedText>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Icon name="logout" size={24} color="#900" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView
          style={[
            styles.transactionsContainer,
            data_transactions?.transactions?.length
              ? styles.transactionsContainerWithData
              : styles.transactionsContainerEmpty,
          ]
        }>
          {is_data_transactions_loading && (
            <ThemedText>Carregando...</ThemedText>
          )}

          {!is_data_transactions_loading && (
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
            onPress={() => setIsModalVisible(true)}
          >
            <ThemedText style={styles.actionButtonText}>
              Novo Registro
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <NewTransactionModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          transaction={transaction}
        />
      </ThemedView>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  logoutButton: {
    padding: 10,
  },
  title: {
    fontSize: 26,
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
