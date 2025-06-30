import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from './services/authService';
import policeLogo from './images/virtusa logo.png';
import CanvasBackground from './CanvasBackground';

function LoginPageSimple() {
  const [activeTab, setActiveTab] = useState('traffic-cop');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    copId: '',
    administration: '',
    employeeId: '',
    password: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Simple form submitted with data:', formData);
    console.log('Active tab:', activeTab);
    
    setIsLoading(true);
    setLoginError('');

    try {
      // Prepare login data
      const loginData = {
        ...formData,
        loginType: activeTab
      };
      
      console.log('Login data being sent:', loginData);

      // Use auth service for login
      const response = await authService.login(loginData);
      
      console.log('Login response:', response);

      if (response.success) {
        // Store token if your API returns one
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          console.log('Token stored:', response.token);
        }

        // Store user data if provided
        if (response.user) {
          authService.setUserData(response.user);
          console.log('User data stored:', response.user);
        }

        // Navigate based on login type
        switch (activeTab) {
          case 'traffic-cop':
            console.log('Navigating to traffic-cop-dashboard');
            navigate('/traffic-cop-dashboard');
            break;
          case 'traffic-central':
            console.log('Navigating to traffic-central-dashboard');
            navigate('/traffic-central-dashboard');
            break;
          case 'emergency-services':
            console.log('Navigating to emergency-services');
            navigate('/emergency-services');
            break;
          default:
            console.log('Navigating to home');
            navigate('/');
        }
      } else {
        setLoginError(response.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError(error.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const loginOptions = [
    {
      id: 'traffic-cop',
      title: 'Traffic Cop Login',
      icon: '🚔',
      fields: [
        { name: 'copId', label: 'Cop ID', type: 'text', placeholder: 'Enter your Cop ID' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
      ]
    },
    {
      id: 'traffic-central',
      title: 'Traffic Central Login',
      icon: '🏢',
      fields: [
        { name: 'administration', label: 'Administration', type: 'text', placeholder: 'Enter administration ID' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
      ]
    },
    {
      id: 'emergency-services',
      title: 'Emergency Services',
      icon: '🚨',
      fields: [
        { name: 'employeeId', label: 'Employee ID', type: 'text', placeholder: 'Enter your Employee ID' },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password' }
      ]
    }
  ];

  return (
    <div className="h-screen w-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
      {/* Fixed Header at the Top */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center bg-transparent" style={{pointerEvents: 'auto'}}>
        <nav className="w-[98vw] max-w-[1800px] mt-2 rounded-2xl border border-white/20 bg-[#23233a]/80 shadow-lg flex items-center px-8 py-4 justify-between" style={{backdropFilter: 'blur(12px)'}}>
          <div className="flex items-center">
            <div className="relative w-[80px] h-[80px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full rounded-full border-2 border-cyan-400/60"></div>
              </div>
              <img src={policeLogo} alt="Virtusa Logo" className="h-[64px] w-[64px] object-contain relative z-10" />
            </div>
            <div className="flex flex-col items-start justify-center ml-4">
              <span className="text-4xl font-extrabold bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent" style={{letterSpacing: '1px'}}>Traffix</span>
              <span className="text-white text-lg mt-1">Secure Access Portal (Simple Version)</span>
            </div>
          </div>
          <div className="flex items-center gap-8 mr-2 ml-auto">
            <button className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-base shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5" onClick={() => navigate('/')}>Home</button>
          </div>
        </nav>
      </header>
      <div className="min-h-full font-sans relative flex items-center justify-center py-12" style={{marginTop: '110px'}}>
        {/* Animated Background Particles (Canvas) */}
        <CanvasBackground />

        <div className={`w-full max-w-[1200px] p-8 opacity-0 translate-y-12 transition-all duration-1000 z-10 relative ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
          {/* Main Login Section */}
          <main className="flex justify-center items-center">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-12 border border-white/10 shadow-2xl w-full max-w-[600px] relative overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex gap-4 mb-12 relative z-10">
                {loginOptions.map((option, index) => (
                  <button
                    key={option.id}
                    className={`group flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl font-semibold text-white cursor-pointer px-4 py-2 rounded-full transition-all relative overflow-hidden nav-item ${activeTab === option.id ? 'bg-[#00d4ff]/20' : 'hover:bg-white/10'}`}
                    onClick={() => setActiveTab(option.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] transition-all duration-500 opacity-0 group-hover:opacity-25 blur-2xl"></div>
                    <span className="relative z-10 text-2xl mb-1 transition-transform duration-300 ease-in-out group-hover:-translate-y-1.5">{option.icon}</span>
                    <span className="relative z-10 text-base font-bold">{option.title}</span>
                    {activeTab === option.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Login Forms */}
              <div>
                {loginOptions.map((option) => (
                  <form
                    key={option.id}
                    className={`transition-opacity duration-500 ${activeTab === option.id ? 'opacity-100 block' : 'opacity-0 hidden'}`}
                    onSubmit={handleSubmit}
                  >
                    {/* Form Header */}
                    <div className="mb-6 text-center">
                      <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent">{option.title}</div>
                      <div className="text-white/80 text-sm">Enter your credentials to access the system</div>
                    </div>
                    <div>
                      {option.fields.map((field, fieldIndex) => (
                        <div key={field.name} className="mb-6">
                          <label htmlFor={`${option.id}-${field.name}`} className="block text-white/80 mb-2 font-medium">{field.label}</label>
                          <input
                            type={field.type}
                            id={`${option.id}-${field.name}`}
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={(e) => handleInputChange(field.name, e.target.value)}
                            className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                          />
                        </div>
                      ))}
                    </div>
                    {/* Login Error Display */}
                    {loginError && (
                      <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm text-center">{loginError}</p>
                      </div>
                    )}
                    <div className="flex justify-center mt-8">
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className={`bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-base shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`} 
                        style={{letterSpacing: '2px'}}
                      >
                        {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-8 text-sm text-white/60">
                      <button type="button" className="hover:text-white transition-colors" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                    </div>
                  </form>
                ))}
              </div>

              <div className="mt-4 text-center text-white/60 text-sm">
                <p>Test Credentials:</p>
                <p>Cop ID: COP001</p>
                <p>Password: test123!</p>
              </div>
              
              {/* Debug Info */}
              <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-400 text-xs text-center">
                  <strong>Debug Info:</strong><br/>
                  Current form data: {JSON.stringify(formData)}<br/>
                  Active tab: {activeTab}
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default LoginPageSimple; 