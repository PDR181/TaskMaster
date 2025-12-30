import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTasks } from '../contexts/TaskContext';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
};

export default function EditarTarefaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask, toggleTask } = useTasks();  // ← updateTask adicionado!
  
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prioridade, setPrioridade] = useState<'baixa' | 'media' | 'alta'>('media');
  const [concluida, setConcluida] = useState(false);
  const [loading, setLoading] = useState(true);

  // ← CARREGA dados da tarefa ao abrir tela
  useEffect(() => {
    if (id) {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setTitulo(task.titulo);
        setDescricao(task.descricao || '');
        setPrioridade(task.prioridade);
        setConcluida(task.concluida);
      }
      setLoading(false);
    }
  }, [id, tasks]);

  function handleCancelar() {
    router.back();
  }

  // ← EDIÇÃO REAL FUNCIONANDO!
  function handleSalvar() {
    if (!titulo.trim()) {
      Alert.alert('Erro', 'Título é obrigatório');
      return;
    }

    const updatedTask: Partial<Task> = {
      titulo: titulo.trim(),
      descricao: descricao.trim() || undefined,
      prioridade,
      concluida,
    };

    updateTask(id!, updatedTask);  // ← ATUALIZA no Context!
    
    Alert.alert('Sucesso', 'Tarefa atualizada!');
    router.back();
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar tarefa</Text>

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

      <Text style={styles.label}>Concluída</Text>
      <TouchableOpacity
        style={[
          styles.checkboxContainer,
          concluida && styles.checkboxContainerChecked
        ]}
        onPress={() => setConcluida(!concluida)}
        activeOpacity={0.7}
      >
        <View style={[
          styles.checkbox,
          concluida && styles.checkboxChecked
        ]}>
          {concluida && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={[
          styles.checkboxLabel,
          concluida && styles.checkboxLabelChecked
        ]}>
          {concluida ? 'Sim' : 'Não'}
        </Text>
      </TouchableOpacity>

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

// Styles iguais (mantidos)
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    marginTop: 4,
  },
  checkboxContainerChecked: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: 'white',
    borderColor: 'white',
  },
  checkmark: {
    color: '#020617',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
  },
  checkboxLabelChecked: {
    color: 'white',
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
