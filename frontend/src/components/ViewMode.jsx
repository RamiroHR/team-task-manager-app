// "See" task details window
import React from 'react';
import { useTaskContext } from '../context/TaskContext';

function ViewMode() {

  const { selectedTask, showDiscarded, setIsEditing } = useTaskContext()
  const task = selectedTask;

  const handleEdit = () => {
    setIsEditing(true);
  }

  return(
    <>
      {/* Task Title */}
      <h2 className="text-xl font-bold mb-4 text-blue-500 break-all whitespace-normal">{task?.title}</h2>

      {/* Task Status */}
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-l font-bold">Status:</h2>
        <p className="text-gray-400">{task?.completed ? ' 🟢 done' : ' ⚫ todo'}</p>
      </div>

      {/* Task Details */}
      <div className="items-center gap-2 mb-6">
        <h2 className="text-l font-bold">Details:</h2>
        <p className="text-gray-400 break-words whitespace-pre-wrap">{task?.description}</p>
      </div>

      {/* Task Created & Updated dates */}
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-l font-bold">Created:</h2>
        <p className="text-gray-400">{task?.createdAt.slice(0, 10)}</p>
      </div>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-l font-bold">Updated:</h2>
        <p className="text-gray-400">{task?.updatedAt.slice(0, 10)}</p>
      </div>

      {/* Non discarded task cna be editted */}
      {!showDiscarded && (
        <button
          onClick={handleEdit}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Edit
        </button>
      )}

      {/*Discarded tasks can not be editted */}
      {showDiscarded && (
        <div className="text-gray-500 italic">
          This task has been discarded and cannot be edited.
        </div>
      )}
    </>
  );
};

export default React.memo(ViewMode);