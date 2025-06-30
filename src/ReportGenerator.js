import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import aiService from './services/aiService';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
// import './ReportGenerator.css';

const ReportGenerator = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    incidentType: '',
    location: '',
    date: '',
    time: '',
    description: '',
    involvedParties: '',
    evidence: '',
    severity: 'medium',
    weather: '',
    roadConditions: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const incidentTypes = [
    'Traffic Accident',
    'Speeding Violation',
    'Red Light Violation',
    'Illegal Parking',
    'DUI/DWI',
    'Reckless Driving',
    'Hit and Run',
    'Road Rage',
    'Other'
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'critical', label: 'Critical', color: '#dc2626' }
  ];

  const weatherConditions = [
    'Clear',
    'Cloudy',
    'Rainy',
    'Snowy',
    'Foggy',
    'Windy',
    'Stormy'
  ];

  const roadConditions = [
    'Dry',
    'Wet',
    'Icy',
    'Snow-covered',
    'Muddy',
    'Under construction',
    'Poor visibility'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.incidentType || !formData.location || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }
    setIsGenerating(true);
    setSuccess(false);
    try {
      const reportData = {
        incidentType: formData.incidentType,
        location: formData.location,
        date: `${formData.date} ${formData.time}`,
        description: formData.description,
        involvedParties: formData.involvedParties,
        evidence: formData.evidence,
        severity: formData.severity,
        weather: formData.weather,
        roadConditions: formData.roadConditions
      };
      const response = await aiService.generateReport(reportData);
      if (response.success) {
        // Immediately download PDF
        const generatedReport = response.data;
        const doc = new jsPDF('p', 'mm', 'a4');
        doc.setFontSize(18);
        doc.text('TRAFFIC INCIDENT REPORT', 105, 18, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Report ID: ${generatedReport.reportId}`, 14, 30);
        doc.text(`Generated: ${new Date(generatedReport.generatedAt).toLocaleString()}`, 14, 38);
        doc.setFontSize(14);
        doc.text('INCIDENT DETAILS', 14, 50);
        doc.setFontSize(12);
        autoTable(doc, {
          startY: 55,
          head: [['Field', 'Value']],
          body: [
            ['Type', generatedReport.incidentType],
            ['Location', generatedReport.location],
            ['Date & Time', generatedReport.date],
            ['Severity', generatedReport.priority],
            ['Weather', generatedReport.weather || 'Not specified'],
            ['Road Conditions', generatedReport.roadConditions || 'Not specified'],
          ],
          theme: 'grid',
          styles: { fontSize: 10 },
          columnStyles: { 0: { cellWidth: 40 }, 1: { cellWidth: 120 } },
        });
        let y = doc.lastAutoTable ? doc.lastAutoTable.finalY + 6 : 90;
        doc.setFontSize(12);
        doc.text('DESCRIPTION:', 14, y);
        doc.setFontSize(10);
        doc.text(generatedReport.description, 14, y + 6, { maxWidth: 180 });
        y += 18;
        doc.setFontSize(12);
        doc.text('INVOLVED PARTIES:', 14, y);
        doc.setFontSize(10);
        doc.text(generatedReport.involvedParties || 'Not specified', 14, y + 6, { maxWidth: 180 });
        y += 18;
        doc.setFontSize(12);
        doc.text('EVIDENCE:', 14, y);
        doc.setFontSize(10);
        doc.text(generatedReport.evidence || 'Not specified', 14, y + 6, { maxWidth: 180 });
        y += 18;
        doc.setFontSize(12);
        doc.text('SUMMARY:', 14, y);
        doc.setFontSize(10);
        doc.text(generatedReport.summary, 14, y + 6, { maxWidth: 180 });
        y += 18;
        doc.setFontSize(12);
        doc.text('RECOMMENDATIONS:', 14, y);
        doc.setFontSize(10);
        generatedReport.recommendations.forEach((rec, idx) => {
          doc.text(`• ${rec}`, 18, y + 12 + idx * 6, { maxWidth: 170 });
        });
        y += 12 + generatedReport.recommendations.length * 6;
        doc.setFontSize(10);
        doc.text(`Status: ${generatedReport.status}`, 14, y + 8);
        doc.text(`Priority: ${generatedReport.priority}`, 80, y + 8);
        doc.save(`traffic-report-${generatedReport.reportId}.pdf`);
        setSuccess(true);
      } else {
        alert('Failed to generate report. Please try again.');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      alert('An error occurred while generating the report.');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      incidentType: '',
      location: '',
      date: '',
      time: '',
      description: '',
      involvedParties: '',
      evidence: '',
      severity: 'medium',
      weather: '',
      roadConditions: ''
    });
    setSuccess(false);
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
      <div className="max-w-3xl mx-auto bg-white/95 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
        <div className="bg-gradient-to-r from-cyan-400 to-cyan-700 text-white p-10 text-center">
          <h1 className="text-4xl font-bold mb-2 drop-shadow"> AI-Powered Report Generator</h1>
          <p className="text-lg opacity-90">Generate comprehensive traffic incident reports with AI assistance</p>
        </div>
        {success ? (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-bold mb-6 text-cyan-700">Report Generated & Downloaded!</h2>
            <button
              className="bg-gradient-to-r from-cyan-400 to-cyan-700 text-white px-8 py-3 rounded-full font-bold shadow hover:from-cyan-500 hover:to-cyan-800 transition-all mt-6"
              onClick={resetForm}
            >
              🔄 New Report
            </button>
          </div>
        ) : (
          <form className="p-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Incident Type *</label>
                <select
                  name="incidentType"
                  value={formData.incidentType}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                >
                  <option value="">Select incident type</option>
                  {incidentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter incident location"
                  required
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Time *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="font-semibold mb-2 text-gray-700">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the incident..."
                  required
                  className="w-full px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base min-h-[80px]"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="font-semibold mb-2 text-gray-700">Involved Parties</label>
                <input
                  type="text"
                  name="involvedParties"
                  value={formData.involvedParties}
                  onChange={handleInputChange}
                  placeholder="Names, roles, or details of involved parties"
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                />
              </div>

              <div className="flex flex-col md:col-span-2">
                <label className="font-semibold mb-2 text-gray-700">Evidence</label>
                <input
                  type="text"
                  name="evidence"
                  value={formData.evidence}
                  onChange={handleInputChange}
                  placeholder="Describe or link to evidence (optional)"
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                />
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Severity</label>
                <div className="flex gap-2 flex-wrap">
                  {severityLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      className={`px-4 py-2 rounded-full border-2 font-semibold text-sm transition-all ${formData.severity === level.value ? 'bg-cyan-400 text-white border-cyan-400 shadow' : 'bg-white border-slate-200 text-gray-700 hover:bg-cyan-100 hover:border-cyan-400'}`}
                      style={formData.severity === level.value ? { boxShadow: `0 4px 15px ${level.color}33` } : {}}
                      onClick={() => setFormData(prev => ({ ...prev, severity: level.value }))}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Weather</label>
                <select
                  name="weather"
                  value={formData.weather}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                >
                  <option value="">Select weather</option>
                  {weatherConditions.map(w => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="font-semibold mb-2 text-gray-700">Road Conditions</label>
                <select
                  name="roadConditions"
                  value={formData.roadConditions}
                  onChange={handleInputChange}
                  className="px-4 py-3 rounded-lg border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white transition-all text-base"
                >
                  <option value="">Select road conditions</option>
                  {roadConditions.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="bg-gradient-to-r from-cyan-400 to-cyan-700 text-white px-8 py-3 rounded-full font-bold shadow hover:from-cyan-500 hover:to-cyan-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate & Download PDF'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator; 