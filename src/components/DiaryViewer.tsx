import React from 'react';
import { motion } from 'motion/react';
import { X, Edit3, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { MOODS, TRANSLATIONS } from '../constants';
import { db, type DiaryEntry } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface DiaryViewerProps {
  entry: DiaryEntry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function DiaryViewer({ entry, onClose, onEdit, onDelete }: DiaryViewerProps) {
  const settings = useLiveQuery(() => db.settings.toCollection().first());
  const lang = settings?.language || 'zh';
  const t = TRANSLATIONS[lang];

  const mood = MOODS.find(m => m.id === entry.mood) || MOODS[0];
  const photoUrl = entry.photo ? URL.createObjectURL(entry.photo) : undefined;

  const handleDelete = async () => {
    if (confirm(t.confirmDelete)) {
      await db.entries.delete(entry.id!);
      onDelete();
    }
  };

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 z-50 bg-ac-bg flex flex-col"
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-ac-yellow bg-white">
        <button onClick={onClose} className="p-2 text-ac-brown"><X size={24} /></button>
        <h2 className="text-xl font-bold text-ac-brown truncate max-w-[200px]">
          {t.viewEntry}
        </h2>
        <div className="flex gap-1">
          <button onClick={onEdit} className="p-2 text-ac-green"><Edit3 size={24} /></button>
          <button onClick={handleDelete} className="p-2 text-red-400"><Trash2 size={24} /></button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Info Card */}
        <div className="ac-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-ac-brown">
              <CalendarIcon size={18} className="text-ac-yellow" />
              <span className="font-bold text-lg">{format(new Date(entry.date), 'yyyy/MM/dd')}</span>
            </div>
            <div className={`px-3 py-1 rounded-full bg-gradient-to-br ${mood.gradient} text-white text-xs font-bold flex items-center gap-1.5 shadow-sm`}>
              <span>{mood.emoji}</span>
              <span>{t.moods[mood.id]}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-ac-brown/40 text-xs font-medium">
            <Clock size={14} />
            <span>{entry.lunarDate} · {entry.shichen}</span>
          </div>
        </div>

        {/* Photo */}
        {photoUrl && (
          <div className="w-full rounded-3xl overflow-hidden border-4 border-white shadow-xl">
            <img 
              src={photoUrl} 
              alt="Diary" 
              className="w-full h-auto object-cover" 
              referrerPolicy="no-referrer" 
            />
          </div>
        )}

        {/* Content */}
        <div className="ac-card p-6 min-h-[200px]">
          <h3 className="text-xl font-bold text-ac-brown mb-4 border-b-2 border-ac-yellow/20 pb-2">
            {entry.title || t.noTitle}
          </h3>
          <p className="text-ac-brown/80 leading-relaxed whitespace-pre-wrap text-lg">
            {entry.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
