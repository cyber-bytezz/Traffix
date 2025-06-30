import React, { useEffect, useState } from 'react';
// import './EmergencySuccess.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';

function EmergencySuccess() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tickActive, setTickActive] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    generateParticles();
    setTimeout(() => setTickActive(true), 300); // Trigger tick animation after mount
  }, []);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 25; i++) {
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

  const handleBackToDashboard = () => {
    navigate('/traffic-cop-dashboard');
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
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

      <header className="fixed top-0 left-0 w-full z-[1000] flex items-center bg-gradient-to-r from-[#23233a] to-[#23233a] border-b border-white/10 h-[90px] px-8" style={{backdropFilter: 'blur(12px)'}}>
        <div className="flex items-center justify-center relative min-w-[120px] min-h-[100px]">
          <div className="absolute w-[100px] h-[100px] rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] animate-[glow_3s_ease-in-out_infinite_alternate]"></div>
          <img src={policeLogo} alt="Virtusa Logo" className="h-[60px] w-auto object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
          <div className="absolute w-[80px] h-[80px] border-2 border-[#00d4ff] rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </header>

      <div className={`mt-[90px] w-full max-w-[500px] p-8 opacity-0 translate-y-12 transition-all duration-1000 z-10 relative ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        <main className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-10 border border-white/10 shadow-2xl w-full relative overflow-hidden text-center">
          <div className="flex justify-center items-center mb-8">
            <div className={`w-[120px] h-[120px] bg-gradient-to-br from-[#00d4ff] via-[#4ecdc4] to-[#ff6b6b] rounded-full flex items-center justify-center shadow-[0_0_40px_#00d4ff55,0_0_0_10px_rgba(0,212,255,0.08)] relative transition-transform duration-700 ${tickActive ? 'scale-110' : 'scale-90 opacity-0'}`}> 
              <svg className={`w-20 h-20 ${tickActive ? 'animate-pop' : ''}`} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="30" fill="url(#tickGradient)" filter="url(#tickShadow)" />
                <path d="M20 34L29 43L44 24" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <radialGradient id="tickGradient" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
                    <stop offset="0%" stopColor="#00d4ff" />
                    <stop offset="70%" stopColor="#4ecdc4" />
                    <stop offset="100%" stopColor="#ff6b6b" />
                  </radialGradient>
                  <filter id="tickShadow" x="0" y="0" width="64" height="64" filterUnits="userSpaceOnUse">
                    <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00d4ff" floodOpacity="0.5" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-10 bg-gradient-to-r from-[#00d4ff] via-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">Emergency registration successful</h1>
          <button className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white px-12 py-4 text-lg font-bold rounded-full cursor-pointer transition-all shadow-xl uppercase tracking-wider relative overflow-hidden inline-flex items-center gap-4 hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5" onClick={handleBackToDashboard}>
            Back to Dashboard
          </button>
        </main>
      </div>
    </div>
  );
}

export default EmergencySuccess; 