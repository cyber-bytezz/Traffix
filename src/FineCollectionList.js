import React from 'react';
// import './FineCollectionList.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';

const fines = [
  { sNo: 1, name: 'John Doe', license: 'DL-123456', date: '2024-06-01', time: '09:30', vehicle: 'MH12AB1234', type: 'Signal Jump', fine: 500 },
  { sNo: 2, name: 'Jane Smith', license: 'DL-654321', date: '2024-06-02', time: '11:15', vehicle: 'KA05CD5678', type: 'Speeding', fine: 1000 },
  { sNo: 3, name: 'Alex Brown', license: 'DL-789012', date: '2024-06-03', time: '14:45', vehicle: 'DL01EF9012', type: 'No Helmet', fine: 300 },
  { sNo: 4, name: 'Priya Kumar', license: 'DL-345678', date: '2024-06-04', time: '16:20', vehicle: 'TN10GH3456', type: 'Wrong Lane', fine: 700 },
  { sNo: 5, name: 'Rahul Singh', license: 'DL-901234', date: '2024-06-05', time: '18:00', vehicle: 'UP32IJ7890', type: 'Signal Jump', fine: 500 },
  { sNo: 6, name: 'Sara Lee', license: 'DL-567890', date: '2024-06-06', time: '08:10', vehicle: 'GJ01KL2345', type: 'Speeding', fine: 1200 },
  { sNo: 7, name: 'Vikram Patel', license: 'DL-234567', date: '2024-06-07', time: '12:30', vehicle: 'RJ14MN6789', type: 'No Helmet', fine: 300 },
  { sNo: 8, name: 'Anjali Mehra', license: 'DL-890123', date: '2024-06-08', time: '15:50', vehicle: 'WB20OP1234', type: 'Wrong Lane', fine: 700 },
  { sNo: 9, name: 'Rohan Gupta', license: 'DL-456789', date: '2024-06-09', time: '10:25', vehicle: 'CH01QR5678', type: 'Signal Jump', fine: 500 },
  { sNo: 10, name: 'Meera Nair', license: 'DL-012345', date: '2024-06-10', time: '13:40', vehicle: 'KL07ST9012', type: 'Speeding', fine: 1500 },
];

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

const getStoredFines = () => {
  const stored = localStorage.getItem('violations');
  if (stored) {
    return JSON.parse(stored).slice().reverse().map((v, i) => ({
      sNo: i + 1,
      name: v.name,
      license: v.license,
      date: v.date,
      time: v.time,
      vehicle: v.vehicle,
      type: v.type,
      fine: getFineAmount(v.type)
    }));
  }
  return fines.slice().reverse();
};

const FineCollectionList = () => {
  const navigate = useNavigate();
  const data = getStoredFines();
  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
      <header className="flex justify-between items-center px-10 py-5 fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center relative w-[60px] h-[60px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full rounded-full" style={{background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)'}}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[52px] h-[52px] border-2 border-[#00d4ff] rounded-full animate-pulse"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-[40px] w-auto object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent ml-4">Traffic Central Dashboard</h1>
        </div>
        <div className="flex gap-8 ml-auto">
          <button
            className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-base ml-6 shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="w-full max-w-none mx-auto mt-[110px] mb-10 p-6 bg-white/20 rounded-3xl shadow-2xl backdrop-blur-md">
        <button className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mb-6 inline-flex items-center gap-2 hover:bg-white/20" type="button" onClick={() => navigate('/traffic-central-dashboard')}>
          ← Back to Dashboard
        </button>
        <h2 className="text-center text-3xl font-bold mb-8 text-white tracking-wide">Fine Collection List</h2>
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="w-full min-w-[700px] border-collapse bg-white/70 rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">S.No</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Violation Name</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Driving License No</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Date</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Time</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Vehicle No</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Violation Type</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Fine Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((f) => (
                <tr key={f.sNo} className="transition-colors hover:bg-[#00d4ff]/10">
                  <td className="py-4 px-6 text-center text-base">{f.sNo}</td>
                  <td className="py-4 px-6 text-center text-base">{f.name}</td>
                  <td className="py-4 px-6 text-center text-base">{f.license}</td>
                  <td className="py-4 px-6 text-center text-base">{f.date}</td>
                  <td className="py-4 px-6 text-center text-base">{f.time}</td>
                  <td className="py-4 px-6 text-center text-base">{f.vehicle}</td>
                  <td className="py-4 px-6 text-center text-base">{f.type}</td>
                  <td className="py-4 px-6 text-center text-base text-[#1bc47d] font-bold whitespace-nowrap">₹{f.fine.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FineCollectionList; 