import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home as HomeIcon, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { MOODS } from '../constants';
import { type DiaryEntry } from '../db';

interface HomeProps {
  entries: DiaryEntry[] | undefined;
  lang: 'zh' | 'en' | 'ja';
  t: any;
  filterMood: string | null;
  setFilterMood: (mood: string | null) => void;
  showFilter: boolean;
  setShowFilter: (show: boolean) => void;
  onSelectEntry: (entry: DiaryEntry) => void;
  itemsPerPage: number;
}

export default function Home({ 
  entries, 
  lang, 
  t, 
  filterMood, 
  setFilterMood, 
  showFilter, 
  setShowFilter, 
  onSelectEntry,
  itemsPerPage
}: HomeProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
    setDirection(0);
  }, [filterMood]);

  if (!entries) return null;

  const totalPages = Math.ceil(entries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEntries = entries.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setDirection(1);
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleDragEnd = (e: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      handlePrevPage();
    } else if (info.offset.x < -swipeThreshold) {
      handleNextPage();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : direction < 0 ? -50 : 0,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -50 : direction < 0 ? 50 : 0,
      opacity: 0
    })
  };

  return (
    <div className="p-4 space-y-6 pb-24 overflow-x-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold text-ac-brown">{t.title}</h1>
          <p className="text-xs text-ac-brown/40 font-medium">{t.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setFilterMood(null);
              setShowFilter(false);
            }}
            className={`p-2 rounded-full ${!filterMood ? 'bg-ac-yellow' : 'bg-white border border-ac-yellow'}`}
          >
            <HomeIcon size={20} />
          </button>
          <div className="relative">
            <button 
              onClick={() => setShowFilter(!showFilter)}
              className={`p-2 rounded-full border transition-colors ${showFilter || filterMood ? 'bg-ac-yellow border-ac-yellow' : 'bg-white border-ac-yellow'}`}
            >
              <Filter size={20} />
            </button>
            <AnimatePresence>
              {showFilter && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute right-0 top-full mt-2 bg-white border-2 border-ac-yellow rounded-2xl p-2 shadow-xl grid grid-cols-4 gap-2 z-10 w-48"
                >
                  {MOODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setFilterMood(m.id);
                        setShowFilter(false);
                      }}
                      className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-lg ${filterMood === m.id ? 'ring-2 ring-ac-green' : ''}`}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage + (filterMood || '')}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ 
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="space-y-4 touch-pan-y"
          >
            {paginatedEntries.map(entry => {
              const mood = MOODS.find(m => m.id === entry.mood);
              return (
                <motion.div
                  key={entry.id}
                  layout
                  onClick={() => onSelectEntry(entry)}
                  className="ac-card p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mood?.gradient} flex-shrink-0 flex flex-col items-center justify-center text-white`}>
                    <span className="text-2xl">{mood?.emoji}</span>
                    <span className="text-[10px] font-bold uppercase">{mood ? t.moods[mood.id] : ''}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold truncate pr-2">{entry.title || t.noTitle}</h3>
                      <span className="text-[10px] text-ac-brown/40 whitespace-nowrap">{format(new Date(entry.date), 'MM/dd')}</span>
                    </div>
                    <p className="text-sm text-ac-brown/60 line-clamp-2 leading-relaxed">{entry.content}</p>
                  </div>
                  {entry.photo && (
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-ac-yellow">
                      <img 
                        src={URL.createObjectURL(entry.photo)} 
                        alt="Entry" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  )}
                </motion.div>
              );
            })}
            {entries.length === 0 && (
              <div className="text-center py-20 text-ac-brown/30 italic">
                {t.empty}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full bg-white shadow-sm border border-ac-yellow transition-opacity ${currentPage === 1 ? 'opacity-30' : 'opacity-100'}`}
          >
            <ChevronLeft size={24} className="text-ac-brown" />
          </button>
          
          <div className="flex gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${currentPage === i + 1 ? 'bg-ac-green w-4' : 'bg-ac-brown/20'}`}
              />
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full bg-white shadow-sm border border-ac-yellow transition-opacity ${currentPage === totalPages ? 'opacity-30' : 'opacity-100'}`}
          >
            <ChevronRight size={24} className="text-ac-brown" />
          </button>
        </div>
      )}
    </div>
  );
}
