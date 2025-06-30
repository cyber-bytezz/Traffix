import React, { useEffect, useState } from 'react';
// import './IssueTicket.css';
import policeLogo from './images/virtusa logo.png';
import emblem1 from './images/emblem1.png';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

function IssueTicket() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const ticketData = location.state?.ticketData;

  useEffect(() => {
    setIsLoaded(true);
    generateParticles();
  }, []);

  const getFineAmount = (violationType) => {
    switch (violationType) {
      case 'High Speed': return 500;
      case 'No Helmet': return 300;
      case 'More Than Two Passengers': return 400;
      case 'Drunk and Drive': return 1000;
      default: return 200;
    }
  };

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

  const handleBackToNewViolation = () => {
    navigate('/register-traffic-violation');
  };

  const handlePay = () => {
    const fineAmount = getFineAmount(ticketData.violationType);
    navigate('/payment-qr', { state: { ticketData: { ...ticketData, fineAmount } } });
  };

  if (!ticketData) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No ticket data found.</h1>
          <button 
            onClick={() => navigate('/register-traffic-violation')}
            className="bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Create a new ticket
          </button>
        </div>
      </div>
    );
  }

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

      <nav className="w-full fixed top-0 left-0 z-[1000] bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg flex items-center py-3 px-8 min-h-[70px]">
        <div className="flex items-center justify-center relative w-[70px] h-[70px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] animate-[glow_3s_ease-in-out_infinite_alternate]"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[50px] h-[50px] border-2 border-[#00d4ff] rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
          </div>
          <img src={policeLogo} alt="Virtusa Logo" className="h-10 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] mx-auto" />
        </div>
      </nav>

      <div className={`w-full max-w-[500px] p-8 opacity-0 translate-y-12 transition-all duration-1000 z-10 relative mt-[90px] ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        <main className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-10 border border-white/10 shadow-2xl w-full relative overflow-hidden text-center">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-[#00d4ff] via-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">Violation Ticket Issued</h1>
          
          <div className="text-left text-white/90 space-y-4 my-8 p-6 bg-white/10 rounded-xl border border-white/20">
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="font-semibold text-white/70">Violator's Name:</span>
              <span className="font-bold text-lg">{ticketData.violatorName}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="font-semibold text-white/70">Driving License:</span>
              <span className="font-mono">{ticketData.drivingLicense}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="font-semibold text-white/70">Vehicle Number:</span>
              <span className="font-mono">{ticketData.vehicleNumber}</span>
            </div>
            <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="font-semibold text-white/70">Date & Time:</span>
              <span>{new Date(ticketData.date + 'T' + ticketData.time).toLocaleString()}</span>
            </div>
             <div className="flex justify-between items-center border-b border-white/20 pb-2">
              <span className="font-semibold text-white/70">Violation Type:</span>
              <span className="font-semibold text-[#ff6b6b]">{ticketData.violationType}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-white/70">Mobile Number:</span>
              <span>{ticketData.mobileNumber}</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
            <button className="bg-gradient-to-r from-[#2ed573] to-[#1dd1a1] text-white px-8 py-3 text-lg font-bold rounded-full cursor-pointer transition-all shadow-xl uppercase tracking-wider hover:scale-105" onClick={handlePay}>
                Pay Fine
            </button>
          </div>

          <button className="mt-8 bg-transparent border border-white/30 text-white/80 px-8 py-3 text-md font-bold rounded-full cursor-pointer transition-all shadow-lg hover:bg-white/10 hover:text-white" onClick={handleBackToNewViolation}>
            ← Create New Violation
          </button>
        </main>
      </div>
    </div>
  );
}

export default IssueTicket; 