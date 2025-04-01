"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminAuthModal from '@/app/components/AdminAuthModal';
import Cookies from 'js-cookie';
import Image from 'next/image';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = Cookies.get('adminAuthenticated');
      const authExpiry = localStorage.getItem('adminAuthExpires');
      
      if (isAuth === 'true' && authExpiry && new Date().getTime() < parseInt(authExpiry)) {
        setIsAuthenticated(true);
        setShowAuthModal(false);
      } else {
        Cookies.remove('adminAuthenticated');
        localStorage.removeItem('adminAuthExpires');
        setShowAuthModal(true);
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await fetch('/api/feedback');
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Failed to fetch feedbacks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedbacks();
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
  };

  return (
    <>
      <Toaster position="top-center" />
      
      <AnimatePresence>
        {showAuthModal && <AdminAuthModal onSuccess={handleAuthSuccess} />}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 font-dongle">Feedback Dashboard</h1>
        
        {isAuthenticated ? (
          isLoading ? (
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--primary]"></div>
            </div>
          ) : (
            <div className="grid gap-6">
              {feedbacks.map((feedback) => (
                <motion.div
                  key={feedback._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={`/${feedback.member.avatar}` || '/default-avatar.png'}
                          alt={feedback.member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg font-dongle">
                          {feedback.member.name}
                        </h3>
                        <span className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 font-dongle text-lg">{feedback.complain}</p>
                  </div>
                </motion.div>
              ))}

              {feedbacks.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500 font-dongle text-xl">No feedbacks yet</p>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="flex justify-center items-center min-h-[60vh]">
            <p className="text-gray-500 font-dongle text-xl">Please authenticate to view feedbacks</p>
          </div>
        )}
      </div>
    </>
  );
} 