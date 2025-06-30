import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import policeLogo from './images/virtusa logo.png';
import TamilNaduLogo from './images/TamilNadu_Logo.png';
import Emblem from './images/emblem.jpg';

function Paid() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticketData } = location.state || {};

  const getFineAmount = (violationType) => {
    switch (violationType) {
      case 'Driving without licence': return 5000;
      case 'Driving without insurance': return 2000;
      case 'Driving without PUCC (Pollution Under Control Certificate)': return 10000;
      case 'RC violation': return 5000;
      case 'Driving under the influence/Drunken Driving': return 10000;
      case 'Driving Dangerously': return 5000;
      case 'Driving against the authorized flow of traffic/Wrong side driving': return 1000;
      case 'Wrong Passing or Overtaking other Vehicles': return 1000;
      case 'Driving without Helmet (Rider/Pillion Rider)': return 1000;
      case 'Disobeying police order or directions': return 2000;
      case 'Not giving way to an emergency vehicle': return 10000;
      case 'Driving in NMV lanes/No entry/One-way roads': return 5000;
      case 'Driving/Parking on Footpath/Cycle Track': return 2000;
      default: return 0;
    }
  };

  const handleGenerateReport = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const fineAmount = getFineAmount(ticketData.violationType);
    doc.addImage(TamilNaduLogo, 'PNG', 10, 10, 30, 30);
    doc.addImage(Emblem, 'JPEG', 170, 10, 30, 30);
    doc.setFontSize(16);
    doc.text('Government of Tamil Nadu, Traffic Police', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('VEHICLE INSPECTION RECORD', 105, 28, { align: 'center' });
    doc.setFontSize(10);
    doc.text('Infringement report under Motor Vehicles Act, 1988 and Rules made thereunder', 105, 34, { align: 'center' });
    autoTable(doc, {
      startY: 95,
      head: [['Field', 'Value']],
      body: [
        ['Date', ticketData.date],
        ['Time', ticketData.time],
        ['Police Station', 'Greater Chennai Traffic Police'],
        ['Challan No', ticketData.challanNo || 'N/A'],
        ['Vehicle No', ticketData.vehicleNumber],
        ["Owner's Name", ticketData.violatorName],
        ["Owner's Address", ticketData.address || 'N/A'],
        ['Mobile No', ticketData.mobileNumber],
        ['Violation', ticketData.violationType],
        ['Fine Amount', `Rs. ${fineAmount}`],
        ['Penalty', `${fineAmount} /-`],
        ['Officer', 'Officer Name'],
      ],
      theme: 'grid',
      styles: { fontSize: 10 },
      columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 120 } },
    });
    doc.setFontSize(8);
    doc.text('This is a system generated report. For queries, contact your local traffic police station.', 10, 285);
    doc.save(`violation-report-${ticketData.vehicleNumber}.pdf`);
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
    <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483]">
      <nav className="w-full fixed top-0 left-0 z-[1000] bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg flex items-center py-3 px-8 min-h-[70px]">
        <div className="flex items-center justify-center relative w-[70px] h-[70px]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full rounded-full border-2 border-cyan-400/60"></div>
          </div>
          <img src={policeLogo} alt="Virtusa Logo" className="h-10 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] mx-auto" />
        </div>
      </nav>
      <main className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-10 border border-white/10 shadow-2xl w-full max-w-md text-center mt-[90px]">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-[120px] h-[120px] bg-gradient-to-br from-[#00d4ff] via-[#4ecdc4] to-[#ff6b6b] rounded-full flex items-center justify-center shadow-[0_0_40px_#00d4ff55,0_0_0_10px_rgba(0,212,255,0.08)] relative">
            <svg className="w-20 h-20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          <h1 className="text-3xl font-bold mt-6 mb-2 bg-gradient-to-r from-[#00d4ff] via-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent">Paid</h1>
        </div>
        <button
          className="bg-gradient-to-r from-[#ff7f50] to-[#ff6b81] text-white px-8 py-3 text-lg font-bold rounded-full cursor-pointer transition-all shadow-xl uppercase tracking-wider hover:scale-105 mb-6"
          onClick={handleGenerateReport}
        >
          Generate Report
        </button>
        <br />
        <button
          className="bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] text-white px-8 py-3 text-lg font-bold rounded-full cursor-pointer transition-all shadow-xl uppercase tracking-wider hover:scale-105"
          onClick={() => navigate('/traffic-cop-dashboard')}
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
}

export default Paid; 