import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { useTasks } from '../contexts/TaskContext';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
};

export default function NovaTarefaScreen() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  
  // Agora usa Context ao invés de params!
  const { addTask } = useTasks();

  function handleCancelar() {
    router.back();
  }

  function handleSalvar() {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    const novaTask: Task = {
      id: Date.now().toString(),
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      prioridade,
      concluida: false,
    };

    // Usa addTask do Context!
    addTask(novaTask);

    Alert.alert('Sucesso', 'Tarefa criada!');
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nova tarefa</Text>

      <Text style={styles.label}>Título *</Text>
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
        placeholder="Detalhes da tarefa (opcional)"
        placeholderTextColor="#6b7280"
        value={descricao}
        onChangeText={setDescricao}
        multiline
      />

      <Text style={styles.label}>Prioridade</Text>
      <View style={styles.prioridadeContainer}>
        {(['baixa', 'media', 'alta'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[
              styles.prioridadeButton,
              prioridade === p && styles.prioridadeButtonActive
            ]}
            onPress={() => setPrioridade(p)}
          >
            <Text style={[
              styles.prioridadeButtonText,
              prioridade === p && styles.prioridadeButtonTextActive
            ]}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity style={styles.botaoCancelar} onPress={handleCancelar}>
          <Text style={styles.botaoCancelarText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.botaoSalvar, !titulo.trim() && styles.botaoSalvarDisabled]} 
          onPress={handleSalvar}
          disabled={!titulo.trim()}
        >
          <Text style={styles.botaoSalvarText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles iguais (mantive do código anterior)
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
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#0f172a',
    color: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  prioridadeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  prioridadeButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  prioridadeButtonActive: {
    backgroundColor: '#facc15',
    borderColor: '#eab308',
  },
  prioridadeButtonText: {
    color: '#9ca3af',
    textAlign: 'center',
    fontWeight: '500',
  },
  prioridadeButtonTextActive: {
    color: '#020617',
    fontWeight: 'bold',
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    gap: 12,
  },
  botaoCancelar: {
    flex: 1,
    backgroundColor: '#1e293b',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoCancelarText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  botaoSalvar: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoSalvarDisabled: {
    backgroundColor: '#4b5563',
  },
  botaoSalvarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
