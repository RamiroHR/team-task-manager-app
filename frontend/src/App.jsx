import Header from "./components/Header";
import TaskList from './components/TaskList';


function App() {
  return (
    <>
      <div className="container mx-auto p-4">
        <Header />
        <TaskList />
      </div>
    </>
  );
}

export default App;
