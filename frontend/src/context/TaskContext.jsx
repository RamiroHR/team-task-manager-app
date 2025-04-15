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


  // View-Mode operations

  const toggleTrashView = () => {
    setShowDiscarded(!showDiscarded);
    setPage(1);
  }



  // Single-task operations

  const selectTask = (task) => {
    setSelectedTask(task);
    setIsEditing(false);
  }


  // Update selected Task (front + back)
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
  const deleteTask = async (id) => {
    const token = localStorage.getItem('token');

    const response = await fetch(getApiUrl(`/api/task/delete/${id}`), {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }

    await fetchTasks();
  }


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
      addTask,
      updateTask,
      deleteTask,
      selectTask,
      setPage,
      setIsEditing,
      toggleTrashView,
      closeTaskDetails
    }}>
      {children}
    </TaskContext.Provider>
  );
};

