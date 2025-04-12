import { createContext } from 'react';
import { useState, useEffect } from 'react';
import { getApiUrl } from '../utils/api';

// create context
export const TaskContext = createContext();


// create provider
export const TaskProvider = ({children}) => {

  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDiscarded, setShowDiscarded] = useState(false);

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