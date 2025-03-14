import React, { useEffect, useState } from 'react';
import TaskForm from "./taskForm"

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(data);
};

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-4">
      <TaskForm onTaskAdded={fetchTasks} />
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2">
            {task.id} | {task.title} --- (created: {task.createdAt.slice(0,10)} // updated: {task.updatedAt.slice(0,10)} )
          </li>
        ))}
      </ul>
    </div>
  );
};


export default TaskList;
