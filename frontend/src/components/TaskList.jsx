import React, { useEffect, useState } from 'react';
import TaskForm from "./taskForm"
import TaskDetails from './TaskDetails';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showDiscarded, setShowDiscarded] = useState(false);

  const fetchTasks = async () => {

    const token = localStorage.getItem('token');

    // select endpoint based on showDiscarded state
    const endpoint = showDiscarded ?
      `/api/tasks/discarded/page/${page}` :
      `/api/tasks/page/${page}`;

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

    await fetch(`/api/task/edit/${id}`, {
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

    const response = await fetch(`/api/task/delete/${id}`, {
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
        `/api/tasks/discarded/page/${page+1}` :
        `/api/tasks/page/${page+1}`;

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
        `/api/tasks/discarded/page/${page-1}` :
        `/api/tasks/page/${page-1}`;

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

  // toggle view beteew deleted and non deleted tasks
  const toggleView = () => {
    setShowDiscarded(!showDiscarded);
    setPage(1);
  };


  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <TaskForm onTaskAdded={fetchTasks} />
        <div className="space-x-4">
          <button
            onClick={toggleView}
            className="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {showDiscarded ? 'Show Active Tasks' : 'Show Discarded Tasks'}
          </button>
        </div>
      </div>


      <div className="mt-6 overflow-x-auto">
        {/* Table Headers */}
        <div className="flex font-bold border-b-3 border-gray-200 pb-2">
          <div className="w-10">ID</div>
          <div className="w-20">Status</div>
          <div className="flex-1">Task</div>
          <div className="w-24 text-center">Actions</div>
          <div className="w-24 text-center">Created</div>
          <div className="w-24 text-center">Updated</div>
        </div>

        {/* Task List */}
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center border-b border-gray-200 py-2"
            >
              <div className="w-10">{task.id}</div>
              <div className="w-20">{task.completed?'done 🟢' : 'todo ⚫'}</div>
              <div className="flex-1 truncate break-all">{task.title.slice(0,50)}</div>
              <div className="w-24 flex justify-center space-x-2">
                <button
                  onClick={() => handleSee(task)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  See
                </button>
                {!showDiscarded && (   // desactivate button for discarded tasks
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Del
                  </button>
                )}
              </div>
              <div className="w-24 text-center">{task.createdAt.slice(0, 10)}</div>
              <div className="w-24 text-center">{task.updatedAt.slice(0, 10)}</div>
            </li>
          ))}
        </ul>

        {/* Modal for displaying full task title & details */}
        <TaskDetails
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
          isDiscarded={showDiscarded}
        />

        {/* Other Pages */}
        <div className="flex justify-left gap-4">
          <button
            className="mt-6 w-30 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => handlePrev(page)}>
            &lt; Previous
          </button>
          <button
            className="mt-6 w-30 py-2 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={() => handleNext(page)}
            >
            Next &gt;
          </button>
        </div>

      </div>
    </div>
  );


};

export default TaskList;
