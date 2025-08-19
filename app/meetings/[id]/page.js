"use client";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function MeetingDetails() {
  const { id } = useParams();
  const [meeting, setMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certPassword, setCertPassword] = useState('');
  const [certError, setCertError] = useState('');

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/meeting/${id}`, { cache: 'no-store' });
        
        if (!response.ok) {
          throw new Error('Failed to fetch meeting details');
        }
        
        const data = await response.json();
        setMeeting(data);
      } catch (err) {
        console.error('Error fetching meeting:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMeeting();
    }
  }, [id]);

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  // Slider navigation functions
  const nextImage = () => {
    if (!meeting?.gallery?.length) return;
    setDirection(1);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === meeting.gallery.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    if (!meeting?.gallery?.length) return;
    setDirection(-1);
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? meeting.gallery.length - 1 : prevIndex - 1
    );
  };

  // Animation variants for slider
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0
    })
  };

  // Animation variants for content sections
  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.8,
        ease: 'easeInOut' 
      }
    }
  };

  const handleCertificateClick = () => {
    setShowCertModal(true);
  };

  const handleCertificateSubmit = async (e) => {
    e.preventDefault();
    
    if (certPassword === 'Chamanochama') {
      setShowCertModal(false);
      setCertPassword('');
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/meeting/certificates/${id}`, {
          method: 'POST',
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to send certificates');
        }
        
        // Update the local state to reflect the change
        setMeeting({
          ...meeting,
          certificates: true
        });
        
        toast.success('Certificates sent successfully!');
      } catch (error) {
        console.error('Error sending certificates:', error);
        toast.error(error.message || 'Failed to send certificates');
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowCertModal(true);
      setIsLoading(false);
      setError('Incorrect password. Please try again.');
      toast.error('Authentication failed!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[--primary]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Meeting</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Meeting Not Found</h2>
          <p>The meeting you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main Image with Title Section */}
      <motion.section 
        className="flex flex-col md:flex-row gap-8 mb-16 items-start"
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
      >
        <div className="w-full md:w-1/2 border-2 border-black">
          <div className="aspect-[16/9]">
            <img 
              src={meeting.thumbnail} 
              alt={meeting.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="w-full md:w-1/2 pt-4 flex flex-col justify-between h-full md:min-h-[calc(100vw*9/16/2)]">
          <div>
            <h1 className="text-5xl font-dongle font-bold mb-4">{meeting.title}</h1>
            <p className="text-xl font-dongle mb-auto">{meeting.desc}</p>
          </div>
          
          {/* Date at bottom of this div */}
          {meeting.createdAt && (
            <p className="text-gray-600 font-dongle text-xl mt-4 self-end">
              <span className="font-bold">Created:</span> {formatDate(meeting.createdAt)}
            </p>
          )}
        </div>
      </motion.section>

      {/* Divider */}
      <div className="w-full h-[1px] bg-black mb-16"></div>
      
      {/* Image Slider Section */}
      {meeting.gallery && meeting.gallery.length > 0 && (
        <motion.section 
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInVariant}
        >
          
          {/* Slider Container */}
          <div className="relative max-w-5xl mx-auto border-2 border-black aspect-[16/9] overflow-hidden">
            {/* Slider */}
            <motion.img
              key={currentImageIndex}
              src={meeting.gallery[currentImageIndex]}
              alt={`Gallery image ${currentImageIndex + 1}`}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              className="absolute w-full h-full object-cover"
            />
            
            {/* Navigation Buttons */}
            <button 
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full z-10 shadow-md"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            
            <button 
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full z-10 shadow-md"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            
            {/* Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {meeting.gallery.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => {
                    setDirection(index > currentImageIndex ? 1 : -1);
                    setCurrentImageIndex(index);
                  }}
                  className={`w-3 h-3 rounded-full ${
                    currentImageIndex === index ? 'bg-white' : 'bg-white/50'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2 mt-4 max-w-5xl mx-auto">
            {meeting.gallery.map((image, index) => (
              <div 
                key={index} 
                className={`border-2 cursor-pointer ${
                  currentImageIndex === index ? 'border-[--primary]' : 'border-gray-300'
                }`}
                onClick={() => {
                  setDirection(index > currentImageIndex ? 1 : -1);
                  setCurrentImageIndex(index);
                }}
              >
                <div className="aspect-[16/9]">
                  <img 
                    src={image} 
                    alt={`Thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Divider */}
      <div className="w-full h-[1px] bg-black mb-16"></div>
      
      {/* Members Participated Section */}
      {meeting.membersParticipated && meeting.membersParticipated.length > 0 ? (
        <motion.section
          className="mb-16"
          initial="hidden"
          animate="visible"
          variants={fadeInVariant}
        >
          <motion.h2 
            className="text-3xl font-dongle font-bold mb-6"
            variants={fadeInVariant}
          >
            Members Participated
          </motion.h2>
          
          <motion.div
            className="flex border-b max-lg:flex-col max-lg:items-center border-[--primary] py-4"
            variants={fadeInVariant}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <div className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {meeting.membersParticipated.map((member, index) => (
                  <div 
                    key={member._id || index} 
                    className="flex items-center gap-4 p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="flex-shrink-0">
                      <img 
                        src={`/${member.avatar}`} 
                        alt={member.name} 
                        className="h-14 w-14 rounded-full object-cover object-top" 
                      />
                    </div>
                    <div>
                      <h3 className="font-dongle text-xl font-semibold">{member.name}</h3>
                      <p className="font-dongle text-sm text-gray-600">{member.stage}</p>
                      {member.Rank && (
                        <p className="font-dongle text-sm text-[--primary]">{member.Rank}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.section>
      ) : (
        <motion.section
          className="mb-16 text-center py-8"
          initial="hidden"
          animate="visible"
          variants={fadeInVariant}
        >
          <h2 className="text-3xl font-dongle font-bold mb-2">Members Participated</h2>
          <p className="text-gray-500 font-dongle text-xl">No members have marked attendance for this meeting yet.</p>
        </motion.section>
      )}

      {/* Certificate Button */}
      {meeting.membersParticipated?.length > 0 && !meeting.certificates && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <button
            onClick={handleCertificateClick}
            disabled={isLoading}
            className="bg-[--primary] text-white px-6 py-3 rounded-full shadow-lg font-dongle text-xl font-semibold flex items-center gap-2 hover:bg-opacity-90 transition-all disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Certificates...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Send Certificates
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Certificate Success Message */}
      {meeting.certificates && (
        <motion.div
          className="mb-16 mt-8 bg-green-50 border border-green-200 p-6 rounded-lg text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-2xl font-dongle font-bold text-green-700 mb-2">
            Certificates Sent!
          </h3>
          <p className="font-dongle text-green-600">
            All participants have received their certificates via email.
          </p>
        </motion.div>
      )}

      {/* Return Button */}
      <motion.div
        className="fixed bottom-6 left-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
      >
        <Link
          href="/"
          className="bg-gray-700 text-white px-5 py-2.5 rounded-full shadow-lg font-dongle text-lg font-semibold flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return Home
        </Link>
      </motion.div>

      {/* Certificate Password Modal */}
      <AnimatePresence>
        {showCertModal && (
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
              <h2 className="text-3xl font-dongle font-bold text-center mb-6">Certificate Authorization</h2>
              
              <form onSubmit={handleCertificateSubmit} className="space-y-4">
                <div>
                  <label htmlFor="certPassword" className="block text-gray-700 text-base mb-2 font-dongle">
                    Enter authorization password
                  </label>
                  <input
                    type="password"
                    id="certPassword"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--primary] font-dongle"
                    placeholder="Password"
                    value={certPassword}
                    onChange={(e) => setCertPassword(e.target.value)}
                    autoFocus
                  />
                  {certError && (
                    <p className="mt-2 text-red-500 text-sm font-dongle">{certError}</p>
                  )}
                </div>
                
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCertModal(false)}
                    className={`w-1/2 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-200 font-dongle text-xl ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-1/2 bg-[--primary] text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-200 font-dongle text-xl disabled:opacity-70 flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Send Certificates'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
