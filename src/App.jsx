import taskLogo from './assets/tasks-icon.png'
import './App.css'

import Header from "./components/Header"
import TasksType from "./components/NavBar"
import Tasks from "./components/Tasks"

function App() {
  return (
    <>
      <Header />
      <TasksType />
      <Tasks />
    </>
  )
}

export default App
