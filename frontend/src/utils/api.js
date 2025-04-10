const API_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint) => {

  // If there is an API_URL from env, use it, otherwise use relative path
  return API_URL ? `${API_URL}${endpoint}` : endpoint;
};