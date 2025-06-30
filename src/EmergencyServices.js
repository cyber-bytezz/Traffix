import React, { useState, useEffect } from 'react';
// import './EmergencyServices.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';
import { getEmergencies, updateEmergency } from './services/emergencyService';

const isLatLng = (str) => /^-?\d+\.\d+\s*,\s*-?\d+\.\d+$/.test(str);

const EmergencyServices = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [addressMap, setAddressMap] = useState({}); // { idx: address }

  useEffect(() => {
    console.log('Fetching emergencies...');
    getEmergencies()
      .then(data => {
        console.log('Fetched emergencies:', data);
        setRows(Array.isArray(data) ? data : []);
      })
      .catch(error => {
        console.error('Error fetching emergencies:', error);
        setRows([]);
      });
  }, []);

  useEffect(() => {
    console.log('Current rows:', rows);
    // For each row with a lat,lng location, fetch the address if not already fetched
    rows.forEach((row, idx) => {
      if (isLatLng(row.location) && !addressMap[idx]) {
        const [lat, lon] = row.location.split(',').map(Number);
        setAddressMap(prev => ({ ...prev, [idx]: 'Fetching address...' }));
        fetch(`/api/geocode/reverse?lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            const address = data.display_name || row.location;
            setAddressMap(prev => ({ ...prev, [idx]: address }));
          })
          .catch(() => {
            setAddressMap(prev => ({ ...prev, [idx]: row.location }));
          });
      }
    });
    // eslint-disable-next-line
  }, [rows]);

  const handleSend = async (id, index) => {
    try {
      // Optimistically update the UI first
      const updatedRows = [...rows];
      updatedRows[index].status = 'Sent';
      setRows(updatedRows);

      // Then send the update to the backend
      await updateEmergency(id, { status: 'Sent' });
    } catch (error) {
      console.error('Failed to update emergency status:', error);
      // If the API call fails, revert the change in the UI
      alert('Failed to update status. Please try again.');
      const revertedRows = [...rows];
      revertedRows[index].status = 'pending';
      setRows(revertedRows);
    }
  };

  const handleCheckbox = async (idx, field) => {
    const row = rows[idx];
    const updated = { ...row, [field]: !row[field] };
    
    // Optimistically update the local state
    const newRows = [...rows];
    newRows[idx] = updated;
    setRows(newRows);

    try {
      // Send the update to the backend
      await updateEmergency(row._id, { [field]: updated[field] });
    } catch (e) {
      console.error('Failed to update checkbox state:', e);
      // Revert the change if the API call fails
      const revertedRows = [...rows];
      revertedRows[idx] = row; // Revert to the original row state
      setRows(revertedRows);
      alert('Failed to save change. Please try again.');
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
      <nav className="w-full fixed top-0 left-0 z-[1000] bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg flex items-center justify-between py-3 px-8 min-h-[70px]">
        <div className="flex items-center gap-6">
          <button
            className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mr-4 hover:bg-white/20"
            type="button"
            onClick={() => navigate('/traffic-central-dashboard')}
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-center relative w-[70px] h-[70px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] animate-[glow_3s_ease-in-out_infinite_alternate]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[50px] h-[50px] border-2 border-[#00d4ff] rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-10 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] mx-auto" />
          </div>
          <span className="text-2xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent ml-2">Medical Rapid Force Team</span>
        </div>
        <div className="flex items-center">
          <button className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-base ml-6 shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="max-w-[1100px] mx-auto mt-[110px] mb-10 p-6 bg-white/20 rounded-3xl shadow-2xl backdrop-blur-md">
        <h2 className="text-center text-3xl font-bold mb-8 text-white tracking-wide">Emergency Services</h2>
        <div className="overflow-x-auto">
          {!rows || rows.length === 0 ? (
            <p className="text-center text-base text-white">No emergencies found.</p>
          ) : (
            <table className="w-full border-collapse bg-white/70 rounded-2xl overflow-hidden shadow-lg">
              <thead>
                <tr>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Date</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Time</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Location</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Type of Incident</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Ambulance</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Fire Engine</th>
                  <th className="bg-[#00d4ff]/20 text-[#0a2540] font-bold text-base py-4 px-6 tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => {
                  const dateObj = row.createdAt ? new Date(row.createdAt) : new Date();
                  const date = dateObj.toISOString().split('T')[0];
                  const time = dateObj.toTimeString().slice(0, 5);
                  return (
                    <tr key={row._id || idx} className="transition-colors hover:bg-[#00d4ff]/10">
                      <td className="py-4 px-6 text-center text-base whitespace-nowrap">{date}</td>
                      <td className="py-4 px-6 text-center text-base">{time}</td>
                      <td className="py-4 px-6 text-center text-base" style={{maxWidth: 220, whiteSpace: 'pre-line', wordBreak: 'break-word'}}>
                        {isLatLng(row.location)
                          ? (addressMap[idx] && addressMap[idx] !== row.location ? addressMap[idx] : 'Fetching address...')
                          : (row.location && !isLatLng(row.location) ? row.location : 'Fetching address...')}
                      </td>
                      <td className="py-4 px-6 text-center text-base">{row.type || 'N/A'}</td>
                      <td className="py-4 px-6 text-center text-base">
                        <input
                          type="checkbox"
                          checked={!!row.ambulance}
                          onChange={() => handleCheckbox(idx, 'ambulance')}
                          className="w-5 h-5 accent-[#00d4ff] cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-6 text-center text-base">
                        <input
                          type="checkbox"
                          checked={!!row.fireEngine}
                          onChange={() => handleCheckbox(idx, 'fireEngine')}
                          className="w-5 h-5 accent-[#00d4ff] cursor-pointer"
                        />
                      </td>
                      <td className="py-4 px-6 text-center text-base">
                        {(row.status || '').toLowerCase() !== 'pending' ? (
                          <span className="text-green-500 font-bold bg-green-100 py-2 px-4 rounded-full">
                            Sent
                          </span>
                        ) : (
                          <button
                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:from-green-500 hover:to-blue-600 shadow-md hover:shadow-lg"
                            onClick={() => handleSend(row._id, idx)}
                            disabled={!row.ambulance && !row.fireEngine}
                          >
                            Send
                          </button>
                        )}
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

export default EmergencyServices; 