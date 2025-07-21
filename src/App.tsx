import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import VendorRegistration from './components/VendorRegistration';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white/70">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication form if user is not logged in
  if (!user) {
    return (
      <>
        <AuthForm onAuthSuccess={() => {}} />
        <Toaster position="top-right" />
      </>
    );
  }

  // Show vendor registration dashboard if user is logged in
  return (
    <>
      <VendorRegistration />
      <Toaster position="top-right" />
    </>
  );
}

export default App;