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

  // single task related states
  const [selectedTask, setSelectedTask] = useState(null);


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


  // Singe-task operations



  return (
    <TaskContext.Provider value={{
      tasks, fetchTasks,
      page, setPage,
      selectedTask, setSelectedTask,
      showDiscarded, setShowDiscarded
    }}>
      {children}
    </TaskContext.Provider>
  );
};

