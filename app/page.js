"use client"
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Session from "@/components/Session";
import { useEffect, useState } from "react";
import LocomotiveScroll from 'locomotive-scroll';
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";

export default function Home() {
  const locomotiveScroll = new LocomotiveScroll();

  const [isLoading, setIsloading] = useState(true)

  useEffect(() => {
    setIsloading(false)
  }, [])

  return (
    <div className="relative overflow-hidden">

      {isLoading && <Loader />}
      {!isLoading && <div>
        <div className="w-80 animate-pulse h-80 absolute blur-xl  -right-28 -top-20 bg-[--secondary] rounded-full"></div>
        <div className="w-[35rem] h-[35rem] animate-pulse blur-xl absolute -left-44 top-[70vh] bg-[--secondary] rounded-full"></div>
    
        <Hero />
        <Mission />
        <Session />
        <Team />
        <Footer />
        </div>}
    </div>
  );
}
