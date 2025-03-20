import Header from "./components/Header";
import TaskList from './components/TaskList';


function App() {
  return (
    <>
      <div className="max-w-7xl mx-auto p-4 sm:max-w-full md:max-w-7xl">
        <Header />
        <TaskList />
      </div>
    </>
  );
}

export default App;
