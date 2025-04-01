'use client'
import React from 'react'
import { motion } from 'framer-motion'
const BentoGrid = ({no, count}) => {
  return (
    <div className=''>
      
      {no == 1 ? <div className="max-lg:w-full ">
      <motion.div
       
        className="relative w-40 p-7 float col-span-1 max-lg:w-full gap-6 row-span-4 rounded-xl flex lg:flex-col text-center justify-center items-center bg-[--primary]">
        <img src="/workshop.png" width="" className='w-[10vw]' alt="" />
        <h1 className=" font-semibold font-dongle text-[2vw] max-lg:text-[6vw] leading-6 text-[--secondary]">
          {count} <br className='max-lg:hidden' /> Meetings
        </h1>
      </motion.div>
      </div> :
      <motion.div className="relative flex float lg:flex-col max-lg:w-full max-lg:text-[5vw] justify-center gap-4 p-8 items-center lg:text-center max-lg:leading-[1.5rem] lg:leading-[1.7rem] bg-[--secondary] text-[--primary] font-dongle tracking-[.15rem] lg:text-[2vw] text-[5rem] font-extrabold col-span-2 row-span-3  rounded-xl">
        <img src="/team.png" className='w-[10vw] mb-3' alt="" />
        {count} <br className='max-lg:hidden' /> Active <br className='max-lg:hidden' /> Members
      </motion.div>
      }
  
     
    
     
    
    </div>
  )
}

export default BentoGrid
