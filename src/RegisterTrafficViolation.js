import React, { useState, useEffect } from 'react';
// import './RegisterTrafficViolation.css';
import policeLogo from './images/virtusa logo.png';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const violationTypes = [
  'Driving without licence',
  'Driving without insurance',
  'Driving without PUCC (Pollution Under Control Certificate)',
  'RC violation',
  'Driving under the influence/Drunken Driving',
  'Driving Dangerously',
  'Driving against the authorized flow of traffic/Wrong side driving',
  'Wrong Passing or Overtaking other Vehicles',
  'Driving without Helmet (Rider/Pillion Rider)',
  'Disobeying police order or directions',
  'Not giving way to an emergency vehicle',
  'Driving in NMV lanes/No entry/One-way roads',
  'Driving/Parking on Footpath/Cycle Track',
];

const validStateCodes = [
  'AN','AP','AR','AS','BR','CH','DN','DD','DL','GA','GJ','HR','HP','JK','KA','KL','LD','MP','MH','MN','ML','MZ','NL','OR','PY','PN','RJ','SK','TN','TR','UP','WB'
];

function RegisterTrafficViolation() {
  const [formData, setFormData] = useState({
    violatorName: '',
    drivingLicense: '',
    date: '',
    time: '',
    vehicleNumber: '',
    violationType: '',
    mobileNumber: ''
  });
  const [image, setImage] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
    generateParticles();
  }, []);

  const generateParticles = () => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
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

  const handleInputChange = (field, value) => {
    // Special handling for mobile number to limit to 10 digits
    if (field === 'mobileNumber') {
      // Remove any non-digit characters and limit to 10 digits
      let cleanedValue = value.replace(/\D/g, '').slice(0, 10);
      // If the first digit is present and not 9/8/7/6, block further typing
      if (cleanedValue.length > 0 && !/^[9876]/.test(cleanedValue)) {
        toast.error('Mobile number must start with 9, 8, 7, or 6');
        setFormData(prev => ({ ...prev, [field]: '' }));
        return;
      }
      setFormData(prev => ({ ...prev, [field]: cleanedValue }));
    }
    // Special handling for driving license: only auto-uppercase and remove spaces as the user types
    else if (field === 'drivingLicense') {
      let cleanedValue = value.replace(/\s/g, '').toUpperCase();
      // Only allow up to 15 characters
      cleanedValue = cleanedValue.slice(0, 15);
      // Only allow letters for the first two characters
      let firstTwo = cleanedValue.slice(0, 2).replace(/[^A-Z]/g, '');
      // Only allow digits for the next 13 characters
      let nextThirteen = cleanedValue.slice(2).replace(/[^0-9]/g, '').slice(0, 13);
      // If user has typed two letters, check if it's a valid state code
      if (firstTwo.length === 2 && cleanedValue.length >= 2) {
        if (!validStateCodes.includes(firstTwo)) {
          toast.error('Driving license must start with a valid state code (e.g., TN, AP, DL, etc.)');
          // Prevent further typing
          setFormData(prev => ({ ...prev, [field]: firstTwo }));
          return;
        }
      }
      setFormData(prev => ({ ...prev, [field]: firstTwo + nextThirteen }));
    }
    // Special handling for vehicle number: auto-uppercase and remove spaces
    else if (field === 'vehicleNumber') {
      let cleaned = value.replace(/\s/g, '').toUpperCase();
      // Only allow up to 10 characters (max possible: 2+2+2+4)
      cleaned = cleaned.slice(0, 10);
      // First 2: letters
      let firstTwo = cleaned.slice(0, 2).replace(/[^A-Z]/g, '');
      // Next 2: digits
      let nextTwo = cleaned.slice(2, 4).replace(/[^0-9]/g, '');
      // Next 2: letters (but allow only 1 or 2)
      let nextLetters = cleaned.slice(4, 6).replace(/[^A-Z]/g, '');
      // Last 4: digits (but allow only 1-4)
      let lastDigits = cleaned.slice(6, 10).replace(/[^0-9]/g, '');
      // If user has typed two letters, check if it's a valid state code
      if (firstTwo.length === 2 && cleaned.length >= 2) {
        if (!validStateCodes.includes(firstTwo)) {
          toast.error('Vehicle number must start with a valid state code (e.g., TN, AP, DL, etc.)');
          setFormData(prev => ({ ...prev, [field]: firstTwo }));
          return;
        }
      }
      // Only allow up to 2 letters for nextLetters and up to 4 digits for lastDigits
      nextLetters = nextLetters.slice(0, 2);
      lastDigits = lastDigits.slice(0, 4);
      // Compose the result
      let result = firstTwo + nextTwo + nextLetters + lastDigits;
      setFormData(prev => ({ ...prev, [field]: result }));
    }
    else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate mobile number is exactly 10 digits
    if (formData.mobileNumber.length !== 10) {
      toast.error('Mobile number must be exactly 10 digits');
      return;
    }
    
    // Validate driving license: 2 letters (state code) + 13 digits
    const drivingLicenseRegex = /^([A-Z]{2})([0-9]{13})$/;
    const dlMatch = formData.drivingLicense.match(drivingLicenseRegex);
    if (!dlMatch) {
      toast.error('Driving license must be in format: 2 letters (state code) + 13 numbers (e.g., TN1234567890123)');
      return;
    }
    const dlStateCode = dlMatch[1];
    if (!validStateCodes.includes(dlStateCode)) {
      toast.error('Driving license must start with a valid state code (e.g., TN, AP, DL, etc.)');
      return;
    }
    
    // Validate vehicle number: 2 letters (state), 2 digits, 1-2 letters, 1-4 digits
    const vehicleNumberRegex = /^([A-Z]{2})([0-9]{2})([A-Z]{1,2})([0-9]{1,4})$/;
    const match = formData.vehicleNumber.match(vehicleNumberRegex);
    if (!match) {
      toast.error('Vehicle number must be in format: TN01AB1234 or TN01A1234, etc. (2 letters, 2 digits, 1-2 letters, 1-4 digits)');
      return;
    }
    const stateCode = match[1];
    if (!validStateCodes.includes(stateCode)) {
      toast.error('Vehicle number must start with a valid state code (e.g., TN, AP, DL, etc.)');
      return;
    }
    
    // Save to localStorage
    const violations = JSON.parse(localStorage.getItem('violations') || '[]');
    violations.push({
      name: formData.violatorName,
      license: formData.drivingLicense,
      date: formData.date,
      time: formData.time,
      vehicle: formData.vehicleNumber,
      type: formData.violationType,
      mobileNumber: formData.mobileNumber,
      status: 'Yet to pay',
      image: image ? URL.createObjectURL(image) : null
    });
    localStorage.setItem('violations', JSON.stringify(violations));
    
    // Navigate to issue-ticket page with ticket data
    navigate('/issue-ticket', { state: { ticketData: formData } });
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden overflow-y-auto relative flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]" style={{scrollBehavior: 'smooth'}}>
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

      <div className={`w-full max-w-[700px] p-4 sm:p-8 pt-1 sm:pt-0 sm:mt-32 lg:mt-40 opacity-0 translate-y-12 transition-all duration-1000 z-10 relative ${isLoaded ? 'opacity-100 translate-y-0' : ''}`}>
        {/* Header with Logo */}
        <header className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 mb-6 sm:mb-10 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-4 sm:p-6 text-center sm:text-left">
          <div className="flex items-center justify-center relative w-[60px] h-[60px] sm:w-[80px] sm:h-[80px] mb-3 sm:mb-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(0,212,255,0.3)_0%,transparent_70%)] animate-[glow_3s_ease-in-out_infinite_alternate]"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[40px] h-[40px] sm:w-[60px] sm:h-[60px] border-2 border-[#00d4ff] rounded-full animate-[pulse_2s_ease-in-out_infinite]"></div>
            </div>
            <img src={policeLogo} alt="Virtusa Logo" className="h-[36px] sm:h-[50px] w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] mx-auto" />
          </div>
          <div className="text-white">
            <h1 className="text-xl sm:text-2xl font-extrabold mb-2 bg-gradient-to-r from-[#00d4ff] via-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,212,255,0.5)]">Register Traffic Violation</h1>
            <p className="text-sm sm:text-base opacity-80 font-light">Issue a ticket for a traffic offense</p>
          </div>
        </header>

        <main className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-10 border border-white/10 shadow-2xl w-full relative overflow-hidden">
          <button className="bg-white/10 border border-white/20 text-white px-6 py-2 rounded-full cursor-pointer transition-all font-semibold mb-6 inline-flex items-center gap-2 hover:bg-white/20" type="button" onClick={() => navigate('/traffic-cop-dashboard')}>
            ← Back to Dashboard
          </button>
          <form className="text-white" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Violator's Name *</label>
                <input
                  type="text"
                  value={formData.violatorName}
                  onChange={e => handleInputChange('violatorName', e.target.value)}
                  placeholder="Enter violator's name"
                  maxLength="30"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Driving License *</label>
                <input
                  type="text"
                  value={formData.drivingLicense}
                  onChange={e => handleInputChange('drivingLicense', e.target.value)}
                  placeholder="Format: AB1234567890123 (2 letters + 13 numbers)"
                  maxLength="16"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              {/* Set Current Date and Time Button */}
              <div className="col-span-1 md:col-span-2 text-center mb-4">
                <button
                  type="button"
                  className="bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] font-bold nav-item text-white cursor-pointer px-4 py-2 rounded-full transition-all relative overflow-hidden shadow-lg hover:from-[#0f3460] hover:to-[#533483] focus:outline-none"
                  onClick={() => {
                    const now = new Date();
                    const date = now.toISOString().slice(0, 10);
                    const time = now.toTimeString().slice(0, 5);
                    setFormData(prev => ({ ...prev, date, time }));
                  }}
                >
                  Set Current Date and Time
                </button>
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => handleInputChange('time', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Vehicle Number *</label>
                <input
                  type="text"
                  value={formData.vehicleNumber}
                  onChange={e => handleInputChange('vehicleNumber', e.target.value)}
                  placeholder="Enter vehicle number"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              <div className="mb-4">
                <label className="block text-white font-semibold mb-2">Violation Type *</label>
                <select
                  value={formData.violationType}
                  onChange={e => handleInputChange('violationType', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-transparent border border-white/30 text-white text-lg placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/10 transition-all appearance-none"
                  style={{ fontFamily: 'inherit' }}
                >
                  <option value="" disabled>-- Select --</option>
                  {violationTypes.map(type => (
                    <option key={type} value={type} className="bg-[#283e51] text-white text-lg">{type}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-white/80 mb-2 font-semibold">Mobile Number *</label>
                <input
                  type="text"
                  value={formData.mobileNumber}
                  onChange={e => handleInputChange('mobileNumber', e.target.value)}
                  placeholder="Enter mobile number (exactly 10 digits)"
                  maxLength="10"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border-2 border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
                />
              </div>
              {/* Image Upload Field (not mandatory) */}
              <div className="mb-4 col-span-1 md:col-span-2">
                <label className="block text-white/80 mb-2 font-semibold">Upload Image (optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => setImage(e.target.files[0] || null)}
                  className="w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#00d4ff] file:to-[#4ecdc4] file:text-white hover:file:bg-[#0f3460]"
                />
                {image && (
                  <div className="flex items-center mt-2 bg-white/10 px-4 py-2 rounded-lg">
                    <span className="text-white text-sm truncate max-w-[200px]">{image.name}</span>
                    <button
                      type="button"
                      className="ml-3 text-red-400 hover:text-red-600 text-lg font-bold focus:outline-none"
                      onClick={() => setImage(null)}
                      title="Remove image"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end mt-8">
              <button type="submit" className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] font-bold nav-item text-white cursor-pointer px-4 py-2 rounded-full transition-all relative overflow-hidden shadow-lg flex items-center gap-2 hover:from-[#ff5252] hover:to-[#d63031] focus:outline-none">
                <span>Issue a Ticket</span>
                <span className="text-xl">→</span>
              </button>
            </div>
          </form>
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}

export default RegisterTrafficViolation; 