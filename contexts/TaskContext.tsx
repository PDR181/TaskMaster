// contexts/TaskContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Task = {
  id: string;
  titulo: string;
  descricao?: string;
  prioridade: 'baixa' | 'media' | 'alta';
  concluida: boolean;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
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

  const addTask = (novaTask: Task) => {
    setTasks(prev => [...prev, novaTask]);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask }}>
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
