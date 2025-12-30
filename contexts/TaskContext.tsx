// contexts/TaskContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
};

type TaskContextType = {
  tasks: Task[];
  filteredTasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;  // ← NOVO!
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

  // ← CARREGA tarefas do storage na inicialização
  useEffect(() => {
    loadTasks();
  }, []);

  // ← SALVA tarefas sempre que mudam
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  // ← FILTRAGEM automática quando tasks ou filter mudam
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
        // Tarefas iniciais se não tiver nada salvo
        const initialTasks: Task[] = [
          {
            id: '1',
            titulo: 'Estudar React Native',
            descricao: 'Assistir aula e praticar 30 min',
            prioridade: 'alta' as const,
            concluida: false,
          },
          {
            id: '2',
            titulo: 'Criar telas do TaskMaster',
            descricao: 'Home, Nova Tarefa e Editar',
            prioridade: 'media' as const,
            concluida: false,
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
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasksToSave));
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

  // ← NOVA FUNÇÃO UPDATE!
  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id 
          ? { ...task, ...updatedTask }
          : task
      )
    );
  };

  // ← CONTADORES (calculados automaticamente!)
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.concluida).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      filteredTasks,
      filter,
      setFilter,
      addTask, 
      toggleTask, 
      updateTask,  // ← NOVO!
      totalTasks, 
      completedTasks, 
      pendingTasks 
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
