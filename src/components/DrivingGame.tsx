import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Hand,
  Compass,
  Award,
  Camera,
  Play,
  Fuel,
  Flag,
} from 'lucide-react';
import { DRIVING_SCENARIOS } from '../data/trafficData';
import { TrafficSignIcon } from './TrafficSignIcon';
import { FullscreenCamera, FullscreenCameraRef } from './FullscreenCamera';
import { sounds } from '../utils/audio';

interface Props {
  onCompleteMission?: (score: number, stars: number) => void;
  onOpenSim?: () => void;
  onPhotoCaptured?: (dataUrl: string) => void;
}

export const DrivingGame: React.FC<Props> = ({ onCompleteMission, onOpenSim, onPhotoCaptured }) => {
  const scenario = DRIVING_SCENARIOS[0]; // Single comprehensive master mission!

  // Game states: start in 'intro'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [carSteerAngle, setCarSteerAngle] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(35);
  const [roadProgress, setRoadProgress] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [stars, setStars] = useState<number>(3);
  const [fuel, setFuel] = useState<number>(100); // 0 to 100%
  const [activeFeedback, setActiveFeedback] = useState<{
    text: string;
    type: 'correct' | 'warning' | 'info';
  } | null>(null);

  // Active target sign on road
  const [currentSignIndex, setCurrentSignIndex] = useState<number>(0);
  const activeSignTarget = scenario.targetSigns[currentSignIndex] || null;

  // Sign distance to car (100 down to 0)
  const [signDistance, setSignDistance] = useState<number>(100);
  const [isSignHandled, setIsSignHandled] = useState<boolean>(false);

  // Vehicle choices
  const [vehicle, setVehicle] = useState<'mobil' | 'bus' | 'polisi'>('mobil');

  const cameraRef = useRef<FullscreenCameraRef>(null);

  // Start game handler
  const startGame = () => {
    setGameState('playing');
    setRoadProgress(0);
    setCarSteerAngle(0);
    setSpeed(35);
    setScore(0);
    setStars(3);
    setFuel(100);
    setCurrentSignIndex(0);
    setSignDistance(95);
    setIsSignHandled(false);
    setActiveFeedback(null);
    sounds.playEngine();
    sounds.speak('Ayo mulai dari garis START! Perhatikan lampu dan rambu di depanmu!');
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'intro') {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft') {
        handleSteer('left');
      } else if (e.key === 'ArrowRight') {
        handleSteer('right');
      } else if (e.key === 'ArrowUp') {
        handleAccelerate();
      } else if (e.key === ' ' || e.key === 'ArrowDown') {
        handleBrake();
      } else if (e.key.toLowerCase() === 'h') {
        honkHorn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, activeSignTarget, isSignHandled]);

  // Steer controls
  const handleSteer = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCarSteerAngle(-35);
      setTimeout(() => setCarSteerAngle(0), 600);
      checkActionCompliance('steer-left');
    } else {
      setCarSteerAngle(35);
      setTimeout(() => setCarSteerAngle(0), 600);
      checkActionCompliance('steer-right');
    }
  };

  const handleBrake = () => {
    sounds.playBrake();
    setSpeed(0);
    checkActionCompliance('brake');
  };

  const handleAccelerate = () => {
    sounds.playEngine();
    setSpeed((s) => Math.min(50, s + 15));
    checkActionCompliance('drive');
  };

  // Check if player's button press matches the approaching sign
  const checkActionCompliance = (
    userAction: 'steer-left' | 'steer-right' | 'brake' | 'drive' | 'slow-down'
  ) => {
    if (!activeSignTarget || isSignHandled) return;

    if (signDistance <= 65 && signDistance >= 5) {
      const required = activeSignTarget.requiredAction;

      let isSuccess = false;
      if (required === userAction) {
        isSuccess = true;
      } else if (required === 'slow-down' && (userAction === 'brake' || speed < 25)) {
        isSuccess = true;
      }

      if (isSuccess) {
        setIsSignHandled(true);
        setScore((s) => s + 100);
        sounds.playSuccess();

        // Special check: Refueling at Pom Bensin
        if (activeSignTarget.sign.id === 'petunjuk-pom-bensin') {
          setFuel(100);
          setActiveFeedback({
            text: '⛽ BENSIN TERISI PENUH! Hebat! Siap melaju ke Terminal Bus!',
            type: 'correct',
          });
          sounds.speak('Hebat! Kamu berhasil mengisi bensin di pom bensin SPBU! Sekarang siap melaju ke Terminal Bus!');
          return;
        }

        const compliments = ['HEBAT!', 'PINTAR SEKALI!', 'TERTIB!', 'ANAK JUARA!'];
        const randomCompliment = compliments[Math.floor(Math.random() * compliments.length)];
        setActiveFeedback({
          text: `🌟 ${randomCompliment} Kamu mematuhi ${activeSignTarget.sign.name}!`,
          type: 'correct',
        });
        sounds.speak(`${randomCompliment} Kamu mematuhi rambu dengan benar!`);
      }
    }
  };

  // Main game loop (advances distance and signs)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      // Fuel consumption along the road
      setFuel((currFuel) => {
        // Decrease fuel towards 15% when approaching step 8/9
        if (currentSignIndex >= 7 && currentSignIndex <= 8 && currFuel > 15) {
          return Math.max(15, currFuel - 2);
        } else if (currentSignIndex < 7 && currFuel > 35) {
          return Math.max(35, currFuel - 0.5);
        }
        return currFuel;
      });

      setSignDistance((dist) => {
        const nextDist = dist - 2.8;

        // If sign passes without being handled
        if (nextDist <= 0 && activeSignTarget && !isSignHandled) {
          if (activeSignTarget.requiredAction === 'brake' || activeSignTarget.requiredAction === 'slow-down') {
            sounds.playWarning();
            setStars((st) => Math.max(1, st - 1));
            setActiveFeedback({
              text: `⚠️ Hati-hati: ${activeSignTarget.prompt}`,
              type: 'warning',
            });
            sounds.speak(`Awas! Seharusnya kamu mematuhi ${activeSignTarget.sign.name}`);
          }
        }

        // Advance to next sign once sign moves past behind us
        if (nextDist <= -15) {
          if (currentSignIndex < scenario.targetSigns.length - 1) {
            setCurrentSignIndex((idx) => idx + 1);
            setIsSignHandled(false);
            if (speed === 0) setSpeed(35);
            return 95;
          } else {
            finishScenario();
            return 0;
          }
        }

        return nextDist;
      });

      // Update total road progress
      setRoadProgress((p) => (p >= 100 ? 100 : p + 0.5));
    }, 120);

    return () => clearInterval(interval);
  }, [gameState, activeSignTarget, currentSignIndex, isSignHandled]);

  const finishScenario = () => {
    setGameState('completed');
    sounds.playVictory();
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    });
    sounds.speak('Selamat! Kamu berhasil menyelesaikan seluruh perjalanan dari START sampai FINISH di Terminal Bus!');
    if (onCompleteMission) {
      onCompleteMission(score + 100, stars);
    }
  };

  const honkHorn = () => {
    sounds.playHorn();
    setActiveFeedback({ text: '📢 TEEET TEEET! Klakson Cilik!', type: 'info' });
  };

  const capturePhotoForSim = () => {
    if (cameraRef.current) {
      const snap = cameraRef.current.takeSnapshot();
      if (snap) {
        if (onPhotoCaptured) onPhotoCaptured(snap);
        sounds.playSuccess();
        sounds.speak('Foto pengemudi cilik berhasil diambil untuk kartu SIM!');
        if (onOpenSim) onOpenSim();
      }
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Sleek Master Mission Status Bar */}
      <div className="w-full max-w-5xl flex items-center justify-between gap-2 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏁</span>
          <div>
            <h2 className="font-black text-xs sm:text-sm text-slate-800 leading-tight">
              Misi Jalan Kota: Garis START ➔ FINISH Terminal Bus
            </h2>
            <p className="text-[10px] text-slate-500 font-semibold">
              Rambu ke-{currentSignIndex + 1} dari {scenario.targetSigns.length} • Patuhi semua rambu!
            </p>
          </div>
        </div>

        <button
          onClick={capturePhotoForSim}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition cursor-pointer shrink-0"
          title="Ambil Foto untuk SIM"
        >
          <Camera className="w-3.5 h-3.5" />
          Foto SIM 📸
        </button>
      </div>

      {/* FULLSCREEN DRIVING ARENA */}
      <div className="w-full max-w-5xl relative aspect-16/10 sm:aspect-16/9 rounded-3xl overflow-hidden border-4 border-amber-400 shadow-xl bg-slate-950 select-none">
        {/* Fullscreen Camera Component */}
        <FullscreenCamera ref={cameraRef}>
          {/* HUD Overlay in Front of Child */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {/* Top Windshield Status Bar */}
            <div className="w-full pt-3 px-3 sm:px-4 flex items-start justify-between z-30 pointer-events-auto">
              {/* Speedometer, Stars & Fuel */}
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-2xl border-2 border-amber-400 shadow-lg flex items-center gap-3">
                <div>
                  <span className="text-[9px] font-bold text-amber-300 block">KECEPATAN</span>
                  <span className="text-base sm:text-lg font-black text-white">{speed} km/j</span>
                </div>
                <div className="h-5 w-px bg-slate-700" />
                <div>
                  <span className="text-[9px] font-bold text-amber-300 block">BINTANG</span>
                  <div className="text-amber-400 text-xs sm:text-sm flex">
                    {Array.from({ length: stars }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                </div>
                <div className="h-5 w-px bg-slate-700" />
                {/* Fuel Meter Indicator */}
                <div className="flex flex-col items-center">
                  <span className="text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                    <Fuel className="w-2.5 h-2.5" /> BENSIN
                  </span>
                  <div className="w-16 h-2 bg-slate-800 rounded-full border border-slate-600 overflow-hidden mt-0.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        fuel > 30 ? 'bg-emerald-400' : 'bg-rose-500 animate-pulse'
                      }`}
                      style={{ width: `${fuel}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Journey Progress: START ➔ FINISH */}
              <div className="hidden sm:flex bg-slate-900/90 backdrop-blur-md px-4 py-1 rounded-2xl border border-slate-700 items-center gap-2 text-[10px] font-black text-white shadow">
                <span className="text-emerald-400">START 🏁</span>
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 transition-all duration-200"
                    style={{
                      width: `${((currentSignIndex + 1) / scenario.targetSigns.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-amber-400">🚌 FINISH</span>
              </div>

              {/* Score Badge */}
              <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-2xl border-2 border-amber-400 shadow-lg text-right">
                <span className="text-[9px] font-bold text-amber-300 block">SKOR TERTIB</span>
                <span className="text-base sm:text-lg font-black text-emerald-400">{score}</span>
              </div>
            </div>

            {/* Approaching Traffic Sign */}
            {gameState === 'playing' && activeSignTarget && signDistance > -10 && (
              <div
                className="absolute transition-all duration-100 ease-linear pointer-events-none flex flex-col items-center z-40"
                style={{
                  top: `${18 + (100 - signDistance) * 0.45}%`,
                  right: `${Math.max(4, 18 - (100 - signDistance) * 0.12)}%`,
                  transform: `scale(${Math.max(0.4, 2.2 - signDistance / 50)})`,
                  opacity: signDistance > 85 ? (100 - signDistance) / 15 : 1,
                }}
              >
                <div className="animate-bounce drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
                  <TrafficSignIcon sign={activeSignTarget.sign} size="md" showPole={true} />
                </div>
                <div className="bg-slate-900/90 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full mt-1 border border-amber-400 shadow">
                  {Math.max(0, Math.round(signDistance))} m
                </div>
              </div>
            )}

            {/* Prompt Instruction Banner */}
            {gameState === 'playing' && activeSignTarget && (
              <div className="self-center mt-2 w-11/12 max-w-lg bg-white/95 backdrop-blur-md rounded-2xl p-2.5 border-4 border-amber-400 shadow-2xl z-40 flex items-center gap-2.5 pointer-events-auto">
                <div className="shrink-0 animate-pulse">
                  <TrafficSignIcon sign={activeSignTarget.sign} size="sm" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full inline-block">
                      {activeSignTarget.sign.category.toUpperCase()}
                    </span>
                    {currentSignIndex === 0 && (
                      <span className="text-[9px] font-black text-emerald-700 bg-emerald-200 px-2 py-0.5 rounded-full">
                        GARIS START
                      </span>
                    )}
                    {currentSignIndex === scenario.targetSigns.length - 1 && (
                      <span className="text-[9px] font-black text-rose-700 bg-rose-200 px-2 py-0.5 rounded-full">
                        GARIS FINISH
                      </span>
                    )}
                  </div>
                  <p className="font-extrabold text-xs sm:text-sm text-slate-900 leading-snug mt-0.5">
                    {activeSignTarget.prompt}
                  </p>
                </div>
              </div>
            )}

            {/* Low Fuel Warning Alert */}
            {gameState === 'playing' && currentSignIndex === 8 && fuel <= 25 && (
              <div className="self-center px-4 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs shadow-xl animate-pulse flex items-center gap-1.5 z-40 border border-white">
                <Fuel className="w-4 h-4" />
                PERINGATAN: Bensin Mobil Menipis! Cari Rambu Pom Bensin di Depan!
              </div>
            )}

            {/* Feedback Popups */}
            {activeFeedback && (
              <div
                className={`self-center px-4 py-2 rounded-2xl font-black text-xs sm:text-sm shadow-2xl z-50 animate-bounce flex items-center gap-2 border-2 ${
                  activeFeedback.type === 'correct'
                    ? 'bg-emerald-500 text-white border-emerald-300'
                    : activeFeedback.type === 'warning'
                    ? 'bg-amber-400 text-slate-950 border-amber-500'
                    : 'bg-sky-500 text-white border-sky-300'
                }`}
              >
                {activeFeedback.text}
              </div>
            )}

            {/* Bottom Dashboard & Tactile Controls */}
            <div className="w-full relative z-30 flex flex-col items-center pointer-events-auto">
              <div
                className="w-full py-2 px-3 sm:px-6 border-t-4 shadow-2xl flex items-center justify-between backdrop-blur-md"
                style={{
                  backgroundColor:
                    vehicle === 'mobil'
                      ? 'rgba(234, 179, 8, 0.94)'
                      : vehicle === 'bus'
                      ? 'rgba(234, 88, 12, 0.94)'
                      : 'rgba(30, 58, 138, 0.94)',
                  borderColor:
                    vehicle === 'mobil'
                      ? '#ca8a04'
                      : vehicle === 'bus'
                      ? '#c2410c'
                      : '#172554',
                }}
              >
                {/* Left Turn Button */}
                <button
                  onClick={() => handleSteer('left')}
                  className="p-2.5 sm:px-4 sm:py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-black shadow-lg flex items-center gap-1 transition cursor-pointer"
                  title="Belok Kiri"
                >
                  <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-xs sm:text-sm font-black hidden sm:inline">KIRI</span>
                </button>

                {/* Steering Wheel with Horn Button in Center */}
                <div className="flex flex-col items-center -mt-6 sm:-mt-10">
                  <div
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-full border-6 sm:border-8 border-slate-900 bg-slate-800 shadow-2xl flex items-center justify-center relative transition-transform duration-200 ease-out cursor-pointer hover:scale-105"
                    style={{ transform: `rotate(${carSteerAngle}deg)` }}
                    onClick={honkHorn}
                  >
                    <div className="w-2 h-full bg-amber-400 absolute" />
                    <div className="h-2 w-full bg-amber-400 absolute" />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        honkHorn();
                      }}
                      className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-amber-400 hover:bg-amber-300 active:scale-90 border-2 border-slate-900 flex items-center justify-center shadow-lg font-black text-slate-900 z-10 cursor-pointer"
                      title="Klakson"
                    >
                      <span className="text-sm sm:text-base">📢</span>
                    </button>
                  </div>
                </div>

                {/* Pedals: REM & GAS & Right Turn Button */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={handleBrake}
                    className="p-2.5 sm:px-4 sm:py-3 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white rounded-2xl font-black shadow-lg flex items-center gap-1 transition cursor-pointer"
                    title="Rem (Berhenti)"
                  >
                    <Hand className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-black">REM</span>
                  </button>

                  <button
                    onClick={handleAccelerate}
                    className="p-2.5 sm:px-4 sm:py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-2xl font-black shadow-lg flex items-center gap-1 transition cursor-pointer"
                    title="Gas (Maju)"
                  >
                    <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm font-black">GAS</span>
                  </button>

                  <button
                    onClick={() => handleSteer('right')}
                    className="p-2.5 sm:px-4 sm:py-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-2xl font-black shadow-lg flex items-center gap-1 transition cursor-pointer"
                    title="Belok Kanan"
                  >
                    <span className="text-xs sm:text-sm font-black hidden sm:inline">KANAN</span>
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* Intro Modal Overlay */}
            {gameState === 'intro' && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center pointer-events-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-400 flex items-center justify-center text-3xl sm:text-4xl shadow-2xl mb-2 animate-bounce border-2 border-white">
                  🚗
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white">{scenario.title}</h3>
                <p className="text-slate-200 text-xs sm:text-sm max-w-md mt-1 mb-3 font-medium">
                  Perjalanan dari <strong>START</strong> lampu hijau ➔ belok kiri & kanan ➔ jalan berkelok ➔ lampu merah & hijau ➔ orang melintas ➔ isi bensin di SPBU ➔ <strong>FINISH</strong> di Terminal Bus!
                </p>

                {/* Vehicle Selection for Kids */}
                <div className="flex items-center gap-2 mb-4">
                  {[
                    { id: 'mobil', label: 'Mobil Kuning 🚗' },
                    { id: 'bus', label: 'Bus Sekolah 🚌' },
                    { id: 'polisi', label: 'Mobil Polisi 🚓' },
                  ].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setVehicle(v.id as 'mobil' | 'bus' | 'polisi')}
                      className={`px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer ${
                        vehicle === v.id
                          ? 'bg-amber-400 text-slate-900 ring-2 ring-white scale-105'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={startGame}
                  className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 hover:from-emerald-600 hover:to-green-700 active:scale-95 text-white font-black text-base sm:text-lg rounded-2xl shadow-2xl hover:scale-105 transition cursor-pointer flex items-center gap-2 border-2 border-emerald-300 ring-4 ring-emerald-400/50 animate-pulse"
                >
                  <Play className="w-6 h-6 fill-white text-white" />
                  Mulai dari Garis START!
                </button>
                <span className="text-[11px] text-amber-300 mt-2 font-bold">
                  (Atau tekan tombol SPASI pada keyboard)
                </span>
              </div>
            )}

            {/* Victory / Mission Complete Overlay */}
            {gameState === 'completed' && (
              <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-6 text-center pointer-events-auto">
                <div className="w-20 h-20 rounded-full bg-amber-400 flex items-center justify-center text-4xl shadow-2xl mb-2 animate-bounce">
                  🏆
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-amber-300">
                  Selamat! Tiba di FINISH Terminal Bus!
                </h3>
                <p className="text-white text-xs sm:text-sm mt-1 max-w-sm">
                  Kamu telah sukses mematuhi semua rambu lalu lintas dari awal sampai akhir!
                </p>

                {/* Stars Rating */}
                <div className="flex items-center gap-1.5 my-3">
                  {[1, 2, 3].map((starIdx) => (
                    <span
                      key={starIdx}
                      className={`text-3xl transition-all ${
                        starIdx <= stars ? 'text-amber-400 scale-110 drop-shadow' : 'text-slate-600'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <div className="bg-slate-800/90 rounded-xl px-4 py-1.5 border border-slate-700 mb-4">
                  <span className="text-[10px] text-slate-400 font-bold block">Skor Keselamatan:</span>
                  <span className="text-xl font-black text-emerald-400">{score} Poin</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={startGame}
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Ulangi Perjalanan
                  </button>

                  <button
                    onClick={capturePhotoForSim}
                    className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    Cetak SIM Cilik Sekarang! 🪪
                  </button>
                </div>
              </div>
            )}
          </div>
        </FullscreenCamera>
      </div>
    </div>
  );
};
