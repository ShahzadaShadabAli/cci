'use client'

import React, { useEffect, useState } from 'react';
import { TeamCard } from './TeamCard';
import members from '@/data/team.json';

const Team = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [members, setMembers] = useState(null)
  const [showAllMembers, setShowAllMembers] = useState(false)
  const [memberSearch, setMemberSearch] = useState("")

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

  // Prepare member list for frontend-only limiting
  const memberList = members ? members.filter(m => {
    const t = (m.type || '').toLowerCase();
    return t ? t === 'member' : m.isMember === true;
  }) : [];

  // Flexible, case-insensitive search across full name
  const normalizedQuery = memberSearch.trim().toLowerCase();
  const queryTokens = normalizedQuery.length > 0 ? normalizedQuery.split(/\s+/) : [];
  const filteredMembers = queryTokens.length === 0
    ? memberList
    : memberList.filter(m => {
        const name = String(m.name || "").toLowerCase();
        return queryTokens.every(token => name.includes(token));
      });

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
          {/* Tiny search bar */}
          {members && (
            <div className="mb-3 flex justify-end">
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => { setMemberSearch(e.target.value); setShowAllMembers(false); }}
                aria-label="Search members"
                placeholder="Search members..."
                className="w-full max-w-xs px-3 py-1.5 text-sm rounded-md border border-[--primary] outline-none focus:ring-2 focus:ring-[--primary] bg-transparent text-[--primary] placeholder-gray-400"
              />
            </div>
          )}

          {members && (
            <TeamCard 
              cards={showAllMembers ? filteredMembers : filteredMembers.slice(0, 5)} 
            />
          )}
          {members && filteredMembers.length > 5 && !showAllMembers && (
            <div className="flex justify-center pt-4">
              <button
                onClick={() => setShowAllMembers(true)}
                className="px-5 py-2 rounded-md border border-[--primary] text-[--primary] transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:bg-[--primary] hover:text-white shadow-sm"
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>

    {/* Links section before footer */}
    <div className="py-10">
      <h1 className="font-dongle text-[4vw] max-md:text-[6vw] text-[--primary] pb-4 font-bold text-center">
        Utilities
      </h1>
      <div className="flex justify-center gap-6">
      <a
        href="https://power-like-93vd.pagedrop.io"
        target="_blank"
        rel="noopener noreferrer"
        className="oauthButton"
      >
        <div className="flex items-center justify-center">
          <span>components page</span>
          <svg className="icon ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 17 5-5-5-5"></path>
            <path d="m13 17 5-5-5-5"></path>
          </svg>
        </div>
      </a>
      <a
        href="https://pagedrop.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="oauthButton"
      >
        <div className="flex items-center justify-center">
          <span>deployment app</span>
          <svg className="icon ml-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 17 5-5-5-5"></path>
            <path d="m13 17 5-5-5-5"></path>
          </svg>
        </div>
      </a>
      </div>
    </div>
    </div>
  );
}

export default Team;
