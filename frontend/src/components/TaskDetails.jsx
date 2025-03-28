import React, { useState, useEffect} from 'react';
import Modal from './Modal';

const TaskDetails = ({ task, isOpen, onClose, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedStatus, setEditedStatus] = useState(task?.completed || false);
  const [error, setError] = useState('')

  const MAX_TITLE_LENGTH = 50;
  const MIN_TITLE_LENGTH = 2;

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedStatus(task.completed);
    }
  }, [task]);

  const handleEdit = () => {
    setEditedTitle(task.title);
    setEditedStatus(task.completed);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (editedTitle.length < MIN_TITLE_LENGTH) {
      setError(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
      return;
    }
    if (editedTitle.length >= MAX_TITLE_LENGTH) {
      setError(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
      return;
    }

    await onUpdate(task.id, {
      title: editedTitle,
      completed: editedStatus
    });

    setError('')
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
    onClose();
  };


  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {!isEditing ? (
        // View Mode
        <>
          <h2 className="text-xl font-bold mb-4">{task?.title}</h2>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-l font-bold">Status:</h2>
            <p className="text-gray-400">{task?.completed ? ' 🟢 done' : ' ⚫ todo'}</p>
          </div>
          <div className="items-center gap-2 mb-6">
            <h2 className="text-l font-bold">Details:</h2>
            <p className="text-gray-400">{task?.title}</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-l font-bold">Created:</h2>
            <p className="text-gray-400">{task?.createdAt.slice(0, 10)}</p>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-l font-bold">Updated:</h2>
            <p className="text-gray-400">{task?.updatedAt.slice(0, 10)}</p>
          </div>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Edit
          </button>
        </>
      ) : (
        // Edit Mode
        <>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Title:</label>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 bg-gray-700 rounded text-white"
              maxLength={MAX_TITLE_LENGTH}
              //minLength={MIN_TITLE_LENGTH}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold mb-2">Status:</label>
            <select
              value={editedStatus}
              onChange={(e) => setEditedStatus(e.target.value === 'true')}
              className="w-full p-2 bg-gray-700 rounded text-white"
            >
              <option value={false}>Todo</option>
              <option value={true}>Done</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default TaskDetails;