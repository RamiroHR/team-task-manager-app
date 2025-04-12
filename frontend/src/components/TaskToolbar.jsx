import { useContext } from 'react'
import { TaskContext } from '../context/TaskContext';
import TaskForm from "./TaskForm"


export default function TaskToolbar() {

  const { fetchTasks } = useContext(TaskContext);

  return(
    <div className="flex justify-between items-center mb-4">

      <TaskForm onTaskAdded={fetchTasks} />

    </div>
  );
}