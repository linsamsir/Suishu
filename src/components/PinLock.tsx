import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Delete } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface PinLockProps {
  onSuccess: () => void;
}

export default function PinLock({ onSuccess }: PinLockProps) {
  const [input, setInput] = useState('');
  const settings = useLiveQuery(() => db.settings.toCollection().first());
  const [error, setError] = useState(false);

  const lang = settings?.language || 'zh';
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (settings && input.length === 4) {
      if (input === settings.pin) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setInput('');
          setError(false);
        }, 500);
      }
    }
  }, [input, settings, onSuccess]);

  const handleNumber = (num: string) => {
    if (input.length < 4) {
      setInput(prev => prev + num);
    }
  };

  const handleDelete = () => {
    setInput(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    // Wait until settings are loaded from DB
    if (settings !== undefined && !settings?.pin) {
      onSuccess();
    }
  }, [settings, onSuccess]);

  if (settings === undefined || !settings?.pin) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-ac-bg flex flex-col items-center justify-center p-8"
    >
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-2">{t.title}</h1>
        <p className="text-ac-brown/60">{t.pinInput}</p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={error ? { x: [0, -10, 10, -10, 10, 0] } : {}}
            className={`w-4 h-4 rounded-full border-2 border-ac-brown ${
              input.length > i ? 'bg-ac-brown' : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 w-full max-w-xs">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleNumber(num.toString())}
            className="w-20 h-20 rounded-full bg-white border-4 border-ac-yellow text-2xl font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            {num}
          </button>
        ))}
        <div />
        <button
          onClick={() => handleNumber('0')}
          className="w-20 h-20 rounded-full bg-white border-4 border-ac-yellow text-2xl font-bold flex items-center justify-center shadow-md active:scale-95 transition-transform"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-20 h-20 rounded-full bg-ac-pink/20 text-ac-brown flex items-center justify-center active:scale-95 transition-transform"
        >
          <Delete size={24} />
        </button>
      </div>
    </motion.div>
  );
}
