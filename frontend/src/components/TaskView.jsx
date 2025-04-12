import { useContext } from 'react';
import { TaskContext } from '../context/TaskContext';
import TaskToolbar from './TaskToolbar';
import TaskTable from './TaskTable';
import TaskDetails from './TaskDetails';
import Footer from './Footer';


const TaskView = () => {

  const { selectedTask } = useContext(TaskContext)

  return (
    <div className="p-4">

      {/* Add new task and filters */}
      <TaskToolbar/>

      {/* Display the list of tasks or a single task overview */}
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

export default TaskView;
