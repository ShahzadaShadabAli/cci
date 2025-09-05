"use client";
import Hero from "@/components/Hero";
import Mission from "@/components/Mission";
import Session from "@/components/Session";
import Team from "@/components/Team";
import Footer from "@/components/Footer";
import Loader from "@/components/Loader";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [locomotiveScroll, setLocomotiveScroll] = useState(null);
  const [isSendingInvites, setIsSendingInvites] = useState(false);

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

  const sendWhatsAppInvites = async () => {
    setIsSendingInvites(true);
    try {
      const response = await fetch('/api/member/whatsapp-invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`WhatsApp invites sent to ${data.successful} members!`);
      } else {
        toast.error(data.message || 'Failed to send WhatsApp invites');
      }
    } catch (error) {
      console.error('Error sending WhatsApp invites:', error);
      toast.error('Failed to send WhatsApp invites');
    } finally {
      setIsSendingInvites(false);
    }
  };

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
          
          {/* Floating WhatsApp Invite Button */}
          <button
            onClick={sendWhatsAppInvites}
            disabled={isSendingInvites}
            className="fixed bottom-6 left-6 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg flex items-center justify-center hover:bg-green-600 transition-all duration-300 z-50 cursor-pointer hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send WhatsApp invites to all members"
          >
            {isSendingInvites ? (
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            )}
          </button>

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
