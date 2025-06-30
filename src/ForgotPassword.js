import React, { useState } from 'react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: input, 2: otp, 3: reset, 4: done
  const [copIdOrEmail, setCopIdOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpError, setOtpError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [inputError, setInputError] = useState('');

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (/^cop\d+$/i.test(copIdOrEmail)) {
      const numPart = copIdOrEmail.slice(3);
      if (/^\d{3}$/.test(numPart) && Number(numPart) >= 1 && Number(numPart) <= 999) {
        setInputError('');
      } else {
        setInputError('Enter correct COP ID (COP001 to COP999)');
        return;
      }
    } else if (/^admin\d+$/i.test(copIdOrEmail)) {
      const numPart = copIdOrEmail.slice(5);
      if (/^\d{3}$/.test(numPart) && Number(numPart) >= 1 && Number(numPart) <= 999) {
        setInputError('');
      } else {
        setInputError('Enter correct Admin ID (ADMIN001 to ADMIN999)');
        return;
      }
    } else if (/^emp\d+$/i.test(copIdOrEmail)) {
      const numPart = copIdOrEmail.slice(3);
      if (/^\d{3}$/.test(numPart) && Number(numPart) >= 1 && Number(numPart) <= 999) {
        setInputError('');
      } else {
        setInputError('Enter correct Employee ID (EMP001 to EMP999)');
        return;
      }
    } else {
      setInputError('Enter a valid ID (COP001-999, ADMIN001-999, or EMP001-999)');
      return;
    }
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep(3);
      setOtpError('');
    } else {
      setOtpError('Invalid OTP');
    }
  };

  const handleResendOtp = () => {
    setOtp('');
    setOtpError('');
  };

  const handlePasswordChange = (val) => {
    setNewPassword(val);
    // Simple strength check
    if (val.length < 6) setPasswordStrength('Weak');
    else if (val.match(/[A-Z]/) && val.match(/[0-9]/) && val.length >= 8) setPasswordStrength('Strong');
    else setPasswordStrength('Medium');
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    // Password validation: min 6 chars, at least one special char
    if (!newPassword || !confirmPassword) {
      setPasswordError('Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }
    if (!/^.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?].*$/.test(newPassword) || newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters and contain at least one special character.');
      return;
    }
    setPasswordError('');
    setStep(4);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#533483] p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/10">
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Forgot Password</h2>
            <label className="block text-white/80 mb-2 font-semibold">Cop ID / Administration ID/ Employee ID/ Registered Email</label>
            <input
              type="text"
              value={copIdOrEmail}
              onChange={e => setCopIdOrEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
              placeholder="Enter Cop ID, Admin ID, or Employee ID"
            />
            {inputError && <div className="text-red-400 mb-4 text-center">{inputError}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] text-white font-bold py-3 rounded-full shadow-lg transition-all hover:from-[#0f3460] hover:to-[#533483] focus:outline-none">Send OTP</button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">OTP Verification</h2>
            <label className="block text-white/80 mb-2 font-semibold">Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              required
              maxLength={6}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all tracking-widest text-center text-lg"
              placeholder="6-digit OTP"
            />
            {otpError && <div className="text-red-400 mb-2 text-center">{otpError}</div>}
            <div className="flex justify-between items-center mb-6">
              <button type="button" className="text-[#00d4ff] hover:underline" onClick={handleResendOtp}>Resend OTP</button>
              <button type="submit" className="bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all hover:from-[#0f3460] hover:to-[#533483] focus:outline-none">Verify OTP</button>
            </div>
          </form>
        )}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h2 className="text-2xl font-bold mb-6 text-white text-center">Reset Password</h2>
            <label className="block text-white/80 mb-2 font-semibold">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => handlePasswordChange(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
              placeholder="Enter new password"
            />
            <div className="mb-4 text-sm">
              <span className={`font-bold ${passwordStrength === 'Strong' ? 'text-green-400' : passwordStrength === 'Medium' ? 'text-yellow-400' : 'text-red-400'}`}>Password Strength: {passwordStrength}</span>
            </div>
            <label className="block text-white/80 mb-2 font-semibold">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#00d4ff] focus:bg-white/20 transition-all"
              placeholder="Confirm new password"
            />
            {passwordError && <div className="text-red-400 mb-2 text-center">{passwordError}</div>}
            <button type="submit" className="w-full bg-gradient-to-r from-[#ff6b6b] to-[#ee5a24] text-white font-bold py-3 rounded-full shadow-lg transition-all hover:from-[#ff5252] hover:to-[#d63031] focus:outline-none">Submit</button>
          </form>
        )}
        {step === 4 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 text-white">Password Reset Successful</h2>
            <p className="text-white/80 mb-6">Your password has been reset successfully. Please login with your new password.</p>
            <a href="/login" className="inline-block bg-gradient-to-r from-[#00d4ff] to-[#4ecdc4] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all hover:from-[#0f3460] hover:to-[#533483] focus:outline-none">Go to Login</a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword; 