import React, { useEffect, useState } from 'react';
import TaskDetails from './TaskDetails';
import { getApiUrl } from '../utils/api';
import TaskToolbar from './TaskToolbar';
import TaskTable from './TaskTable';
import Footer from './Footer';

const TaskView = () => {
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

  const handleSee = (task) => {
    setSelectedTask(task);
  };

  const handleUpdate = async (id, updatedData) => {
    const token = localStorage.getItem('token');

    await fetch(getApiUrl(`/api/task/edit/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    await fetchTasks();

    setSelectedTask(prev => ({
      ...prev,
      ...updatedData // overwrite the previous task details
    }));
  };


  const handleDelete = async (id) => {
    // confirmation message before deleting
    if (!window.confirm('Are you sure you want to discard this task?')) {
      return;
    }

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

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  const handleNext = async (page) => {
    if (tasks.length === 10) {
      const token = localStorage.getItem('token');

      const endpoint = showDiscarded ?
        getApiUrl(`/api/tasks/discarded/page/${page+1}`) :
        getApiUrl(`/api/tasks/page/${page+1}`);

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTasks(data);
      setPage(page+1);
    }
  }

  const handlePrev = async (page) => {
    if (page > 1) {
      const token = localStorage.getItem('token');

      const endpoint = showDiscarded ?
        getApiUrl(`/api/tasks/discarded/page/${page-1}`) :
        getApiUrl(`/api/tasks/page/${page-1}`);

      const res = await fetch(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTasks(data);
      setPage(page-1);
    }
  }

  // toggle view between deleted and non deleted tasks
  const toggleView = () => {
    setShowDiscarded(!showDiscarded);
    setPage(1);
  };


  return (
    <div className="p-4">

      <TaskToolbar
        onTaskAdded={fetchTasks}
        toggleView={toggleView}
        showDiscarded={showDiscarded}
      />

      <TaskTable
          tasks={tasks}
          handleSee={handleSee}
          handleDelete={handleDelete}
          showDiscarded={showDiscarded}
      />

      <TaskDetails
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        isDiscarded={showDiscarded}
      />

      <Footer
        page={page}
        handlePrev={handlePrev}
        handleNext={handleNext}
        toggleView={toggleView}
        showDiscarded={showDiscarded}
      />

    </div>
  );


};

export default TaskView;
