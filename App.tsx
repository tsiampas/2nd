
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { fetchSportsSchedule } from './services/geminiService';
import { BroadcastEvent, SportType } from './types';
import { BroadcastCard } from './components/BroadcastCard';

const App: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [events, setEvents] = useState<BroadcastEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<SportType | 'Όλα'>('Όλα');
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Μορφοποίηση ημερομηνίας σε Ελληνικά
  const formattedGreekDate = useMemo(() => {
    try {
      const date = new Date(selectedDate);
      return new Intl.DateTimeFormat('el-GR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch (e) {
      return selectedDate;
    }
  }, [selectedDate]);

  const handleSearch = async (dateToFetch: string) => {
    setLoading(true);
    const data = await fetchSportsSchedule(dateToFetch);
    setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    handleSearch(selectedDate);
  }, [selectedDate]);

  const filteredEvents = useMemo(() => {
    if (filter === 'Όλα') return events;
    return events.filter(e => e.sport === filter);
  }, [events, filter]);

  const sports = ['Όλα', ...Object.values(SportType)];

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if ('showPicker' in HTMLInputElement.prototype) {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.click();
      }
    }
  };

  const changeDay = (offset: number) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + offset);
    setSelectedDate(current.toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen text-slate-200 flex flex-col bg-[#0b1120]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-5xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-xl shadow-lg shadow-blue-600/20">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">Τι αθλητικούς αγώνες θα δω;</h1>
                  <p className="text-blue-400/80 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">Ελληνικές Μεταδόσεις</p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-medium bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live Updates
              </div>
            </div>

            {/* Date Navigator Widget */}
            <div className="flex items-center justify-between bg-slate-900/50 p-2 rounded-2xl border border-slate-800 shadow-inner">
              <button 
                onClick={() => changeDay(-1)}
                className="p-3 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                title="Προηγούμενη Μέρα"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div 
                onClick={triggerDatePicker}
                className="flex-1 flex flex-col items-center justify-center cursor-pointer group px-4"
              >
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                   <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-blue-400 transition-colors">Επιλογή Ημερομηνίας</span>
                </div>
                <span className="text-sm md:text-lg font-bold text-white text-center capitalize">
                  {formattedGreekDate}
                </span>
                <input
                  ref={dateInputRef}
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="absolute opacity-0 pointer-events-none"
                />
              </div>

              <button 
                onClick={() => changeDay(1)}
                className="p-3 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                title="Επόμενη Μέρα"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar scroll-smooth">
          {sports.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s as any)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-xl border text-xs md:text-sm font-bold transition-all duration-300 ${
                filter === s 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/30 translate-y-[-2px]' 
                : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Content State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-blue-600/10 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-indigo-500/20 border-b-indigo-500 rounded-full animate-spin-slow"></div>
            </div>
            <p className="mt-8 text-slate-400 font-bold tracking-wide animate-pulse italic text-center">
              Αναζήτηση αγώνων...<br/>
              <span className="text-[10px] uppercase font-black text-slate-600 not-italic mt-2 block">{formattedGreekDate}</span>
            </p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {filteredEvents.sort((a, b) => a.time.localeCompare(b.time)).map((event) => (
              <BroadcastCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-slate-900/20 rounded-[3rem] border border-slate-800/50 backdrop-blur-sm">
            <div className="bg-slate-800/30 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-slate-400 mb-3 tracking-tight">ΚΑΝΕΝΑ ΑΠΟΤΕΛΕΣΜΑ</h3>
            <p className="text-slate-600 max-w-xs mx-auto text-sm font-medium">
              Δεν βρέθηκαν προγραμματισμένες μεταδόσεις για την επιλεγμένη ημερομηνία.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0f172a] border-t border-slate-800/50 py-12 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col items-center">
          <div className="w-12 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full mb-8"></div>
          <div className="flex items-center gap-2 text-slate-500 font-black text-[10px] tracking-[0.3em] uppercase mb-4">
            <span>Powered by</span>
            <span className="text-blue-500/80">Google Gemini AI</span>
          </div>
          <p className="text-slate-600 text-[10px] text-center max-w-md leading-relaxed opacity-60 font-medium">
            Η εφαρμογή αντλεί δεδομένα σε πραγματικό χρόνο από το διαδίκτυο.<br/>
            Οι ώρες και τα κανάλια ενδέχεται να αλλάξουν από τους παρόχους.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
