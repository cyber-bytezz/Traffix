import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './TrafficCopDashboard.css';
import policeLogo from './images/virtusa logo.png';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SosService from './services/sosService';
import AIChatbot from './AIChatbot';
import { authService } from './services/authService';
import ViolationList from './ViolationList';
import EmergencyList from './EmergencyList';
import { getEmergencies } from './services/emergencyService';

function TrafficCopDashboard() {
  const navigate = useNavigate();
  const userData = authService.getUserData();
  const copId = userData?.id || '';
  const [showChatbot, setShowChatbot] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [sosCount, setSosCount] = useState(0);
  const [showTable, setShowTable] = useState(null); // 'violations' | 'emergencies' | null
  const [todayViolations, setTodayViolations] = useState([]);
  const [todayEmergencies, setTodayEmergencies] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [emergenciesLoading, setEmergenciesLoading] = useState(true);
  const [emergenciesError, setEmergenciesError] = useState(null);
  const [addressMap, setAddressMap] = useState({});

  useEffect(() => {
    // Violations from localStorage (for now)
    let violations = [];
    try {
      violations = JSON.parse(localStorage.getItem('violations')) || [];
    } catch {
      violations = [];
    }
    setViolationCount(violations.length);
    setSosCount(SosService.getSosCount());
    // Fetch emergencies from backend
    setEmergenciesLoading(true);
    getEmergencies()
      .then(data => {
        setEmergencies(Array.isArray(data) ? data : []);
        setEmergencyCount(Array.isArray(data) ? data.length : 0);
        setEmergenciesLoading(false);
      })
      .catch(() => {
        setEmergenciesError('Failed to fetch emergencies');
        setEmergenciesLoading(false);
      });
  }, []);

  // Helper to get today's date string
  const getTodayString = () => new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (!emergenciesLoading && emergencies.length > 0) {
      const today = getTodayString();
      const filtered = emergencies.filter(e => {
        const dateObj = e.createdAt ? new Date(e.createdAt) : new Date();
        const date = dateObj.toISOString().split('T')[0];
        return date === today;
      });
      setTodayEmergencies(filtered);
    }
  }, [emergencies, emergenciesLoading]);

  // Address resolution for lat/lng locations
  const isLatLng = (str) => /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(str);
  useEffect(() => {
    todayEmergencies.forEach((e, idx) => {
      if (isLatLng(e.location) && !addressMap[idx]) {
        const [lat, lon] = e.location.split(',').map(Number);
        setAddressMap(prev => ({ ...prev, [idx]: 'Fetching address...' }));
        fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || e.location;
            setAddressMap(prev => ({ ...prev, [idx]: address }));
          })
          .catch(() => {
            setAddressMap(prev => ({ ...prev, [idx]: e.location }));
          });
      }
    });
    // eslint-disable-next-line
  }, [todayEmergencies]);

  const handleStatCardClick = (type) => {
    if (type === 'violations') {
      let violations = [];
      try {
        violations = JSON.parse(localStorage.getItem('violations')) || [];
      } catch {
        violations = [];
      }
      const today = getTodayString();
      const filtered = violations.filter(v => v.date === today);
      setTodayViolations(filtered);
      setShowTable('violations');
    } else if (type === 'emergencies') {
      setShowTable('emergencies');
    }
  };

  const handleOptionClick = (option) => {
    if (option === 'violation') {
      navigate('/register-traffic-violation');
      return;
    } else if (option === 'emergency') {
      navigate('/register-emergency');
      return;
    } else if (option === 'report-generator') {
      navigate('/report-generator', { state: { from: 'cop' } });
      return;
    } else if (option === 'violation-explainer') {
      navigate('/violation-explainer', { state: { from: 'cop' } });
      return;
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483]">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-5 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center sticky top-0 z-[100] shadow-lg gap-4 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mr-4 hover:bg-white/20"
            type="button"
            onClick={() => navigate('/traffic-central-dashboard')}
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-center relative w-[50px] h-[50px] sm:w-[60px] sm:h-[60px]">
            {/* Stronger radial gradient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full rounded-full" style={{background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)'}}></div>
            </div>
            {/* Pulsing border */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[42px] h-[42px] sm:w-[52px] sm:h-[52px] border-2 border-[#00d4ff] rounded-full animate-pulse"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-[32px] w-auto sm:h-[40px] object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
          </div>
          <div className="text-left">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent">Traffic Cop Dashboard</h1>
            <p className="text-white/70 text-xs mt-1">Officer Portal - Traffix System</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap justify-center sm:justify-end">
          <div className="flex items-center gap-2 sm:gap-3 bg-white/10 px-3 sm:px-5 py-2 rounded-full border border-white/20">
            <span className="text-xl sm:text-2xl">👮</span>
            <div className="flex flex-col">
              <span className="text-white font-semibold text-xs sm:text-sm">Officer</span>
              <span className="text-white/70 text-xs">ID: {copId}</span>
            </div>
          </div>
          {/* SOS Button */}
          <button
            className="flex items-center gap-1 sm:gap-2 px-4 sm:px-6 py-2 rounded-full font-bold bg-gradient-to-r from-[#ff3b3b] to-[#b31217] shadow-lg focus:outline-none border-none outline-none hover:shadow-[0_0_24px_4px_#ff3b3b99] text-white cursor-pointer transition-all relative overflow-hidden nav-item text-sm sm:text-base"
            style={{ boxShadow: '0 0 16px 2px #ff3b3b88, 0 0 24px 4px #b3121788' }}
            onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    const location = `${position.coords.latitude}, ${position.coords.longitude}`;
                    // Save to localStorage
                    let sosLocations = [];
                    try {
                      sosLocations = JSON.parse(localStorage.getItem('sos_locations')) || [];
                    } catch {
                      sosLocations = [];
                    }
                    sosLocations.push(location);
                    localStorage.setItem('sos_locations', JSON.stringify(sosLocations));
                    // Increment SOS count
                    const newCount = SosService.incrementSosCount();
                    toast.success(`🚨 SOS Alert Sent! Location: ${location} (Total: ${newCount})`, {
                      position: "top-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      style: {
                        background: 'linear-gradient(135deg, #ff3b3b, #b31217)',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    });
                  },
                  (error) => {
                    toast.error('Unable to fetch GPS location for SOS!', {
                      position: "top-right",
                      autoClose: 5000,
                      style: {
                        background: 'linear-gradient(135deg, #ff3b3b, #b31217)',
                        color: 'white',
                        fontWeight: 'bold'
                      }
                    });
                  }
                );
              } else {
                toast.error('Geolocation is not supported by this browser.', {
                  position: "top-right",
                  autoClose: 5000,
                  style: {
                    background: 'linear-gradient(135deg, #ff3b3b, #b31217)',
                    color: 'white',
                    fontWeight: 'bold'
                  }
                });
              }
            }}
            title="Send SOS Alert"
          >
            <span className="text-lg sm:text-xl">🚨</span>
            <span className="font-extrabold tracking-widest text-sm sm:text-lg">SOS</span>
          </button>
          <button
            className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-4 sm:px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-sm sm:text-base shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center justify-center mt-6 sm:mt-10 px-4 sm:px-6">
        <div className="mb-6 sm:mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold mb-2 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent drop-shadow-lg">Select Action</h2>
          <p className="text-white/80 text-sm sm:text-lg">Choose what you want to register today</p>
        </div>
        
        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 w-full max-w-5xl mb-8 sm:mb-12">
          {/* Register Traffic Violation Card */}
          <div className="bg-white/10 rounded-[16px] sm:rounded-[20px] p-4 flex items-center shadow-2xl border border-white/10 hover:border-[#00d4ff] group hover:-translate-y-2 hover:scale-105 w-full min-h-[100px] sm:min-h-[120px] max-w-lg mx-auto transition-all text-white cursor-pointer relative overflow-hidden nav-item" onClick={() => handleOptionClick('violation')}>
            <div className="flex-shrink-0 mr-4 sm:mr-6 flex items-center h-full">
              <span className="text-[2.5rem] sm:text-[3.5rem] block">🚗</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white mb-1">Register Traffic Violation</h3>
              <p className="text-white/80 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">Report traffic violations, speeding, parking violations, and other traffic offenses</p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
                <span className="flex items-center gap-1 text-[#ff6b6b] font-semibold bg-[#3a2323]/60 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm"><span>📄</span>Document violations</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="flex items-center gap-1 text-[#4ecdc4] font-semibold bg-[#232f3a]/60 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm"><span>📷</span>Photo evidence</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-2">
                <span className="flex items-center gap-1 text-[#ffb347] font-semibold bg-[#232f3a]/60 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm"><span>🎫</span>Issue Tickets</span>
              </div>
            </div>
            <div className="ml-4 sm:ml-8 text-xl sm:text-2xl text-white/40 group-hover:text-[#00d4ff] transition-colors flex items-center h-full">→</div>
          </div>
          
          {/* Register Emergency Card */}
          <div className="bg-white/10 rounded-[16px] sm:rounded-[20px] p-4 flex items-center shadow-2xl border border-white/10 hover:border-[#ff6b6b] group hover:-translate-y-2 hover:scale-105 w-full min-h-[100px] sm:min-h-[120px] max-w-lg mx-auto transition-all text-white cursor-pointer relative overflow-hidden nav-item" onClick={() => handleOptionClick('emergency')}>
            <div className="flex-shrink-0 mr-4 sm:mr-6 flex items-center h-full">
              <span className="text-[2.5rem] sm:text-[3.5rem] block">🚨</span>
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-white mb-1">Register Emergency</h3>
              <p className="text-white/80 text-xs sm:text-sm lg:text-base mb-3 sm:mb-4">Report accidents, medical emergencies, road hazards, and urgent situations</p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-2">
                <span className="flex items-center gap-1 text-[#ff6b6b] font-semibold bg-[#3a2323]/60 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm"><span>🚑</span>Emergency response</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <span className="flex items-center gap-1 text-[#4ecdc4] font-semibold bg-[#232f3a]/60 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm"><span>🏥</span>Medical assistance</span>
                <span className="flex items-center gap-1 text-[#ffb347] font-semibold bg-[#232f3a]/60 px-2 sm:px-4 py-1 rounded-full text-xs sm:text-sm"><span>⚡</span>Priority dispatch</span>
              </div>
            </div>
            <div className="ml-4 sm:ml-8 text-xl sm:text-2xl text-white/40 group-hover:text-[#ff6b6b] transition-colors flex items-center h-full">→</div>
          </div>
        </div>

        {/* AI Features Section */}
        <div className="mb-6 sm:mb-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"> AI-Powered Features</h3>
          <p className="text-white/80 text-sm sm:text-base">Enhanced tools with artificial intelligence assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl mb-8 sm:mb-12">
          {/* AI Report Generator Card */}
          <div className="bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-2xl sm:rounded-3xl p-6 sm:p-8 flex items-center shadow-2xl transition-all relative overflow-hidden border border-[#667eea]/30 hover:border-[#667eea] group cursor-pointer hover:-translate-y-2 hover:scale-105 text-white" onClick={() => handleOptionClick('report-generator')}>
            <div className="flex-shrink-0 mr-4 sm:mr-6">
              <span className="text-[2.5rem] sm:text-[3rem] block">📋</span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">AI Report Generator</h3>
              <p className="text-white/80 text-xs sm:text-sm mb-3">Generate comprehensive traffic incident reports with AI assistance</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="flex items-center gap-1 text-[#667eea] font-semibold bg-[#667eea]/20 px-2 py-1 rounded-full text-xs"><span>🤖</span>AI-powered</span>
                <span className="flex items-center gap-1 text-[#4ecdc4] font-semibold bg-[#4ecdc4]/20 px-2 py-1 rounded-full text-xs"><span>📊</span>Detailed reports</span>
                <span className="flex items-center gap-1 text-[#ffb347] font-semibold bg-[#ffb347]/20 px-2 py-1 rounded-full text-xs"><span>💡</span>Smart insights</span>
              </div>
            </div>
            <div className="ml-4 text-2xl text-white/40 group-hover:text-[#667eea] transition-colors">→</div>
          </div>

          {/* Violation Explainer Card */}
          <div className="bg-gradient-to-br from-[#ef4444]/20 to-[#dc2626]/20 rounded-3xl p-8 flex items-center shadow-2xl transition-all relative overflow-hidden border border-[#ef4444]/30 hover:border-[#ef4444] group cursor-pointer hover:-translate-y-2 hover:scale-105 text-white" onClick={() => handleOptionClick('violation-explainer')}>
            <div className="flex-shrink-0 mr-6">
              <span className="text-[3rem] block">🚨</span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">Violation Explainer</h3>
              <p className="text-white/80 text-sm mb-3">Get detailed explanations of traffic violations and consequences</p>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="flex items-center gap-1 text-[#ef4444] font-semibold bg-[#ef4444]/20 px-2 py-1 rounded-full text-xs"><span>📚</span>Educational</span>
                <span className="flex items-center gap-1 text-[#10b981] font-semibold bg-[#10b981]/20 px-2 py-1 rounded-full text-xs"><span>🛡️</span>Prevention tips</span>
                <span className="flex items-center gap-1 text-[#f59e0b] font-semibold bg-[#f59e0b]/20 px-2 py-1 rounded-full text-xs"><span>⚖️</span>Legal info</span>
              </div>
            </div>
            <div className="ml-4 text-2xl text-white/40 group-hover:text-[#ef4444] transition-colors">→</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl mt-4">
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg border border-white/10 cursor-pointer hover:border-[#00d4ff]" onClick={() => handleStatCardClick('violations')}>
            <div className="text-[2.5rem] mb-2">📊</div>
            <div className="text-white/80 text-lg font-semibold mb-1">Today's Violations</div>
            <span className="text-[#00d4ff] text-3xl font-extrabold">{violationCount}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg border border-white/10 cursor-pointer hover:border-[#ff6b6b]" onClick={() => handleStatCardClick('emergencies')}>
            <div className="text-[2.5rem] mb-2">🚨</div>
            <div className="text-white/80 text-lg font-semibold mb-1">Emergencies</div>
            <span className="text-[#ff6b6b] text-3xl font-extrabold">{emergencyCount}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-8 flex flex-col items-center shadow-lg border border-white/10">
            <div className="text-[2.5rem] mb-2">🆘</div>
            <div className="text-white/80 text-lg font-semibold mb-1">SOS Clicks</div>
            <span className="text-[#ff6242] text-3xl font-extrabold">{sosCount}</span>
          </div>
        </div>
        {/* Table Section */}
        {showTable === 'violations' && (
          <div className="w-full max-w-5xl mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Today's Violations</h2>
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
              <table className="w-full min-w-[700px] border-collapse bg-white/70 rounded-2xl overflow-hidden shadow-lg">
                <thead>
                  <tr>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">S.No</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Violator Name</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Driving License No</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Date</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Time</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Vehicle No</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Violation Type</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Mobile Number</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Image</th>
                    <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayViolations.length === 0 ? (
                    <tr><td colSpan="10" className="text-center py-6 text-gray-500">No violations for today.</td></tr>
                  ) : (
                    todayViolations.map((v, idx) => (
                      <tr key={idx} className="transition-colors hover:bg-[#00d4ff]/10">
                        <td className="py-4 px-6 text-center text-base">{idx + 1}</td>
                        <td className="py-4 px-6 text-center text-base">{v.name}</td>
                        <td className="py-4 px-6 text-center text-base">{v.license}</td>
                        <td className="py-4 px-6 text-center text-base whitespace-nowrap">{v.date}</td>
                        <td className="py-4 px-6 text-center text-base">{v.time}</td>
                        <td className="py-4 px-6 text-center text-base">{v.vehicle}</td>
                        <td className="py-4 px-6 text-center text-base">{v.type}</td>
                        <td className="py-4 px-6 text-center text-base">{v.mobileNumber}</td>
                        <td className="py-4 px-6 text-center text-base">{v.image ? <img src={v.image} alt="evidence" className="h-10 w-10 object-cover rounded" /> : 'not available'}</td>
                        <td className="py-4 px-6 text-center text-base">
                          <span className='text-[#0f7a0f] font-bold bg-[#1bc47d]/20 py-2 px-8 pr-12 rounded-xl whitespace-nowrap'>{v.status || 'N/A'}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {showTable === 'emergencies' && (
          <div className="w-full max-w-5xl mt-10">
            <h2 className="text-2xl font-bold text-white mb-4">Today's Emergencies</h2>
            <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
              {emergenciesLoading ? (
                <p className="text-center text-base text-white">Loading emergencies...</p>
              ) : emergenciesError ? (
                <p className="text-center text-base text-red-500">{emergenciesError}</p>
              ) : (
                <table className="w-full min-w-[700px] border-collapse bg-white/70 rounded-2xl overflow-hidden shadow-lg">
                  <thead>
                    <tr>
                      <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">S.No</th>
                      <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Date</th>
                      <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Time</th>
                      <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Location</th>
                      <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Type of Incident</th>
                      <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayEmergencies.length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-6 text-gray-500">No emergencies for today.</td></tr>
                    ) : (
                      todayEmergencies.map((e, idx) => {
                        const dateObj = e.createdAt ? new Date(e.createdAt) : new Date();
                        const date = dateObj.toISOString().split('T')[0];
                        const time = dateObj.toTimeString().slice(0, 5);
                        return (
                          <tr key={e._id || idx} className="transition-colors hover:bg-[#00d4ff]/10">
                            <td className="py-4 px-6 text-center text-base">{idx + 1}</td>
                            <td className="py-4 px-6 text-center text-base">{date}</td>
                            <td className="py-4 px-6 text-center text-base">{time}</td>
                            <td className="py-4 px-6 text-center text-base" style={{maxWidth: 220, whiteSpace: 'pre-line', wordBreak: 'break-word'}}>
                              {isLatLng(e.location)
                                ? (addressMap[idx] && addressMap[idx] !== e.location ? addressMap[idx] : 'Fetching address...')
                                : (e.location && !isLatLng(e.location) ? e.location : 'Fetching address...')}
                            </td>
                            <td className="py-4 px-6 text-center text-base">{e.type}</td>
                            <td className="py-4 px-6 text-center text-base">
                              <span className={e.status === 'Rescue Team Sent' ? 'text-[#0f7a0f] font-bold bg-[#1bc47d]/20 py-2 px-8 pr-12 rounded-xl whitespace-nowrap' : 'text-[#ff2a00] font-bold bg-[#ffb3b3]/30 py-2 px-8 pr-12 rounded-xl whitespace-nowrap'}>
                                {e.status || 'N/A'}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Floating AI Assistant Button */}
      {!showChatbot && (
        <button
          className="fixed bottom-6 right-6 z-[1100] bg-gradient-to-br from-cyan-400 to-cyan-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-110 transition-transform border-4 border-white/40 focus:outline-none"
          aria-label="Open AI Assistant"
          onClick={() => setShowChatbot(true)}
        >
          🤖
        </button>
      )}
      {/* AI Chatbot */}
      {showChatbot && (
        <AIChatbot onClose={() => setShowChatbot(false)} />
      )}
      
      <ToastContainer />
    </div>
  );
}

export default TrafficCopDashboard; 