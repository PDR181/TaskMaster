import { StyleSheet, View, Text, Button, FlatList } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';

// Modelo de tarefa
type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
};

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      titulo: 'Estudar React Native',
      descricao: 'Assistir aula e praticar 30 min',
      prioridade: 'alta',
      concluida: false,
    },
    {
      id: '2',
      titulo: 'Criar telas do TaskMaster',
      descricao: 'Home, Nova Tarefa e Editar',
      prioridade: 'media',
      concluida: false,
    },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TaskMaster</Text>
      <Text style={styles.subtitle}>Gerencie suas tarefas do dia a dia</Text>

      <View style={styles.actions}>
        {/* depois esse Link vai apontar para a tela de Nova Tarefa */}
        <Link href="/nova-tarefa" asChild>
          <Button title="Adicionar tarefa" onPress={() => {}} />
        </Link>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <Text style={[styles.taskTitle, item.concluida && styles.taskDone]}>
              {item.titulo}
            </Text>
            {item.descricao ? (
              <Text style={styles.taskDescription}>{item.descricao}</Text>
            ) : null}
            <Text style={styles.taskPriority}>
              Prioridade: {item.prioridade}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: '#020617',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5e7eb',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
    marginBottom: 16,
  },
  actions: {
    marginBottom: 16,
  },
  listContent: {
    gap: 8,
    paddingBottom: 24,
  },
  taskCard: {
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
  },
  taskTitle: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDescription: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  taskPriority: {
    color: '#facc15',
    fontSize: 12,
    marginTop: 4,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
});
