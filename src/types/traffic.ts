export type SignCategory = 'lampu' | 'peringatan' | 'larangan' | 'perintah' | 'petunjuk';

export interface TrafficSign {
  id: string;
  name: string;
  category: SignCategory;
  shape: 'wajik' | 'lingkaran' | 'persegi' | 'persegi-panjang' | 'lampu';
  bgColor: string;
  borderColor: string;
  symbol: string;
  meaning: string;
  actionAdvice: string;
  realWorldExample: string;
  iconType: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  signId?: string;
  signCategory?: SignCategory;
  signName?: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  hint: string;
}

export type MotionDirection = 'left' | 'right' | 'center' | 'stop' | 'none';

export interface MotionData {
  direction: MotionDirection;
  horizontalOffset: number; // -1 (left) to 1 (right)
  motionIntensity: number;   // 0 to 1
  isStopGesture: boolean;
  isHeadLeft: boolean;
  isHeadRight: boolean;
}

export interface DrivingScenario {
  id: string;
  title: string;
  description: string;
  vehicle: 'mobil' | 'bus' | 'polisi' | 'sepeda';
  targetSigns: {
    sign: TrafficSign;
    distance: number; // normalized position on road
    requiredAction: 'steer-left' | 'steer-right' | 'brake' | 'drive' | 'slow-down';
    prompt: string;
  }[];
}
