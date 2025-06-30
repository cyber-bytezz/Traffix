import React, { useEffect, useState } from 'react';
// import './EmergencyList.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';
import { getEmergencies } from './services/emergencyService';

const isLatLng = (str) => /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(str);

const EmergencyList = () => {
  const navigate = useNavigate();
  const [emergencies, setEmergencies] = useState([]);
  const [addressMap, setAddressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    setLoading(true);
    getEmergencies()
      .then(data => {
        setEmergencies(Array.isArray(data) ? data.reverse() : []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch emergencies');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    emergencies.forEach((e, idx) => {
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
  }, [emergencies]);

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
      <header className="flex justify-between items-center px-10 py-5 fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mr-4 hover:bg-white/20"
            type="button"
            onClick={() => navigate('/traffic-central-dashboard')}
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-center relative w-[60px] h-[60px]">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full rounded-full" style={{background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)'}}></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[52px] h-[52px] border-2 border-[#00d4ff] rounded-full animate-pulse"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-[40px] w-auto object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent ml-4">Traffic Central Dashboard
          </h1>
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
      <div className="max-w-[1100px] mx-auto mt-[110px] mb-10 p-6 bg-white/20 rounded-3xl shadow-2xl backdrop-blur-md">
        <button className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mb-6 inline-flex items-center gap-2 hover:bg-white/20" type="button" onClick={() => navigate('/traffic-central-dashboard')}>
          ← Back to Dashboard
        </button>
        <h2 className="text-center text-3xl font-bold mb-8 text-white tracking-wide">Emergency List</h2>
        <div className="overflow-x-auto overflow-y-auto max-h-[70vh]">
          {loading ? (
            <p className="text-center text-base text-white">Loading emergencies...</p>
          ) : error ? (
            <p className="text-center text-base text-red-500">{error}</p>
          ) : (
            <table className="w-full min-w-[700px] border-collapse bg-white/70 rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">S.No</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Date</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Time</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Exact Location</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Type of Incident</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {emergencies.map((e, idx) => {
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
                        <span className={
                          e.status === 'Rescue Team Sent' ? 'text-[#0f7a0f] font-bold bg-[#1bc47d]/20 py-2 px-8 pr-12 rounded-xl whitespace-nowrap' : 'text-[#ff2a00] font-bold bg-[#ffb3b3]/30 py-2 px-8 pr-12 rounded-xl whitespace-nowrap'
                        }>
                          {e.status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyList; 