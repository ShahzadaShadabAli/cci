"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';

export default function AdminSpace() {
  const [showModal, setShowModal] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'Expelliarmus') {
      setError('');
      setAuthenticated(true);
      
      // Set authentication with 30-minute expiration
      const expirationTime = new Date(new Date().getTime() + 30 * 60000); // 30 minutes
      Cookies.set('adminAuthenticated', 'true', { expires: new Date(expirationTime) });
      // Also store the expiration time for easy checking
      localStorage.setItem('adminAuthExpires', expirationTime.getTime().toString());
      
      toast.success('Authentication successful!');
      
      // Smoothly close the modal
      setTimeout(() => {
        setShowModal(false);
      }, 500);
    } else {
      setError('Incorrect password. Please try again.');
      toast.error('Authentication failed!');
    }
  };

  // Update useEffect to check for the cookie instead of sessionStorage
  useEffect(() => {
    const isAuth = Cookies.get('adminAuthenticated');
    const authExpiry = localStorage.getItem('adminAuthExpires');
    
    // Check if auth exists and hasn't expired
    if (isAuth === 'true' && authExpiry && new Date().getTime() < parseInt(authExpiry)) {
      setAuthenticated(true);
      setShowModal(false);
    } else {
      // Clear expired auth data
      Cookies.remove('adminAuthenticated');
      localStorage.removeItem('adminAuthExpires');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Password Modal */}
      <AnimatePresence>
        {showModal && (
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
        )}
      </AnimatePresence>

      {/* Admin Dashboard Content */}
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-4xl font-bold text-center mb-12 font-dongle">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Meetings Card */}
            <AdminCard 
              href="/meetings"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Meetings"
              description="Manage all meetings, schedules, and attendances"
            />
            
            {/* Confirmations Card */}
            <AdminCard 
              href="/confirmations"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Confirmations"
              description="Review and approve pending user requests"
            />
            
            {/* Members Card */}
            <AdminCard 
              href="/members"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Members"
              description="View and manage all club members"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Admin Card Component
function AdminCard({ href, icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200"
    >
      <Link href={href} className="block p-6">
        <div className="flex flex-col items-center text-center">
          <div className="text-[--primary] mb-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-2 font-dongle">{title}</h3>
          <p className="text-gray-600 font-dongle">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}
