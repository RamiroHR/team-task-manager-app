import React from 'react'
import TaskForm from './TaskForm'


function TaskToolbar() {

  return(
    <div className="flex justify-between items-center mb-4">

      <TaskForm />

    </div>
  );
};

export default React.memo(TaskToolbar);