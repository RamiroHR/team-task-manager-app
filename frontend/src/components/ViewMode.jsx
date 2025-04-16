// "See" task details window
import React from 'react';
import { useTaskContext } from '../context/TaskContext';
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";

function ViewMode() {

  const { selectedTask, showDiscarded, setIsEditing } = useTaskContext()
  const task = selectedTask;

  // const formatDateTime = (dateString) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleString('en-US', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     second: '2-digit',
  //     hour12: false
  //   });
  // };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);

    // Format for the date/time
    const localDateTime = date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return `${localDateTime}`;
  };

  const localTimezone = () => {
    // Get timezone name
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return `${timeZone}`
  }


  const handleEdit = () => {
    setIsEditing(true);
  }

  return(
    <>
      {/* Task Title */}
      <h2 className="text-xl font-bold mb-4 text-blue-500 break-all whitespace-normal">{task?.title}</h2>

      {/* Task Status and ID*/}
      <div className="flex justify-between items-center mb-6">
        {/* Status */}
        <div className="flex items-center gap-2 ">
          <h2 className="text-l font-bold">Status:</h2>
          <div className="flex items-center gap-1 text-gray-400">
            {task?.completed ? (
              <>
                <BsCheckCircleFill className="w-4 h-4 text-green-500" />
                <span>done</span>
              </>
            ) : (
              <>
                <BsCircle className="w-4 h-4 text-gray-500" />
                <span>To-do</span>
              </>
            )}
          </div>
        </div>
        {/* Task ID */}
        <div className="flex items-center gap-1 text-gray-400">
          <span className="text-l font-bold">Task ID:</span>
          <span>{task?.id}</span>
        </div>
      </div>

      {/* Task Details */}
      <div className="items-center gap-2 mb-6">
        <h2 className="text-l font-bold">Details:</h2>
        <p className="text-gray-400 break-words whitespace-pre-wrap">{task?.description}</p>
      </div>

      {/* Task Created & Updated dates */}
      <div className="flex flex-col gap-2 mb-2">
        <div className="flex items-center">
          <h2 className="text-l font-bold w-20">Created:</h2>
          <p className="text-gray-400">{task?.createdAt && formatDateTime(task.createdAt)}</p>
        </div>
        <div className="flex items-center">
          <h2 className="text-l font-bold w-20">Updated:</h2>
          <p className="text-gray-400">{task?.updatedAt && formatDateTime(task.updatedAt)}</p>
        </div>
        <div className="text-xs text-gray-400 italic mt-1">Times shown in your local timezone: {localTimezone()}</div>
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