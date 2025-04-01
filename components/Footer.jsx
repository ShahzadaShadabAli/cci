'use client'
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Form from "./Form";
const Footer = () => {
    const ref = useRef(null)
    const isInView = useInView(ref)
  return (
    <div className="bg-[--primary] pt-10 mt-32 rounded-tr-3xl rounded-tl-3xl" ref={ref}>
     <div className="flex whitespace-nowrap overflow-hidden">
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: -2000 }} // Adjust this value to control how far it scrolls
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex"
      >
        {/* Repeat the text within a single div for continuous scrolling */}
        <h1 className="font-dongle text-[11vw] mb-10 py-20 max-lg:py-2 text-[--secondary] flex items-center font-bold border-b leading-[5rem] border-[--primary]">
          Become 
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
          A 
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
          Member
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
        </h1>
        <h1 className="font-dongle text-[11vw] mb-10 py-20 max-lg:py-2 text-[--secondary] flex items-center font-bold border-b leading-[5rem] border-[--primary]">
          Become 
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
          A 
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
          Member
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
        </h1>
        <h1 className="font-dongle text-[11vw] lg:hidden mb-10 py-20 max-lg:py-2 text-[--secondary] flex items-center font-bold border-b leading-[5rem] border-[--primary]">
          Become 
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
          A 
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
          Member
          <div className="w-10 h-10 mx-7 rounded-full bg-[--secondary]" />
        </h1>
      </motion.div>
    </div>
      <div className="bg-[--secondary] h-1 w-full" />
      <div className="flex max-lg:flex-col">
        <div className="lg:w-1/2 w-full flex max-lg:pb-10">
        <div className="flex flex-col pl-16 mt-14">
        <h1 className="text-[6vw] font-dongle max-md:text-[12vw] font-extrabold mb-0 leading-[3.5vw] text-[--secondary]">
          CCI
        </h1>
        <div className="">
        <h1
          className={`text-[3vw] max-md:text-[6vw] !inline-block relative font-custom mt-4 mb-1 font-extrabold text-[--primary] bg-[--secondary] p-4 transform transition duration-1000 ${
              isInView ? "-rotate-2" : "-rotate-2"
            }`}
        >
            <div className="absolute animate-bounce w-10 h-10 -top-10 right-10 rounded-full bg-[--secondary] "></div>
          <span
            className={`inline-block transform transition duration-1000 ${
              isInView ? "rotate-2" : "rotate-2"
            }`}
          >
            &lt; Programming /&gt;
          </span>
        </h1>
        </div>
        <h1 className="text-[6vw] leading-[7vw] max-md:leading-[12vw] block max-md:text-[12vw] font-dongle font-extrabold float-right mr-14 text-[--secondary]">
          CLUB
        </h1>
      </div></div>
        <div className="lg:w-1/2">
        <Form />
        </div>
      </div>
    </div>
  );
};

export default Footer;
