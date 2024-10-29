import React from 'react'
import { Card } from './Card'
import { motion } from 'framer-motion'

const Session = () => {
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
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatem
        delectus quae facere nesciunt id maiores perferendis sit numquam ea
        molestiae natus, laudantium ipsum modi explicabo? Quod veritatis ab
        illum excepturi!
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
            <Card />
            <Card />
            <Card />
        </div>
    </div>
    </div>
  )
}

export default Session
