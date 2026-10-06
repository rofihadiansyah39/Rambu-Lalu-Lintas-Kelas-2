import React, { useState } from 'react';
import {
  Car,
  Footprints,
  BookOpen,
  HelpCircle,
  Award,
  Volume2,
  VolumeX,
  Sparkles,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { DrivingGame } from './components/DrivingGame';
import { CrossingGame4T } from './components/CrossingGame4T';
import { SignEncyclopedia } from './components/SignEncyclopedia';
import { SignQuiz } from './components/SignQuiz';
import { SimCertificate } from './components/SimCertificate';
import { sounds } from './utils/audio';

type ActiveTab = 'mengemudi' | 'menyeberang' | 'ensiklopedia' | 'kuis' | 'sim';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('mengemudi');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [studentPhoto, setStudentPhoto] = useState<string | null>(null);

  const toggleSound = () => {
    sounds.soundEnabled = !sounds.soundEnabled;
    sounds.voiceEnabled = !sounds.voiceEnabled;
    setSoundEnabled(sounds.soundEnabled);
  };

  const navItems = [
    { id: 'mengemudi' as ActiveTab, label: 'Mengemudi', icon: '🚗' },
    { id: 'menyeberang' as ActiveTab, label: 'Menyeberang 4T', icon: '🚶‍♂️' },
    { id: 'ensiklopedia' as ActiveTab, label: 'Buku Rambu', icon: '📖' },
    { id: 'kuis' as ActiveTab, label: 'Kuis', icon: '🎯' },
    { id: 'sim' as ActiveTab, label: 'SIM Cilik', icon: '🪪' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-sky-50 to-emerald-50 flex flex-col font-['Fredoka',sans-serif]">
      {/* Sleek, Compact Single-Row Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-300 shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2">
          {/* Logo & Branding */}
          <div
            onClick={() => setActiveTab('mengemudi')}
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-xl shadow-sm border border-amber-500">
              🚦
            </div>
            <div>
              <h1 className="font-black text-base sm:text-lg text-slate-900 leading-none flex items-center gap-1.5">
                Si Cilik Tertib
                <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.2 rounded-md">
                  Kelas 2 SD
                </span>
              </h1>
            </div>
          </div>

          {/* Clean Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none py-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    sounds.playHorn();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400 text-slate-900 shadow-sm border border-amber-500 scale-102'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Sound Toggle */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                sounds.playHorn();
                sounds.speak('Halo teman-teman! Ayo berkendara dengan tertib!');
              }}
              className="p-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold transition cursor-pointer"
              title="Bunyikan Klakson"
            >
              📢
            </button>
            <button
              onClick={toggleSound}
              className={`p-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                soundEnabled
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
              }`}
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4 text-rose-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main App Content View */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-2 sm:px-4 py-4 flex flex-col items-center">
        {activeTab === 'mengemudi' && (
          <DrivingGame
            onOpenSim={() => setActiveTab('sim')}
            onPhotoCaptured={(dataUrl) => {
              setStudentPhoto(dataUrl);
              setActiveTab('sim');
            }}
            onCompleteMission={() => {}}
          />
        )}

        {activeTab === 'menyeberang' && <CrossingGame4T />}

        {activeTab === 'ensiklopedia' && <SignEncyclopedia />}

        {activeTab === 'kuis' && <SignQuiz onOpenSim={() => setActiveTab('sim')} />}

        {activeTab === 'sim' && (
          <SimCertificate
            initialPhotoUrl={studentPhoto}
            onBackToDriving={() => setActiveTab('mengemudi')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white/80 border-t border-amber-200 py-4 px-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-700">
              Si Cilik Tertib • Media Pembelajaran Interaktif Kelas 2 SD
            </span>
          </div>
          <p className="text-[11px] text-slate-500 flex items-center gap-1">
            Materi Bab 3 Bahasa Indonesia • Rambu Lalu Lintas & Teknik 4T
          </p>
        </div>
      </footer>
    </div>
  );
}
