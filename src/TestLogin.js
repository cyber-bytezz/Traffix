import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/authService';

function TestLogin() {
  const [copId, setCopId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const loginData = {
        copId: copId,
        password: password,
        loginType: 'traffic-cop'
      };

      console.log('Submitting login data:', loginData);
      
      const response = await authService.login(loginData);
      
      console.log('Login response:', response);
      setResult('SUCCESS: ' + JSON.stringify(response, null, 2));
      
      if (response.success) {
        setTimeout(() => {
          navigate('/traffic-cop-dashboard');
        }, 2000);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('ERROR: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Login</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Cop ID</label>
            <input
              type="text"
              value={copId}
              onChange={(e) => setCopId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter COP001"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter test123!"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div className="mt-6 p-4 bg-gray-100 rounded-md">
          <h3 className="font-medium mb-2">Test Credentials:</h3>
          <p className="text-sm">Cop ID: <strong>COP001</strong></p>
          <p className="text-sm">Password: <strong>test123!</strong></p>
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        {result && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            <pre className="text-xs whitespace-pre-wrap">{result}</pre>
          </div>
        )}
        
        <div className="mt-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded text-sm">
          <strong>Debug Info:</strong><br/>
          Cop ID: "{copId}"<br/>
          Password: "{password}"<br/>
          Login Type: "traffic-cop"
        </div>
      </div>
    </div>
  );
}

export default TestLogin; 