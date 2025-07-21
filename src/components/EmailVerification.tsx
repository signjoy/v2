import React from 'react';
import { Mail, RefreshCw } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const EmailVerification: React.FC = () => {
  const { user, logout, resendVerification } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-orange-900 to-red-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20 shadow-2xl text-center">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Mail className="text-white" size={32} />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">
          Email Verification Required
        </h1>
        
        <p className="text-white/80 mb-6">
          We've sent a verification email to:
        </p>
        
        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <p className="text-white font-semibold">{user?.email}</p>
        </div>
        
        <p className="text-white/70 mb-8">
          Please check your email and click the verification link to continue.
        </p>
        
        <div className="space-y-4">
          <button
            onClick={resendVerification}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <RefreshCw size={20} />
            <span>Resend Verification Email</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full bg-white/10 text-white py-3 rounded-lg font-semibold hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 border border-white/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;