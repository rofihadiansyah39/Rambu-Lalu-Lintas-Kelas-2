import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, ShieldCheck, ArrowRight } from 'lucide-react';
import { CROSSING_4T_STEPS } from '../data/trafficData';
import { FullscreenCamera } from './FullscreenCamera';
import { sounds } from '../utils/audio';

export const CrossingGame4T: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCrossedSuccessfully, setIsCrossedSuccessfully] = useState<boolean>(false);
  const [trafficActive, setTrafficActive] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string>(
    'Ayo ikuti 4 langkah aman menyeberang jalan (Teknik 4T)!'
  );

  const step = CROSSING_4T_STEPS[currentStepIndex];

  const handleStepClick = (stepIdx: number) => {
    if (completedSteps.includes(stepIdx)) return;

    sounds.playSuccess();
    setCompletedSteps((prev) => [...prev, stepIdx]);

    if (stepIdx === 0) {
      setFeedback('✅ Bagus! Langkah 1: Kamu menengok ke KIRI melihat kendaraan terdekat.');
      sounds.speak('Bagus! Kamu sudah tengok ke kiri. Sekarang langkah kedua: Tengok ke kanan!');
      setTimeout(() => setCurrentStepIndex(1), 1200);
    } else if (stepIdx === 1) {
      setFeedback('✅ Pintar! Langkah 2: Kamu menengok ke KANAN memastikan jalur seberang.');
      sounds.speak('Pintar! Sekarang langkah ketiga: Tengok ke kiri lagi untuk memastikan!');
      setTimeout(() => setCurrentStepIndex(2), 1200);
    } else if (stepIdx === 2) {
      setFeedback('✅ Mantap! Langkah 3: Tengok ke KIRI LAGI. Kendaraan mulai berhenti di stop line!');
      sounds.speak('Mantap! Kendaraan sudah berhenti. Langkah keempat: Tunggu sepi lalu jalan di zebra cross!');
      setTrafficActive(false);
      setTimeout(() => setCurrentStepIndex(3), 1200);
    } else if (stepIdx === 3) {
      setFeedback('🎉 Luar biasa! Langkah 4: Berjalan perlahan di atas Zebra Cross dengan selamat!');
      sounds.speak('Luar biasa! Kamu menyeberang dengan sangat aman sampai ke gerbang sekolah!');
      setIsCrossedSuccessfully(true);
      sounds.playVictory();
      confetti({
        particleCount: 100,
        spread: 75,
        origin: { y: 0.6 },
      });
    }
  };

  const resetGame = () => {
    setCurrentStepIndex(0);
    setCompletedSteps([]);
    setIsCrossedSuccessfully(false);
    setTrafficActive(true);
    setFeedback('Ayo bersiap menyeberang dengan aman menggunakan teknik 4T!');
    sounds.speak('Ayo bersiap menyeberang dengan teknik 4T. Langkah pertama: Tengok ke Kiri!');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sleek Header Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🚶‍♂️</span>
          <h2 className="font-black text-sm sm:text-base text-slate-800">
            Misi 4T: Cara Aman Menyeberang di Zebra Cross
          </h2>
        </div>

        <button
          onClick={resetGame}
          className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Ulangi Latihan
        </button>
      </div>

      {/* FULLSCREEN CROSSING ARENA */}
      <div className="w-full max-w-5xl relative aspect-16/10 sm:aspect-16/9 rounded-3xl overflow-hidden border-4 border-emerald-400 shadow-2xl bg-black">
        {/* Fullscreen Camera showing child */}
        <FullscreenCamera>
          {/* Overlaid Zebra Cross & Traffic Atmosphere */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
            {/* Top Info Bar & Pedestrian Light */}
            <div className="flex items-start justify-between z-20">
              {/* Target Step Banner */}
              <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl border-2 border-emerald-400 shadow-xl flex items-center gap-3">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${step.badgeColor}`}>
                  {step.code}
                </span>
                <div>
                  <h4 className="font-black text-xs sm:text-sm text-slate-900">{step.title}</h4>
                  <p className="text-[11px] text-slate-600 hidden sm:block">
                    {step.actionInstruction}
                  </p>
                </div>
              </div>

              {/* Pedestrian Traffic Light Overlay */}
              <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border-2 border-slate-700 flex flex-col items-center gap-1.5 shadow-xl">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                    trafficActive
                      ? 'bg-rose-500 text-white shadow-[0_0_12px_#ef4444]'
                      : 'bg-rose-950 text-rose-800 opacity-30'
                  }`}
                >
                  🛑
                </div>
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
                    !trafficActive
                      ? 'bg-emerald-500 text-white shadow-[0_0_12px_#22c55e] animate-pulse'
                      : 'bg-emerald-950 text-emerald-800 opacity-30'
                  }`}
                >
                  🚶
                </div>
              </div>
            </div>

            {/* School Gate Indicator */}
            <div className="self-end mr-4 bg-amber-400/90 text-amber-950 font-black text-xs px-3 py-1 rounded-xl border border-amber-600 shadow">
              🏫 GERBANG SEKOLAH ➔
            </div>

            {/* Bottom Zebra Cross Floor Graphics overlaid in front of child */}
            <div className="w-full relative z-20 flex flex-col items-center">
              {/* Zebra Cross Painted on Road */}
              <div className="w-full h-12 flex justify-around items-center px-4 mb-2 pointer-events-none opacity-85">
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-12 bg-white rounded-sm shadow-md border border-slate-200"
                  />
                ))}
              </div>

              {/* 4T Step Action Buttons (Large, friendly buttons for kids) */}
              <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 pointer-events-auto bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border-2 border-emerald-400 shadow-2xl">
                {CROSSING_4T_STEPS.map((s, idx) => {
                  const isDone = completedSteps.includes(idx);
                  const isCurrent = currentStepIndex === idx && !isCrossedSuccessfully;

                  return (
                    <button
                      key={s.step}
                      onClick={() => handleStepClick(idx)}
                      className={`p-2.5 sm:p-3 rounded-2xl border-2 font-black transition-all flex flex-col items-center text-center cursor-pointer ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-300 text-white shadow-lg'
                          : isCurrent
                          ? 'bg-amber-400 hover:bg-amber-300 border-white text-slate-950 ring-4 ring-amber-300/60 scale-102 animate-bounce'
                          : 'bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs">{s.code}</span>
                        {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-200" />}
                      </div>
                      <span className="text-xs sm:text-sm mt-0.5 line-clamp-1">{s.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </FullscreenCamera>
      </div>

      {/* Spoken Feedback Banner */}
      <div className="w-full max-w-5xl mt-3 p-3.5 bg-emerald-100 rounded-2xl border-2 border-emerald-300 text-xs sm:text-sm font-extrabold text-emerald-950 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
          <span>{feedback}</span>
        </div>
        <span className="text-xs bg-emerald-200 text-emerald-900 px-3 py-1 rounded-xl">
          Langkah {completedSteps.length} / 4 Selesai
        </span>
      </div>
    </div>
  );
};
