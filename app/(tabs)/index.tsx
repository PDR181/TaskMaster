import {
  StyleSheet,
  View,
  Text,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  useWindowDimensions,
} from "react-native";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useTasks } from "../../contexts/TaskContext";
import { useTheme } from "../../contexts/ThemeContext";
import {
  Colors,
  PriorityColors,
  CardColors,
  TaskTextColors,
} from "../../constants/theme";

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: "baixa" | "media" | "alta";
  concluida: boolean;
  dataVencimento?: string;
};

export default function HomeScreen() {
  const {
    filteredTasks,
    toggleTask,
    totalTasks,
    completedTasks,
    setFilter,
    filter,
    deleteTask,
  } = useTasks();
  const { colorScheme } = useTheme();
  const colors = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const { width } = useWindowDimensions();
  const maxWidth = Math.min(width * 0.95, 900);

  // Estado para o modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{
    id: string;
    titulo: string;
  } | null>(null);

  function parseYYYYMMDD(dateStr: string): Date {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function getDeadlineStatus(dateStr: string): "atrasada" | "hoje" | "futura" {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const deadline = parseYYYYMMDD(dateStr);
    deadline.setHours(0, 0, 0, 0);

    if (deadline < hoje) return "atrasada";
    if (deadline.getTime() === hoje.getTime()) return "hoje";
    return "futura";
  }

  function getDeadlineEmoji(dateStr: string): string {
    const status = getDeadlineStatus(dateStr);
    if (status === "atrasada") return "🔴";
    if (status === "hoje") return "🟡";
    return "🟢";
  }

  function formatDate(dateStr: string): string {
    return parseYYYYMMDD(dateStr).toLocaleDateString("pt-BR");
  }

  // ← FUNÇÃO DELETE DA LISTA!
  function handleDeleteTask(taskId: string, taskTitle: string) {
    setTaskToDelete({ id: taskId, titulo: taskTitle });
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  }

  function cancelDelete() {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  }

  return (
    <>
      {/* Modal de confirmação de exclusão */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          ]}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Excluir Tarefa
            </Text>
            <Text style={[styles.modalMessage, { color: colors.icon }]}>
              Tem certeza que deseja remover "{taskToDelete?.titulo}"?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonCancel,
                  { borderColor: colors.icon },
                ]}
                onPress={cancelDelete}
              >
                <Text style={[styles.modalButtonText, { color: colors.icon }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonDelete]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonDeleteText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Conteúdo principal */}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.contentWrapper, { maxWidth }]}>
          {/* ← HEADER COM ABAS DE FILTRO! */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              TaskMaster
            </Text>

            {/* ← CONTADOR (permanece) */}
            <Text style={[styles.stats, { color: colors.tint }]}>
              📊 {totalTasks} tarefas | {completedTasks} concluídas
            </Text>

            {/* ← ABAS DE FILTRO NOVAS! */}
            <View style={styles.filterTabs}>
              {(["todas", "alta", "media", "baixa"] as const).map((tab) => {
                const isActive = filter === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    style={[
                      styles.filterTab,
                      {
                        backgroundColor: isDark
                          ? CardColors.dark
                          : CardColors.light,
                        borderColor: isDark ? "#556B7F" : "#cbd5d5",
                      },
                      isActive && { backgroundColor: colors.tint },
                    ]}
                    onPress={() => setFilter(tab)}
                  >
                    <Text
                      style={[
                        styles.filterTabText,
                        { color: isActive ? colors.background : colors.icon },
                        isActive && styles.filterTabTextActive,
                      ]}
                    >
                      {tab === "todas"
                        ? "Todas"
                        : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.subtitle, { color: colors.icon }]}>
              Gerencie suas tarefas do dia a dia
            </Text>
          </View>

          <View style={styles.actions}>
            <Link href="/nova-tarefa" asChild>
              <Button title="Adicionar tarefa" />
            </Link>
          </View>

          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.taskCard,
                  {
                    backgroundColor: isDark
                      ? CardColors.dark
                      : CardColors.light,
                  },
                ]}
              >
                <View style={styles.taskRow}>
                  {/* Checkbox CLICÁVEL */}
                  <TouchableOpacity
                    style={[
                      styles.checkbox,
                      { borderColor: colors.icon },
                      item.concluida && {
                        backgroundColor: colors.tint,
                        borderColor: colors.tint,
                      },
                    ]}
                    onPress={() => toggleTask(item.id)}
                    activeOpacity={0.7}
                  >
                    {item.concluida && (
                      <Text
                        style={[styles.checkmark, { color: colors.background }]}
                      >
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Conteúdo */}
                  <View style={styles.taskContent}>
                    <TouchableOpacity
                      onPress={() =>
                        router.push({
                          pathname: "/editar-tarefa",
                          params: { id: item.id },
                        })
                      }
                      activeOpacity={0.7}
                      disabled={item.concluida}
                    >
                      <Text
                        style={[
                          styles.taskTitle,
                          { color: TaskTextColors[colorScheme] },
                          item.concluida && {
                            ...styles.taskDone,
                            color: colors.icon,
                          },
                          !item.concluida && styles.taskTitleClickable,
                        ]}
                      >
                        {item.titulo}
                      </Text>
                    </TouchableOpacity>

                    {item.descricao ? (
                      <Text
                        style={[
                          styles.taskDescription,
                          { color: colors.icon },
                          item.concluida && styles.taskDescriptionDone,
                        ]}
                      >
                        {item.descricao}
                      </Text>
                    ) : null}
                    <Text
                      style={[
                        styles.taskPriority,
                        { color: PriorityColors[item.prioridade] },
                        item.concluida && {
                          ...styles.taskPriorityDone,
                          color: colors.icon,
                        },
                      ]}
                    >
                      Prioridade: {item.prioridade}
                    </Text>
                    {item.dataVencimento ? (
                      <Text
                        style={[
                          styles.taskDeadline,
                          { color: colors.icon },
                          getDeadlineStatus(item.dataVencimento) ===
                            "atrasada" && styles.deadlineOverdue,
                          getDeadlineStatus(item.dataVencimento) === "hoje" &&
                            styles.deadlineToday,
                        ]}
                      >
                        Vence em: {formatDate(item.dataVencimento)}{" "}
                        {getDeadlineEmoji(item.dataVencimento)}
                      </Text>
                    ) : null}
                  </View>

                  {/* ← ÍCONE 🗑️ NO CANTO DIREITO! */}
                  <TouchableOpacity
                    style={[
                      styles.deleteIcon,
                      { borderColor: isDark ? "#ef4444" : "#fca5a5" },
                    ]}
                    onPress={() => handleDeleteTask(item.id, item.titulo)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.deleteIconText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 16,
    backgroundColor: "#020617",
    alignItems: "center",
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 600,
  },
  header: {
    marginBottom: 16,
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#e5e7eb",
  },
  stats: {
    fontSize: 14,
    color: "#10b981",
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 8,
  },
  filterTabs: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#0f172a",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#334155",
  },
  filterTabActive: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },
  filterTabText: {
    color: "#9ca3af",
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#020617",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 4,
  },
  actions: {
    marginBottom: 16,
    width: "100%",
  },
  listContent: {
    gap: 8,
    paddingBottom: 24,
    width: "100%",
  },
  taskCard: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#6b7280",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#10b981",
    borderColor: "#059669",
  },
  checkmark: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    color: "#e5e7eb",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskTitleClickable: {
    textDecorationLine: "underline",
  },
  taskDone: {
    textDecorationLine: "line-through",
    color: "#6b7280",
  },
  taskDescription: {
    color: "#9ca3af",
    fontSize: 14,
    marginTop: 4,
  },
  taskDescriptionDone: {
    color: "#6b7280",
  },
  taskPriority: {
    color: "#facc15",
    fontSize: 12,
    marginTop: 4,
  },
  taskPriorityDone: {
    color: "#6b7280",
  },
  // ← NOVOS ESTILOS ÍCONE 🗑️!
  deleteIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  deleteIconText: {
    fontSize: 18,
    color: "#ef4444",
  },
  taskDeadline: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#94a3b8", // futura (cinza-azulado)
  },
  deadlineToday: {
    color: "#facc15", // hoje (amarelo)
  },
  deadlineOverdue: {
    color: "#ef4444", // atrasada (vermelho)
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 14,
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  modalButtonCancel: {
    backgroundColor: "transparent",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalButtonDelete: {
    backgroundColor: "#EF4444",
    borderColor: "#EF4444",
  },
  modalButtonDeleteText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
