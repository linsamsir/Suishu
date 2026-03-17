import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { zhTW, enUS, ja } from 'date-fns/locale';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type DiaryEntry } from '../db';
import { MOODS } from '../constants';

interface CalendarViewProps {
  lang: 'zh' | 'en' | 'ja';
  t: any;
  onSelectEntry: (entry: DiaryEntry) => void;
}

export default function CalendarView({ lang, t, onSelectEntry }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const entries = useLiveQuery(() => db.entries.toArray());

  const locale = lang === 'zh' ? zhTW : lang === 'en' ? enUS : ja;

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const startDay = days[0].getDay();
  const padding = Array(startDay).fill(null);

  const getEntriesForDay = (day: Date) => {
    return entries?.filter(e => isSameDay(new Date(e.date), day)) || [];
  };

  const currentMonthEntries = entries?.filter(e => isSameMonth(new Date(e.date), currentMonth)) || [];
  
  const moodStats = MOODS.map(m => {
    const count = currentMonthEntries.filter(e => e.mood === m.id).length;
    return { 
      name: t.moods[m.id], 
      value: count, 
      id: m.id, 
      emoji: m.emoji,
      gradient: m.gradient 
    };
  }).filter(s => s.value > 0).sort((a, b) => b.value - a.value);

  const totalEntries = currentMonthEntries.length;

  return (
    <div className="p-4 space-y-6 pb-24">
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border-4 border-ac-yellow">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2"><ChevronLeft /></button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, lang === 'zh' ? 'yyyy年 MM月' : 'MMMM yyyy', { locale })}
        </h2>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2"><ChevronRight /></button>
      </div>

      <div className="ac-card p-4">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {(lang === 'zh' ? ['日', '一', '二', '三', '四', '五', '六'] : 
            lang === 'en' ? ['S', 'M', 'T', 'W', 'T', 'F', 'S'] :
            ['日', '月', '火', '水', '木', '金', '土']).map(d => (
            <div key={d} className="text-center text-xs font-bold text-ac-brown/40">{d}</div>
          ))}
          {padding.map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const dayEntries = getEntriesForDay(day);
            const mood = MOODS.find(m => m.id === dayEntries[0]?.mood);
            return (
              <button 
                key={day.toString()} 
                onClick={() => setSelectedDay(day)}
                className={`aspect-square flex flex-col items-center justify-center relative rounded-xl transition-colors ${isSameDay(day, selectedDay || new Date(-1)) ? 'bg-ac-yellow/20' : ''}`}
              >
                <span className={`text-sm font-medium ${isSameDay(day, new Date()) ? 'text-ac-green font-bold' : ''}`}>
                  {format(day, 'd')}
                </span>
                {mood && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={`w-2 h-2 rounded-full mt-1 bg-gradient-to-br ${mood.gradient}`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Stats - Modern Horizontal Bars */}
      <div className="ac-card p-5 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-bold text-ac-brown/60 uppercase tracking-wider">{t.moodStats}</h3>
          <span className="text-xs font-bold text-ac-brown/40">{totalEntries} {lang === 'zh' ? '則記錄' : 'Entries'}</span>
        </div>
        
        <div className="space-y-4">
          {moodStats.length > 0 ? (
            moodStats.map((stat) => (
              <div key={stat.id} className="space-y-1">
                <div className="flex justify-between items-end text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="text-lg leading-none">{stat.emoji}</span>
                    <span className="text-ac-brown">{stat.name}</span>
                  </div>
                  <span className="text-ac-brown/40">{stat.value}</span>
                </div>
                <div className="h-2 w-full bg-ac-yellow/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stat.value / totalEntries) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stat.gradient}`}
                  />
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-ac-brown/30 italic text-sm">
              {t.empty}
            </div>
          )}
        </div>
      </div>

      {/* Selected Day Entries Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-ac-bg w-full max-w-md rounded-t-[3rem] p-6 shadow-2xl border-t-8 border-ac-yellow max-h-[70vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ac-brown">
                  {format(selectedDay, 'yyyy/MM/dd')}
                </h3>
                <button onClick={() => setSelectedDay(null)} className="p-2 bg-white rounded-full border border-ac-yellow">
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                {getEntriesForDay(selectedDay).map(entry => {
                  const mood = MOODS.find(m => m.id === entry.mood);
                  return (
                    <div 
                      key={entry.id}
                      onClick={() => {
                        onSelectEntry(entry);
                        setSelectedDay(null);
                      }}
                      className="ac-card p-4 flex gap-4 cursor-pointer active:scale-95 transition-transform"
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${mood?.gradient} flex items-center justify-center text-xl`}>
                        {mood?.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate">{entry.title || t.noTitle}</h4>
                        <p className="text-sm text-ac-brown/60 line-clamp-1">{entry.content}</p>
                      </div>
                    </div>
                  );
                })}
                {getEntriesForDay(selectedDay).length === 0 && (
                  <div className="text-center py-10 text-ac-brown/30 italic">
                    {t.empty}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
