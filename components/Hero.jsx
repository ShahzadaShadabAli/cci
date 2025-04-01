'use client'

import React, { useRef, useState, useEffect } from 'react'
import Navbar from './Navbar'
import BentoGrid from './BentoGrid'
import { motion, useInView } from 'framer-motion'

const Hero = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, {
    amount: "all"
  })

  const [counts, setCounts] = useState({
    members: 0,
    meetings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch members count
        const membersResponse = await fetch('/api/member');
        const membersData = await membersResponse.json();
        const membersCount = membersData.length;

        // Fetch meetings count
        const meetingsResponse = await fetch('/api/meeting');
        const meetingsData = await meetingsResponse.json();
        const meetingsCount = meetingsData.length;

        setCounts({
          members: membersCount,
          meetings: meetingsCount
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div data-scroll data-scroll-section data-scroll-speed="-0.5" id='Home' className='relative w-full min-h-screen' ref={ref}>
      <motion.div initial={{y:-50}} animate={{y:0}} transition={{duration: 1}}>
        <Navbar />
      </motion.div>
      <div className="absolute -z-10 top-1/2 -translate-y-1/2 flex flex-col pl-16">
        <h1 className="text-[7vw] max-lg:text-[15vw] font-dongle relative font-extrabold mb-0 leading-[3.5vw] max-lg:leading-[10.5vw] text-[--primary]">
            {"CCI".split('').map((l, i) => (
        <motion.span
        key={i}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: i * 0.3 }}
        style={{ display: "inline-block", position: "relative" }} // Add position relative
      >
        {l}
      </motion.span>
          ))}
            <div className="absolute animate-bounce w-10 h-10 top-5 right-10 rounded-full bg-[--primary] "></div>
        </h1>
        <h1 className={`text-[4vw] max-lg:text-[6vw] inline-block font-custom mt-4 font-extrabold text-[--secondary] bg-[--primary] p-4 transform transition duration-1000 ${isInView ? "-rotate-2" : ""}`}>
  <span className={`inline-block transform transition duration-1000 ${isInView ? "rotate-2" : ""}`}>
    &lt; Programming /&gt;
  </span>
</h1>
        <h1 className="text-[7vw] max-lg:text-[15vw] leading-[7vw] max-lg:leading-[15vw] block font-dongle font-extrabold float-right mr-14 text-[--primary]">
        {"CLUB".split('').map((l, i) => (
        <motion.span
        key={i}
        initial={{ opacity: 0, y: -60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: (i+1) * 0.3 }}
        style={{ display: "inline-block", position: "relative" }} // Add position relative
      >
        {l}
      </motion.span>
          ))}
        </h1>
      </div>
      <div className="absolute bottom-10 max-lg:-bottom-40 gap-6 flex max-lg:flex-col max-lg:items-center justify-end items-end px-10 left-0 w-full">
      <motion.div initial={{scale: 0}} transition={{duration: 1}} animate={{scale:1}} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <BentoGrid no={1} count={isLoading ? "..." : counts.meetings} />
      </motion.div>
      <motion.div initial={{scale: 0}} animate={{scale:1}} transition={{duration: 1, delay:0.5}} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
      <BentoGrid no={2} count={isLoading ? "..." : counts.members} />
      </motion.div>
      </div>
    </div>
  )
}

export default Hero
