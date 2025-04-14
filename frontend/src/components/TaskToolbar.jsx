import { useTaskContext } from '../context/TaskContext';
import TaskForm from "./TaskForm"


export default function TaskToolbar() {

  const { fetchTasks } = useTaskContext();

  return(
    <div className="flex justify-between items-center mb-4">

      <TaskForm onTaskAdded={fetchTasks} />

    </div>
  );
}