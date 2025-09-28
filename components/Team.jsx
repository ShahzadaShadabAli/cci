'use client'

import React, { useEffect, useState } from 'react';
import { TeamCard } from './TeamCard';
import members from '@/data/team.json';

const Team = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState(null)

    const fetchMembers = async () =>{
        setIsLoading(true)
        try {
            const response = await fetch("/api/member", {method: "GET", cache: 'no-store'})
            const data = await response.json()
            setMembers(data)
        } catch (error) {
            console.log(error)
        } finally { 
            setIsLoading(false)
        }
    }
  
  useEffect(() => {
    fetchMembers()
  }, [])

  return (
    <div
      id='Team'
      className="mt-60"
    >
      <h1 className="font-dongle text-[7vw] pl-7 max-md:text-[12vw] text-[--primary] pb-7 font-bold border-b leading-[5rem] border-[--primary]">
        Our Team
      </h1>

      <div className="flex max-lg:flex-col max-lg:items-center border-b border-[--primary] py-4">
        <div className="w-1/2 pl-7">
          <h1 className="font-custom text-lg">
            Presidents:
          </h1>
        </div>
        <div className="w-1/2">
          {members && (
            <TeamCard 
              cards={members.filter(m => {
                const t = (m.type || '').toLowerCase();
                return t ? t === 'president' : m.isMember !== true;
              })} 
            />
          )}
          {!members && <span className='w-20 h-20 text-black animate-spin'></span> }
        </div>
      </div>

      <div className="flex border-b max-lg:flex-col max-lg:items-center border-[--primary] py-4">
        <div className="w-1/2 pl-7">
          <h1 className="font-custom text-lg">
            Deputy Presidents:
          </h1>
        </div>
        <div className="w-1/2">
          {members && (
            <TeamCard 
              cards={members.filter(m => (m.type || '').toLowerCase() === 'vpresident')} 
            />
          )}
        </div>
      </div>

      <div className="flex border-b max-lg:flex-col max-lg:items-center border-[--primary] py-4">
        <div className="w-1/2 pl-7">
          <h1 className="font-custom text-lg">
            Members:
          </h1>
        </div>
        <div className="w-1/2">
          {members && (
            <TeamCard 
              cards={members.filter(m => {
                const t = (m.type || '').toLowerCase();
                return t ? t === 'member' : m.isMember === true;
              })} 
            />
          )}
        </div>
      </div>

    {/* Links section before footer */}
    <div className="flex justify-center gap-6 py-10">
      <a
        href="https://power-like-93vd.pagedrop.io"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-md border border-[--primary] text-[--primary] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[--primary] hover:text-white shadow-sm"
      >
        components page
      </a>
      <a
        href="https://pagedrop.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="px-6 py-3 rounded-md border border-[--primary] text-[--primary] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[--primary] hover:text-white shadow-sm"
      >
        deployment app
      </a>
    </div>
    </div>
  );
}

export default Team;
