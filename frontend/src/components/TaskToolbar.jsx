import React from 'react'
import TaskForm from './TaskForm'
import { useTaskContext } from '../context/TaskContext';

function TaskToolbar() {

  const {
    completionFilter,
    handleCompletionFilter,
    handleSortChange,
    sortField,
    sortOrder,
    showDiscarded,
    isLoading
  } = useTaskContext();


  return(
    <div className="flex justify-between items-center mb-4">

      {/* To add a new task */}
      <TaskForm />

      {/* Filters and Sorting controls */}
      <div className="flex gap-2">

        {/* Completion Filter */}
        <select
          value={completionFilter}
          onChange={(e) => handleCompletionFilter(e.target.value)}
          className="px-3 py-1 rounded-md bg-gray-600 text-white text-sm hover:bg-gray-700"
          disable={(showDiscarded || isLoading).toString()}
        >
          <option value="all">All Tasks</option>
          <option value="completed">To-do</option>
          <option value="uncompleted">Done</option>
        </select>

        {/* Sort Buttons */}
        <div className="flex gap-1">
          <button
            onClick={() => handleSortChange('createdAt')}
            disabled={isLoading}
            className={`px-3 py-1 rounded-md text-sm ${
              isLoading ? 'opacity-50 cursor-not-allowed' :
              sortField === 'createdAt'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
            title={`Sort by creation date (${
              sortField === 'createdAt' && sortOrder === 'asc' ? '↑' : '↓'
            })`}
          >
            Created {sortField === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>

          <button
            onClick={() => handleSortChange('updatedAt')}
            className={`px-3 py-1 rounded-md text-sm ${
              isLoading ? 'opacity-50 cursor-not-allowed' :
              sortField === 'updatedAt'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-700'
            }`}
            title={`Sort by update date (${
              sortField === 'updatedAt' && sortOrder === 'asc' ? '↑' : '↓'
            })`}
          >
            Updated {sortField === 'updatedAt' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

    </div>
  );
};

export default React.memo(TaskToolbar);