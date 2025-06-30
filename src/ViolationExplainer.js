import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import aiService from './services/aiService';
// import './ViolationExplainer.css';

const ViolationExplainer = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedViolation, setSelectedViolation] = useState('');
  const [explanation, setExplanation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const violations = [
    {
      id: 'speeding',
      name: 'Speeding',
      icon: '🚗',
      description: 'Exceeding posted speed limits',
      category: 'Moving Violation'
    },
    {
      id: 'red_light',
      name: 'Red Light Violation',
      icon: '🚦',
      description: 'Running red lights or stop signs',
      category: 'Moving Violation'
    },
    {
      id: 'parking',
      name: 'Illegal Parking',
      icon: '🅿️',
      description: 'Parking in unauthorized areas',
      category: 'Non-Moving Violation'
    },
    {
      id: 'dui',
      name: 'DUI/DWI',
      icon: '🍺',
      description: 'Driving under the influence',
      category: 'Criminal Offense'
    },
    {
      id: 'reckless',
      name: 'Reckless Driving',
      icon: '⚠️',
      description: 'Driving with willful disregard for safety',
      category: 'Criminal Offense'
    },
    {
      id: 'hit_run',
      name: 'Hit and Run',
      icon: '💥',
      description: 'Leaving scene of an accident',
      category: 'Criminal Offense'
    },
    {
      id: 'texting',
      name: 'Texting While Driving',
      icon: '📱',
      description: 'Using mobile devices while driving',
      category: 'Moving Violation'
    },
    {
      id: 'seatbelt',
      name: 'No Seatbelt',
      icon: '🦺',
      description: 'Not wearing seatbelt or child restraints',
      category: 'Non-Moving Violation'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Violations', color: '#667eea' },
    { id: 'moving', name: 'Moving Violations', color: '#ef4444' },
    { id: 'non-moving', name: 'Non-Moving Violations', color: '#f59e0b' },
    { id: 'criminal', name: 'Criminal Offenses', color: '#dc2626' }
  ];

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = violation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         violation.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (selectedCategory === 'moving' && violation.category === 'Moving Violation') ||
                           (selectedCategory === 'non-moving' && violation.category === 'Non-Moving Violation') ||
                           (selectedCategory === 'criminal' && violation.category === 'Criminal Offense');
    
    return matchesSearch && matchesCategory;
  });

  const handleViolationSelect = async (violationId) => {
    setSelectedViolation(violationId);
    setIsLoading(true);
    setExplanation(null);

    try {
      const response = await aiService.explainViolation(violationId);
      
      if (response.success) {
        setExplanation(response.data);
      } else {
        alert('Failed to get violation explanation. Please try again.');
      }
    } catch (error) {
      console.error('Violation explanation error:', error);
      alert('An error occurred while getting the explanation.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Moving Violation': return '#ef4444';
      case 'Non-Moving Violation': return '#f59e0b';
      case 'Criminal Offense': return '#dc2626';
      default: return '#667eea';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 to-cyan-600 p-5 font-sans">
      <button
        onClick={() => {
          const from = location.state?.from;
          if (from === 'cop') navigate('/traffic-cop-dashboard');
          else navigate('/traffic-central-dashboard');
        }}
        className="absolute top-14 left-8 z-10 bg-white/20 text-white px-3 py-2 md:px-4 rounded-full font-semibold hover:bg-white/40 transition-all flex items-center"
      >
        <span className="text-xl">&larr;</span>
        <span className="hidden md:inline ml-2">Back to Dashboard</span>
      </button>
      <div className="max-w-6xl mx-auto bg-white/95 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-400 to-red-700 text-white p-10 text-center">
          <h1 className="text-4xl font-bold mb-2 drop-shadow">Traffic Violation Explainer</h1>
          <p className="text-lg opacity-90">Get detailed explanations of traffic violations, consequences, and prevention tips</p>
        </div>

        <div className="p-8">
          {/* Search and Filter */}
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-8 bg-white/10 p-6 rounded-xl border border-white/20">
            <div className="relative max-w-xs w-full mx-auto md:mx-0">
              <input
                type="text"
                placeholder="Search violations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-full border-2 border-white/30 bg-white/90 text-base focus:outline-none focus:ring-2 focus:ring-red-400 focus:bg-white transition-all pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-lg text-gray-500">🔍</span>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {(categories || []).map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${selectedCategory === category.id ? 'bg-red-500 text-white border-red-500 shadow' : 'bg-white border-white/30 text-gray-700 hover:bg-red-100 hover:border-red-400'}`}
                  style={selectedCategory === category.id ? { boxShadow: `0 4px 15px ${category.color}33` } : {}}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Violations List */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 overflow-y-auto max-h-[600px]">
              <h3 className="text-lg font-bold mb-4 text-slate-800">Select a Violation</h3>
              <div className="flex flex-col gap-3">
                {(filteredViolations || []).map(violation => (
                  <div
                    key={violation.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedViolation === violation.id ? 'bg-gradient-to-br from-red-100 to-red-200 border-red-400 scale-105 shadow' : 'bg-white border-slate-200 hover:border-red-400 hover:-translate-y-1 hover:shadow-lg'}`}
                    onClick={() => handleViolationSelect(violation.id)}
                  >
                    <div className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg bg-slate-100">{violation.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-base font-bold mb-1 text-slate-800">{violation.name}</h4>
                      <p className="text-xs text-slate-600 mb-1">{violation.description}</p>
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getCategoryColor(violation.category) }}
                      >
                        {violation.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Explanation Panel */}
            <div className="md:col-span-2 bg-white rounded-xl p-8 min-h-[600px]">
              {!selectedViolation ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-bold mb-2">Select a Violation</h3>
                  <p>Choose a traffic violation from the list to see detailed information, consequences, and prevention tips.</p>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mb-6"></div>
                  <h3 className="text-xl font-bold mb-2">Loading Explanation...</h3>
                  <p>Getting detailed information about the violation</p>
                </div>
              ) : explanation ? (
                <div>
                  <div className="mb-8 border-b border-slate-200 pb-6">
                    <h2 className="text-2xl font-bold mb-2 text-red-600">{explanation.title}</h2>
                    <div className="flex flex-wrap gap-4 items-center text-sm text-slate-600">
                      <span className="inline-block">📋 Legal Reference: {explanation.legal_reference}</span>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800">📝 Description</h3>
                      <p className="text-slate-700 text-base leading-relaxed">{explanation.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800">⚠️ Consequences</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {explanation.consequences.map((consequence, index) => (
                          <li key={index} className="flex items-center gap-2 text-slate-700"><span>💸</span>{consequence}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800">🛡️ Prevention Tips</h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {explanation.prevention.map((tip, index) => (
                          <li key={index} className="flex items-center gap-2 text-slate-700"><span>✅</span>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-2 text-slate-800">📊 Additional Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center text-center">
                          <div className="text-3xl mb-2">⚖️</div>
                          <h4 className="font-bold mb-1">Legal Status</h4>
                          <p className="text-slate-700">This violation is taken seriously by law enforcement and can result in significant penalties.</p>
                        </div>
                        <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center text-center">
                          <div className="text-3xl mb-2">📈</div>
                          <h4 className="font-bold mb-1">Insurance Impact</h4>
                          <p className="text-slate-700">Violations can lead to increased insurance premiums and potential policy cancellations.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViolationExplainer; 