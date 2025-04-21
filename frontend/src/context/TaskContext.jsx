import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getApiUrl } from '../utils/api';

// create context (private)
const TaskContext = createContext();


// create custom hook (public)
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider')
  }
  return context;
}


// create context provider (public)
export default function TaskProvider({children}) {

  // List-related states
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [showDiscarded, setShowDiscarded] = useState(false);

  // single task states
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // filters related states
  const [completionFilter, setCompletionFilter] = useState('all'); // 'all', 'completed', 'uncompleted'
  const [sortField, setSortField] = useState('createdAt'); // 'createdAt', 'updatedAt'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'


  // Update filter handlers to reset page
  const handleCompletionFilter = (value) => {
    setPage(1);  // Reset to first page
    setCompletionFilter(value);
  };

  const handleSortChange = useCallback((field) => {
    setPage(1);
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  }, [sortField, sortOrder]);

  // List-related operations
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');

      // select endpoint based on showDiscarded state
      const endpoint = showDiscarded ?
        getApiUrl(`/api/tasks/discarded/page/${page}`) :
        getApiUrl(`/api/tasks/page/${page}`);

      // Query parameters fr filters
      const queryParams = new URLSearchParams({
        completionFilter,
        sortField,
        sortOrder
      }).toString();

      const res = await fetch(`${endpoint}?${queryParams}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, showDiscarded, completionFilter, sortField, sortOrder]);


  useEffect(() => {
    fetchTasks();
  }, [page, showDiscarded, completionFilter, sortField, sortOrder, fetchTasks]);


  // View-Mode operations

  const toggleTrashView = useCallback(() => {
    setShowDiscarded(!showDiscarded);
    setPage(1);
  }, [showDiscarded]);



  // Single-task operations

  const selectTask = (task) => {
    setSelectedTask(task);
    setIsEditing(false);
  }


  // Update selected Task (front + back)
  const updateTask = useCallback(async (taskId, updatedData) => {
    const response = await updateDatabase(taskId, updatedData);
    await fetchTasks();
    const updatedTask = await response.json();
    setSelectedTask(updatedTask);
    setIsEditing(false);
  }, [fetchTasks]);


  // Update DataBase
  const updateDatabase = async (id, updatedData) => {
    const token = localStorage.getItem('token');

    const response = await fetch(getApiUrl(`/api/task/edit/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    return response;
  };


  // Add new task
  const addTask = async (title) => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    const res = await fetch(getApiUrl('/api/task/new'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Include the token in the headers
      },
      body: JSON.stringify({ title }),
    });

    return res
  }


  // Delete a task, then fetch data
  const deleteTask = useCallback(async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl(`/api/task/delete/${id}`), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    await fetchTasks();
  }, [fetchTasks]);


  // Restore a task from trash
  const restoreTask = useCallback(async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl(`/api/task/restore/${id}`), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to restore task');
    }

    await fetchTasks();
  }, [fetchTasks]);


  // Permanently delete a task from trash
  const eraseTask = useCallback(async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(getApiUrl(`/api/task/erase/${id}`), {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      throw new Error('Failed to erase task');
    }

    await fetchTasks();
  }, [fetchTasks]);


  const closeTaskDetails = () => {
    setIsEditing(false);
    setSelectedTask(null);
  };


  // memoized context values
  const contextValues = useMemo(() => ({
    // states
    tasks,
    page,
    selectedTask,
    showDiscarded,
    isEditing,
    isLoading,

    // functions
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    selectTask,
    setPage,
    setIsEditing,
    toggleTrashView,
    closeTaskDetails,
    restoreTask,
    eraseTask,

    // filters related states and functions
    completionFilter,
    setCompletionFilter,
    sortField,
    setSortField,
    sortOrder,
    setSortOrder,
    handleCompletionFilter,
    handleSortChange
  }), [
    // State values
    tasks,
    page,
    selectedTask,
    showDiscarded,
    isEditing,
    isLoading,
    completionFilter,
    sortField,
    sortOrder,
    // Memoized functions
    fetchTasks,
    deleteTask,
    eraseTask,
    restoreTask,
    toggleTrashView,
    updateTask,
    handleSortChange
  ]);


  return (
    <TaskContext.Provider value={{ contextValues }}>
      {children}
    </TaskContext.Provider>
  );
};

