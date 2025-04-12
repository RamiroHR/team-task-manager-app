import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import { getApiUrl } from '../utils/api';


export default function TaskTable() {

  const {tasks, fetchTasks, setSelectedTask, showDiscarded} = useContext(TaskContext);


  const handleSee = (task) => {
    setSelectedTask(task);
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


  return(
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
            {/* ID, Status, Title */}
            <div className="w-10">{task.id}</div>
            <div className="w-20">{task.completed?'done 🟢' : 'todo ⚫'}</div>
            <div className="flex-1 truncate break-all">{task.title.slice(0,50)}</div>

            {/* Actions */}
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

            {/* Dates: Created & Updated */}
            <div className="w-24 text-center">{task.createdAt.slice(0, 10)}</div>
            <div className="w-24 text-center">{task.updatedAt.slice(0, 10)}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
