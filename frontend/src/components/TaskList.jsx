import React, { useEffect, useState } from 'react';
import TaskForm from "./taskForm"
// import Modal from './Modal';
import TaskDetails from './TaskDetails';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/tasks/page/${page}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

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
    const token = localStorage.getItem('token'); // Get the token from localStorage
    await fetch(`/api/task/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the headers
      }
    });
    fetchTasks();
  }

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsEditing(false);
  };

  const handleNext = async (page) => {
    if (tasks.length === 10) {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const res = await fetch(`/api/tasks/page/${page+1}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      const data = await res.json();
      setTasks(data);
      setPage(page+1);
    }
  }

  const handlePrev = async (page) => {
    if (page > 1) {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      const res = await fetch(`/api/tasks/page/${page-1}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
      });
      const data = await res.json();
      setTasks(data);
      setPage(page-1);
    }
  }

  return (
    <div className="p-4">
      <TaskForm onTaskAdded={fetchTasks} />
      <div className="mt-6 overflow-x-auto">

        {/* Table Headers */}
        <div className="flex font-bold border-b-2 border-gray-200 pb-2 min-w-[1200px]">
          <div className="w-1/24">ID</div>
          <div className="w-1/15">Status</div>
          <div className="w-4/12">Task</div>
          <div className="w-2/20">Actions</div>
          <div className="w-1/12">Created</div>
          <div className="w-1/12">Updated</div>
        </div>

        {/* Task List */}
        <ul className="min-w-[1200px]">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center border-b border-gray-200 py-2"
            >
              <div className="w-1/24">{task.id}</div>
              <div className="w-1/15">{task.completed?'done 🟢' : 'todo ⚫'}</div>
              <div className="w-4/12">{task.title.slice(0,50)}</div>
              <div className="w-2/20 flex space-x-2">
                <button
                  onClick={() => handleSee(task)}
                  className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  See
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Del
                </button>
              </div>
              <div className="w-1/12">{task.createdAt.slice(0, 10)}</div>
              <div className="w-1/12">{task.updatedAt.slice(0, 10)}</div>
            </li>
          ))}
        </ul>

        {/* Modal for displaying full task title & details */}
        <TaskDetails
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={handleCloseModal}
          onUpdate={handleUpdate}
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
