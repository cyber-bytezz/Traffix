import React, { useState, useEffect } from 'react';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';

const demoAddresses = [
  '12, MG Road, Bengaluru',
  '45, Anna Salai, Chennai',
  '88, Marine Drive, Mumbai',
  '23, Park Street, Kolkata'
];

function isLatLng(str) {
  // Simple check for lat,lng format
  return /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(str);
}

function SOSPage() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [sentRows, setSentRows] = useState([]);
  const [addressMap, setAddressMap] = useState({}); // { idx: address }

  useEffect(() => {
    let sosLocations = [];
    try {
      sosLocations = JSON.parse(localStorage.getItem('sos_locations')) || [];
    } catch {
      sosLocations = [];
    }
    if (sosLocations.length > 0) {
      setLocations(sosLocations);
      setSentRows(Array(sosLocations.length).fill(false));
    } else {
      setLocations(demoAddresses);
      setSentRows(Array(demoAddresses.length).fill(false));
    }
  }, []);

  useEffect(() => {
    // For each location that is a lat,lng, fetch the address if not already fetched
    locations.forEach((loc, idx) => {
      if (isLatLng(loc) && !addressMap[idx]) {
        const [lat, lon] = loc.split(',').map(Number);
        setAddressMap(prev => ({ ...prev, [idx]: 'Fetching address...' }));
        fetch(`/api/geocode/reverse-geocode?lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || loc;
            setAddressMap(prev => ({ ...prev, [idx]: address }));
          })
          .catch(() => {
            setAddressMap(prev => ({ ...prev, [idx]: loc }));
          });
      }
    });
    // eslint-disable-next-line
  }, [locations]);

  const handleSend = (idx) => {
    setSentRows(rows => rows.map((v, i) => i === idx ? true : v));
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483]">
      {/* Header/Nav Bar */}
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
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent ml-4">SOS Alerts</h1>
        </div>
        <div className="flex gap-8 ml-auto">
          <button
            className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-base ml-6 shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5"
            onClick={() => navigate('/login')}
          >
            Logout
          </button>
        </div>
      </header>
      <div className="max-w-[800px] mx-auto mt-[110px] mb-10 p-6 bg-white/20 rounded-3xl shadow-2xl backdrop-blur-md">
        <button className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mb-6 inline-flex items-center gap-2 hover:bg-white/20" type="button" onClick={() => navigate('/traffic-central-dashboard')}>
          ← Back to Dashboard
        </button>
        <h2 className="text-center text-3xl font-bold mb-8 text-white tracking-wide">SOS Alerts</h2>
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          <table className="w-full min-w-[700px] border-collapse bg-white/70 rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Address</th>
                <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Action</th>
              </tr>
            </thead>
            <tbody>
              {locations.length === 0 ? (
                <tr><td colSpan={2} className="text-center py-8 text-white/80">No SOS alerts yet.</td></tr>
              ) : (
                locations.map((address, idx) => (
                  <tr key={address + idx} className="transition-colors hover:bg-[#00d4ff]/10">
                    <td className="py-4 px-6 text-center text-base">
                      {isLatLng(address) ? (addressMap[idx] || 'Fetching address...') : address}
                    </td>
                    <td className="py-4 px-6 text-center text-base">
                      {sentRows[idx] ? (
                        <span className="text-[#0f7a0f] font-bold bg-[#1bc47d]/20 py-2 px-8 rounded-xl whitespace-nowrap">Sent</span>
                      ) : (
                        <button
                          className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full font-bold cursor-pointer transition-all shadow-lg text-base hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5"
                          onClick={() => handleSend(idx)}
                        >
                          Send
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SOSPage; 