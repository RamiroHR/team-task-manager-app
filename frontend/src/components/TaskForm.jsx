import React, { useState } from 'react';
import { getApiUrl } from '../utils/api';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent the form refreshing the page
    const token = localStorage.getItem('token'); // Get the token from localStorage

    try {
      // Send a POST request to the backend
      const res = await fetch(getApiUrl('/api/task/new'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({ title }),
      });

      const data = await res.json(); // Parse the response as JSON

      if (res.ok) {
        onTaskAdded(data);    // Notify the parent component to update the ui
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

export default TaskForm;
