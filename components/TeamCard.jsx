"use client";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";


export function TeamCard({cards, onClickAction = null, toDelete = null, confirmation = false, isLoading = null, memberList = false}) {
  console.log(cards)
  const [active, setActive] = useState(null);
  const [pointsCounter, setPointsCounter] = useState({});
  const [processingCards, setProcessingCards] = useState({});
  const ref = useRef(null);
  const id = useId()
  

  useEffect(() => {
    const initialCounters = {};
    cards.forEach(card => {
      initialCounters[card._id] = initialCounters[card._id] || 0;
    });
    setPointsCounter(initialCounters);
  }, [cards]);

  const incrementPoints = (cardId, e) => {
    e.stopPropagation();
    setPointsCounter(prev => ({
      ...prev,
      [cardId]: (prev[cardId] || 0) + 10
    }));
  };

  const decrementPoints = (cardId, e) => {
    e.stopPropagation();
    setPointsCounter(prev => ({
      ...prev,
      [cardId]: Math.max(0, (prev[cardId] || 0) - 10)
    }));
  };

  const handleClickAction = async (card, points = 0) => {
    if (processingCards[card._id]) return;
    
    setProcessingCards(prev => ({
      ...prev,
      [card._id]: true
    }));
    
    try {
      await onClickAction(card, points);
    } finally {
      setProcessingCards(prev => ({
        ...prev,
        [card._id]: false
      }));
    }
  };

  const handleDelete = async (card) => {
    if (processingCards[card._id]) return;
    
    setProcessingCards(prev => ({
      ...prev,
      [card._id]: true
    }));
    
    try {
      await toDelete(card);
    } finally {
      setProcessingCards(prev => ({
        ...prev,
        [card._id]: false
      }));
    }
  };

  // Reset processing state when cards change
  useEffect(() => {
    setProcessingCards({});
  }, [cards]);

  useOutsideClick(ref, () => setActive(null));

  return (<>
    <AnimatePresence>
      {active && typeof active === "object" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 h-full w-full z-10" />
      )}
    </AnimatePresence>
    <AnimatePresence>
      {active && typeof active === "object" ? (
        <div className="fixed inset-0  grid place-items-center z-[100]">
          <motion.button
            key={`button-${active.title}-${id}`}
            layout
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
              transition: {
                duration: 0.05,
              },
            }}
            className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
            onClick={() => setActive(null)}>
            <CloseIcon />
          </motion.button>
          <motion.div
            layoutId={`card-${active.title}-${id}`}
            ref={ref}
            className="w-full max-w-[500px]  h-full md:h-fit md:max-h-[90%]  flex flex-col items-center bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden">
            <motion.div layoutId={`image-${active.title}-${id}`}>
              <img
                priority
                src={`/${active.avatar}`}
                alt={active.title}
                className="  sm:rounded-tr-lg sm:rounded-tl-lg object-cover object-top" />
            </motion.div>

            <div className={`flex ${!confirmation ? "pb-6" : ""} justify-center items-center w-full`} >
              <div>
              {!confirmation && <img src={`/${active.Rank}.png`} width={55} alt="" />}

              </div>
              <div className="flex flex-col gap-2 justify-between items-start p-4">
                <div className="flex flex-col gap-2 items-center">
                  <motion.h1
                    layoutId={`title-${active.title}-${id}`}
                    className="font-bold text-neutral-700 font-dongle mt-2 text-3xl leading-[1rem] dark:text-neutral-200">
                    {active.name}
                  </motion.h1>
                 <div className="flex gap-2 justify-between w-full items-center">
              {!confirmation && <motion.p
                    layoutId={`description-${active.description}-${id}`}
                    className="text-neutral-600 text-2xl dark:text-neutral-400 font-dongle">
                    {active.Rank}
                  </motion.p>}
                 <motion.p
                    layoutId={`description-${active.description}-${id}`}
                    className="text-neutral-600 text-2xl dark:text-neutral-400 font-dongle">
                    {active.stage}
                  </motion.p>
                 </div>
                </div>

               
              </div>
              <div className="pt- relative px-4">
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-neutral-600 text-xs md:text-sm lg:text-base font-custom h-40 md:h-fit pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400 [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch]">
                  {typeof active.content === "function"
                    ? active.content()
                    : active.content}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
    <ul className={`max-w-2xl mx-auto w-full ${confirmation ? "border-b-2" : ""} ${memberList ? "max-w-4xl" : ""} gap-4`}>
      {cards.map((card, index) => (
        <motion.div
          key={card._id}
          layoutId={`card-${card.name}-${id}`}
          className={`p-4 flex flex-row justify-between items-center hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer w-full mb-4 ${confirmation || memberList ? "w-full" : ""}`}>
          
          {/* Main content area - now always horizontal */}
          <div className="flex gap-4 flex-row items-center flex-1 min-w-0">
            <div className="flex items-center justify-center"><h1 className="font-dongle text-lg">{index+1}.</h1></div>
            <motion.div onClick={() => setActive(card)} layoutId={`image-${card.name}-${id}`} className="flex-shrink-0">
              <img
                width={100}
                height={100}
                src={`${card.avatar}`}
                alt={card.name}
                className="h-14 w-14 rounded-lg object-cover object-top" />
            </motion.div>
            {!confirmation && <img src={`/${card.Rank}.png`} width={40} height={40} alt="" className="flex-shrink-0" />}
            <div className="font-dongle flex flex-col justify-center flex-1 min-w-0" onClick={() => setActive(card)}>
              <motion.h3
                layoutId={`title-${card.name}-${id}`}
                className="font-medium text-neutral-800 dark:text-neutral-200 text-left text-base truncate">
                {card.name} ({card.stage})
              </motion.h3>
              {!confirmation && 
                <motion.h3
                  className="font-medium text-neutral-400 dark:text-neutral-200 text-left text-sm">
                  {card.Rank}
                </motion.h3>
              }
            </div>
          </div>
          
          {/* Actions area - now always horizontal */}
          <div className="flex flex-row items-center gap-4">
            {/* Counter and tick button for !confirmation && memberList */}
            {!confirmation && memberList && (
              <>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => decrementPoints(card._id, e)}
                    className={`w-8 h-8 flex items-center cursor-pointer justify-center rounded-full ${pointsCounter[card._id] > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-400'}`}
                    disabled={pointsCounter[card._id] <= 0 || processingCards[card._id]}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <div className="w-10 text-center font-medium text-sm">
                    {pointsCounter[card._id] || 0}
                  </div>
                  
                  <button 
                    onClick={(e) => incrementPoints(card._id, e)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600"
                    disabled={processingCards[card._id]}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Tick button that calls onClickAction with card and points */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!processingCards[card._id]) {
                      handleClickAction(card, pointsCounter[card._id] || 0);
                    }
                  }}
                  className={`px-2 py-2 flex-shrink-0 ${processingCards[card._id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="inline-flex items-center justify-center shrink-0 w-10 h-10 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                    {processingCards[card._id] ? (
                      <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                      </svg>
                    )}
                    <span className="sr-only">Confirm icon</span>
                  </div>
                </span>
              </>
            )}
            
            {/* Progress bar for !confirmation && !memberList */}
            {!confirmation && !memberList && (
              <div className="w-32 flex flex-col justify-center">
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div 
                    className={`bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full`} 
                    style={{ width: `${Math.round((card.Points / card.totalPoints) * 100)}%` }}
                  >
                    {Math.round((card.Points / card.totalPoints) * 100)}%
                  </div>
                </div>
                <h1 className="font-dongle text-xs text-center md:text-right mt-1 font-semibold">{card.Points}/{card.totalPoints}</h1>
              </div>
            )}
            
            {/* "Add To Club" button */}
            {confirmation && (
              <div className="flex items-center">
                <motion.button
                  onClick={() => {
                    if (!processingCards[card._id]) {
                      handleClickAction(card);
                    }
                  }}
                  disabled={processingCards[card._id]}
                  className={`px-3 py-2 w-32 text-sm rounded-xl font-bold bg-[--primary] text-white ${
                    processingCards[card._id] ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-500 cursor-pointer'
                  }`}>
                  {processingCards[card._id] ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    "Add To Club"
                  )}
                </motion.button>
              </div>
            )}
            
            {/* Delete button */}
            {(confirmation || memberList) && 
              <span
                onClick={() => {
                  if (!processingCards[card._id]) {
                    handleDelete(card);
                  }
                }}
                className={`px-2 py-2 flex-shrink-0 ${processingCards[card._id] ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="inline-flex items-center justify-center shrink-0 w-10 h-10 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                  {processingCards[card._id] ? (
                    <svg className="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                    </svg>
                  )}
                  <span className="sr-only">Error icon</span>
                </div>
              </span>
            }
          </div>
        </motion.div>
      ))}
    </ul>
  
  </>);
}

export const CloseIcon = () => {
  return (
    (<motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>)
  );
};