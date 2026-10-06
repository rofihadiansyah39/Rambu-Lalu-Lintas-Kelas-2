import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Camera, CameraOff, Sparkles, RefreshCw, Smile } from 'lucide-react';

export interface FullscreenCameraRef {
  takeSnapshot: () => string | null;
  toggleHat: () => void;
  hatStyle: 'police' | 'pilot' | 'sunglasses' | 'none';
}

interface Props {
  className?: string;
  children?: React.ReactNode;
  showStickerControls?: boolean;
}

export const FullscreenCamera = forwardRef<FullscreenCameraRef, Props>(
  ({ className = '', children, showStickerControls = true }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraActive, setCameraActive] = useState<boolean>(false);
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [hatStyle, setHatStyle] = useState<'police' | 'pilot' | 'sunglasses' | 'none'>('police');

    useEffect(() => {
      startCamera();
      return () => {
        stopCamera();
      };
    }, []);

    const startCamera = async () => {
      setCameraError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setCameraActive(true);
        }
      } catch (err: unknown) {
        console.warn('Camera not available:', err);
        setCameraError('Kamera tidak aktif atau izin belum diberikan.');
        setCameraActive(false);
      }
    };

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setCameraActive(false);
    };

    const takeSnapshot = (): string | null => {
      if (!videoRef.current || !cameraActive) return null;
      const canvas = document.createElement('canvas');
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Draw mirrored video frame
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      // Draw hat overlay on captured photo
      if (hatStyle === 'police') {
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.ellipse(320, 80, 100, 35, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.ellipse(320, 100, 115, 20, 0, 0, Math.PI);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(320, 75, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      return canvas.toDataURL('image/jpeg', 0.9);
    };

    const cycleHat = () => {
      const styles: ('police' | 'pilot' | 'sunglasses' | 'none')[] = [
        'police',
        'pilot',
        'sunglasses',
        'none',
      ];
      const nextIndex = (styles.indexOf(hatStyle) + 1) % styles.length;
      setHatStyle(styles[nextIndex]);
    };

    useImperativeHandle(ref, () => ({
      takeSnapshot,
      toggleHat: cycleHat,
      hatStyle,
    }));

    return (
      <div className={`relative w-full h-full overflow-hidden bg-slate-950 ${className}`}>
        {/* Fullscreen Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Fallback if camera is off or denied */}
        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-sky-400 via-sky-200 to-emerald-400">
            <div className="w-24 h-24 rounded-full bg-white/80 border-4 border-amber-400 shadow-xl flex items-center justify-center text-5xl mb-3 animate-bounce">
              🧒
            </div>
            <h3 className="text-xl font-black text-slate-800">
              Layar Pengemudi Cilik
            </h3>
            <p className="text-xs text-slate-700 max-w-sm mt-1 mb-4 font-semibold">
              {cameraError || 'Aktifkan kamera agar wajahmu muncul di layar pengemudi!'}
            </p>
            <button
              onClick={startCamera}
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              Izinkan & Nyalakan Kamera
            </button>
          </div>
        )}

        {/* Fun Driver Stickers Overlay (Topi Polisi, Kacamata, Helm) */}
        {cameraActive && hatStyle !== 'none' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none select-none z-20 transition-all duration-200">
            {hatStyle === 'police' && (
              <div className="flex flex-col items-center drop-shadow-2xl animate-pulse">
                {/* Police cap */}
                <div className="w-40 sm:w-52 h-20 sm:h-24 bg-blue-600 rounded-t-full border-4 border-blue-900 flex items-center justify-center relative shadow-2xl">
                  {/* Gold Badge */}
                  <div className="w-12 h-12 rounded-full bg-amber-300 border-2 border-amber-600 flex items-center justify-center shadow-md">
                    <span className="text-xl">⭐</span>
                  </div>
                  {/* Red/White Indonesian flag ribbon */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-white to-red-600" />
                </div>
                {/* Visor */}
                <div className="w-48 sm:w-60 h-7 bg-slate-900 rounded-b-2xl border-2 border-slate-950 shadow-2xl -mt-1" />
              </div>
            )}

            {hatStyle === 'pilot' && (
              <div className="flex flex-col items-center drop-shadow-2xl">
                {/* Pilot Helmet */}
                <div className="w-44 sm:w-56 h-22 sm:h-26 bg-amber-400 rounded-t-full border-4 border-amber-600 flex items-center justify-center relative shadow-2xl">
                  <span className="text-2xl font-black text-slate-900">PILOT CILIK ✈</span>
                </div>
                <div className="w-40 sm:w-48 h-8 bg-sky-200/80 rounded-b-xl border-2 border-slate-700 shadow -mt-1" />
              </div>
            )}

            {hatStyle === 'sunglasses' && (
              <div className="mt-14 sm:mt-18 flex items-center justify-center gap-3 drop-shadow-2xl">
                {/* Cool sunglasses */}
                <div className="w-16 h-12 bg-slate-900 border-4 border-amber-400 rounded-b-3xl rounded-t-lg shadow-xl" />
                <div className="w-6 h-2 bg-amber-400 -mt-3 rounded" />
                <div className="w-16 h-12 bg-slate-900 border-4 border-amber-400 rounded-b-3xl rounded-t-lg shadow-xl" />
              </div>
            )}
          </div>
        )}

        {/* Sticker toggle button floating at top-right */}
        {showStickerControls && cameraActive && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
            <button
              onClick={cycleHat}
              className="px-3 py-1.5 bg-black/60 hover:bg-black/80 backdrop-blur-md text-amber-300 rounded-2xl text-xs font-bold border border-amber-400/50 shadow flex items-center gap-1.5 transition cursor-pointer"
              title="Ganti Topi / Aksesoris"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Topi: {hatStyle === 'police' ? 'Polisi' : hatStyle === 'pilot' ? 'Pilot' : hatStyle === 'sunglasses' ? 'Kacamata' : 'Polos'}
            </button>
          </div>
        )}

        {/* Subview Children (Cockpit, Road Signs, Steering wheel, Prompts) */}
        {children}
      </div>
    );
  }
);
