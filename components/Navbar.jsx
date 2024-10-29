"use client"

import React, { useEffect, useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [scroll, setScroll] = useState(0)
  const [scrollPos, setScrollPos] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const [toggle, setToggle] = useState(false)

  useEffect(() => {
    // Check if window is defined (i.e., the code is running on the client side)
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        const currentScrollPos = window.scrollY;

        // If scrolling down, hide the navbar (set isVisible to false)
        // If scrolling up, show the navbar (set isVisible to true)
        if (currentScrollPos > scrollPos) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        // Update the scroll position
        setScrollPos(currentScrollPos);
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [scrollPos]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => {
        setScroll(window.scrollY);
        console.log(window.scrollY); // Logs the scroll position
      };

      window.addEventListener('scroll', handleScroll);

      // Clean up the event listener on component unmount
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  return (
    <nav
    initial={{ opacity: 0, y: -100 }} // Initial hidden state
      animate={{
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -100,
        rotate: isVisible ? [0, 10, -10, 0] : 0,
        scale: isVisible ? [0.5, 1.2, 0.8, 1] : 1,
      }}
    transition={{ duration: 1, ease: 'easeInOut' }} // Smooth transition
     className={`w-full z-[999] fixed text-[--primary] px-20 py-4 flex justify-between items-center ${isVisible ? 'slide-down' : 'slide-up'}
    ${scroll > 400 ? "bg-black bg-opacity-10 backdrop-filter backdrop-blur-lg border-none p-6" : ""} `}>
      <div className="logo font-dongle text-3xl font-bold">
      <h1>CCI PC</h1>
      </div>
      <div className="links flex gap-10 max-lg:hidden">
        {["Home","Mission", "Sessions", "Team",  "Contact"].map((item, index) =>(
            <a key={index} href={`#${item}`} className={`text-lg capitalize font-custom hover-underline-animation ${index === 4 ? "ml-32" : ''}`}>{item}</a>
        ))}
      </div>
      <div className="hidden max-lg:inline-block text-4xl cursor-pointer" onClick={() => setToggle(prev => !prev)}>
      <GiHamburgerMenu />
      </div>
      <AnimatePresence>
  {toggle && (
    <motion.div 
      className="links z-[999] flex flex-col gap-10 border-2 border-[--secondary] rounded-3xl p-10 top-24 text-center absolute bg-white w-[90%] left-[5%]"
      initial={{ y: -100, opacity: 0 }} // Slide up and hide initially
      animate={{ y: 0, opacity: 1 }} // Slide down and appear
      exit={{ y: -100, opacity: 0 }} // Slide up and disappear
      transition={{ duration: 0.5 }} // Smoothen the animation duration
    >
      {["Home","Mission", "Sessions", "Team",  "Contact"].map((item, index) => (
        <a key={index} href={`#${item}`} className="text-lg inline-block capitalize font-custom hover-underline-animation">
          {item}
        </a>
      ))}
    </motion.div>
  )}
</AnimatePresence>
    </nav>
  );
}

export default Navbar;
