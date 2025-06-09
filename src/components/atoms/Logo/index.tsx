import { StyleSheet } from 'react-native';

import { ThemedText } from '../ThemedText';

const MyWalletLogo = () => {
	return (
		<ThemedText style={styles.logo}>
      MyWallet
		</ThemedText>
	);
};

const styles = StyleSheet.create({
	logo: {
		fontSize: 50,
		fontFamily: 'Saira Stencil One',
		fontWeight: 700,
		lineHeight: 50,
	},
});

export default MyWalletLogo;
