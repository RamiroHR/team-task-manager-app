import React from 'react'

export default function TaskRow({task, onSee, onDelete, showDiscarded}) {
  return(
    <li
      key={task.key}
      className="flex items-center border-b border-gray-200 py-2"
    >
      {/* ID, Status, Title */}
      <div className="w-10">{task.id}</div>
      <div className="w-20">{task.completed?'done 🟢' : 'todo ⚫'}</div>
      <div className="flex-1 truncate break-all">{task.title.slice(0,50)}</div>

      {/* Actions */}
      <div className="w-24 flex justify-center space-x-2">
        <button
          onClick={() => onSee(task)}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          See
        </button>
        {!showDiscarded && (   // desactivate button for discarded tasks
          <button
            onClick={() => onDelete(task.id)}
            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
          >
            Del
          </button>
        )}
      </div>

      {/* Dates: Created & Updated */}
      <div className="w-24 text-center">{task.createdAt.slice(0, 10)}</div>
      <div className="w-24 text-center">{task.updatedAt.slice(0, 10)}</div>
    </li>
  )

}
