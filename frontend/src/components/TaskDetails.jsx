import { useState, useEffect} from 'react';
import { useTaskContext } from '../context/TaskContext';
import { getApiUrl } from '../utils/api';
import Modal from './Modal';

const TaskDetails = () => {

  const { fetchTasks, selectedTask, setSelectedTask, isDiscarded } = useTaskContext()

  const task = selectedTask
  const [isEditing, setIsEditing] = useState(false);
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

  const handleEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedStatus(task.completed);
    setIsEditing(true);
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

  // write update
  const onUpdate = async (id, updatedData) => {
    const token = localStorage.getItem('token');

    await fetch(getApiUrl(`/api/task/edit/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    await fetchTasks();

    setSelectedTask(prev => ({
      ...prev,
      ...updatedData // overwrite the previous task details
    }));
  };

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

    // Proceeed to save edits if no error
    await onUpdate(task.id, {
      title: editedTitle,
      description: editedDescription,
      completed: editedStatus
    });

    setIsEditing(false);
  };


  const handleClose = () => {
    setIsEditing(false);
    setSelectedTask(null);
  };


  return (
    <Modal onClose={handleClose}>

      {!isEditing ? (

        // View Mode
        <>
          <h2 className="text-xl font-bold mb-4 text-blue-500 break-all whitespace-normal">{task?.title}</h2>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-l font-bold">Status:</h2>
            <p className="text-gray-400">{task?.completed ? ' 🟢 done' : ' ⚫ todo'}</p>
          </div>
          <div className="items-center gap-2 mb-6">
            <h2 className="text-l font-bold">Details:</h2>
            <p className="text-gray-400 break-words whitespace-pre-wrap">{task?.description}</p>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-l font-bold">Created:</h2>
            <p className="text-gray-400">{task?.createdAt.slice(0, 10)}</p>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-l font-bold">Updated:</h2>
            <p className="text-gray-400">{task?.updatedAt.slice(0, 10)}</p>
          </div>
          {!isDiscarded && (
            <button
              onClick={handleEdit}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          )}
            {isDiscarded && (  // Show a message if task is discarded
            <div className="text-gray-500 italic">
              This task has been discarded and cannot be edited.
            </div>
          )}
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
            {errorTitle && <p className="text-red-500 text-sm mt-1">{errorTitle}</p>}
          </div>
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