import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

const MONTHS = [
	'JANEIRO', 'FEVEREIRO', 'MARÇO', 'ABRIL', 'MAIO', 'JUNHO',
	'JULHO', 'AGOSTO', 'SETEMBRO', 'OUTUBRO', 'NOVEMBRO', 'DEZEMBRO',
];

type TMonthYearSelectorProps = {
	onChange: (month: number, year: number)=> void;
};

const MonthYearSelector = (props: TMonthYearSelectorProps) => {
	const { onChange } = props;

	const [ selectedMonth, setSelectedMonth ] = useState(new Date().getMonth());
	const [ selectedYear, setSelectedYear ] = useState(new Date().getFullYear());

	useEffect(() => {
		onChange(selectedMonth, selectedYear);
	}, [ selectedMonth, selectedYear, onChange ]);

	return (
		<>
			<TouchableOpacity
				style={styles.monthYearSelectorContainer}
				onPress={() => {

				}}
			>
				<ThemedView style={styles.monthSelectorContainer}>
					<TouchableOpacity
						style={styles.monthChevron}
						onPress={() => {
							if(selectedMonth === 0) {
								setSelectedMonth(11);
								setSelectedYear(selectedYear - 1);
							} else {
								setSelectedMonth(selectedMonth - 1);
							}
						}}
					>
						<Icon name='chevron-left' size={24} color='#666' />
					</TouchableOpacity>
					<ThemedText>{MONTHS[selectedMonth]}</ThemedText>
					<TouchableOpacity
						style={styles.monthChevron}
						onPress={() => {
							if(selectedMonth === 11) {
								setSelectedMonth(0);
								setSelectedYear(selectedYear + 1);
							} else {
								setSelectedMonth(selectedMonth + 1);
							}
						}}
					>
						<Icon name='chevron-right' size={24} color='#666' />
					</TouchableOpacity>
				</ThemedView>
				<ThemedText style={styles.yearSelector}>
					{selectedYear}
				</ThemedText>
			</TouchableOpacity>
		</>
	);
};

const styles = StyleSheet.create({
	monthYearSelectorContainer: {
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	monthSelectorContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
	},
	monthChevron: {
		padding: 10,
		borderWidth: 1,
		borderColor: '#666',
		borderRadius: 50,
	},
	monthYearSelectorInput: {
		flex: 1,
	},
	yearSelector: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	picker: {
		textAlign: 'center',
		textAlignVertical: 'center',
	},
	monthYearSelectorInputItem: {
		textAlignVertical: 'center',
		color: 'white',
	},
});

export default MonthYearSelector;
