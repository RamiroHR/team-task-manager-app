import React from 'react'
import { FaTrash } from "react-icons/fa";
import { BsCheckCircleFill, BsCircle } from "react-icons/bs";

function TaskRow({task, onSee, onDelete, onRestore, onErase, showDiscarded}) {

  const actionButtonStyle = "px-1 py-1 text-sm rounded border border-transparent hover:border-gray-400 hover:bg-gray-600";

  return(
    <li key={task.key} className="flex items-center border-b border-gray-200 py-1.5">

      {/* ID, Status, Title */}
      <div className="w-10">{task.id}</div>
      <div className="w-20">
        {task.completed?(
          <BsCheckCircleFill className="w-4 h-4 text-green-500" />
        ) : (
          <BsCircle className="w-4 h-4 text-gray-500" />
        )}
      </div>
      <div className="flex-1 truncate break-all">{task.title.slice(0,50)}</div>

      {/* Actions */}
      <div className="w-24 flex justify-center space-x-1">
        <button
          onClick={() => onSee(task)}
          className={actionButtonStyle}
          title= "See task"
        >
          👁️
        </button>
        {showDiscarded ? (
          // Inside Trash bin view
          <>
            <button
              onClick={() => onRestore(task.id)}
              className={actionButtonStyle}
              title="Restore task"
            >
              ♻️
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently delete this task? This action cannot be undone.')) {
                  onErase(task.id);
                }
              }}
              className={actionButtonStyle}
              title="Permanently delete"
            >
              ⛔
            </button>
          </>
        ) : (
          // Inside Home view
          <button
            onClick={() => onDelete(task.id)}
            className={actionButtonStyle}
            title="Move to trash"
          >
            {/* 🗑️ */}
            <FaTrash/>
          </button>
        )}
      </div>

      {/* Dates: Created & Updated */}
      <div className="w-24 text-center">{task.createdAt.slice(0, 10)}</div>
      <div className="w-24 text-center">{task.updatedAt.slice(0, 10)}</div>
    </li>
  );
}

export default React.memo(TaskRow);