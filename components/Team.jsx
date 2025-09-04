'use client'

import React, { useEffect, useState } from 'react';
import { TeamCard } from './TeamCard';
import members from '@/data/team.json';
import { motion } from 'framer-motion';

const fadeInVariant = {
  hidden: { opacity: 0, y: 50 }, // Start with a slight downward offset for a smoother effect
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 1.5,  // Longer duration for a smoother feel
      ease: 'easeInOut' // Smooth easing function for both in and out
    }
  }
};

const Team = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState(null)

    const fetchMembers = async () =>{
        setIsLoading(true)
        try {
            const response = await fetch("/api/member", {method: "GET", cache: 'no-store'})
            const data = await response.json()
            setMembers(data)
        } catch (error) {
            console.log(error)
        } finally { 
            setIsLoading(false)
        }
    }
  
  useEffect(() => {
    fetchMembers()
  }, [])

  return (
    <motion.div
    id='Team'
      className="mt-60"
      initial="hidden"
      whileInView="visible" // Trigger on scroll
      viewport={{ once: true, amount: 0.2 }} // 20% of the component must be in view to trigger
      variants={fadeInVariant}
    >
      <motion.h1
        className="font-dongle text-[7vw] pl-7 max-md:text-[12vw] text-[--primary] pb-7 font-bold border-b leading-[5rem] border-[--primary]"
        variants={fadeInVariant}
      >
        Our Team
      </motion.h1>

      <motion.div
        className="flex max-lg:flex-col max-lg:items-center border-b border-[--primary] py-4"
        variants={fadeInVariant}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-1/2 pl-7">
          <motion.h1 className="font-custom text-lg" variants={fadeInVariant}>
            Presidents:
          </motion.h1>
        </div>
        <div className="w-1/2">
          {members && (
            <TeamCard 
              cards={members.filter(m => {
                const t = (m.type || '').toLowerCase();
                return t ? t === 'president' : m.isMember !== true;
              })} 
            />
          )}
          {!members && <span className='w-20 h-20 text-black animate-spin'></span> }
        </div>
      </motion.div>

      <motion.div
        className="flex border-b max-lg:flex-col max-lg:items-center border-[--primary] py-4"
        variants={fadeInVariant}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-1/2 pl-7">
          <motion.h1 className="font-custom text-lg" variants={fadeInVariant}>
            Deputy Presidents:
          </motion.h1>
        </div>
        <div className="w-1/2">
          {members && (
            <TeamCard 
              cards={members.filter(m => (m.type || '').toLowerCase() === 'vpresident')} 
            />
          )}
        </div>
      </motion.div>

      <motion.div
        className="flex border-b max-lg:flex-col max-lg:items-center border-[--primary] py-4"
        variants={fadeInVariant}
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="w-1/2 pl-7">
          <motion.h1 className="font-custom text-lg" variants={fadeInVariant}>
            Members:
          </motion.h1>
        </div>
        <div className="w-1/2">
          {members && (
            <TeamCard 
              cards={members.filter(m => {
                const t = (m.type || '').toLowerCase();
                return t ? t === 'member' : m.isMember === true;
              })} 
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Team;
