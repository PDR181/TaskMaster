import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function NovaTarefaScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  function handleCancelar() {
    router.back();
  }

  function handleSalvar() {
    // Aqui depois vamos de fato criar a tarefa
    console.log('Salvar tarefa:', { titulo, descricao });
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova tarefa</Text>

      <Text style={styles.label}>Título</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o título"
        placeholderTextColor="#6b7280"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Detalhes da tarefa"
        placeholderTextColor="#6b7280"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <View style={styles.buttonsRow}>
        <Button title="Cancelar" onPress={handleCancelar} />
        <Button title="Salvar" onPress={handleSalvar} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    padding: 16,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e5e7eb',
    marginBottom: 24,
  },
  label: {
    color: '#e5e7eb',
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
});
