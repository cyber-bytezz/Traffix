import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authService } from './services/authService';
// import './LoginPage.css';
import policeLogo from './images/virtusa logo.png';
import CanvasBackground from './CanvasBackground';

// Validation schemas for different login types
const trafficCopSchema = yup.object({
  copId: yup
    .string()
    .required('Cop ID is required')
    .matches(/^cop\d{3}$/i, 'Enter correct COP ID (e.g., COP001)')
    .test('cop-number', 'COP ID must be between COP001 and COP999', function(value) {
      if (!value) return false;
      const number = parseInt(value.slice(3));
      return number >= 1 && number <= 999;
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/, 'Password must contain at least one special character')
});

const trafficCentralSchema = yup.object({
  administration: yup
    .string()
    .required('Administration ID is required')
    .matches(/^admin\d{3}$/i, 'Enter correct Admin ID (e.g., ADMIN001)')
    .test('admin-number', 'Admin ID must be between ADMIN001 and ADMIN999', function(value) {
      if (!value) return false;
      const number = parseInt(value.slice(5));
      return number >= 1 && number <= 999;
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/, 'Password must contain at least one special character')
});

const emergencyServicesSchema = yup.object({
  employeeId: yup
    .string()
    .required('Employee ID is required')
    .matches(/^emp\d{3}$/i, 'Enter correct Employee ID (e.g., EMP001)')
    .test('emp-number', 'Employee ID must be between EMP001 and EMP999', function(value) {
      if (!value) return false;
      const number = parseInt(value.slice(3));
      return number >= 1 && number <= 999;
    }),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/, 'Password must contain at least one special character')
});

function LoginPage() {
  const [activeTab, setActiveTab] = useState('traffic-cop');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();

  // Get the appropriate schema based on active tab
  const getSchema = () => {
    switch (activeTab) {
      case 'traffic-cop':
        return trafficCopSchema;
      case 'traffic-central':
        return trafficCentralSchema;
      case 'emergency-services':
        return emergencyServicesSchema;
      default:
        return trafficCopSchema;
    }
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: 'onChange',
    defaultValues: {
      loginType: 'traffic-cop'
    }
  });

  // Update loginType when tab changes
  useEffect(() => {
    setValue('loginType', activeTab);
    setLoginError('');
    clearErrors(); // Clear errors when tab changes
  }, [activeTab, setValue, clearErrors]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Login function using Axios
  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError('');

    try {
      // Prepare login data
      const loginData = {
        ...data,
        loginType: activeTab
      };

      // Use auth service for login
      const response = await authService.login(loginData);

      if (response.success) {
        // Store token if your API returns one
        if (response.token) {
          localStorage.setItem('authToken', response.token);
        }

        // Store user data if provided
        if (response.user) {
          authService.setUserData(response.user);
        } else if (activeTab === 'traffic-cop' && data.copId) {
          authService.setUserData({ id: data.copId, role: 'traffic-cop' });
        }

        // Navigate based on login type
        switch (activeTab) {
          case 'traffic-cop':
            navigate('/traffic-cop-dashboard');
            break;
          case 'traffic-central':
            navigate('/traffic-central-dashboard');
            break;
          case 'emergency-services':
            navigate('/emergency-services');
            break;
          default:
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
        <nav className="w-[95vw] sm:w-[98vw] max-w-[1800px] mt-2 rounded-2xl border border-white/20 bg-[#23233a]/80 shadow-lg flex items-center px-4 sm:px-8 py-3 sm:py-4 justify-between" style={{backdropFilter: 'blur(12px)'}}>
          <div className="flex items-center">
            <div className="relative w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-full rounded-full border-2 border-cyan-400/60"></div>
              </div>
              <img src={policeLogo} alt="Virtusa Logo" className="h-[48px] w-[48px] sm:h-[64px] sm:w-[64px] object-contain relative z-10" />
            </div>
            <div className="flex flex-col items-start justify-center ml-3 sm:ml-4">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent" style={{letterSpacing: '1px'}}>Traffix</span>
              <span className="text-white text-sm sm:text-lg mt-1">Secure Access Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-8 mr-2 ml-auto">
            <button className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-4 sm:px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-sm sm:text-base shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5" onClick={() => navigate('/')}>Home</button>
          </div>
        </nav>
      </header>
      <div className="min-h-full font-sans relative flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6" style={{marginTop: '100px'}}>
        {/* Animated Background Particles (Canvas) */}
        <CanvasBackground />

        {/* Floating Security Icons */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[2]">
          <div className="absolute text-[1.5rem] sm:text-[2.5rem] opacity-20 animate-[floatSecurity_10s_ease-in-out_infinite]" style={{ top: '15%', left: '15%', animationDelay: '0s', willChange: 'transform' }}>🔐</div>
          <div className="absolute text-[1.5rem] sm:text-[2.5rem] opacity-20 animate-[floatSecurity_10s_ease-in-out_infinite]" style={{ top: '25%', right: '20%', animationDelay: '1s', willChange: 'transform' }}>🛡️</div>
          <div className="absolute text-[1.5rem] sm:text-[2.5rem] opacity-20 animate-[floatSecurity_10s_ease-in-out_infinite]" style={{ bottom: '35%', left: '25%', animationDelay: '2s', willChange: 'transform' }}>🔒</div>
          <div className="absolute text-[1.5rem] sm:text-[2.5rem] opacity-20 animate-[floatSecurity_10s_ease-in-out_infinite]" style={{ bottom: '25%', right: '15%', animationDelay: '3s', willChange: 'transform' }}>⚡</div>
        </div>

        <div className={`w-full max-w-[1200px] p-4 sm:p-8 opacity-0 translate-y-12 transition-all duration-1000 z-10 relative ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
          {/* Main Login Section */}
          <main className="flex justify-center items-center">
            <div className="bg-white/5 backdrop-blur-3xl rounded-[20px] sm:rounded-[30px] p-6 sm:p-8 lg:p-12 border border-white/10 shadow-2xl w-full max-w-[500px] sm:max-w-[600px] relative overflow-hidden">
              {/* Tab Navigation */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-8 sm:mb-12 relative z-10">
                {loginOptions.map((option, index) => (
                  <button
                    key={option.id}
                    className={`group flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-semibold text-white cursor-pointer transition-all relative overflow-hidden nav-item text-sm sm:text-base ${activeTab === option.id ? 'bg-[#00d4ff]/20' : 'hover:bg-white/10'}`}
                    onClick={() => setActiveTab(option.id)}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] transition-all duration-500 opacity-0 group-hover:opacity-25 blur-2xl"></div>
                    <span className="relative z-10 text-xl sm:text-2xl mb-1 transition-transform duration-300 ease-in-out group-hover:-translate-y-1.5">{option.icon}</span>
                    <span className="relative z-10 text-xs sm:text-base font-bold">{option.title}</span>
                    {activeTab === option.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b]"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Login Forms */}
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Hidden input for loginType */}
                  <input type="hidden" {...register('loginType')} value={activeTab} />
                  
                  {/* Form Header */}
                  <div className="mb-6 text-center">
                    <div className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent">
                      {loginOptions.find(opt => opt.id === activeTab)?.title}
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm">Enter your credentials to access the system</div>
                  </div>
                  
                  <div>
                    {loginOptions.find(opt => opt.id === activeTab)?.fields.map((field, fieldIndex) => (
                      <div key={field.name} className="mb-4 sm:mb-6">
                        <label htmlFor={`${activeTab}-${field.name}`} className="block text-white/80 mb-2 font-medium text-sm sm:text-base">{field.label}</label>
                        <input
                          type={field.type}
                          id={`${activeTab}-${field.name}`}
                          placeholder={field.placeholder}
                          {...register(field.name)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all text-sm sm:text-base"
                        />
                        {/* Show validation errors */}
                        {errors[field.name] && (
                          <div className="text-red-400 text-xs mt-1">{errors[field.name].message}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Login Error Display */}
                  {loginError && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-xs sm:text-sm text-center">{loginError}</p>
                    </div>
                  )}
                  
                  <div className="flex justify-center mt-6 sm:mt-8">
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className={`bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-4 sm:px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-sm sm:text-base shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed`} 
                      style={{letterSpacing: '1px'}}
                    >
                      {isLoading ? 'LOGGING IN...' : 'LOGIN'}
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-6 sm:mt-8 text-xs sm:text-sm text-white/60">
                    <button type="button" className="hover:text-white transition-colors" onClick={() => navigate('/forgot-password')}>Forgot Password?</button>
                  </div>
                </form>
              </div>
            </div>
          </main>

          {/* Security Features Display */}
          <div className="flex flex-col items-center mt-8 sm:mt-12">
            <div className="w-full max-w-3xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-center transition-all hover:bg-white/20 hover:scale-105 cursor-pointer border border-white/10">
                <div className="text-2xl sm:text-3xl mb-2">🔐</div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-1">256-bit Encryption</h3>
                <p className="text-white/80 text-center text-xs sm:text-sm">Bank-level security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-center transition-all hover:bg-white/20 hover:scale-105 cursor-pointer border border-white/10">
                <div className="text-2xl sm:text-3xl mb-2">🛡️</div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-1">Multi-Factor Auth</h3>
                <p className="text-white/80 text-center text-xs sm:text-sm">Enhanced protection</p>
              </div>
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-center transition-all hover:bg-white/20 hover:scale-105 cursor-pointer border border-white/10 sm:col-span-2 lg:col-span-1">
                <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                <h3 className="text-white text-lg sm:text-xl font-bold mb-1 whitespace-nowrap">Real-time Monitoring</h3>
                <p className="text-white/80 text-center text-xs sm:text-sm">24/7 surveillance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage; 