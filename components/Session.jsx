'use client'
import React, { useState, useEffect } from 'react'
import { Card } from './Card'
import { motion } from 'framer-motion'

const Session = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/meeting');
        
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }
        
        const data = await response.json();
        setMeetings(data);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div id='Sessions' data-scroll data-scroll-section data-scroll-speed="-0.2">
        <div className='py-32 bg-[--secondary] rounded-bl-3xl rounded-br-3xl'>
        <div className="flex gap-[5vw] max-lg:flex-col max-lg:items-center w-full">
     
          
       
     <div className="px-10">
     <motion.h1
        className="font-dongle text-[7vw] max-md:text-[12vw] mb-10 border-b border-[--primary] lg:pb-8 text-[--primary] font-extrabold leading-[9rem]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
           {"Our Sessions".split('').map((l, i) => (
    <motion.span
    key={i}
    initial={{ opacity: 0, y: 60 }}
    whileInView={{ opacity: 1, y: 0 }}
    className={`${i == 3 ? "ml-5 max-md:ml-3" : ""}`}
    transition={{ duration: 0.6, delay: (i+1) * 0.1 }}
    style={{ display: "inline-block", position: "relative" }} // Add position relative
  >
    {l}
  </motion.span>
      ))}
      </motion.h1>
  

  
      <motion.p
        className="font-custom lg:w-[60vw] text-xl max-md:text-sm text-[--primary]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Explore our past meetings and sessions. Each gathering is an opportunity to learn,
        connect, and grow together. Click on any session to learn more about what we discussed
        and view the gallery of memories we created.
      </motion.p>
     </div>
     <motion.img
        src="/meeting.png"
        alt="Rotating on scroll"
        className="w-[20rem] h-[20rem]"
        initial={{ opacity: 0 }} // Start hidden
        whileInView={{ opacity: 1 }} // Fade in and rotate
        transition={{ duration: 1 }} // Animation duration
  
      />
  </div>
        <div className="mt-16 px-32 max-md:px-4 cursor-pointer flex justify-center gap-10 flex-wrap">
            {loading ? (
              <div className="flex justify-center items-center w-full py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--primary]"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 font-custom text-center w-full py-10">
                Error loading meetings: {error}
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-[--primary] font-custom text-center w-full py-10">
                No meetings found. Check back later!
              </div>
            ) : (
              meetings.map((meeting) => (
                <Card 
                  key={meeting._id}
                  id={meeting._id}
                  title={meeting.title}
                  description={meeting.desc}
                  thumbnail={meeting.thumbnail}
                />
              ))
            )}
        </div>
    </div>
    </div>
  )
}

export default Session
