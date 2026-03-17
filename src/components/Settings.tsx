import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Upload, Shield, Globe, Info, ChevronRight, X, Smartphone, Trash2, Mail, ExternalLink } from 'lucide-react';
import { db } from '../db';
import { useLiveQuery } from 'dexie-react-hooks';

interface SettingsProps {
  lang: 'zh' | 'en' | 'ja';
  t: any;
}

export default function Settings({ lang, t }: SettingsProps) {
  const settings = useLiveQuery(() => db.settings.toCollection().first());
  const [newPin, setNewPin] = useState('');
  const [showPinInput, setShowPinInput] = useState(false);
  const [aboutModal, setAboutModal] = useState<string | null>(null);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [isFeedbackSent, setIsFeedbackSent] = useState(false);

  const handleSendFeedback = async () => {
    if (!feedbackText.trim()) return;
    
    setIsSendingFeedback(true);
    try {
      // Using the specific Formspree Form ID provided by the user
      const response = await fetch('https://formspree.io/f/mqeygdja', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          message: feedbackText,
          _subject: `隨書 Suishu Feedback (${new Date().toLocaleDateString()})`,
        })
      });

      if (response.ok) {
        setIsFeedbackSent(true);
        setFeedbackText('');
        setTimeout(() => {
          setShowFeedbackModal(false);
          setIsFeedbackSent(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Formspree Error:', errorData);
        throw new Error('AJAX failed');
      }
    } catch (error) {
      console.log('Background send failed, falling back to mailto...');
      // Fallback: Open mail app if background send fails
      const subject = encodeURIComponent(`隨書意見回饋 Suishu Feedback (${new Date().toLocaleDateString()})`);
      const body = encodeURIComponent(feedbackText);
      window.location.href = `mailto:linsamsir@gmail.com?subject=${subject}&body=${body}`;
      setShowFeedbackModal(false);
      setFeedbackText('');
    } finally {
      setIsSendingFeedback(false);
    }
  };

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // If no prompt, check if it's iOS
      const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIos) {
        setShowIosGuide(true);
      } else {
        alert(t.installDesc);
      }
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleSetPin = async () => {
    if (newPin.length !== 4) return;
    if (settings?.id) {
      await db.settings.update(settings.id, { pin: newPin, isLocked: true });
    } else {
      await db.settings.add({ pin: newPin, isLocked: true, language: lang });
    }
    setNewPin('');
    setShowPinInput(false);
    alert(t.pinSet);
  };

  const handleToggleLock = async () => {
    if (!settings?.pin) {
      setShowPinInput(true);
      return;
    }
    if (settings?.id) {
      await db.settings.update(settings.id, { isLocked: !settings.isLocked });
    }
  };

  const handleClearPin = async () => {
    if (confirm(t.pinClear)) {
      if (settings?.id) {
        await db.settings.update(settings.id, { pin: undefined, isLocked: false });
      }
    }
  };

  const handleLanguageChange = async (newLang: 'zh' | 'en' | 'ja') => {
    if (settings?.id) {
      await db.settings.update(settings.id, { language: newLang });
    } else {
      await db.settings.add({ language: newLang, isLocked: false });
    }
  };

  const handleSetItemsPerPage = async (count: number) => {
    if (settings?.id) {
      await db.settings.update(settings.id, { itemsPerPage: count });
    } else {
      await db.settings.add({ itemsPerPage: count, isLocked: false, language: lang });
    }
  };

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = async () => {
    // Telemetry: Track export frequency (Anonymous)
    try {
      // This is a placeholder for a tracking service like Umami or a simple ping
      console.log('Telemetry: Export triggered');
      // fetch('https://your-analytics-endpoint.com/api/event', { method: 'POST', body: JSON.stringify({ event: 'export_clicked' }) }).catch(() => {});
    } catch (e) {}

    const entries = await db.entries.toArray();
    const exportData = await Promise.all(entries.map(async e => {
      if (e.photo) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(e.photo!);
        });
        return { ...e, photo: base64 };
      }
      return e;
    }));

    const fileName = `suishu-backup-${new Date().toISOString().split('T')[0]}.json`;
    const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
    
    // Check if Web Share API is available and can share files
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], fileName, { type: 'application/json' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: 'Suishu Backup',
            text: 'My Suishu Diary Backup'
          });
          return; // Success
        } catch (err) {
          // If user cancelled or error, fallback to download
          console.log('Share failed, falling back to download', err);
        }
      }
    }

    // Fallback for desktop or browsers without Share API
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (confirm(t.confirmImport)) {
          await db.entries.clear();
          for (const item of data) {
            if (item.photo && typeof item.photo === 'string') {
              const res = await fetch(item.photo);
              item.photo = await res.blob();
            }
            await db.entries.add(item);
          }
          alert('Success!');
        }
      } catch (err) {
        alert('Error!');
      }
    };
    reader.readAsText(file);
  };

  const handleClearAll = async () => {
    await db.entries.clear();
    setShowClearConfirm(false);
    // Use a simple state for success message instead of alert if needed, 
    // but for now let's just close the confirm.
  };

  const AboutContent = ({ type }: { type: string }) => {
    const content = t.aboutContent[type];
    if (!content) return null;

    switch (type) {
      case 'desc':
        return (
          <div className="space-y-4 text-ac-brown/80">
            <p className="font-bold text-lg text-ac-brown">{content.title}</p>
            <p>{content.p1}</p>
            <p>{content.p2}</p>
          </div>
        );
      case 'guide':
        return (
          <div className="space-y-4 text-ac-brown/80">
            <p className="font-bold text-lg text-ac-brown">{content.title}</p>
            <ul className="list-disc pl-5 space-y-2">
              {content.items.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-4 text-ac-brown/80 text-sm">
            <p className="font-bold text-lg text-ac-brown">{content.title}</p>
            <p>{content.p1}</p>
            <p>{content.p2}</p>
            <p className="mt-4 font-medium">{content.footer}</p>
          </div>
        );
      default:
        return null;
    }
  };

  const getPinStatus = () => {
    if (!settings?.pin) return t.statusNotSet;
    return settings.isLocked ? t.statusLocked : t.statusUnlocked;
  };

  return (
    <div className="p-6 space-y-8 pb-24">
      <h2 className="text-2xl font-bold mb-6">{t.settings}</h2>

      {/* Language */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Globe size={16} /> {t.language}
        </div>
        <div className="ac-card p-2 flex gap-2">
          {[
            { id: 'zh', label: '中文' },
            { id: 'en', label: 'English' },
            { id: 'ja', label: '日本語' }
          ].map(l => (
            <button
              key={l.id}
              onClick={() => handleLanguageChange(l.id as any)}
              className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                lang === l.id ? 'bg-ac-green text-white shadow-md' : 'text-ac-brown/40'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {/* Items Per Page */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Smartphone size={16} /> {t.itemsPerPage}
        </div>
        <div className="ac-card p-2 flex gap-2">
          {[5, 10, 15, 20].map((count) => (
            <button
              key={count}
              onClick={() => handleSetItemsPerPage(count)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-all ${ (settings?.itemsPerPage || 5) === count ? 'bg-ac-green text-white shadow-md' : 'text-ac-brown/40'}`}
            >
              {count}
            </button>
          ))}
        </div>
      </section>

      {/* Security */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Shield size={16} /> {t.security}
        </div>
        <div className="ac-card overflow-hidden">
          <button 
            onClick={() => setShowSecurityModal(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-ac-yellow/10 transition-colors"
          >
            <div>
              <div className="font-bold">{t.pinLock}</div>
              <div className="text-sm text-ac-brown/60">{getPinStatus()}</div>
            </div>
            <ChevronRight size={20} className="text-ac-brown/40" />
          </button>
        </div>
      </section>

      {/* Install App */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Smartphone size={16} /> {t.installApp}
        </div>
        <div className="ac-card p-4 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <div className="font-bold">{t.installApp}</div>
            <div className="text-xs text-ac-brown/60">{t.installDesc}</div>
          </div>
          <button 
            onClick={handleInstall}
            className="bg-ac-green text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-transform"
          >
            {t.installBtn}
          </button>
        </div>
      </section>

      {/* Data */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Download size={16} /> {t.data}
        </div>
        <div className="ac-card p-4 space-y-4">
          <button onClick={handleExport} className="w-full flex items-center justify-between font-bold">
            <span>{t.export}</span>
            <Download size={20} className="text-ac-blue" />
          </button>
          <div className="h-px bg-ac-yellow/30" />
          <label className="w-full flex items-center justify-between font-bold cursor-pointer">
            <span>{t.import}</span>
            <Upload size={20} className="text-ac-green" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <div className="h-px bg-ac-yellow/30" />
          <button onClick={() => setShowClearConfirm(true)} className="w-full flex items-center justify-between font-bold text-red-500 text-left">
            <span>{t.clearAll}</span>
            <Trash2 size={20} />
          </button>
        </div>
      </section>

      {/* Support & Feedback */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Mail size={16} />
          <span>{lang === 'zh' ? '支援與回饋' : lang === 'en' ? 'Support & Feedback' : 'サポート'}</span>
        </div>
        <div className="ac-card p-4">
          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="w-full flex items-center justify-between font-bold text-ac-brown"
          >
            <span>{lang === 'zh' ? '發送意見回饋' : lang === 'en' ? 'Send Feedback' : 'フィードバック'}</span>
            <ChevronRight size={20} className="text-ac-yellow" />
          </button>
        </div>
      </section>

      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="ac-card p-6 w-full max-w-md bg-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-ac-brown">
                  {lang === 'zh' ? '意見回饋' : lang === 'en' ? 'Feedback' : 'フィードバック'}
                </h3>
                <button 
                  onClick={() => setShowFeedbackModal(false)} 
                  className="text-ac-brown/40"
                  disabled={isSendingFeedback}
                >
                  <X size={24} />
                </button>
              </div>
              
              {isFeedbackSent ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
                    <Shield size={32} />
                  </div>
                  <p className="font-bold text-ac-brown text-lg">
                    {lang === 'zh' ? '傳送成功！感謝您的回饋' : 
                     lang === 'en' ? 'Sent! Thank you for your feedback' : 
                     '送信しました！ありがとうございます'}
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="text-sm text-ac-brown/60">
                    {lang === 'zh' ? '您的建議是我們進步的動力，請告訴我們您的想法：' : 
                     lang === 'en' ? 'Your feedback helps us improve. Please let us know your thoughts:' : 
                     'あなたのフィードバックは私たちの改善に役立ちます。'}
                  </p>

                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={lang === 'zh' ? '在此輸入您的意見...' : lang === 'en' ? 'Type your feedback here...' : 'ここに入力...'}
                    className="w-full h-32 p-4 rounded-xl bg-ac-bg border-none focus:ring-2 focus:ring-ac-yellow text-ac-brown resize-none"
                    autoFocus
                    disabled={isSendingFeedback}
                  />

                  <button
                    onClick={handleSendFeedback}
                    disabled={!feedbackText.trim() || isSendingFeedback}
                    className="w-full p-4 rounded-xl font-bold bg-ac-yellow text-white shadow-lg shadow-ac-yellow/20 disabled:opacity-50 disabled:shadow-none transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSendingFeedback ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{lang === 'zh' ? '傳送中...' : lang === 'en' ? 'Sending...' : '送信中...'}</span>
                      </>
                    ) : (
                      <span>{lang === 'zh' ? '確認送出' : lang === 'en' ? 'Submit' : '送信する'}</span>
                    )}
                  </button>
                </>
              )}
            </motion.div>
          </div>
        )}

        {showClearConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="ac-card p-6 w-full max-w-sm bg-white space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={24} />
                </div>
                <h3 className="text-xl font-bold text-ac-brown">{t.clearAll}</h3>
                <p className="text-ac-brown/60">{t.confirmClearAll}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 p-3 rounded-xl font-bold bg-ac-bg text-ac-brown"
                >
                  {lang === 'zh' ? '取消' : lang === 'en' ? 'Cancel' : 'キャンセル'}
                </button>
                <button
                  onClick={handleClearAll}
                  className="flex-1 p-3 rounded-xl font-bold bg-red-500 text-white shadow-lg shadow-red-200"
                >
                  {lang === 'zh' ? '確定清除' : lang === 'en' ? 'Clear' : '削除する'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Website */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-ac-brown/60 font-bold uppercase text-sm">
          <Info size={16} /> {t.about}
        </div>
        <div className="ac-card overflow-hidden">
          {[
            { id: 'desc', label: t.aboutDesc },
            { id: 'guide', label: t.aboutGuide },
            { id: 'privacy', label: t.aboutPrivacy }
          ].map((item, idx) => (
            <React.Fragment key={item.id}>
              <button 
                onClick={() => setAboutModal(item.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-ac-yellow/10 transition-colors"
              >
                <span className="font-bold">{item.label}</span>
                <ChevronRight size={20} className="text-ac-brown/40" />
              </button>
              {idx < 2 && <div className="h-px bg-ac-yellow/30 mx-4" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="text-center text-ac-brown/40 text-sm mt-12 pb-8">
        <p>Suishu 隨書 v1.1</p>
        <p>{t.subtitle}</p>
      </div>

      {/* Security Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center p-0 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSecurityModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-ac-bg rounded-t-[2rem] p-8 pb-12 shadow-2xl max-h-[80%] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ac-brown">{t.pinLock}</h3>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 bg-white rounded-full shadow-sm"><X size={20} /></button>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between ac-card p-4">
                  <div>
                    <div className="font-bold">{t.pinLock}</div>
                    <div className="text-sm text-ac-brown/60">{getPinStatus()}</div>
                  </div>
                  <div className="flex gap-4">
                    {settings?.pin && (
                      <button 
                        onClick={handleToggleLock} 
                        className={`font-bold ${settings.isLocked ? 'text-ac-blue' : 'text-ac-green'}`}
                      >
                        {settings.isLocked ? t.unlock : t.lock}
                      </button>
                    )}
                    <button 
                      onClick={() => setShowPinInput(!showPinInput)} 
                      className="text-ac-green font-bold"
                    >
                      {settings?.pin ? t.change : t.set}
                    </button>
                    {settings?.pin && (
                      <button onClick={handleClearPin} className="text-red-500 font-bold">{t.clear}</button>
                    )}
                  </div>
                </div>

                {showPinInput && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-2"
                  >
                    <input
                      type="password"
                      maxLength={4}
                      placeholder={t.pinPlaceholder}
                      value={newPin}
                      onChange={e => setNewPin(e.target.value.replace(/\D/g, ''))}
                      className="ac-input py-2"
                    />
                    <button onClick={handleSetPin} className="ac-button py-2 px-4">OK</button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* About Modal */}
      <AnimatePresence>
        {aboutModal && (
          <div className="fixed inset-0 z-[110] flex items-end justify-center p-0 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setAboutModal(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-ac-bg rounded-t-[2rem] p-8 pb-12 shadow-2xl max-h-[80%] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ac-brown">
                  {aboutModal === 'desc' ? t.aboutDesc : aboutModal === 'guide' ? t.aboutGuide : t.aboutPrivacy}
                </h3>
                <button onClick={() => setAboutModal(null)} className="p-2 bg-white rounded-full shadow-sm"><X size={20} /></button>
              </div>
              <AboutContent type={aboutModal} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* iOS Install Guide Modal */}
      <AnimatePresence>
        {showIosGuide && (
          <div className="fixed inset-0 z-[120] flex items-end justify-center p-0 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIosGuide(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full max-w-md bg-ac-bg rounded-t-[2rem] p-8 pb-12 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-ac-brown">{t.iosInstallTitle}</h3>
                <button onClick={() => setShowIosGuide(false)} className="p-2 bg-white rounded-full shadow-sm"><X size={20} /></button>
              </div>
              <div className="space-y-4 text-ac-brown font-medium">
                <div className="p-3 bg-ac-yellow/10 rounded-xl border border-ac-yellow/20 text-xs mb-4">
                  <p className="mb-2 font-bold text-ac-brown/80">{t.installUrlNotice}</p>
                  <a 
                    href={window.location.origin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-ac-green underline break-all"
                  >
                    {window.location.origin}
                  </a>
                </div>
                <p>{t.iosInstallStep1}</p>
                <p>{t.iosInstallStep2}</p>
                <p>{t.iosInstallStep3}</p>
                <div className="pt-4 flex justify-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-inner flex items-center justify-center border-2 border-ac-yellow">
                    <img src="https://picsum.photos/seed/suishu/128/128" alt="App Icon" className="w-12 h-12 rounded-xl" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
