import { useCallback } from 'react'
import { useTaskContext } from '../context/TaskContext';
import TaskRow from './TaskRow'


export default function TaskTable() {
  const {tasks, selectTask, showDiscarded, deleteTask} = useTaskContext();

  const handleSee = useCallback((task) => {
    selectTask(task);
  }, [selectTask]);

  const handleDelete = useCallback(async (id) => {
    // confirmation message before deleting
    if (!window.confirm('Are you sure you want to discard this task?')) {
      return;
    }
    // proceed to delete after confirmation
    await deleteTask(id)
  }, [deleteTask])

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
          <TaskRow
            key={task.id}
            task={task}
            onSee={handleSee}
            onDelete={handleDelete}
            showDiscarded={showDiscarded}
          />
        ))}
      </ul>
    </div>
  );
}
