'use client';

import React, { use, useEffect, useState } from 'react';

import { storage } from '@/lib/utils';

// types.ts
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdBy: string;
  createdAt: string;
  lastModified: number;
  version: number;
}

interface VectorClock {
  timestamp: number;
  userId: string;
  counter: number;
}

interface ChangeLogEntry {
  id: number;
  action: 'add' | 'update' | 'delete';
  todoId: number;
  data: Todo | null;
  vectorClock: VectorClock;
  userId: string;
  timestamp: string;
}

type SyncStatus = 'synced' | 'pending' | 'error' | 'conflict';

type TodoContextType = {
  todos: Todo[];
  isOnline: boolean;
  syncStatus: SyncStatus;
  changeLog: ChangeLogEntry[];
  lastSyncTimestamp: number | null;
  addTodo: (text: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  setIsOnline: (isOnline: boolean) => void;
  setSyncStatus: (syncStatus: SyncStatus) => void;
  setChangeLog: (changeLog: ChangeLogEntry[]) => void;
  setLastSyncTimestamp: (lastSyncTimestamp: number | null) => void;
};

export const TodoContext = React.createContext<TodoContextType>({
  todos: [],
  isOnline: true,
  syncStatus: 'synced',
  changeLog: [],
  lastSyncTimestamp: null,
  addTodo: (text: string) => {},
  toggleTodo: (id: number) => {},
  deleteTodo: (id: number) => {},
  setIsOnline: (isOnline: boolean) => {},
  setSyncStatus: (syncStatus: SyncStatus) => {},
  setChangeLog: (changeLog: ChangeLogEntry[]) => {},
  setLastSyncTimestamp: (lastSyncTimestamp: number | null) => {},
});

type TodoProviderProps = React.PropsWithChildren<{
  userId: string;
  params: Promise<{ sid: string }>;
}>;

export const TodoProvider: React.FC<TodoProviderProps> = ({ children, userId, params }) => {
  const { sid } = use(params);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState<number | null>(null);

  // Load todos and change log from local storage on initial render
  useEffect(() => {
    const storedTodos = storage.get<Todo[]>(`todos_${userId}`);
    const storedChangeLog = storage.get<ChangeLogEntry[]>(`changeLog_${userId}`);
    const storedLastSync = storage.get<number>(`lastSync_${userId}`);

    if (storedTodos) setTodos(storedTodos);
    if (storedChangeLog) setChangeLog(storedChangeLog);
    if (storedLastSync) setLastSyncTimestamp(storedLastSync);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    // console.log('saving on localstorage')
    storage.set(`todos_${userId}`, todos);
    storage.set(`changeLog_${userId}`, changeLog);
    storage.set(`lastSync_${userId}`, lastSyncTimestamp);
  }, [todos, changeLog, lastSyncTimestamp]);

  const handleOnline = (): void => {
    setIsOnline(true);
    if (changeLog.length > 0) {
      void syncWithServer();
    }
  };

  const handleOffline = (): void => {
    setIsOnline(false);
    setSyncStatus('pending');
  };

  const generateVectorClock = (): VectorClock => ({
    timestamp: Date.now(),
    userId: userId,
    counter: changeLog.length + 1,
  });

  const addToChangeLog = (
    action: ChangeLogEntry['action'],
    todoId: number,
    data: Todo | null
  ): void => {
    const change: ChangeLogEntry = {
      id: Date.now(),
      action,
      todoId,
      data,
      vectorClock: generateVectorClock(),
      userId: userId,
      timestamp: new Date().toISOString(),
    };
    setChangeLog((prev) => [...prev, change]);
  };

  const resolveConflicts = (
    serverTodos: Todo[],
    localTodos: Todo[],
    localChanges: ChangeLogEntry[]
  ): Todo[] => {
    // Create a map of all todos by ID
    const todoMap = new Map<number, Todo & { source: 'server' | 'local' }>();

    // Add server todos to the map
    serverTodos.forEach((todo) => {
      todoMap.set(todo.id, { ...todo, source: 'server' });
    });

    // Process local changes
    localChanges.forEach((change) => {
      const serverTodo = todoMap.get(change.todoId);
      const localTodo = localTodos.find((t) => t.id === change.todoId);

      if (!serverTodo) {
        // New local todo - keep it
        if (change.action === 'add' && change.data) {
          todoMap.set(change.todoId, { ...change.data, source: 'local' });
        }
      } else if (serverTodo.lastModified < new Date(change.timestamp).getTime()) {
        // Local change is newer - keep local version
        if (change.action === 'update' && change.data) {
          todoMap.set(change.todoId, { ...serverTodo, ...change.data, source: 'local' });
        } else if (change.action === 'delete') {
          todoMap.delete(change.todoId);
        }
      }
    });

    return Array.from(todoMap.values());
  };

  const syncWithServer = async (): Promise<void> => {
    setSyncStatus('pending');
    try {
      // Simulated server sync
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would be an API call returning server todos
      const serverTodos: Todo[] = []; // Simulated server response

      // Resolve conflicts between server and local state
      const resolvedTodos = resolveConflicts(serverTodos, todos, changeLog);

      // Update local state with resolved todos
      setTodos(resolvedTodos);
      setChangeLog([]); // Clear change log after successful sync
      setLastSyncTimestamp(Date.now());
      setSyncStatus('synced');
    } catch (error) {
      setSyncStatus('error');
      console.error('Sync failed:', error);
    }
  };

  const addTodo = (text: string): void => {
    const todoId = Date.now();
    const todo: Todo = {
      id: todoId,
      text: text.trim(),
      completed: false,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      lastModified: Date.now(),
      version: 1,
    };

    setTodos((prev) => [...prev, todo]);
    addToChangeLog('add', todoId, todo);
  };

  const toggleTodo = (id: number): void => {
    setTodos((prev) =>
      prev.map((todo) => {
        if (todo.id === id) {
          const updated: Todo = {
            ...todo,
            completed: !todo.completed,
            lastModified: Date.now(),
            version: todo.version + 1,
          };
          addToChangeLog('update', id, updated);
          return updated;
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: number): void => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    addToChangeLog('delete', id, null);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        isOnline,
        syncStatus,
        changeLog,
        lastSyncTimestamp,
        addTodo,
        toggleTodo,
        deleteTodo,
        setIsOnline,
        setSyncStatus,
        setChangeLog,
        setLastSyncTimestamp,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
