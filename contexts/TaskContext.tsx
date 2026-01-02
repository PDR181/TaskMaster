// contexts/TaskContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
  dataVencimento?: string; // ← NOVO (YYYY-MM-DD)
};

type TaskContextType = {
  tasks: Task[];
  filteredTasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: 'todas' | 'alta' | 'media' | 'baixa') => void;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const TASKS_KEY = '@taskmaster:tasks';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'todas' | 'alta' | 'media' | 'baixa'>('todas');

  // Carrega tarefas do storage na inicialização
  useEffect(() => {
    loadTasks();
  }, []);

  // Salva tarefas sempre que mudam (inclusive quando fica vazio)
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const filteredTasks = tasks.filter(task => {
    if (filter === 'todas') return true;
    return task.prioridade === filter;
  });

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem(TASKS_KEY);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        const initialTasks: Task[] = [
          {
            id: '1',
            titulo: 'Estudar React Native',
            descricao: 'Assistir aula e praticar 30 min',
            prioridade: 'alta' as const,
            concluida: false,
            dataVencimento: '2026-01-10',
          },
          {
            id: '2',
            titulo: 'Criar telas do TaskMaster',
            descricao: 'Home, Nova Tarefa e Editar',
            prioridade: 'media' as const,
            concluida: false,
            dataVencimento: '2026-01-05',
          },
        ];

        setTasks(initialTasks);
        await saveTasks(initialTasks);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  };

  const saveTasks = async (tasksToSave: Task[]) => {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasksToSave)); // persiste em string [web:316]
    } catch (error) {
      console.error('Erro ao salvar tarefas:', error);
    }
  };

  const addTask = (novaTask: Task) => {
    setTasks(prev => [...prev, novaTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, concluida: !task.concluida }
          : task
      )
    );
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.concluida).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      addTask,
      toggleTask,
      updateTask,
      deleteTask,
      setFilter,
      totalTasks,
      completedTasks,
      pendingTasks,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks deve ser usado dentro de TaskProvider');
  }
  return context;
}
