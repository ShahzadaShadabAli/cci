"use client";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Mission = () => {
  const ref = useRef(null);

  // Use framer-motion's useScroll to track the scroll position within the div
  const { scrollYProgress } = useScroll({
    target: ref, // Track scroll within the target div
    offset: ["start end", "end start"], // Start and end points for the scroll tracking
  });

  // Transform the scroll progress into rotation values
  const rotation = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <div
      id="Mission"
      ref={ref}
      className="flex max-lg:mt-96 mt-10 bg-[--primary] w-full z-40 relative pb-20 lg:py-32 rounded-tl-3xl rounded-tr-3xl"
    >
      <div className="flex gap-[5vw] max-lg:flex-col max-lg:items-center w-full">
        <div className="px-10">
          <motion.h1
            className="font-dongle text-[7vw] max-md:text-[12vw] mb-10 border-b border-[--secondary] lg:pb-8 text-[--secondary] font-extrabold leading-[9rem]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {"Our Target".split("").map((l, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                className={`${i === 3 ? "ml-5 max-md:ml-3" : ""}`}
                transition={{ duration: 0.6, delay: (i + 1) * 0.1 }}
                style={{ display: "inline-block", position: "relative" }}
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
Who wants to spend their life writing “Hello, World!”? Not us.

Welcome to CCI Programming Club, where we turn crazy ideas into reality and laugh in the face of boring assignments. No dry lectures, no pointless memorization—just real coding, wild projects, and pushing tech to its limits. Build games, break AI, and maybe even create something that melts your laptop (oops).          </motion.p>
        </div>
        <motion.img
          src="/target.png"
          alt="Rotating on scroll"
          className="w-[20rem] h-[20rem]"
          style={{
            rotate: rotation, // Apply the rotation based on scroll progress
          }}
        />
      </div>
    </div>
  );
};

export default Mission;
