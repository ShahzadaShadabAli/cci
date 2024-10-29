"use client";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Session from "@/components/Session";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [locomotiveScroll, setLocomotiveScroll] = useState(null);

  useEffect(() => {
    setIsLoading(false);

    // Dynamically import LocomotiveScroll and initialize it
    const initializeScroll = async () => {
      const LocomotiveScroll = (await import('locomotive-scroll')).default;
      setLocomotiveScroll(new LocomotiveScroll());
    };

    if (typeof window !== "undefined") {
      initializeScroll();
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      {isLoading && <Loader />}
      {!isLoading && (
        <div>
          <div className="w-80 animate-pulse h-80 absolute blur-xl -right-28 -top-20 bg-[--secondary] rounded-full"></div>
          <div className="w-[35rem] h-[35rem] animate-pulse blur-xl absolute -left-44 top-[70vh] bg-[--secondary] rounded-full"></div>
        
          <Hero />
          <Mission />
          <Session />
          <Team />
          <Footer />
        </div>
      )}
    </div>
  );
}
