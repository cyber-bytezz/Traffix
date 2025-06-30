import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode';
import policeLogo from './images/virtusa logo.png';

function PaymentQR() {
  const location = useLocation();
  const navigate = useNavigate();
  const { ticketData } = location.state || {};
  const [qrUrl, setQrUrl] = useState('');

  // Fine mapping
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

  const fineAmount = getFineAmount(ticketData?.violationType);

  // Create a dummy payment link or data for the QR code
  const paymentData = ticketData 
    ? `upi://pay?pa=dummy-vpa@okicici&pn=TrafficPolice&am=${fineAmount}&tn=ViolationFine_${ticketData.vehicleNumber}`
    : 'No data available';

  useEffect(() => {
    if (paymentData) {
      QRCode.toDataURL(paymentData, { width: 256, margin: 2 }, (err, url) => {
        if (!err) setQrUrl(url);
      });
    }
  }, [paymentData]);

  // Timer to auto-navigate after 10 seconds
  useEffect(() => {
    if (!ticketData) return;
    const timer = setTimeout(() => {
      navigate('/paid', { state: { ticketData } });
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate, ticketData]);

  if (!ticketData) {
    return (
      <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No payment data found.</h1>
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
    <div className="min-h-screen font-sans flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] via-50% to-[#533483]">
        <nav className="w-full fixed top-0 left-0 z-[1000] bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-lg flex items-center py-3 px-8 min-h-[70px]">
            <div className="flex items-center justify-center relative w-[70px] h-[70px]">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-full h-full rounded-full border-2 border-cyan-400/60"></div>
                </div>
                <img src={policeLogo} alt="Virtusa Logo" className="h-10 w-auto object-contain relative z-10 drop-shadow-[0_0_15px_rgba(0,212,255,0.6)] mx-auto" />
            </div>
        </nav>
        
        <main className="bg-white/5 backdrop-blur-3xl rounded-[30px] p-10 border border-white/10 shadow-2xl w-full max-w-md text-center mt-[90px]">
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-[#00d4ff] via-[#ff6b6b] to-[#4ecdc4] bg-clip-text text-transparent">Scan to Pay</h1>
            <p className="text-white/80 mb-6">Use any UPI app to scan the QR code and pay the fine.</p>
            
            <div className="bg-white p-6 rounded-lg inline-block shadow-lg">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" width={256} height={256} />
                ) : (
                  <span className="text-gray-500">Generating QR...</span>
                )}
            </div>

            <div className="text-white mt-6">
                <p className="text-lg">Fine Amount: <span className="font-bold text-2xl text-[#ff6b6b]">₹{fineAmount}</span></p>
                <p className="text-sm text-white/70">Vehicle: {ticketData.vehicleNumber}</p>
            </div>
        </main>
    </div>
  );
}

export default PaymentQR; 