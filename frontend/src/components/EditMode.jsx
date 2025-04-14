// "Edit" task window

import { useState, useEffect } from 'react'
import { useTaskContext } from '../context/TaskContext'

export default function EditMode() {

  const { selectedTask, setIsEditing, updateTask } = useTaskContext()

  const task = selectedTask;
  const [editedTitle, setEditedTitle] = useState(task?.title || '');
  const [editedDescription, setEditedDescription] = useState(task?.description || '');
  const [editedStatus, setEditedStatus] = useState(task?.completed || false);
  const [errorTitle, setErrorTitle] = useState('')
  const [errorDescr, setErrorDescr] = useState('')

  const MAX_TITLE_LENGTH = 50;
  const MIN_TITLE_LENGTH = 2;
  const MAX_DESCRIPTION_LENGTH = 512;

  useEffect(() => {
    if (task) {
      setEditedTitle(task.title);
      setEditedDescription(task.description);
      setEditedStatus(task.completed);
    }
  }, [task]);

  // Save task details
  const handleSave = async () => {

    setErrorTitle('');
    setErrorDescr('');

    // Set error messages & stops if there is an error
    const hasTitleError = validateTitle()
    const hasDescriptionError = validateDescription()

    if (hasTitleError || hasDescriptionError) {
      return;
    }

    // If no errors, proceeed to update, database, task list and selected task details
    const updatedData = {
      title: editedTitle,
      description: editedDescription,
      completed: editedStatus
    }
    await updateTask(task.id, updatedData)
  };


  // Validate title
  const validateTitle = () => {
    let hasTitleError = false;
    if (editedTitle.length < MIN_TITLE_LENGTH) {
      setErrorTitle(`Title must be at least ${MIN_TITLE_LENGTH} characters`);
      hasTitleError = true;
    } else if (editedTitle.length >= MAX_TITLE_LENGTH) {
      setErrorTitle(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
      hasTitleError = true;
    }
    return hasTitleError
  }

  // Validate description
  const validateDescription = () => {
    let hasDescriptionError = false;
    if (editedDescription.length >= MAX_DESCRIPTION_LENGTH) {
      setErrorDescr(`Details field must be less than ${MAX_DESCRIPTION_LENGTH} characters`);
      hasDescriptionError = true;
    }
    return hasDescriptionError
  }

  // on Cancel button
  const handleCancel = () => {
    setIsEditing(false);
  }

  return(
    <>

      {/* Title */}
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
        {errorTitle && <p className="text-red-500 text-sm mt-1">{errorTitle}</p>}
      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Details:</label>
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="w-full p-2 bg-gray-700 rounded text-white min-h-[300px] max-h-[600px]"
          maxLength={MAX_DESCRIPTION_LENGTH}
          row={4}
        />
        {errorDescr && <p className="text-red-500 text-sm mt-1">{errorDescr}</p>}
      </div>

      {/* Task Status */}
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

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </>
  )
}