import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api', // Replace with your actual API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock login function for testing (remove this when you have a real backend)
const mockLogin = async (loginData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock validation
  const { copId, administration, employeeId, password, loginType } = loginData;
  
  // Validate password requirements
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters long');
  }
  
  if (!/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/.test(password)) {
    throw new Error('Password must contain at least one special character');
  }
  
  // Check if credentials match valid ranges
  let isValidId = false;
  let userId = '';
  
  if (loginType === 'traffic-cop') {
    userId = copId;
    // Validate COP ID format: COP001 to COP999
    if (/^cop\d{3}$/i.test(copId)) {
      const number = parseInt(copId.slice(3));
      if (number >= 1 && number <= 999) {
        isValidId = true;
      }
    }
  } else if (loginType === 'traffic-central') {
    userId = administration;
    // Validate ADMIN ID format: ADMIN001 to ADMIN999
    if (/^admin\d{3}$/i.test(administration)) {
      const number = parseInt(administration.slice(5));
      if (number >= 1 && number <= 999) {
        isValidId = true;
      }
    }
  } else if (loginType === 'emergency-services') {
    userId = employeeId;
    // Validate EMP ID format: EMP001 to EMP999
    if (/^emp\d{3}$/i.test(employeeId)) {
      const number = parseInt(employeeId.slice(3));
      if (number >= 1 && number <= 999) {
        isValidId = true;
      }
    }
  }
  
  if (isValidId) {
    // Generate a proper MongoDB ObjectId format (24 hex characters)
    const generateObjectId = () => {
      const timestamp = Math.floor(new Date().getTime() / 1000).toString(16).padStart(8, '0');
      const randomPart = Math.random().toString(16).slice(2, 14).padStart(16, '0');
      return timestamp + randomPart;
    };

    const userData = {
      success: true,
      token: 'mock_jwt_token_' + Date.now(),
      user: {
        _id: generateObjectId(),
        id: userId,
        name: 'Test User',
        role: loginType
      },
      message: 'Login successful'
    };
    // Store the user data in localStorage
    localStorage.setItem('userData', JSON.stringify(userData.user));
    localStorage.setItem('authToken', userData.token);
    return userData;
  } else {
    throw new Error('Invalid ID format. Please use correct format (COP001-COP999, ADMIN001-ADMIN999, or EMP001-EMP999)');
  }
};

// Auth service functions
export const authService = {
  // Login function
  login: async (loginData) => {
    try {
      // Use mock login for testing (comment this out when you have a real backend)
      const response = await mockLogin(loginData);
      // Store user data and token
      localStorage.setItem('userData', JSON.stringify(response.user));
      localStorage.setItem('authToken', response.token);
      return response;
      
      // Uncomment this when you have a real backend
      // const response = await api.post('/login', loginData);
      // localStorage.setItem('userData', JSON.stringify(response.data.user));
      // localStorage.setItem('authToken', response.data.token);
      // return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout function
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Get stored user data
  getUserData: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Store user data
  setUserData: (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData));
  },
};

export default api; 