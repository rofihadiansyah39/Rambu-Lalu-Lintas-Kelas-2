import React, { useState } from 'react';
import { Volume2, BookOpen, AlertTriangle, Ban, CheckCircle, Info, Sparkles } from 'lucide-react';
import { TrafficSign, SignCategory } from '../types/traffic';
import { TRAFFIC_SIGNS } from '../data/trafficData';
import { TrafficSignIcon } from './TrafficSignIcon';
import { sounds } from '../utils/audio';

export const SignEncyclopedia: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<SignCategory | 'semua'>('semua');
  const [activeSign, setActiveSign] = useState<TrafficSign>(TRAFFIC_SIGNS[0]);

  const categories = [
    { id: 'semua', label: 'Semua Rambu', icon: '🌟', color: 'bg-amber-100 text-amber-900' },
    { id: 'lampu', label: 'Lampu Lalu Lintas', icon: '🚦', color: 'bg-rose-100 text-rose-900' },
    { id: 'peringatan', label: '1. Rambu Peringatan', icon: '⚠️', color: 'bg-yellow-100 text-yellow-900' },
    { id: 'larangan', label: '2. Rambu Larangan', icon: '⛔', color: 'bg-red-100 text-red-900' },
    { id: 'perintah', label: '3. Rambu Perintah', icon: '🔵', color: 'bg-blue-100 text-blue-900' },
    { id: 'petunjuk', label: '4. Rambu Petunjuk', icon: '🟩', color: 'bg-emerald-100 text-emerald-900' },
  ];

  const filteredSigns =
    selectedCategory === 'semua'
      ? TRAFFIC_SIGNS
      : TRAFFIC_SIGNS.filter((s) => s.category === selectedCategory);

  const handleReadSign = (sign: TrafficSign) => {
    setActiveSign(sign);
    sounds.playHorn();
    sounds.speak(`${sign.name}. Artinya: ${sign.meaning}. Saran untukmu: ${sign.actionAdvice}`);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center">
      {/* Sleek Header */}
      <div className="w-full flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <h2 className="font-black text-sm sm:text-base text-slate-800">
            Buku Rambu Lalu Lintas (Fase A - Kelas 2 SD)
          </h2>
        </div>

        <div className="bg-amber-100/90 text-amber-900 px-3 py-1 rounded-xl text-xs font-bold border border-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Klik untuk dengar suara 📢
        </div>
      </div>

      {/* Category Tabs */}
      <div className="w-full flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as SignCategory | 'semua')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 shadow-sm ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md scale-102 font-extrabold'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Detail Spotlight & Grid Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Spotlight Active Sign Detail (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border-4 border-amber-300 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-3 right-3">
            <button
              onClick={() => handleReadSign(activeSign)}
              className="p-2.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 shadow transition flex items-center gap-1 text-xs font-bold cursor-pointer"
              title="Dengarkan Suara Pembaca"
            >
              <Volume2 className="w-4 h-4 text-amber-700" />
              Dengarkan
            </button>
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 mb-4">
            Kategori: {activeSign.category.toUpperCase()}
          </span>

          {/* Large Traffic Sign Icon */}
          <div className="my-2 p-3 bg-slate-50 rounded-2xl border-2 border-slate-100 shadow-inner">
            <TrafficSignIcon sign={activeSign} size="xl" showPole={true} />
          </div>

          <h3 className="text-xl font-black text-slate-900 mt-2 mb-1">
            {activeSign.name}
          </h3>

          <div className="w-full bg-amber-50 rounded-2xl p-3 border border-amber-200 text-left my-3 space-y-2">
            <div>
              <span className="text-[11px] font-bold text-amber-900 block">💡 Arti Rambu:</span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {activeSign.meaning}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-900 block">
                🚗 Apa yang Harus Dilakukan Siswa / Pengemudi?
              </span>
              <p className="text-xs text-slate-700 font-medium leading-relaxed">
                {activeSign.actionAdvice}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-amber-900 block">
                📍 Contoh Tempat di Sekitar:
              </span>
              <p className="text-xs text-slate-600 font-medium italic">
                {activeSign.realWorldExample}
              </p>
            </div>
          </div>
        </div>

        {/* Signs Grid Collection (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredSigns.map((s) => {
              const isSelected = activeSign.id === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleReadSign(s)}
                  className={`bg-white rounded-2xl p-3 border-2 transition cursor-pointer flex flex-col items-center text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/50'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div className="h-20 flex items-center justify-center">
                    <TrafficSignIcon sign={s} size="sm" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-800 line-clamp-2 mt-1">
                    {s.name}
                  </h4>
                  <span className="text-[10px] text-slate-500 mt-1 capitalize font-medium">
                    {s.category}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Materi Ringkasan Penting 4 Jenis Rambu (Kurikulum SD) */}
          <div className="mt-2 bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm text-xs space-y-3">
            <h4 className="font-black text-sm text-slate-800 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-600" />
              Ciri Khas 4 Rambu Utama Kelas 2 SD:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-yellow-50 border border-yellow-200 rounded-xl">
                <span className="font-extrabold text-yellow-900 block">
                  1. Rambu Peringatan
                </span>
                <p className="text-yellow-800 mt-0.5">
                  Bentuk belah ketupat (wajik), warna kuning cerah, lambang hitam. Memberitahu ada bahaya/kondisi jalan.
                </p>
              </div>
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl">
                <span className="font-extrabold text-red-900 block">
                  2. Rambu Larangan
                </span>
                <p className="text-red-800 mt-0.5">
                  Bentuk lingkaran, garis tepi merah, ada coret miring merah. Melarang sesuatu (tidak boleh dilakukan!).
                </p>
              </div>
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="font-extrabold text-blue-900 block">
                  3. Rambu Perintah
                </span>
                <p className="text-blue-800 mt-0.5">
                  Bentuk lingkaran/kotak biru dengan lambang putih. Wajib ditaati dan dipatuhi oleh pengguna jalan.
                </p>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-extrabold text-emerald-900 block">
                  4. Rambu Petunjuk
                </span>
                <p className="text-emerald-800 mt-0.5">
                  Bentuk persegi panjang biru/hijau. Memberikan petunjuk arah, lokasi, rumah sakit, atau zebra cross.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
