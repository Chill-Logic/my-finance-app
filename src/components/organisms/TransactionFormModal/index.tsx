import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../atoms/ThemedText';
import { ThemedView } from '../../atoms/ThemedView';
import { ThemedTextInput } from '../../atoms/ThemedTextInput';
// @ts-ignore
import { Picker } from '@react-native-picker/picker';
import { TNewTransactionForm } from '../../../types/forms';
import { TTransaction } from '../../../types/models';
import { useCreateTransactions } from '../../../hooks/api/transactions/useCreateTransactions';
import { Loader } from '../../atoms/Loader';
import { formatMoney, unformatMoney } from '../../../utils/formatMoney';
import Toast from 'react-native-toast-message';
import { useUpdateTransactions } from '../../../hooks/api/transactions/useUpdateTransactions';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transaction?: TTransaction | null;
}

export const TransactionFormModal = (props: TransactionModalProps) => {
  const { visible, onClose, transaction } = props;

  const { mutate: createTransactionMutation, isPending: is_create_transaction_pending } = useCreateTransactions();
  const { mutate: updateTransactionMutation, isPending: is_update_transaction_pending } = useUpdateTransactions();
  const [form, setForm] = useState<TNewTransactionForm>({
    type: 'deposit',
    description: '',
    value: '',
  });

  const handleSave = () => {
    if(transaction){
      updateTransactionMutation({
        body: {
          type: form.type,
          description: form.description,
          value: Number(unformatMoney(form.value)) / 100,
        },
        id: transaction.transactionID,
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Transação atualizada!',
            text2: 'Sua transação foi atualizada com sucesso',
          });
          onClose();
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'Erro ao atualizar transação!',
            text2: 'Ocorreu um erro ao atualizar a transação',
          });
        },
      });

    } else {
      createTransactionMutation({
        body: {
          type: form.type,
          description: form.description,
          value: Number(unformatMoney(form.value)) / 100,
        },
        onSuccess: () => {
          Toast.show({
            type: 'success',
            text1: 'Transação criada!',
            text2: 'Sua transação foi criada com sucesso',
          });
          onClose();
        },
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'Erro ao criar transação!',
            text2: 'Ocorreu um erro ao criar a transação',
          });
        },
      });
    }
  };

  const is_submit_disabled = is_create_transaction_pending  || is_update_transaction_pending || !form.value || !form.description || !form.type;

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        description: transaction.description,
        value: formatMoney(transaction.value.toString()),
      });
    }
  }, [transaction]);
const handleClose = () => {
  setForm({
    type: 'deposit',
    description: '',
    value: '',
  });
  onClose();
};
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <ThemedView style={styles.modalOverlay}>
        <ThemedView style={styles.modalContent}>
          <ThemedText style={styles.title}>{transaction ? `Editar ${transaction.type === 'deposit' ? 'Entrada' : 'Saída'}` : 'Nova Transação'}</ThemedText>

          <ThemedView style={styles.formGroup}>
            <ThemedText>Tipo</ThemedText>
            <ThemedView style={styles.pickerContainer}>
              <Picker
                selectedValue={form.type}
                onValueChange={(value: TTransaction['type']) => setForm({ ...form, type: value })}
                style={styles.picker}
              >
                <Picker.Item label="Entrada" value="deposit" />
                <Picker.Item label="Saída" value="spent" />
              </Picker>
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.formGroup}>
            <ThemedText>Descrição</ThemedText>
            <ThemedTextInput
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
              placeholder="Digite a descrição"
            />
          </ThemedView>

          <ThemedView style={styles.formGroup}>
            <ThemedText>Valor</ThemedText>
            <ThemedTextInput
              value={form.value}
              onChangeText={(text) => {
                const formattedValue = formatMoney(text);
                setForm({ ...form, value: formattedValue });
              }}
              placeholder="R$ 0,00"
              keyboardType="numeric"
            />
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity disabled={(is_create_transaction_pending || is_update_transaction_pending )} style={[styles.button, styles.cancelButton]} onPress={handleClose}>
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
              <TouchableOpacity disabled={is_submit_disabled} style={[styles.button, is_submit_disabled ? styles.saveButtonDisabled : styles.saveButton]} onPress={handleSave}>
                <ThemedText style={styles.buttonText}>{(is_create_transaction_pending || is_update_transaction_pending ) ? <Loader /> : 'Salvar'}</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  picker: {
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f16f6f',
  },
  saveButton: {
    backgroundColor: '#A328D6',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
