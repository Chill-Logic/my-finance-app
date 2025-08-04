import React, { useMemo } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useIndexWallets } from '../../../hooks/api/wallets/useIndexWallets';

import { useCurrentUserContext } from '../../../context/current_user';
import { useWallet } from '../../../context/wallet';

import Dropdown from '../../atoms/Dropdown';
import { ThemedText } from '../../atoms/ThemedText';
import { ThemedView } from '../../atoms/ThemedView';

export interface IMenuOption {
	id: string;
	title: string;
	icon: string;
	onClick: ()=> void;
}

interface ISidebarProps {
	onClose: ()=> void;
	onNavigate: (screen: string)=> void;
	options: IMenuOption[];
}

const Sidebar = ({ onClose, onNavigate, options }: ISidebarProps) => {
	const { current_user } = useCurrentUserContext();
	const { user_wallet, setUserWallet } = useWallet();

	const { data: data_wallets } = useIndexWallets({
		enabled: !!current_user?.data?.id,
	});

	const wallets_options = useMemo(() => {
		return data_wallets?.map((wallet) => ({
			label: wallet.name,
			value: wallet.id,
		})) || [];
	}, [ data_wallets ]);

	return (
		<ThemedView style={styles.container}>
			<ThemedView style={styles.header}>
				<Dropdown
					label='Visualizando a carteira:'
					options={wallets_options}
					value={user_wallet?.data?.id || ''}
					onChange={(value: string) => {
						const new_wallet = data_wallets?.find((wallet) => wallet.id === value);
						if (new_wallet) {
							setUserWallet({ data: new_wallet });
						}
					}}
					placeholder='Selecione uma carteira'
				/>
			</ThemedView>

			<ScrollView style={styles.menuContainer}>
				{options.map((item) => (
					<TouchableOpacity
						key={item.id}
						style={styles.menuItem}
						onPress={() => {
							item.onClick();
						}}
					>
						<Icon name={item.icon} size={24} color='#666' style={styles.menuIcon} />
						<ThemedText style={styles.menuText}>{item.title}</ThemedText>
					</TouchableOpacity>
				))}
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: 280,
		paddingTop: 50,
	},
	header: {
		padding: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
	},
	closeButton: {
		padding: 5,
	},
	walletName: {
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	menuContainer: {
		flex: 1,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 15,
		paddingHorizontal: 20,
		borderBottomWidth: 1,
		borderBottomColor: '#333',
	},
	menuIcon: {
		marginRight: 15,
	},
	menuText: {
		fontSize: 16,
	},
});

export default Sidebar;
