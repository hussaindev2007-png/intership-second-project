import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, AlertCircle, Building2, CircleDollarSign, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('entrepreneur');
  const [error, setError] = useState<string | null>(null);
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const { login, isVerifying2FA, verifyOTP, cancel2FA, isLoading } = useAuth();
  const navigate = useNavigate();

  // 1. Auto-Focus Logic
  useEffect(() => {
    if (isVerifying2FA) {
      setTimeout(() => {
        inputRefs[0].current?.focus();
      }, 100);
    }
  }, [isVerifying2FA]);

  // 2. Auto-Verify Logic
  useEffect(() => {
    const code = otp.join('');
    if (code.length === 4) {
      handleAutoOTP(code);
    }
  }, [otp]);

  const handleAutoOTP = async (finalOtp: string) => {
    try {
      await verifyOTP(finalOtp);
      toast.success('Successfully Signed In!');
      navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
    } catch (err) {
      toast.error('Invalid code. Please use 1234');
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs[index - 1].current?.focus();
  };

  // --- UPDATED SUBMIT LOGIC WITH ROLE CHECK ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // Login call se user data milta hai
      const response = await login(email, password, role);
      
      // Role validation: selected role vs account role
      if (response && response.user && response.user.role !== role) {
        const errorMsg = `Access Denied: Your account is registered as an ${response.user.role}`;
        setError(errorMsg);
        toast.error(errorMsg);
        // Yahan cancel2FA() call kar sakte hain agar state stuck ho jaye
        return;
      }
      
      toast.success('Credentials verified! Enter OTP.');
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error(message);
    }
  };

  // --- OTP MODAL ---
  if (isVerifying2FA) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
        <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl text-center animate-in zoom-in duration-300">
          <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            {isLoading ? <Loader2 size={32} className="animate-spin" /> : <ShieldCheck size={32} />}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Identity</h2>
          <p className="text-sm text-gray-500 mb-8">Enter the 4-digit code (1234) sent to your email.</p>
          
          <div className="flex justify-between gap-3 mb-8">
            {otp.map((digit, idx) => (
              <input key={idx} ref={inputRefs[idx]} type="text" maxLength={1} value={digit}
                disabled={isLoading}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-14 h-16 text-center text-2xl font-bold border-2 border-gray-100 rounded-2xl focus:border-primary-500 outline-none transition-all"
              />
            ))}
          </div>
          <button type="button" className={`w-full text-white py-4 rounded-2xl font-bold text-lg shadow-lg ${isLoading ? 'bg-gray-400' : 'bg-[#10a34b]'}`}>
            {isLoading ? 'Verifying...' : 'Verify & Sign In'}
          </button>
          <button onClick={cancel2FA} className="mt-6 text-gray-400 text-sm font-medium hover:text-gray-600">Back to Login</button>
        </div>
      </div>
    );
  }

  // --- LOGIN UI ---
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white">
              <path d="M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Welcome back to Business Nexus</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">I am signing in as a</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole('entrepreneur')}
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${role === 'entrepreneur' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <Building2 size={18} className="mr-2" /> Entrepreneur
                </button>
                <button type="button" onClick={() => setRole('investor')}
                  className={`py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${role === 'investor' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  <CircleDollarSign size={18} className="mr-2" /> Investor
                </button>
              </div>
            </div>
            <Input label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth startAdornment={<User size={18} />} />
            <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth startAdornment={<Lock size={18} />} />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
              </div>
              <Link to="/forgot-password" size="sm" className="text-sm font-medium text-primary-600 hover:text-primary-500">Forgot password?</Link>
            </div>
            <Button type="submit" fullWidth isLoading={isLoading} leftIcon={<LogIn size={18} />}>Sign in</Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Don't have an account? <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};