import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import useShowCurrentUser from '../../hooks/api/user/useShowCurrentUser';

import { useCurrentUserContext } from '../../context/current_user';
import { LocalStorage } from '../../services/storage';

import { IScreenProps } from '../../types/screen';
import { StorageKeys } from '../../types/storage';

import { ThemedText } from '../atoms/ThemedText';
import { ThemedView } from '../atoms/ThemedView';

const AuthenticatedLayout = ({ children, navigation }: { children: React.ReactNode; navigation: IScreenProps<any>['navigation'] }) => {
	const { current_user, setCurrentUser } = useCurrentUserContext();
	const { data: current_user_data } = useShowCurrentUser();

	const handleLogout = () => {
		LocalStorage.logout().then(() => {
			setCurrentUser({ data: null });
			navigation.replace('SignIn');
		});
	};

	useEffect(() => {
		(async() => {
			const keep_logged_in = await LocalStorage.getItem(StorageKeys.KEEP_LOGGED_IN);

			if (current_user_data && (!current_user.data || current_user.data.id !== current_user_data.id)) {
				if (keep_logged_in === 'true') {
					LocalStorage.setItem(StorageKeys.USER_DATA, JSON.stringify(current_user_data));
				}
				setCurrentUser({ data: current_user_data });
			}
		})();
	}, [ current_user_data, current_user, setCurrentUser ]);

	return (
		<SafeAreaView style={styles.container}>
			<ThemedView style={styles.header}>
				<ThemedText style={styles.title}>Olá, {current_user?.data?.name}</ThemedText>
				<ThemedView style={styles.headerButtons}>
					<TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
						<Icon name='logout' size={24} color='#900' />
					</TouchableOpacity>
				</ThemedView>
			</ThemedView>

			<ThemedView style={styles.content}>
				{children}
			</ThemedView>

		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	content: {
		flex: 1,
		padding: 20,
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 18,
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
});

export default AuthenticatedLayout;
