import { useState, useEffect, createContext } from 'react';
import { getApiUrl } from '../utils/api';

// create context
export const AuthContext = createContext();


// create context provider
export const AuthProvider = ({children}) => {

  // 1- state variables
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);


  // 2- side effects logic
  useEffect(() => {
    const verifyToken = async () => {

      // await new Promise(resolve => setTimeout(resolve, 2000));  // to test the spinner only

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(getApiUrl('/api/auth/verify'), {
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


  // 3- authentication state management functions
  const onLogin = () => {
    setIsAuthenticated(true);
  };

  const onLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={ {isAuthenticated, isLoading, onLogin, onLogout} }>
        {children}
    </AuthContext.Provider>
  );
};