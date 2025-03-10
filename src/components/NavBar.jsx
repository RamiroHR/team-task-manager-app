import taskLogo from '../assets/tasks-icon.png'

export default function TasksType() {
  return(
    <header className="bar-header">
      <img src={taskLogo} className="task-logo" alt="Task Logo" />
      <nav>
        <ul className="task-type-list">
          <li>ToDo</li>
          <li>Done</li>
        </ul>
      </nav>
    </header>
  )
}