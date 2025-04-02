import { StrictMode, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
/*import './index.css';*/
import Header from './components/Header';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleRegister = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="max-w-4xl mx-auto p-4 sm:max-w-2xl md:max-w-4xl lg:max-w-4xl">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout}/>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <TaskList /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={<Login onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={<Register onRegister={handleRegister} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
