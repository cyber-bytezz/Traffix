import React, { useState, useEffect, useRef } from 'react';
// import './RegisterEmergency.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';
import { createEmergency } from './services/emergencyService';
import { authService } from './services/authService';

const incidentTypes = [
  'Accident',
  'Medical Emergency',
  'Fire Accident',
  'Others'
];

function RegisterEmergency() {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    useGPS: false,
    incidentType: '',
    otherIncident: ''
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [particles, setParticles] = useState([]);
  const [gpsLoading, setGpsLoading] = useState(false);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setIsLoaded(true);
    generateParticles();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 3 + 1,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    setParticles(newParticles);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGPS = () => {
    setGpsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            location: `${position.coords.latitude}, ${position.coords.longitude}`,
            useGPS: true
          }));
          setGpsLoading(false);
        },
        (error) => {
          alert('Unable to fetch GPS location.');
          setGpsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
      setGpsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = authService.getUserData();
    console.log('Current user data:', user);
    
    if (!user || !user._id) {
      alert('User not logged in or invalid user data. Please log in again.');
      navigate('/login');
      return;
    }

    const emergencyData = {
      userId: user._id,
      type: formData.incidentType || 'Accident',
      location: formData.location,
      description: `Emergency reported on ${formData.date} at ${formData.time}`,
      status: 'pending'
    };

    console.log('Submitting emergency data:', emergencyData);

    try {
      const response = await createEmergency(emergencyData);
      console.log('Emergency created successfully:', response);
      setShowSuccess(true);
    } catch (error) {
      console.error('Failed to register emergency:', error);
      alert(`Failed to register emergency: ${error.message}`);
    }
  };

  const handleBackToDashboard = () => {
    const user = authService.getUserData();
    if (user && user.role) {
      switch (user.role) {
        case 'traffic-cop':
          navigate('/traffic-cop-dashboard');
          break;
        case 'emergency-services':
          navigate('/emergency-services');
          break;
        case 'traffic-central':
          navigate('/traffic-central-dashboard');
          break;
        default:
          navigate('/');
      }
    } else {
      navigate('/');
    }
  };

  if (showSuccess) {
    return (
      <div className="h-screen font-sans overflow-hidden relative flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
        <div className="text-center p-8 rounded-3xl bg-[#1E1E30]/50 backdrop-blur-xl border border-white/10 shadow-2xl max-w-md w-full mx-4">
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-[#00D4FF]/10 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-[#00D4FF]/20 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-8 h-8 text-[#00D4FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] bg-clip-text text-transparent">
            Emergency registration successful
          </h2>
          <button
            onClick={handleBackToDashboard}
            className="mt-6 w-full bg-gradient-to-r from-[#FF6B6B] to-[#FF8E8E] text-white font-bold py-3 px-6 rounded-full hover:from-[#FF8E8E] hover:to-[#FFA5A5] transition-all duration-300 shadow-lg"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen font-sans overflow-x-hidden overflow-y-auto relative flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]" style={{scrollBehavior: 'smooth'}}>
      {/* Animated Background Particles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-[linear-gradient(45deg,#00d4ff,#ff6b6b,#4ecdc4)] animate-[float_8s_ease-in-out_infinite]"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
      </div>

      <div className={`w-full max-w-[700px] p-8 mt-16 opacity-0 translate-y-12 transition-all duration-1000 z-10 relative ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        {/* Header with Logo */}
        <header className="flex items-center gap-8 mb-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6">
          <div className="flex items-center justify-center relative w-[80px] h-[80px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] animate-[glow_3s_ease-in-out_infinite_alternate]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[60px] h-[60px] border-2 border-[#00d4ff] rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-[50px] w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] mx-auto" />
          </div>
          <div className="text-white">
            <h1 className="text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#00d4ff] via-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">Register Emergency</h1>
            <p className="text-base opacity-80 font-light">Report and respond to emergencies instantly</p>
          </div>
        </header>

        <main className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-10 border border-white/10 shadow-2xl w-full relative overflow-visible">
          <button className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mb-6 inline-flex items-center gap-2 hover:bg-white/20" type="button" onClick={handleBackToDashboard}>
            ← Back to Dashboard
          </button>
          <form className="text-white" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Set Current Date and Time Button */}
              <div className="col-span-1 md:col-span-2 text-center mb-4">
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] font-bold nav-item text-white cursor-pointer px-4 py-2 rounded-full transition-all relative overflow-hidden shadow-lg hover:from-[#0f3460] hover:to-[#533483] focus:outline-none"
                  onClick={() => {
                    const now = new Date();
                    const date = now.toISOString().slice(0, 10);
                    const time = now.toTimeString().slice(0, 5);
                    setFormData(prev => ({ ...prev, date, time }));
                  }}
                >
                  Set Current Date and Time
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => handleInputChange('time', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              <div className="mb-4 md:col-span-2">
                <label className="block text-white/80 mb-2 font-semibold">Exact Location *</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => handleInputChange('location', e.target.value)}
                    placeholder="Type location manually or use GPS"
                    required
                    disabled={formData.useGPS}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    className={`bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] font-bold nav-item text-white cursor-pointer px-4 py-2 rounded-full transition-all relative overflow-hidden shadow-md hover:from-[#0f3460] hover:to-[#533483] focus:outline-none ${gpsLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    onClick={handleGPS}
                    disabled={gpsLoading}
                  >
                    {gpsLoading ? 'Locating...' : 'Enable GPS'}
                  </button>
                  {formData.useGPS && (
                    <button
                      type="button"
                      className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full cursor-pointer transition-all font-semibold hover:bg-white/20"
                      onClick={() => handleInputChange('useGPS', false) || handleInputChange('location', '')}
                    >
                      Clear GPS
                    </button>
                  )}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-white font-semibold mb-2">Type of Incident *</label>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    className={`w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white text-lg flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/10 transition-all ${formData.incidentType ? '' : 'placeholder-white/60'}`}
                    onClick={() => setDropdownOpen((open) => !open)}
                  >
                    <span>{formData.incidentType || '-- Select --'}</span>
                    <svg className={`w-5 h-5 ml-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {dropdownOpen && (
                    <ul className="absolute left-0 mt-2 w-full bg-[#1a1a2e] border border-white/20 rounded-lg shadow-xl z-20 max-h-60 overflow-auto">
                      {incidentTypes.map(type => (
                        <li
                          key={type}
                          className={`px-4 py-3 cursor-pointer text-white text-lg hover:bg-[#00d4ff]/20 transition-all ${formData.incidentType === type ? 'bg-[#00d4ff]/10 font-bold' : ''}`}
                          onClick={() => { setDropdownOpen(false); handleInputChange('incidentType', type); }}
                        >
                          {type}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {formData.incidentType === 'Others' && (
                <div className="mb-4">
                  <label className="block text-white/80 mb-2 font-semibold">Specify Incident *</label>
                  <input
                    type="text"
                    value={formData.otherIncident}
                    onChange={e => handleInputChange('otherIncident', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                  />
                </div>
              )}
            </div>
            {/* Register Emergency Button */}
            <button type="submit" className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] font-bold nav-item text-white cursor-pointer px-4 py-2 rounded-full transition-all relative overflow-hidden shadow-lg mt-4 max-w-xs w-full mx-auto block hover:from-[#ff5252] hover:to-[#d63031] focus:outline-none">Register Emergency</button>
          </form>
        </main>
      </div>
    </div>
  );
}

export default RegisterEmergency; 