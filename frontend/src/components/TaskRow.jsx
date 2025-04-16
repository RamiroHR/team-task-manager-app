import React from 'react'

function TaskRow({task, onSee, onDelete, onRestore, onErase, showDiscarded}) {
  return(
    <li key={task.key} className="flex items-center border-b border-gray-200 py-2">

      {/* ID, Status, Title */}
      <div className="w-10">{task.id}</div>
      <div className="w-20">{task.completed?'done 🟢' : 'todo ⚫'}</div>
      <div className="flex-1 truncate break-all">{task.title.slice(0,50)}</div>

      {/* Actions */}
      <div className="w-24 flex justify-center space-x-1">
        <button
          onClick={() => onSee(task)}
          className="px-1 py-1 text-sm text-white rounded hover:border hover:bg-gray-600"
          title= "See task"
        >
          👁️
        </button>
        {showDiscarded ? (
          // Inside Trash bin view
          <>
            <button
              onClick={() => onRestore(task.id)}
              className="px-1 py-1 text-sm text-white rounded hover:border hover:bg-gray-600"
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
              className="px-1 py-1 text-sm text-white rounded hover:border hover:bg-gray-600"
              title="Permanently delete"
            >
              ⛔
            </button>
          </>
        ) : (
          // Inside Home view
          <button
            onClick={() => onDelete(task.id)}
            className="px-1 py-1 text-sm text-white rounded hover:border hover:bg-gray-600"
            title="Move to trash"
          >
            🗑️
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