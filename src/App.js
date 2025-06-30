import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import LoginPageSimple from './LoginPageSimple';
import TestLogin from './TestLogin';
import TrafficCopDashboard from './TrafficCopDashboard';
import RegisterTrafficViolation from './RegisterTrafficViolation';
import IssueTicket from './IssueTicket';
import RegisterEmergency from './RegisterEmergency';
import EmergencySuccess from './EmergencySuccess';
import TrafficCentralDashboard from './TrafficCentralDashboard';
import ViolationList from './ViolationList';
import FineCollectionList from './FineCollectionList';
import EmergencyList from './EmergencyList';
import EmergencyServices from './EmergencyServices';
import ForgotPassword from './ForgotPassword';
import ReportGenerator from './ReportGenerator';
import ViolationExplainer from './ViolationExplainer';
import PaymentQR from './PaymentQR';
import Paid from './Paid';
import SOSPage from './SOSPage';
import shieldLogo from './images/virtusa logo.png';

function HomePage() {
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    generateParticles();
  }, []);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1
      });
    }
    setParticles(newParticles);
  };

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0c0c0c] via-[#1a1a2e] via-50% to-[#533483]">
      {/* Animated Background Particles */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className="particle"
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

      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-center bg-transparent" style={{pointerEvents: 'auto'}}>
        <nav className="w-[95vw] sm:w-[98vw] max-w-[1800px] mt-2 rounded-2xl border border-white/20 bg-[#23233a]/80 shadow-lg flex items-center px-4 sm:px-8 py-3 sm:py-4 justify-between" style={{backdropFilter: 'blur(12px)'}}>
          <div className="flex items-center">
            <img src={shieldLogo} alt="Shield Logo" className="h-12 w-12 sm:h-16 sm:w-16 object-contain rounded-full border-2 border-cyan-400 bg-[#181c2f] p-1" />
          </div>
          <div className="text-white cursor-pointer px-3 sm:px-4 py-2 rounded-full transition-all relative overflow-hidden nav-item text-sm sm:text-base" onClick={() => navigate('/login')}>Login</div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center min-h-screen pt-[100px] sm:pt-[110px] px-4 sm:px-6">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16 w-full max-w-5xl">
          {/* Emergency Service Cards */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 bg-[#23233a]/80 p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl w-full max-w-md lg:max-w-none">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#6a82fb] to-[#fc5c7d] rounded-xl p-4 sm:p-6 lg:p-8 shadow-md w-full h-32 sm:h-36 lg:h-40">
              <span className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">🚓</span>
              <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">Police</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#fc5c7d] to-[#fcb045] rounded-xl p-4 sm:p-6 lg:p-8 shadow-md w-full h-32 sm:h-36 lg:h-40">
              <span className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">🚑</span>
              <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">Ambulance</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#fcb045] to-[#fd1d1d] rounded-xl p-4 sm:p-6 lg:p-8 shadow-md w-full h-32 sm:h-36 lg:h-40">
              <span className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">🚒</span>
              <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">Fire</span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#43cea2] to-[#185a9d] rounded-xl p-4 sm:p-6 lg:p-8 shadow-md w-full h-32 sm:h-36 lg:h-40">
              <span className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3">🚨</span>
              <span className="text-white font-semibold text-sm sm:text-base lg:text-lg">Emergency</span>
            </div>
          </div>

          {/* Traffix Title and Get Started */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-2" style={{ textShadow: '0 0 16px #00d4ff, 0 0 32px #00d4ff' }}>Traffix</h1>
            <div className="w-32 sm:w-40 lg:w-48 h-1 bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] rounded-full mb-4" />
            <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8 max-w-md lg:max-w-none">Your safety is our priority. Get connected to emergency services instantly.</p>
            <button className="px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-full bg-gradient-to-r from-[#ff7f50] to-[#ff6b81] text-white shadow-xl transition hover:from-[#ff6b81] hover:to-[#ff7f50]" onClick={handleGetStarted}>
              GET STARTED <span className="ml-2">→</span>
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-8 mt-12 sm:mt-16 w-full max-w-4xl">
          <div className="bg-[#23233a]/80 rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col items-center w-full sm:w-80">
            <span className="text-2xl sm:text-3xl mb-2">⚡</span>
            <h3 className="text-white text-lg sm:text-xl font-bold mb-1">Instant Response</h3>
            <p className="text-white/80 text-center text-sm sm:text-base">Emergency services at your fingertips</p>
          </div>
          <div className="bg-[#23233a]/80 rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col items-center w-full sm:w-80">
            <span className="text-2xl sm:text-3xl mb-2">🎯</span>
            <h3 className="text-white text-lg sm:text-xl font-bold mb-1">Precise Location</h3>
            <p className="text-white/80 text-center text-sm sm:text-base">GPS tracking for accurate assistance</p>
          </div>
          <div className="bg-[#23233a]/80 rounded-2xl p-6 sm:p-8 shadow-lg flex flex-col items-center w-full sm:w-80">
            <span className="text-2xl sm:text-3xl mb-2">🔒</span>
            <h3 className="text-white text-lg sm:text-xl font-bold mb-1">Secure & Private</h3>
            <p className="text-white/80 text-center text-sm sm:text-base">Your data is protected</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login-simple" element={<LoginPageSimple />} />
        <Route path="/test-login" element={<TestLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/traffic-cop-dashboard" element={<TrafficCopDashboard />} />
        <Route path="/register-traffic-violation" element={<RegisterTrafficViolation />} />
        <Route path="/register-emergency" element={<RegisterEmergency />} />
        <Route path="/issue-ticket" element={<IssueTicket />} />
        <Route path="/emergency-success" element={<EmergencySuccess />} />
        <Route path="/traffic-central-dashboard" element={<TrafficCentralDashboard />} />
        <Route path="/violation-list" element={<ViolationList />} />
        <Route path="/fine-collection-list" element={<FineCollectionList />} />
        <Route path="/emergency-list" element={<EmergencyList />} />
        <Route path="/emergency-services" element={<EmergencyServices />} />
        <Route path="/report-generator" element={<ReportGenerator />} />
        <Route path="/violation-explainer" element={<ViolationExplainer />} />
        <Route path="/payment-qr" element={<PaymentQR />} />
        <Route path="/paid" element={<Paid />} />
        <Route path="/sos" element={<SOSPage />} />
      </Routes>
    </Router>
  );
}

export default App;
