import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  // State variables
  const { isAuthenticated, isLoading } = useContext(AuthContext);


  // Don't render anything while verifying token (inside useEffect)
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />
  }


  // Render Main app only after isLoading is false
  return (
    <div className="max-w-4xl mx-auto p-4 sm:max-w-2xl md:max-w-4xl lg:max-w-4xl">
      <Header />
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </div>
  );
};

export default App;
