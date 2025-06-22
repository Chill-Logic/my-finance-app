import { useEffect, useState } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useListTransactions } from '../../hooks/api/transactions/useListTransactions';
import useShowCurrentUser from '../../hooks/api/user/useShowCurrentUser';

import { useCurrentUserContext } from '../../context/current_user';
import { LocalStorage } from '../../services/storage';

import { TTransaction } from '../../types/models';
import { IScreenProps } from '../../types/screen';
import { StorageKeys } from '../../types/storage';

import { ThemedText } from '../../components/atoms/ThemedText';
import { ThemedView } from '../../components/atoms/ThemedView';
import ScreenLayout from '../../components/layouts/ScreenLayout';
import { SettingsModal } from '../../components/organisms/SettingsModal';
import { TransactionFormModal } from '../../components/organisms/TransactionFormModal';
import TransactionsList from '../../components/organisms/TransactionList';

const HomeScreen = ({ navigation }: IScreenProps<'Home'>) => {
	const { current_user, setCurrentUser } = useCurrentUserContext();

	const { data: current_user_data, isLoading: is_current_user_loading } = useShowCurrentUser();
	const { data: data_transactions, isLoading: is_data_transactions_loading } = useListTransactions();

	const [ transaction, setTransaction ] = useState<TTransaction | null>(null);
	const [ is_modal_visible, setIsModalVisible ] = useState(false);
	const [ is_settings_modal_visible, setIsSettingsModalVisible ] = useState(false);

	const handleLogout = () => {
		LocalStorage.logout().then(() => {
			setCurrentUser({ data: null });
			navigation.replace('SignIn');
		});
	};

	const is_loading = is_current_user_loading || is_data_transactions_loading;

	useEffect(() => {
		(async() => {
			const keep_logged_in = await LocalStorage.getItem(StorageKeys.KEEP_LOGGED_IN);

			if (current_user_data && !current_user.data) {
				if (keep_logged_in === 'true') {
					LocalStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(current_user_data));
				}
				setCurrentUser({ data: current_user_data });
			}
		})();
	}, [ current_user_data, current_user, setCurrentUser ]);

	return (
		<ScreenLayout>
			<ThemedView style={styles.container}>
				<ThemedView style={styles.header}>
					<ThemedText style={styles.title}>Olá, {current_user?.data?.name}</ThemedText>
					<ThemedView style={styles.headerButtons}>
						<TouchableOpacity
							style={styles.headerButton}
							onPress={() => setIsSettingsModalVisible(true)}
						>
							<Icon name='settings' size={24} color='#A328D6' />
						</TouchableOpacity>
						<TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
							<Icon name='logout' size={24} color='#900' />
						</TouchableOpacity>
					</ThemedView>
				</ThemedView>

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

				<SettingsModal
					visible={is_settings_modal_visible}
					onClose={() => setIsSettingsModalVisible(false)}
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
	headerButtons: {
		flexDirection: 'row',
		gap: 10,
	},
	headerButton: {
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
