import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Calendar, Settings as SettingsIcon, Home, Search, Filter } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, type DiaryEntry } from './db';
import { MOODS, TRANSLATIONS } from './constants';
import DiaryEditor from './components/DiaryEditor';
import DiaryViewer from './components/DiaryViewer';
import CalendarView from './components/CalendarView';
import Settings from './components/Settings';
import PinLock from './components/PinLock';
import HomeView from './components/Home';
import { format } from 'date-fns';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'calendar' | 'settings'>('home');
  const [isLocked, setIsLocked] = useState(true);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null | 'new'>(null);
  const [viewingEntry, setViewingEntry] = useState<DiaryEntry | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filterMood, setFilterMood] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const settings = useLiveQuery(() => db.settings.toCollection().first());
  const lang = settings?.language || 'zh';
  const t = TRANSLATIONS[lang];

  const entries = useLiveQuery(async () => {
    let collection = db.entries.orderBy('createdAt').reverse();
    if (filterMood) {
      return await collection.filter(e => e.mood === filterMood).toArray();
    }
    return await collection.toArray();
  }, [filterMood]);

  useEffect(() => {
    if (settings) {
      if (!settings.pin || !settings.isLocked) {
        setIsLocked(false);
      } else {
        setIsLocked(true);
      }
    }
  }, [settings]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'calendar':
        return <CalendarView lang={lang} t={t} onSelectEntry={setViewingEntry} />;
      case 'settings':
        return <Settings lang={lang} t={t} />;
      default:
        return (
          <HomeView
            entries={entries}
            lang={lang}
            t={t}
            filterMood={filterMood}
            setFilterMood={setFilterMood}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            onSelectEntry={setViewingEntry}
            itemsPerPage={settings?.itemsPerPage || 5}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-0 md:p-8">
      <div className="w-full max-w-md h-screen md:h-[844px] bg-ac-bg relative overflow-hidden md:rounded-[3rem] md:shadow-2xl md:border-[12px] md:border-white">
        <Analytics />
        <AnimatePresence>
          {isLocked && <PinLock onSuccess={() => setIsLocked(false)} />}
        </AnimatePresence>

        <main className="h-full overflow-y-auto pb-20">
          {renderContent()}
        </main>

        {/* Floating Action Button */}
        {activeTab === 'home' && (
          <button
            onClick={() => setEditingEntry('new')}
            className="absolute bottom-24 right-6 w-14 h-14 bg-ac-green text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-40"
          >
            <Plus size={32} />
          </button>
        )}

        {/* Navigation */}
        <nav className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-ac-yellow px-6 py-3 flex justify-between items-center z-40">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-ac-green' : 'text-ac-brown/40'}`}
          >
            <Home size={24} />
            <span className="text-[10px] font-bold">{t.home}</span>
          </button>
          <button 
            onClick={() => setActiveTab('calendar')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'calendar' ? 'text-ac-green' : 'text-ac-brown/40'}`}
          >
            <Calendar size={24} />
            <span className="text-[10px] font-bold">{t.calendar}</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'settings' ? 'text-ac-green' : 'text-ac-brown/40'}`}
          >
            <SettingsIcon size={24} />
            <span className="text-[10px] font-bold">{t.settings}</span>
          </button>
        </nav>

        {/* Editor Modal */}
        <AnimatePresence>
          {editingEntry && (
            <DiaryEditor
              entry={editingEntry === 'new' ? undefined : editingEntry}
              onClose={() => setEditingEntry(null)}
              onSave={(quote) => {
                setEditingEntry(null);
                showToast(quote);
              }}
            />
          )}
        </AnimatePresence>

        {/* Viewer Modal */}
        <AnimatePresence>
          {viewingEntry && (
            <DiaryViewer
              entry={viewingEntry}
              onClose={() => setViewingEntry(null)}
              onEdit={() => {
                setEditingEntry(viewingEntry);
                setViewingEntry(null);
              }}
              onDelete={() => {
                setViewingEntry(null);
              }}
            />
          )}
        </AnimatePresence>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-28 left-4 right-4 z-50"
            >
              <div className="bg-ac-brown text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 border-2 border-white">
                <div className="w-8 h-8 bg-ac-pink rounded-full flex items-center justify-center text-lg">🌸</div>
                <p className="text-sm font-medium">{toast}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
