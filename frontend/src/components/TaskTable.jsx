import { useCallback } from 'react'
import { useTaskContext } from '../context/TaskContext';
import TaskRow from './TaskRow'


export default function TaskTable() {
  const {tasks, selectTask, showDiscarded, deleteTask, restoreTask, eraseTask} = useTaskContext();

  const handleSee = useCallback((task) => {
    selectTask(task);
  }, [selectTask]);

  const handleDelete = useCallback(async (id) => {
    // confirmation message before deleting
    if (!window.confirm('Are you sure you want to move this task to trash?')) {
      return;
    }
    // proceed to delete after confirmation
    await deleteTask(id)
  }, [deleteTask]);

  const handleRestore = useCallback(async (id) => {
    try {
      await restoreTask(id);
    } catch (error) {
      console.error('Falied to restore task', error);
    }
  },[restoreTask]);

  const handleErase = useCallback(async (id) => {
    try {
      await eraseTask(id);
    } catch (error) {
      console.error('Falied to erase task', error);
    }
  },[eraseTask]);

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
            onRestore={handleRestore}
            onErase={handleErase}
            showDiscarded={showDiscarded}
          />
        ))}
      </ul>
    </div>
  );
}
