import { StrictMode, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation }  from 'react-router-dom';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/auth/verify', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token')
            setIsAuthenticated(false)
          }

        } catch (error) {
          localStorage.removeItem('token')
          setIsAuthenticated(false)
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    verifyToken();
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
    <div className="max-w-4xl mx-auto p-4 sm:max-w-2xl md:max-w-4xl lg:max-w-4xl">
      <Header
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        isLoginPage={isLoginPage}
      />
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
  );
};

export default App;
