import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Award, RotateCcw, CheckCircle2, XCircle, Sparkles, HelpCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/trafficData';
import { sounds } from '../utils/audio';

interface Props {
  onOpenSim?: () => void;
}

export const SignQuiz: React.FC<Props> = ({ onOpenSim }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);

  const question = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const option = question.options[idx];
    if (option.isCorrect) {
      setScore((s) => s + 10);
      sounds.playSuccess();
      sounds.speak(`Hebat! Benar sekali. ${option.explanation}`);
    } else {
      sounds.playWarning();
      sounds.speak(`Oops, kurang tepat. ${option.explanation}`);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsFinished(true);
    sounds.playVictory();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
    });
    sounds.speak(`Selamat! Kamu menyelesaikan kuis dengan nilai ${score + (selectedOption !== null && question.options[selectedOption].isCorrect ? 10 : 0)}!`);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setShowHint(false);
  };

  const readQuestion = () => {
    sounds.speak(`Pertanyaan nomor ${currentIdx + 1}: ${question.question}`);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Sleek Header */}
      <div className="w-full flex items-center justify-between mb-2.5 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎯</span>
          <h2 className="font-black text-sm sm:text-base text-slate-800">
            Kuis Rambu Lalu Lintas Kelas 2 SD
          </h2>
        </div>

        <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-xl font-black text-xs border border-amber-300">
          Skor: {score} Poin
        </div>
      </div>

      {!isFinished ? (
        <div className="w-full bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-xl flex flex-col">
          {/* Progress Tracker */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
            <span>Soal {currentIdx + 1} dari {QUIZ_QUESTIONS.length}</span>
            <span>{Math.round(((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100)}% Selesai</span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 border border-slate-200">
            <div
              className="h-full bg-amber-400 transition-all duration-300 rounded-full"
              style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="flex items-start justify-between gap-3 mb-6 bg-amber-50 p-4 rounded-2xl border-2 border-amber-200">
            <div className="flex-1">
              <span className="text-[11px] font-black uppercase text-amber-700 bg-amber-200 px-2 py-0.5 rounded-full inline-block mb-1.5">
                Pertanyaan #{currentIdx + 1}
              </span>
              <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                {question.question}
              </h3>
            </div>

            <button
              onClick={readQuestion}
              className="p-2.5 rounded-2xl bg-white hover:bg-amber-100 text-amber-800 shadow transition cursor-pointer shrink-0"
              title="Dengarkan Soal"
            >
              <Volume2 className="w-5 h-5 text-amber-700" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnClass = 'bg-white hover:bg-amber-50/70 border-slate-200 text-slate-800';

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-400';
                } else if (isSelected && !opt.isCorrect) {
                  btnClass = 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-400';
                } else {
                  btnClass = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border-2 font-bold text-left transition flex items-center justify-between cursor-pointer ${btnClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center font-black text-sm text-slate-700">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-sm font-extrabold">{opt.text}</span>
                  </div>

                  {isAnswered && opt.isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  )}
                  {isAnswered && isSelected && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && selectedOption !== null && (
            <div
              className={`p-4 rounded-2xl border-2 mb-6 text-xs font-semibold ${
                question.options[selectedOption].isCorrect
                  ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                  : 'bg-rose-100/70 border-rose-300 text-rose-950'
              }`}
            >
              <span className="font-extrabold block mb-1">
                {question.options[selectedOption].isCorrect ? '🎉 Penjelasan:' : '💡 Penjelasan:'}
              </span>
              {question.options[selectedOption].explanation}
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-4 h-4 text-amber-600" />
              {showHint ? 'Tutup Petunjuk' : 'Lihat Petunjuk'}
            </button>

            {isAnswered && (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-sm rounded-xl shadow-lg transition active:scale-95 cursor-pointer"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Soal Berikutnya ➔' : 'Lihat Hasil Akhir 🏆'}
              </button>
            )}
          </div>

          {showHint && (
            <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 font-medium animate-fadeIn">
              💡 <strong>Petunjuk:</strong> {question.hint}
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Result Screen */
        <div className="w-full bg-white rounded-3xl p-8 border-4 border-amber-300 shadow-xl flex flex-col items-center text-center">
          <div className="w-24 h-24 rounded-full bg-amber-400 flex items-center justify-center text-5xl shadow-xl mb-3 animate-bounce">
            🌟
          </div>
          <h3 className="text-2xl font-black text-slate-900">Kuis Selesai! Luar Biasa!</h3>
          <p className="text-slate-600 text-sm mt-1 max-w-md">
            Kamu sudah belajar dengan giat dan mengenal aturan rambu lalu lintas untuk siswa kelas 2 SD.
          </p>

          <div className="my-6 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 flex items-center gap-6">
            <div>
              <span className="text-xs text-slate-500 font-bold block">Skor Kamu:</span>
              <span className="text-3xl font-black text-amber-600">{score} / 80</span>
            </div>
            <div className="h-10 w-px bg-amber-200" />
            <div>
              <span className="text-xs text-slate-500 font-bold block">Predikat:</span>
              <span className="text-base font-black text-emerald-600">
                {score >= 70
                  ? '🏅 Pelopor Tertib Juara'
                  : score >= 50
                  ? '⭐ Sahabat Lalu Lintas'
                  : '👍 Siswa Belajar Hebat'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRestart}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              Coba Kuis Lagi
            </button>

            {onOpenSim && (
              <button
                onClick={onOpenSim}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-900 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                Buat Kartu SIM Cilik Saya! 🪪
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
