// contexts/TaskContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSession } from './session';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
  dataVencimento?: string; // YYYY-MM-DD
  ownerId: string; // <- dono da tarefa
};

type Filter = 'todas' | 'alta' | 'media' | 'baixa';

type TaskContextType = {
  tasks: Task[];
  filteredTasks: Task[];
  addTask: (task: Task) => void;
  toggleTask: (id: string) => void;
  updateTask: (id: string, updatedTask: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: Filter) => void;
  filter: Filter;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Base da chave; a real vira "@taskmaster:tasks:<usuario>"
const TASKS_KEY_BASE = '@taskmaster:tasks:';

export function TaskProvider({ children }: { children: ReactNode }) {
  const { session } = useSession(); // session = username
  const storageKey = session ? `${TASKS_KEY_BASE}${session}` : null;

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<Filter>('todas');

  // Carrega tarefas SEMPRE que o usuário mudar (login/logout/troca de usuário)
  useEffect(() => {
    (async () => {
      try {
        if (!storageKey) {
          setTasks([]);
          return;
        }

        const storedTasks = await AsyncStorage.getItem(storageKey);
        if (storedTasks) {
          setTasks(JSON.parse(storedTasks));
          return;
        }

        // Seed inicial por usuário (primeira vez)
        const initialTasks: Task[] = [
          {
            id: '1',
            titulo: 'Estudar React Native',
            descricao: 'Assistir aula e praticar 30 min',
            prioridade: 'alta',
            concluida: false,
            dataVencimento: '2026-01-10',
            ownerId: session,
          },
          {
            id: '2',
            titulo: 'Criar telas do TaskMaster',
            descricao: 'Home, Nova Tarefa e Editar',
            prioridade: 'media',
            concluida: false,
            dataVencimento: '2026-01-05',
            ownerId: session,
          },
        ];

        setTasks(initialTasks);
        await AsyncStorage.setItem(storageKey, JSON.stringify(initialTasks));
      } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
      }
    })();
  }, [storageKey, session]);

  // Salva tarefas sempre que mudam (somente se houver usuário logado)
  useEffect(() => {
    (async () => {
      try {
        if (!storageKey) return;
        await AsyncStorage.setItem(storageKey, JSON.stringify(tasks));
      } catch (error) {
        console.error('Erro ao salvar tarefas:', error);
      }
    })();
  }, [tasks, storageKey]);

  // Segurança extra: garante que só conte/mostre tarefas do usuário atual
  const userTasks = useMemo(() => {
    if (!session) return [];
    return tasks.filter(t => t.ownerId === session);
  }, [tasks, session]);

  const filteredTasks = useMemo(() => {
    return userTasks.filter(task => {
      if (filter === 'todas') return true;
      return task.prioridade === filter;
    });
  }, [userTasks, filter]);

  const addTask = (novaTask: Task) => {
    if (!session) return;

    // Se vier ownerId errado/vazio, força o correto
    const taskToAdd: Task = {
      ...novaTask,
      ownerId: session,
    };

    setTasks(prev => [...prev, taskToAdd]);
  };

  const toggleTask = (id: string) => {
    if (!session) return;

    setTasks(prev =>
      prev.map(task =>
        task.id === id && task.ownerId === session
          ? { ...task, concluida: !task.concluida }
          : task
      )
    );
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    if (!session) return;

    // Não permitir trocar ownerId pelo update
    const { ownerId, ...rest } = updatedTask;

    setTasks(prev =>
      prev.map(task =>
        task.id === id && task.ownerId === session
          ? { ...task, ...rest }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    if (!session) return;
    setTasks(prev => prev.filter(task => !(task.id === id && task.ownerId === session)));
  };

  const totalTasks = userTasks.length;
  const completedTasks = userTasks.filter(task => task.concluida).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <TaskContext.Provider
      value={{
        tasks: userTasks,
        filteredTasks,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        setFilter,
        filter,
        totalTasks,
        completedTasks,
        pendingTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks deve ser usado dentro de TaskProvider');
  return context;
}
