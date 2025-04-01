"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function AdminAuthModal({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'Expelliarmus') {
      setError('');
      
      // Set authentication with 30-minute expiration
      const expirationTime = new Date(new Date().getTime() + 30 * 60000); // 30 minutes
      Cookies.set('adminAuthenticated', 'true', { expires: new Date(expirationTime) });
      localStorage.setItem('adminAuthExpires', expirationTime.getTime().toString());
      
      toast.success('Authentication successful!');
      
      // Notify parent component
      if (onSuccess) {
        // Small delay for better UX
        setTimeout(() => {
          onSuccess();
        }, 500);
      }
    } else {
      setError('Incorrect password. Please try again.');
      toast.error('Authentication failed!');
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
        >
          <h2 className="text-3xl font-dongle font-bold text-center mb-6">Admin Access</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-gray-700 text-base mb-2 font-dongle">
                Enter the secret password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] font-dongle"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              {error && (
                <p className="mt-2 text-red-500 text-sm font-dongle">{error}</p>
              )}
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[--primary] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 font-dongle text-xl"
              >
                Access Admin Panel
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
} 