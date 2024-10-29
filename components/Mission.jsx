"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const Mission = () => {
  const [rotation, setRotation] = useState(0);
  const ref = useRef(null)
  const isInView = useInView(ref, {
    amount: "all"
  })

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setRotation(scrollPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div id="Mission" ref={ref} className="flex  max-lg:mt-96 mt-10 bg-[--primary] w-full z-40 relative pb-20 lg:py-32 rounded-tl-3xl rounded-tr-3xl">
      <div className="flex gap-[5vw] max-lg:flex-col max-lg:items-center w-full">
     
          
       
         <div className="px-10">
         <motion.h1
            className="font-dongle text-[7vw] max-md:text-[12vw] mb-10 border-b border-[--secondary] lg:pb-8 text-[--secondary] font-extrabold leading-[9rem]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
               {"Our Target".split('').map((l, i) => (
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
            className="font-custom lg:w-[60vw] max-md:text-sm text-xl text-[--secondary-light]"
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
            src="/target.png"
            alt="Rotating on scroll"
            className="w-[20rem] h-[20rem]"
            initial={{ opacity: 0, rotate: 0 }} // Start hidden
            whileInView={{ opacity: 1, rotate: rotation }} // Fade in and rotate
            transition={{ duration: 1 }} // Animation duration
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: "transform 0.1s linear",
            }}
          />
      </div>
    </div>
  );
};

export default Mission;
