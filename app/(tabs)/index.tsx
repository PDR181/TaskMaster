import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTasks } from '../../contexts/TaskContext';

// Modelo de tarefa
type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
};

export default function HomeScreen() {
  const { tasks, toggleTask, totalTasks, completedTasks } = useTasks();

  return (
    <View style={styles.container}>
      {/* ← HEADER COM CONTADOR NOVO! */}
      <View style={styles.header}>
        <Text style={styles.title}>TaskMaster</Text>
        <Text style={styles.stats}>
          📊 {totalTasks} tarefas | {completedTasks} concluídas
        </Text>
        <Text style={styles.subtitle}>Gerencie suas tarefas do dia a dia</Text>
      </View>

      <View style={styles.actions}>
        <Link href="/nova-tarefa" asChild>
          <Button title="Adicionar tarefa" />
        </Link>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <View style={styles.taskRow}>
              {/* Checkbox CLICÁVEL APENAS AQUI! */}
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  item.concluida && styles.checkboxChecked,
                ]}
                onPress={() => toggleTask(item.id)}
                activeOpacity={0.7}
              >
                {item.concluida && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>

              {/* Conteúdo NÃO clicável */}
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, item.concluida && styles.taskDone]}>
                  {item.titulo}
                </Text>
                {item.descricao ? (
                  <Text
                    style={[
                      styles.taskDescription,
                      item.concluida && styles.taskDescriptionDone,
                    ]}
                  >
                    {item.descricao}
                  </Text>
                ) : null}
                <Text
                  style={[
                    styles.taskPriority,
                    item.concluida && styles.taskPriorityDone,
                  ]}
                >
                  Prioridade: {item.prioridade}
                </Text>
              </View>
            </View>
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
  // ← NOVO ESTILO HEADER!
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#e5e7eb',
  },
  // ← NOVO ESTILO CONTADOR!
  stats: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
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
  taskRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#6b7280',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: '#e5e7eb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#6b7280',
  },
  taskDescription: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 4,
  },
  taskDescriptionDone: {
    color: '#6b7280',
  },
  taskPriority: {
    color: '#facc15',
    fontSize: 12,
    marginTop: 4,
  },
  taskPriorityDone: {
    color: '#6b7280',
  },
});
