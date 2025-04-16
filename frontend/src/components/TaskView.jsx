import React from 'react'
import { useTaskContext } from '../context/TaskContext';
import TaskToolbar from './TaskToolbar';
import TaskTable from './TaskTable';
import TaskDetails from './TaskDetails';
import Footer from './Footer';


function TaskView() {

  const { selectedTask } = useTaskContext()

  return (
    <div className="p-4">

      {/* Add new task and filters */}
      <TaskToolbar/>

      {/* Display either 'the list of tasks' or 'a single task details' */}
      {!selectedTask?
        <TaskTable/>
      :
        <TaskDetails/>
      }

      {/* Page controls and Trash bin */}
      <Footer/>

    </div>
  );
};

export default React.memo(TaskView);
