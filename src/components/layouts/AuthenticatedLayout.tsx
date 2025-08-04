import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Modal, TouchableOpacity, Animated } from 'react-native';

import useShowCurrentUser from '../../hooks/api/user/useShowCurrentUser';

import { useCurrentUserContext } from '../../context/current_user';
import { LocalStorage } from '../../services/storage';

import { IScreenProps } from '../../types/screen';
import { StorageKeys } from '../../types/storage';

import { ThemedView } from '../atoms/ThemedView';
import Header from '../organisms/Header';
import Sidebar, { IMenuOption } from '../organisms/Sidebar';
import { WalletFormModal } from '../organisms/WalletFormModal';

const AuthenticatedLayout = ({ children, navigation }: { children: React.ReactNode; navigation: IScreenProps<any>['navigation'] }) => {
	const { current_user, setCurrentUser } = useCurrentUserContext();
	const { data: current_user_data } = useShowCurrentUser();
	const [ isSidebarOpen, setIsSidebarOpen ] = useState(false);
	const slideAnim = useState(new Animated.Value(-280))[0];
	const [ is_wallet_form_modal_visible, setIsWalletFormModalVisible ] = useState(false);
	const handleLogout = () => {
		LocalStorage.logout().then(() => {
			setCurrentUser({ data: null });
			navigation.replace('SignIn');
		});
	};

	const handleOpenSidebar = () => {
		setIsSidebarOpen(true);
		Animated.timing(slideAnim, {
			toValue: 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	const handleCloseSidebar = () => {
		Animated.timing(slideAnim, {
			toValue: -280,
			duration: 300,
			useNativeDriver: true,
		}).start(() => {
			setIsSidebarOpen(false);
		});
	};

	const handleNavigate = (screen: string) => {
		navigation.navigate(screen);
		handleCloseSidebar();
	};

	const menuOptions: IMenuOption[] = [
		{ id: 'home', title: 'Início', icon: 'home', onClick: () => handleNavigate('Home') },
		{ id: 'wallets_invites', title: 'Convites', icon: 'wallet', onClick: () => handleNavigate('WalletsInvites') },
		{ id: 'new_wallet', title: 'Nova Carteira', icon: 'add', onClick: () => setIsWalletFormModalVisible(true) },
		{ id: 'wallet_settings', title: 'Configurar Carteiras', icon: 'settings', onClick: () => handleNavigate('WalletSettings') },
	];

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
			<Header handleLogout={handleLogout} onOpenSidebar={handleOpenSidebar} />

			<ThemedView style={styles.content}>
				{children}
			</ThemedView>

			<Modal
				visible={isSidebarOpen}
				transparent={true}
				animationType='none'
				onRequestClose={handleCloseSidebar}
			>
				<TouchableOpacity
					style={styles.overlay}
					activeOpacity={1}
					onPress={handleCloseSidebar}
				>
					<Animated.View
						style={[
							styles.sidebarContainer,
							{
								transform: [ { translateX: slideAnim } ],
							},
						]}
					>
						<Sidebar
							onClose={handleCloseSidebar}
							onNavigate={handleNavigate}
							options={menuOptions}
						/>
					</Animated.View>
				</TouchableOpacity>
			</Modal>

			<WalletFormModal
				visible={is_wallet_form_modal_visible}
				onClose={() => setIsWalletFormModalVisible(false)}
				onSuccess={() => setIsWalletFormModalVisible(false)}
			/>
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
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	sidebarContainer: {
		position: 'absolute',
		left: 0,
		top: 0,
		bottom: 0,
		width: 280,
		backgroundColor: '#fff',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
});

export default AuthenticatedLayout;
