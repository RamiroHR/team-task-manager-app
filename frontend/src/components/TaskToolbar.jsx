import TaskForm from "./TaskForm"

export default function TaskToolbar({onTaskAdded}) {
  return(
    <div className="flex justify-between items-center mb-4">

      <TaskForm onTaskAdded={onTaskAdded} />

    </div>
  );
}