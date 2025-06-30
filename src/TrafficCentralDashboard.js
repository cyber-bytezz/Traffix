import React, { useState, useEffect } from 'react';
// import './TrafficCentralDashboard.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';
import SosService from './services/sosService';
import AIChatbot from './AIChatbot';
import { getEmergencies } from './services/emergencyService';

function TrafficCentralDashboard() {
  const navigate = useNavigate();
  const [sosCount, setSosCount] = useState(0);
  const [violationCount, setViolationCount] = useState(0);
  const [fineCollection, setFineCollection] = useState(0);
  const [emergencyCount, setEmergencyCount] = useState(0);
  const [emergencies, setEmergencies] = useState([]);
  const [emergenciesLoading, setEmergenciesLoading] = useState(true);
  const [emergenciesError, setEmergenciesError] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  // Real-time trend data for the line graph (last 7 days)
  const [trendData, setTrendData] = useState({
    labels: [],
    violations: [],
    fineCollection: [],
    emergencies: []
  });

  // Helper to get last 7 days' labels and date strings
  function getLast7Days() {
    const days = [];
    const labels = [];
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().slice(0, 10)); // 'YYYY-MM-DD'
      labels.push(weekdays[d.getDay()]);
    }
    return { days, labels };
  }

  useEffect(() => {
    const updateStats = () => {
      // Violations
      let violations = [];
      try {
        violations = JSON.parse(localStorage.getItem('violations')) || [];
      } catch {
        violations = [];
      }
      setViolationCount(violations.length);

      // Fine Collection
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
      let fineSum = 0;
      for (const v of violations) {
        fineSum += getFineAmount(v.type);
      }
      setFineCollection(fineSum);

      // SOS
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

      // --- Real-time trend data ---
      const { days, labels } = getLast7Days();
      // Violations per day
      const violationsPerDay = days.map(day => violations.filter(v => v.date === day).length);
      // Fine collection per day
      const finePerDay = days.map(day => violations.filter(v => v.date === day).reduce((sum, v) => sum + getFineAmount(v.type), 0));
      // Emergencies per day
      const emergenciesPerDay = days.map(day => emergencies.filter(e => {
        const dateObj = e.createdAt ? new Date(e.createdAt) : new Date();
        const date = dateObj.toISOString().split('T')[0];
        return date === day;
      }).length);
      setTrendData({
        labels,
        violations: violationsPerDay,
        fineCollection: finePerDay,
        emergencies: emergenciesPerDay
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, []);

  // This useEffect recalculates trendData.emergencies when emergencies or emergenciesLoading changes
  useEffect(() => {
    if (!emergenciesLoading) {
      const { days, labels } = getLast7Days();
      const emergenciesPerDay = days.map(day => emergencies.filter(e => {
        const dateObj = e.createdAt ? new Date(e.createdAt) : new Date();
        const date = dateObj.toISOString().split('T')[0];
        return date === day;
      }).length);
      setTrendData(prev => ({ ...prev, labels, emergencies: emergenciesPerDay }));
    }
  }, [emergencies, emergenciesLoading]);

  const stats = {
    violations: violationCount,
    fineCollection: fineCollection,
    emergencies: emergencyCount,
    sosClicks: sosCount
  };

  const handleLogout = () => {
    navigate('/login');
  };

  // SVG Line Graph Helper (single series)
  function SingleLineGraph({ data, labels, color, title, yLabel, legend, valueFormatter }) {
    const width = 600;
    const height = 220;
    const padding = 40;
    const maxY = Math.max(...data);
    const minY = 0;
    const points = data.map((v, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
      const y = height - padding - ((v - minY) * (height - 2 * padding)) / (maxY - minY);
      return `${x},${y}`;
    }).join(' ');
    return (
      <div className="rounded-2xl bg-[#232b3b] p-6 shadow-xl mx-auto w-full max-w-3xl mb-8">
        <div className={`text-xl font-bold mb-2`} style={{ color }}>{title}</div>
        <svg width={width} height={height} className="block mx-auto">
          {/* Axes */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#fff" strokeWidth="2" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#fff" strokeWidth="2" />
          {/* Line */}
          <polyline points={points} fill="none" stroke={color} strokeWidth="3.5" strokeLinejoin="round" />
          {/* Dots */}
          {data.map((v, i) => {
            const x = padding + (i * (width - 2 * padding)) / (data.length - 1);
            const y = height - padding - ((v - minY) * (height - 2 * padding)) / (maxY - minY);
            return <circle key={i} cx={x} cy={y} r="7" fill="#232b3b" stroke={color} strokeWidth="3" />;
          })}
          {/* Labels */}
          {labels.map((label, i) => {
            const x = padding + (i * (width - 2 * padding)) / (labels.length - 1);
            return <text key={label} x={x} y={height - padding + 25} textAnchor="middle" fill="#fff" fontSize="1.15rem" fontWeight="500">{label}</text>;
          })}
          {/* Y-axis label */}
          {yLabel && <text x={padding - 30} y={padding + 40} fill={color} fontSize="1.1rem" fontWeight="bold" textAnchor="middle" transform={`rotate(-90,${padding - 30},${padding + 40})`}>{yLabel}</text>}
        </svg>
        {/* Legend */}
        {legend && (
          <div className="flex items-center justify-center gap-2 mt-4 mb-2">
            <span className="w-4 h-4 rounded-full inline-block" style={{ background: color }}></span>
            <span className="text-white/90 font-semibold text-base">{legend}</span>
          </div>
        )}
        {/* Value Chips */}
        <div className="flex items-center justify-center gap-3 mt-2 flex-wrap">
          {data.map((v, i) => (
            <span key={i} className={`px-4 py-2 rounded-lg bg-white/10 text-white text-lg font-bold shadow border border-white/10 min-w-[48px] text-center ${color === '#ffb347' && v === 15 ? 'bg-[#ffb347] text-[#232b3b]' : ''}`}>{valueFormatter ? valueFormatter(v) : v}</span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans overflow-x-hidden relative bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483]">
      {/* Header */}
      <header className="flex justify-between items-center px-10 py-5 fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center relative w-[60px] h-[60px]">
            {/* Stronger radial gradient glow */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full rounded-full" style={{background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)'}}></div>
            </div>
            {/* Pulsing border */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[52px] h-[52px] border-2 border-[#00d4ff] rounded-full animate-pulse"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-[40px] w-auto object-contain relative z-10 drop-shadow-[0_0_10px_rgba(0,212,255,0.5)]" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#ff6b6b] bg-clip-text text-transparent">Traffic Central Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Logout Button */}
          <button
            className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white border-none px-6 py-2 rounded-full cursor-pointer transition-all font-bold text-base ml-6 shadow-lg hover:from-[#ff5252] hover:to-[#d63031] hover:-translate-y-0.5"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex flex-col items-center justify-center mt-[130px]">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Stat Card 1 */}
          <div className="bg-[#232b3b] rounded-2xl p-8 text-center shadow-xl relative cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/violation-list')}>
            <div className="flex justify-center mb-2">
              <span className="text-4xl" style={{ filter: 'drop-shadow(0 0 12px #00d4ff88)' }}>🚦</span>
            </div>
            <div className="text-white/90 text-lg font-semibold mb-1">Number of Violations</div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] bg-clip-text text-transparent">{stats.violations}</div>
          </div>
          {/* Stat Card 2 */}
          <div className="bg-[#232b3b] rounded-2xl p-8 text-center shadow-xl relative cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/fine-collection-list')}>
            <div className="flex justify-center mb-2">
              <span className="text-4xl" style={{ filter: 'drop-shadow(0 0 12px #ffb34788)' }}>💰</span>
            </div>
            <div className="text-white/90 text-lg font-semibold mb-1">Fine Collection</div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-[#ff6b6b] to-[#f0932b] bg-clip-text text-transparent">₹{stats.fineCollection.toLocaleString()}</div>
          </div>
          {/* Stat Card 3 */}
          <div className="bg-[#232b3b] rounded-2xl p-8 text-center shadow-xl relative cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/emergency-list')}>
            <div className="flex justify-center mb-2">
              <span className="text-4xl" style={{ filter: 'drop-shadow(0 0 12px #ff6b6b88)' }}>🚨</span>
            </div>
            <div className="text-white/90 text-lg font-semibold mb-1">Number of Emergencies</div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-[#ff6b6b] to-[#ffb347] bg-clip-text text-transparent">{stats.emergencies}</div>
          </div>
          {/* Stat Card 4 */}
          <div className="bg-[#232b3b] rounded-2xl p-8 text-center shadow-xl relative cursor-pointer hover:scale-105 transition-transform duration-300" onClick={() => navigate('/sos')}>
            <div className="flex justify-center mb-2">
              <span className="text-4xl" style={{ filter: 'drop-shadow(0 0 12px #ff6b6b), drop-shadow(0 0 18px #00d4ff)' }}>
                <span className="bg-[#ff6b6b] text-white px-3 py-1 rounded-lg font-bold shadow-lg">SOS</span>
              </span>
            </div>
            <div className="text-white/90 text-lg font-semibold mb-1">Number of SOS Clicks</div>
            <div className="text-4xl font-extrabold bg-gradient-to-r from-[#ff6b6b] to-[#00d4ff] bg-clip-text text-transparent">{stats.sosClicks}</div>
          </div>
        </div>
        {/* Violations Graph */}
        <div className="overflow-x-auto w-full mb-4"><div className="min-w-[600px]">
          <SingleLineGraph
            data={trendData.violations}
            labels={trendData.labels}
            color="#00d4ff"
            title="Violations"
            yLabel="Violations"
          />
        </div></div>
        {/* Fine Collection Graph */}
        <div className="overflow-x-auto w-full mb-4"><div className="min-w-[600px]">
          <SingleLineGraph
            data={trendData.fineCollection}
            labels={trendData.labels}
            color="#ff6b6b"
            title="Fine Collection"
            yLabel="₹"
            legend="Fine Collection"
            valueFormatter={v => `₹${v.toLocaleString()}`}
          />
        </div></div>
        {/* Emergencies Graph */}
        <div className="overflow-x-auto w-full mb-4"><div className="min-w-[600px]">
          <SingleLineGraph
            data={trendData.emergencies}
            labels={trendData.labels}
            color="#ffb347"
            title="Emergencies"
            yLabel="Emergencies"
            legend="Emergencies"
          />
        </div></div>

        {/* AI Tools Section */}
        <div className="w-full flex flex-col items-center justify-center mb-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"> AI-Powered Tools</h2>
            <p className="text-white/80 text-lg">Advanced analytics and intelligent assistance tools</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center mx-auto max-w-3xl">
            {/* Report Generator */}
            <div className="bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20 rounded-2xl p-6 shadow-xl border border-[#667eea]/30 hover:border-[#667eea] group cursor-pointer hover:-translate-y-2 hover:scale-105 text-white transition-all" onClick={() => navigate('/report-generator', { state: { from: 'central' } })}>
              <div className="text-center">
                <div className="text-4xl mb-3">📋</div>
                <h3 className="text-lg font-bold text-white mb-2">AI Report Generator</h3>
                <p className="text-white/80 text-sm mb-3">Generate comprehensive traffic incident reports</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="flex items-center gap-1 text-[#667eea] font-semibold bg-[#667eea]/20 px-2 py-1 rounded-full text-xs"><span>🤖</span>AI-powered</span>
                  <span className="flex items-center gap-1 text-[#4ecdc4] font-semibold bg-[#4ecdc4]/20 px-2 py-1 rounded-full text-xs"><span>📊</span>Detailed</span>
                </div>
              </div>
            </div>

            {/* Violation Explainer */}
            <div className="bg-gradient-to-br from-[#ff6b6b]/20 to-[#ffb347]/20 rounded-2xl p-6 shadow-xl border border-[#ff6b6b]/30 hover:border-[#ff6b6b] group cursor-pointer hover:-translate-y-2 hover:scale-105 text-white transition-all" onClick={() => navigate('/violation-explainer', { state: { from: 'central' } })}>
              <div className="text-center">
                <div className="text-4xl mb-3">🚨</div>
                <h3 className="text-lg font-bold text-white mb-2">Violation Explainer</h3>
                <p className="text-white/80 text-sm mb-3">Get detailed explanations of traffic violations</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  <span className="flex items-center gap-1 text-[#ff6b6b] font-semibold bg-[#ff6b6b]/20 px-2 py-1 rounded-full text-xs"><span>📚</span>Educational</span>
                  <span className="flex items-center gap-1 text-[#10b981] font-semibold bg-[#10b981]/20 px-2 py-1 rounded-full text-xs"><span>🛡️</span>Prevention</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
    </div>
  );
}

export default TrafficCentralDashboard; 