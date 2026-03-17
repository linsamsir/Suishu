import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Camera, Save, Trash2 } from 'lucide-react';
import { Lunar } from 'lunar-javascript';
import { format } from 'date-fns';
import { MOODS, SHICHEN, getShichen, MOOD_QUOTES, TRANSLATIONS } from '../constants';
import { db, type DiaryEntry } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface DiaryEditorProps {
  entry?: DiaryEntry;
  onClose: () => void;
  onSave: (quote: string) => void;
}

export default function DiaryEditor({ entry, onClose, onSave }: DiaryEditorProps) {
  const settings = useLiveQuery(() => db.settings.toCollection().first());
  const lang = settings?.language || 'zh';
  const t = TRANSLATIONS[lang];

  const [date, setDate] = useState(entry ? new Date(entry.date) : new Date());
  const [mood, setMood] = useState(entry?.mood || MOODS[0].id);
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [photo, setPhoto] = useState<Blob | undefined>(entry?.photo);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(entry?.photo ? URL.createObjectURL(entry.photo) : undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lunar = Lunar.fromDate(date);
  const lunarStr = `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`;
  const currentShichen = getShichen(date);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress image using canvas
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const scale = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setPhoto(blob);
          setPhotoUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.7);
    };
  };

  const handleSave = async () => {
    if (!content.trim()) return;

    const newEntry: DiaryEntry = {
      date,
      lunarDate: lunarStr,
      shichen: currentShichen,
      mood,
      title,
      content,
      photo,
      createdAt: entry?.createdAt || Date.now(),
    };

    if (entry?.id) {
      await db.entries.update(entry.id, newEntry);
    } else {
      await db.entries.add(newEntry);
    }

    const randomQuote = MOOD_QUOTES[Math.floor(Math.random() * MOOD_QUOTES.length)];
    onSave(randomQuote);
  };

  const handleDelete = async () => {
    if (entry?.id && confirm(t.confirmDelete)) {
      await db.entries.delete(entry.id);
      onClose();
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
      <div className="p-4 flex items-center justify-between border-b border-ac-yellow bg-white">
        <button onClick={onClose} className="p-2 text-ac-brown"><X size={24} /></button>
        <h2 className="text-xl font-bold">{entry ? t.editEntry : t.newEntry}</h2>
        <button onClick={handleSave} className="p-2 text-ac-green"><Save size={24} /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Date & Info */}
        <div className="ac-card p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">{format(date, 'yyyy/MM/dd')}</span>
            <span className="text-ac-brown/60">{lunarStr} · {currentShichen}</span>
          </div>
        </div>

        {/* Mood Selector */}
        <div className="space-y-3">
          <label className="font-bold text-sm uppercase tracking-wider text-ac-brown/60">{t.mood}</label>
          <div className="grid grid-cols-4 gap-3">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center p-2 rounded-2xl border-2 transition-all ${
                  mood === m.id ? 'border-ac-green bg-white scale-105 shadow-md' : 'border-transparent opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-xl mb-1`}>
                  {m.emoji}
                </div>
                <span className="text-xs font-medium">{t.moods[m.id]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Photo */}
        <div className="space-y-3">
          <label className="font-bold text-sm uppercase tracking-wider text-ac-brown/60">{t.photo}</label>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 ac-card flex flex-col items-center justify-center overflow-hidden cursor-pointer relative"
          >
            {photoUrl ? (
              <img src={photoUrl} alt="Diary" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <>
                <Camera size={24} className="text-ac-yellow mb-1" />
                <span className="text-ac-brown/40 text-sm">{t.upload}</span>
              </>
            )}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handlePhotoChange} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder={lang === 'zh' ? '標題 (選填)' : lang === 'en' ? 'Title (optional)' : 'タイトル (任意)'}
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="ac-input font-bold text-lg"
          />
          <textarea
            placeholder={lang === 'zh' ? '今天發生了什麼事呢？' : lang === 'en' ? 'What happened today?' : '今日は何がありましたか？'}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="ac-input min-h-[200px] resize-none"
          />
        </div>

        {entry?.id && (
          <button
            onClick={handleDelete}
            className="w-full p-4 text-red-500 font-bold flex items-center justify-center gap-2"
          >
            <Trash2 size={20} /> {t.delete}
          </button>
        )}
      </div>
    </motion.div>
  );
}
