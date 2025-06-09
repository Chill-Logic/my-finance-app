export const formatMoney = (value: string): string => {
	const numericValue = value.replace(/\D/g, '');

	const amount = Number(numericValue) / 100;

	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
	}).format(amount);
};

export const unformatMoney = (formattedValue: string): string => {
	return formattedValue.replace(/\D/g, '');
};
