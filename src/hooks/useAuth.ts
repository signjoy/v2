import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Registration successful! Please check your email to verify your account.');
      return data;
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      toast.success('Successfully signed in!');
      return data;
    } catch (error: any) {
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Incorrect email or password. Please try again.');
      } else {
        toast.error(error.message || 'Sign in failed');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error(error.message || 'Sign out failed');
    }
  };

  const resendVerification = async () => {
    if (user?.email) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        });
        if (error) throw error;
        toast.success('Verification email sent!');
      } catch (error: any) {
        toast.error(error.message || 'Failed to send verification email');
      }
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    logout,
    resendVerification
  };
};