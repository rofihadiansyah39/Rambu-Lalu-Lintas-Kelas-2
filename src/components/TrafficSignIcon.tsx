import React from 'react';
import { TrafficSign } from '../types/traffic';

interface Props {
  sign: TrafficSign;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPole?: boolean;
  className?: string;
}

export const TrafficSignIcon: React.FC<Props> = ({
  sign,
  size = 'md',
  showPole = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const renderSignSymbol = () => {
    switch (sign.iconType) {
      // --- TRAFFIC LIGHTS ---
      case 'traffic-light-red':
      case 'traffic-light-yellow':
      case 'traffic-light-green':
        return (
          <div className="w-full h-full bg-slate-900 border-2 border-slate-700 rounded-2xl flex flex-col items-center justify-around p-1 shadow-lg relative">
            {/* Red Light */}
            <div
              className={`w-4/5 h-1/4 rounded-full border border-slate-950 transition-all ${
                sign.iconType === 'traffic-light-red'
                  ? 'bg-red-500 shadow-[0_0_15px_#ef4444] animate-pulse'
                  : 'bg-red-950/70 opacity-40'
              }`}
            />
            {/* Yellow Light */}
            <div
              className={`w-4/5 h-1/4 rounded-full border border-slate-950 transition-all ${
                sign.iconType === 'traffic-light-yellow'
                  ? 'bg-amber-400 shadow-[0_0_15px_#facc15] animate-pulse'
                  : 'bg-amber-950/70 opacity-40'
              }`}
            />
            {/* Green Light */}
            <div
              className={`w-4/5 h-1/4 rounded-full border border-slate-950 transition-all ${
                sign.iconType === 'traffic-light-green'
                  ? 'bg-emerald-500 shadow-[0_0_15px_#22c55e] animate-pulse'
                  : 'bg-emerald-950/70 opacity-40'
              }`}
            />
          </div>
        );

      // --- PERINGATAN (Diamond / Wajik) ---
      case 'curve-left':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            <polygon points="50,11 89,50 50,89 11,50" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
            {/* Turn Left Arrow */}
            <path
              d="M60,70 L60,48 Q60,35 48,35 L38,35 M38,35 L47,26 M38,35 L47,44"
              fill="none"
              stroke="#0f172a"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'curve-right':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            <polygon points="50,11 89,50 50,89 11,50" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
            {/* Turn Right Arrow */}
            <path
              d="M40,70 L40,48 Q40,35 52,35 L62,35 M62,35 L53,26 M62,35 L53,44"
              fill="none"
              stroke="#0f172a"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'slippery-road':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            <polygon points="50,11 89,50 50,89 11,50" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
            {/* Car icon */}
            <rect x="42" y="32" width="16" height="20" rx="3" fill="#0f172a" />
            <rect x="38" y="35" width="4" height="6" rx="1" fill="#0f172a" />
            <rect x="58" y="35" width="4" height="6" rx="1" fill="#0f172a" />
            <rect x="38" y="44" width="4" height="6" rx="1" fill="#0f172a" />
            <rect x="58" y="44" width="4" height="6" rx="1" fill="#0f172a" />
            {/* Skid marks */}
            <path
              d="M40,56 Q35,62 44,68 Q52,74 46,80 M58,56 Q63,62 54,68 Q46,74 52,80"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'children-crossing':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            <polygon points="50,11 89,50 50,89 11,50" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
            {/* Big child */}
            <circle cx="43" cy="34" r="5" fill="#0f172a" />
            <path d="M43,40 L43,58 M43,47 L33,52 M43,47 L53,49 M43,58 L36,73 M43,58 L48,73" stroke="#0f172a" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Small child holding hand */}
            <circle cx="61" cy="42" r="4" fill="#0f172a" />
            <path d="M61,47 L61,61 M61,52 L53,49 M61,52 L68,55 M61,61 L57,72 M61,61 L65,72" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );

      case 'steep-down':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            {/* Down slope */}
            <polygon points="26,72 74,72 74,48" fill="#0f172a" />
            {/* Car on slope */}
            <g transform="translate(46,45) rotate(22)">
              <rect x="-10" y="-8" width="20" height="10" rx="2" fill="#0f172a" />
              <circle cx="-6" cy="3" r="2.5" fill="#facc15" />
              <circle cx="6" cy="3" r="2.5" fill="#facc15" />
            </g>
          </svg>
        );

      // --- LARANGAN (Lingkaran Merah) ---
      case 'no-entry':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="44" fill="#ef4444" stroke="#b91c1c" strokeWidth="3" />
            <rect x="18" y="42" width="64" height="16" rx="3" fill="#ffffff" />
          </svg>
        );

      case 'no-stopping':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#dc2626" strokeWidth="9" />
            <text x="50" y="67" textAnchor="middle" fontSize="48" fontWeight="900" fontFamily="sans-serif" fill="#0f172a">
              S
            </text>
            <line x1="22" y1="22" x2="78" y2="78" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />
          </svg>
        );

      case 'no-parking':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#dc2626" strokeWidth="9" />
            <text x="50" y="67" textAnchor="middle" fontSize="48" fontWeight="900" fontFamily="sans-serif" fill="#0f172a">
              P
            </text>
            <line x1="22" y1="22" x2="78" y2="78" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />
          </svg>
        );

      case 'no-u-turn':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#dc2626" strokeWidth="9" />
            <path
              d="M38,68 L38,44 Q38,28 50,28 Q62,28 62,44 L62,60 M62,60 L54,52 M62,60 L70,52"
              fill="none"
              stroke="#0f172a"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <line x1="22" y1="22" x2="78" y2="78" stroke="#dc2626" strokeWidth="9" strokeLinecap="round" />
          </svg>
        );

      case 'speed-limit-30':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#ffffff" stroke="#dc2626" strokeWidth="9" />
            <text x="50" y="64" textAnchor="middle" fontSize="40" fontWeight="900" fontFamily="sans-serif" fill="#0f172a">
              30
            </text>
          </svg>
        );

      // --- PERINTAH (Biru Lingkaran) ---
      case 'turn-right-mandatory':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
            <path
              d="M38,68 L38,50 Q38,36 50,36 L66,36 M66,36 L55,25 M66,36 L55,47"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'turn-left-mandatory':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
            <path
              d="M62,68 L62,50 Q62,36 50,36 L34,36 M34,36 L45,25 M34,36 L45,47"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'straight-mandatory':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
            <path
              d="M50,72 L50,28 M50,28 L37,42 M50,28 L63,42"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'bicycle-lane':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#ffffff" strokeWidth="3" />
            {/* Bicycle */}
            <circle cx="34" cy="58" r="11" fill="none" stroke="#ffffff" strokeWidth="4.5" />
            <circle cx="66" cy="58" r="11" fill="none" stroke="#ffffff" strokeWidth="4.5" />
            <path
              d="M34,58 L46,42 L58,58 L34,58 M46,42 L42,34 M66,58 L54,38 L60,34"
              fill="none"
              stroke="#ffffff"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      // --- PETUNJUK (Persegi Panjang Biru / Hijau) ---
      case 'pedestrian-crossing':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="8" y="8" width="84" height="84" rx="10" fill="#1d4ed8" stroke="#ffffff" strokeWidth="3" />
            {/* White Triangle */}
            <polygon points="50,16 84,78 16,78" fill="#ffffff" />
            {/* Walking human on zebra */}
            <circle cx="48" cy="34" r="4.5" fill="#0f172a" />
            <path d="M48,39 L46,55 M46,45 L38,50 M46,45 L55,47 M46,55 L38,70 M46,55 L53,70" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
            {/* Zebra Stripes */}
            <line x1="28" y1="73" x2="35" y2="73" stroke="#1d4ed8" strokeWidth="3" />
            <line x1="42" y1="73" x2="49" y2="73" stroke="#1d4ed8" strokeWidth="3" />
            <line x1="56" y1="73" x2="63" y2="73" stroke="#1d4ed8" strokeWidth="3" />
          </svg>
        );

      case 'hospital':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="8" y="8" width="84" height="84" rx="10" fill="#1d4ed8" stroke="#ffffff" strokeWidth="3" />
            <rect x="18" y="18" width="64" height="64" rx="8" fill="#ffffff" />
            {/* Red Cross and H */}
            <text x="50" y="65" textAnchor="middle" fontSize="46" fontWeight="900" fontFamily="sans-serif" fill="#dc2626">
              H
            </text>
          </svg>
        );

      case 'gas-station':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="8" y="8" width="84" height="84" rx="10" fill="#1d4ed8" stroke="#ffffff" strokeWidth="3" />
            <rect x="24" y="24" width="30" height="52" rx="4" fill="#ffffff" />
            <rect x="30" y="32" width="18" height="16" rx="2" fill="#1d4ed8" />
            <path d="M54,34 Q66,34 66,48 L66,66 L70,66" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'direction-board':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="6" y="18" width="88" height="64" rx="8" fill="#15803d" stroke="#ffffff" strokeWidth="3" />
            <text x="50" y="44" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#ffffff">
              SEKOLAH ➔
            </text>
            <text x="50" y="66" textAnchor="middle" fontSize="14" fill="#e2e8f0">
              KOTA 5 km
            </text>
          </svg>
        );

      case 'winding-road':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <polygon points="50,5 95,50 50,95 5,50" fill="#facc15" stroke="#0f172a" strokeWidth="6" strokeLinejoin="round" />
            <polygon points="50,11 89,50 50,89 11,50" fill="none" stroke="#0f172a" strokeWidth="2" strokeLinejoin="round" />
            {/* Winding road S curve */}
            <path
              d="M50,75 C30,68 30,55 50,50 C70,45 70,32 50,25 M50,25 L42,32 M50,25 L58,32"
              fill="none"
              stroke="#0f172a"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      case 'bus-terminal':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <rect x="8" y="8" width="84" height="84" rx="10" fill="#1d4ed8" stroke="#ffffff" strokeWidth="3" />
            {/* Bus symbol */}
            <rect x="22" y="24" width="56" height="42" rx="7" fill="#ffffff" />
            <rect x="28" y="32" width="18" height="14" rx="2" fill="#1d4ed8" />
            <rect x="54" y="32" width="18" height="14" rx="2" fill="#1d4ed8" />
            <circle cx="34" cy="58" r="4.5" fill="#0f172a" />
            <circle cx="66" cy="58" r="4.5" fill="#0f172a" />
            <text x="50" y="78" textAnchor="middle" fontSize="10" fontWeight="900" fill="#facc15">
              TERMINAL FINISH
            </text>
          </svg>
        );

      default:
        return (
          <div className="w-full h-full rounded-2xl bg-amber-400 flex items-center justify-center font-bold text-2xl border-4 border-slate-900 shadow">
            {sign.symbol}
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <div className={`relative ${sizeMap[size]}`}>{renderSignSymbol()}</div>
      {showPole && (
        <div className="w-2.5 h-16 bg-gradient-to-r from-slate-400 via-slate-200 to-slate-400 -mt-1 shadow-md border-x border-slate-500 rounded-b" />
      )}
    </div>
  );
};
