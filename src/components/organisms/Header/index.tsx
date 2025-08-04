import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { useCurrentUserContext } from '../../../context/current_user';

import { ThemedText } from '../../atoms/ThemedText';
import { ThemedView } from '../../atoms/ThemedView';

interface IHeaderProps {
	handleLogout: ()=> void;
}

const Header = ({ handleLogout }: IHeaderProps) => {
	const { current_user } = useCurrentUserContext();

	return (
		<ThemedView style={styles.header}>
			<ThemedText style={styles.title}>Olá, {current_user?.data?.name}</ThemedText>
			<ThemedView style={styles.headerButtons}>
				<TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
					<Icon name='logout' size={24} color='#900' />
				</TouchableOpacity>
			</ThemedView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
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

export default Header;
