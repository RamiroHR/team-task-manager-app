import { StrictMode, useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useLocation }  from 'react-router-dom';
import Header from './components/Header';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';

const App = () => {
  // 1- state variables
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state


  // 2- useEffect logic definition
  useEffect(() => {
    const verifyToken = async () => {

      // await new Promise(resolve => setTimeout(resolve, 2000));  // to test the spinner only

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
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }

        } catch (error) {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false); // Set loading to false when verification is complete
    };

    verifyToken();
  }, []);


  // 3- handle functions definitions
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


  // 4- Don't render anything while verifying token (inside useEffect)
  const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (isLoading) {
    return <LoadingSpinner />
  }


  // 5- Render Main app only after isLoading is false
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
