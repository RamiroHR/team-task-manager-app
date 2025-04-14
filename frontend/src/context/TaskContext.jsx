import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';
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


  // List-related operations
  const fetchTasks = async () => {
    const token = localStorage.getItem('token');

    // select endpoint based on showDiscarded state
    const endpoint = showDiscarded ?
      getApiUrl(`/api/tasks/discarded/page/${page}`) :
      getApiUrl(`/api/tasks/page/${page}`);

    const res = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTasks(data);
  };


  useEffect(() => {
    fetchTasks();
  }, [page, showDiscarded]);


  const toggleDiscardedView = () => {
    setShowDiscarded(!showDiscarded);
    setPage(1);
  }


  // Single-task operations

  const updateTask = async(taskId, updatedData) => {
    await updateDatabase(taskId, updatedData);
    await fetchTasks();

    setSelectedTask(prev => ({
      ...prev,
      ...updatedData // overwrite the previous task details
    }));

    setIsEditing(false);
  }


  // Update DataBase
  const updateDatabase = async (id, updatedData) => {
    const token = localStorage.getItem('token');

    await fetch(getApiUrl(`/api/task/edit/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });
  };


  const closeTaskDetails = () => {
    setIsEditing(false);
    setSelectedTask(null);
  };


  return (
    <TaskContext.Provider value={{
      // states
      tasks,
      page,
      selectedTask,
      showDiscarded,
      isEditing,

      // functions
      fetchTasks,
      setPage,
      setSelectedTask,
      toggleDiscardedView,
      setIsEditing,
      updateTask,
      closeTaskDetails
    }}>
      {children}
    </TaskContext.Provider>
  );
};

