import React from 'react'
import { useTaskContext } from '../context/TaskContext';
import Modal from './Modal';
import ViewMode from './ViewMode';
import EditMode from './EditMode';

function TaskDetails() {

  const { isEditing, closeTaskDetails } = useTaskContext()

  return (
    <Modal onClose={closeTaskDetails}>
      {!isEditing ?
        <ViewMode/>
      :
        <EditMode/>
      }
    </Modal>
  );
};

export default React.memo(TaskDetails);