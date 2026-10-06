import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import { Camera, Printer, Award, Sparkles, Download, Check, ShieldCheck, FileDown, Loader2 } from 'lucide-react';
import { FullscreenCamera, FullscreenCameraRef } from './FullscreenCamera';
import { sounds } from '../utils/audio';

interface Props {
  onBackToDriving?: () => void;
  initialPhotoUrl?: string | null;
}

export const SimCertificate: React.FC<Props> = ({ onBackToDriving, initialPhotoUrl }) => {
  const [studentName, setStudentName] = useState<string>('Boni Pratama');
  const [schoolName, setSchoolName] = useState<string>('SD Negeri 01 Pagi');
  const [studentClass, setStudentClass] = useState<string>('Kelas 2-A (Fase A)');
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialPhotoUrl || null);
  const [isTakingPhoto, setIsTakingPhoto] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);

  const cameraRef = useRef<FullscreenCameraRef>(null);

  const capturePhoto = () => {
    if (cameraRef.current) {
      const snap = cameraRef.current.takeSnapshot();
      if (snap) {
        setPhotoUrl(snap);
        setIsTakingPhoto(false);
        sounds.playSuccess();
        sounds.speak('Foto berhasil diambil! Kartu SIM Cilik kamu sudah jadi!');
      }
    }
  };

  // Pure Canvas-based high-DPI card renderer (immune to Tailwind oklch CSS errors)
  const renderCardToCanvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');

    const w = canvas.width;
    const h = canvas.height;

    // Helper: Rounded Rectangle
    const roundRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    };

    // 1. Background Gradient Card
    roundRect(15, 15, w - 30, h - 30, 40);
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#1e3a8a'); // Navy Blue
    grad.addColorStop(0.5, '#1d4ed8'); // Royal Blue
    grad.addColorStop(1, '#312e81'); // Indigo
    ctx.fillStyle = grad;
    ctx.fill();

    // 2. Gold Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#f59e0b'; // Amber-500
    ctx.stroke();

    // 3. Watermark text in background
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.font = 'bold 85px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('POLISI CILIK INDONESIA', w / 2, h / 2 + 30);
    ctx.restore();

    // 4. Header Bar
    // Gold Star badge icon
    ctx.save();
    ctx.beginPath();
    ctx.arc(80, 95, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.font = '36px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⭐', 80, 95);
    ctx.restore();

    // Header Title Text
    ctx.fillStyle = '#fde047';
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('KEPOLISIAN CILIK INDONESIA', 135, 78);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('SURAT IZIN MENGEMUDI CILIK', 135, 120);

    // Pill badge: SIM KELAS 2 SD
    roundRect(w - 280, 70, 220, 50, 25);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SIM KELAS 2 SD', w - 170, 102);

    // Header divider line
    ctx.beginPath();
    ctx.moveTo(50, 155);
    ctx.lineTo(w - 50, 155);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fcd34d';
    ctx.stroke();

    // 5. Photo Box (Left Side)
    const photoX = 65;
    const photoY = 195;
    const photoW = 280;
    const photoH = 370;
    const photoRadius = 24;

    // Draw photo background & border
    roundRect(photoX, photoY, photoW, photoH, photoRadius);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#f59e0b';
    ctx.stroke();

    if (photoUrl) {
      try {
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            ctx.save();
            roundRect(photoX, photoY, photoW, photoH, photoRadius);
            ctx.clip();
            ctx.drawImage(img, photoX, photoY, photoW, photoH);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve(); // continue even if image error
          img.src = photoUrl;
        });
      } catch {
        // Fallback placeholder
      }
    } else {
      ctx.save();
      ctx.font = '80px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧒', photoX + photoW / 2, photoY + photoH / 2 - 20);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('FOTO PENGEMUDI', photoX + photoW / 2, photoY + photoH / 2 + 50);
      ctx.restore();
    }

    // Gold badge on bottom right of photo
    ctx.beginPath();
    ctx.arc(photoX + photoW - 30, photoY + photoH - 30, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = '900 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', photoX + photoW - 30, photoY + photoH - 30);

    // 6. Data Fields (Right Side)
    const dataX = 390;
    ctx.textAlign = 'left';

    // Field 1: Nama Siswa
    ctx.fillStyle = '#93c5fd'; // Light Blue
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('NAMA LENGKAP SISWA:', dataX, 230);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 42px sans-serif';
    ctx.fillText((studentName || 'SISWA TELADAN').toUpperCase(), dataX, 280);

    // Field 2: Sekolah
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('ASAL SEKOLAH:', dataX, 350);

    ctx.fillStyle = '#fef08a'; // Pale Yellow
    ctx.font = '900 34px sans-serif';
    ctx.fillText((schoolName || 'SD NEGERI CERIA').toUpperCase(), dataX, 395);

    // Field 3: Kelas & Fase
    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('TINGKAT / FASE:', dataX, 465);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 32px sans-serif';
    ctx.fillText(studentClass || 'Kelas 2 SD (Fase A)', dataX, 510);

    // Field 4: Status Kelulusan (Green Pill Badge)
    roundRect(dataX, 550, 360, 50, 25);
    ctx.fillStyle = '#10b981'; // Emerald-500
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✓ PAHAM RAMBU & TEKNIK 4T', dataX + 180, 582);

    // 7. Footer Divider & Text
    ctx.beginPath();
    ctx.moveTo(50, 680);
    ctx.lineTo(w - 50, 680);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.stroke();

    ctx.fillStyle = '#bfdbfe';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Berlaku Selama Menjadi Siswa Tertib Lalu Lintas', 65, 725);

    ctx.fillStyle = '#fde047';
    ctx.font = '900 22px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('★ PELOPOR KESELAMATAN JALAN RAYA FASE A ★', w - 65, 725);

    return canvas;
  };

  // Download high-resolution PDF document with student's photo
  const handleDownloadPdf = async () => {
    setIsExportingPdf(true);
    sounds.playHorn();
    sounds.speak('Sedang memproses dokumen PDF Kartu SIM Cilik...');

    try {
      // 1. Render card to high-DPI pure Canvas
      const canvas = await renderCardToCanvas();
      const imgData = canvas.toDataURL('image/png');

      // 2. Generate PDF using jsPDF (landscape card proportions 148mm x 100mm)
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [148, 100],
      });

      pdf.addImage(imgData, 'PNG', 4, 4, 140, 92);

      const safeName = (studentName || 'Siswa_Teladan').trim().replace(/[^a-zA-Z0-9]/g, '_');
      pdf.save(`SIM_Cilik_${safeName}.pdf`);

      sounds.playVictory();
      sounds.speak('Dokumen PDF berhasil diunduh! Tunjukkan ke guru dan orang tuamu!');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      // Fallback: window.print()
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    sounds.playHorn();
    window.print();
  };

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {/* Top Banner */}
      <div className="w-full mb-3 bg-white/95 rounded-2xl p-3 sm:p-4 border-2 border-amber-300 shadow-md flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-xl shadow">
            🪪
          </div>
          <div>
            <h2 className="font-black text-base sm:text-lg text-slate-800 leading-tight">
              SIM Cilik: Pelopor Keselamatan Lalu Lintas
            </h2>
            <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
              Surat Izin Mengemudi Cilik Kelas 2 SD (Bahasa Indonesia Bab 3)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 active:scale-95 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isExportingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Menyiapkan PDF...
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                Unduh PDF SIM 📄
              </>
            )}
          </button>

          {/* Print dialog button */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-black text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            Cetak 🖨️
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Form Controls (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-md space-y-3">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Data Pengemudi Cilik:
          </h3>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Nama Lengkap Siswa:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-amber-200 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-amber-500"
              placeholder="Contoh: Siti Aisyah"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Nama Sekolah:
            </label>
            <input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-amber-200 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-amber-500"
              placeholder="Contoh: SD Negeri Ceria"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-600 block mb-1">
              Kelas / Fase:
            </label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              className="w-full px-3 py-1.5 border-2 border-amber-200 rounded-xl font-bold text-sm text-slate-800 focus:outline-none focus:border-amber-500"
              placeholder="Contoh: Kelas 2-A (Fase A)"
            />
          </div>

          {/* Photo Capture Section */}
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setIsTakingPhoto(!isTakingPhoto)}
              className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              {isTakingPhoto ? 'Tutup Kamera' : 'Ambil Foto Siswa dari Kamera 📸'}
            </button>

            {isTakingPhoto && (
              <div className="mt-3 flex flex-col items-center">
                <div className="w-full aspect-4/3 rounded-2xl overflow-hidden border-2 border-amber-400 relative">
                  <FullscreenCamera ref={cameraRef} />
                </div>
                <button
                  onClick={capturePhoto}
                  className="mt-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  Jepret Foto Sekarang! 📸
                </button>
              </div>
            )}
          </div>
        </div>

        {/* The Official SIM Cilik Card Preview (7 cols) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            id="sim-card-print"
            className="w-full max-w-md aspect-16/10 rounded-3xl p-5 shadow-2xl relative overflow-hidden select-none text-white print:border-none print:shadow-none"
            style={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #312e81 100%)',
              border: '4px solid #f59e0b',
            }}
          >
            {/* Background Watermark Pattern */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none text-8xl font-black"
              style={{ color: 'rgba(255, 255, 255, 0.08)' }}
            >
              POLISI CILIK
            </div>

            {/* Header Stripes */}
            <div
              className="flex items-center justify-between pb-3 relative z-10"
              style={{ borderBottom: '2px solid #fcd34d' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-2xl shadow"
                  style={{ backgroundColor: '#f59e0b', border: '2px solid #ffffff' }}
                >
                  ⭐
                </div>
                <div>
                  <h4
                    className="font-black text-[10px] tracking-wider"
                    style={{ color: '#fde047' }}
                  >
                    KEPOLISIAN CILIK INDONESIA
                  </h4>
                  <h3 className="font-extrabold text-xs sm:text-sm text-white tracking-wide">
                    SURAT IZIN MENGEMUDI CILIK
                  </h3>
                </div>
              </div>
              <span
                className="font-black text-[9px] px-2.5 py-1 rounded-full shadow"
                style={{ backgroundColor: '#f59e0b', color: '#0f172a' }}
              >
                SIM KELAS 2 SD
              </span>
            </div>

            {/* Main ID Content */}
            <div className="mt-3.5 flex items-center gap-4 relative z-10">
              {/* Photo Box */}
              <div
                className="w-24 h-32 rounded-2xl overflow-hidden shadow-md flex items-center justify-center shrink-0 relative"
                style={{ backgroundColor: '#0f172a', border: '2px solid #f59e0b' }}
              >
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="Foto Siswa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-2">
                    <span className="text-4xl">🧒</span>
                    <span
                      className="text-[9px] font-bold mt-1"
                      style={{ color: '#fde047' }}
                    >
                      Foto Cilik
                    </span>
                  </div>
                )}
                {/* Gold Seal watermark */}
                <div
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{ backgroundColor: '#f59e0b', color: '#0f172a' }}
                >
                  ★
                </div>
              </div>

              {/* Data Rows */}
              <div className="flex-1 space-y-1 text-xs">
                <div>
                  <span
                    className="text-[8px] block font-bold"
                    style={{ color: '#93c5fd' }}
                  >
                    NAMA SISWA:
                  </span>
                  <span className="font-black text-sm text-white uppercase tracking-wide">
                    {studentName || 'SISWA TELADAN'}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[8px] block font-bold"
                    style={{ color: '#93c5fd' }}
                  >
                    SEKOLAH:
                  </span>
                  <span
                    className="font-extrabold text-xs"
                    style={{ color: '#fef08a' }}
                  >
                    {schoolName || 'SD NEGERI'}
                  </span>
                </div>
                <div>
                  <span
                    className="text-[8px] block font-bold"
                    style={{ color: '#93c5fd' }}
                  >
                    KELAS & FASE:
                  </span>
                  <span className="font-bold text-xs text-white">
                    {studentClass || 'Kelas 2 SD'}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <span
                    className="font-extrabold text-[8px] px-2 py-0.5 rounded-full flex items-center gap-1 shadow"
                    style={{ backgroundColor: '#10b981', color: '#ffffff' }}
                  >
                    <Check className="w-3 h-3" /> Paham Rambu & 4T
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Seal */}
            <div
              className="mt-3 pt-2 flex items-center justify-between text-[9px] relative z-10"
              style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#bfdbfe',
              }}
            >
              <span className="font-semibold">Berlaku Selama Menjadi Siswa Tertib</span>
              <span className="font-black" style={{ color: '#fde047' }}>
                ★ PELOPOR TERTIB LALU LINTAS ★
              </span>
            </div>
          </div>

          {/* Action buttons below card */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengunduh PDF...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  Unduh Dokumen PDF Lengkap 📄
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Cetak Kertas
            </button>

            {onBackToDriving && (
              <button
                onClick={onBackToDriving}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Kembali ke Mengemudi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
