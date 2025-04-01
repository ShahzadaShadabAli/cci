"use client";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Session from "@/components/Session";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Link from "next/link";
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
          
          {/* Floating Attendance Button */}
          <Link href="/attendance">
            <div className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[--primary] text-[--secondary] shadow-lg flex items-center justify-center hover:bg-[--primary-dark] transition-all duration-300 z-50 cursor-pointer hover:scale-110">
              {/* Calendar/Attendance Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
