export const formatMoney = (value: string): string => {
  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');

  // Converte para número e divide por 100 para considerar os centavos
  const amount = Number(numericValue) / 100;

  // Formata o valor usando o Intl.NumberFormat
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
};

export const unformatMoney = (formattedValue: string): string => {
  // Remove todos os caracteres não numéricos
  return formattedValue.replace(/\D/g, '');
};
