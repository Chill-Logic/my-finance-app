import { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

import useShowCurrentUser from '../../hooks/api/user/useShowCurrentUser';

import { useCurrentUserContext } from '../../context/current_user';
import { LocalStorage } from '../../services/storage';

import { IScreenProps } from '../../types/screen';
import { StorageKeys } from '../../types/storage';

import { ThemedView } from '../atoms/ThemedView';
import Header from '../organisms/Header';

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
			<Header handleLogout={handleLogout} />

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
});

export default AuthenticatedLayout;
