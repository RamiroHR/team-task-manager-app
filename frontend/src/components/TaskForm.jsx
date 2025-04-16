import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';

export default function TaskForm() {
  const { addTask, fetchTasks } = useTaskContext()

  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the form refreshing the page

    try {
      const res = await addTask(title)
      const data = await res.json();

      if (res.ok) {
        fetchTasks();        // Update parent
        setTitle('');         // Clear the input field
        setError('');         // Remove previous Errors
      } else {
        setError(data.error || 'Invalid task title')
      }

    } catch (err) {
      setError('An error ocurred. Please Try again.');
    }
  };

  return (
    <div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task"
          className="p-2 border rounded"
        />
        <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded">
          Add
        </button>
      </form>
    </div>
  );
};

