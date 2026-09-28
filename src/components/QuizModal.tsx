import React, { useState } from 'react';
import { Question, SUBJECTS, WeaponType, WEAPONS } from '../types/game';
import { soundManager } from '../utils/audio';
import { CheckCircle2, XCircle, Lightbulb, Sparkles, Shield, Zap, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  question: Question;
  isOpen: boolean;
  onAnswer: (isCorrect: boolean, selectedOption: number) => void;
  onClose: () => void;
  bonusWeapon?: WeaponType;
  isBossBreach?: boolean;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  isOpen,
  onAnswer,
  onClose,
  bonusWeapon = 'SPREAD',
  isBossBreach = false
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [aiDetail, setAiDetail] = useState<{ detailedExplanation: string; mnemonicTip: string; relatedConcept: string } | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  if (!isOpen) return null;

  const subjectMeta = SUBJECTS[question.subject] || SUBJECTS.toan;
  const rewardWeaponInfo = WEAPONS[bonusWeapon];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const correct = idx === question.correctIndex;
    if (correct) {
      soundManager.playCorrect();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } else {
      soundManager.playWrong();
    }
    onAnswer(correct, idx);
  };

  const fetchAiExplanation = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, userOptionIndex: selectedIdx })
      });
      const data = await res.json();
      if (data.success) {
        setAiDetail(data);
      }
    } catch {
      // Fallback
      setAiDetail({
        detailedExplanation: question.explanation,
        mnemonicTip: question.hint,
        relatedConcept: `Trọng tâm chương trình ${subjectMeta.name}: ${question.topic}`
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-[#0f172a] border-2 border-slate-700 rounded-xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Terminal Header */}
        <div className="px-6 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl" role="img" aria-label="subject icon">{subjectMeta.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider font-tech" style={{ color: subjectMeta.color }}>
                  {subjectMeta.name}
                </span>
                <span className="text-slate-500 text-xs">/</span>
                <span className="text-xs font-tech text-slate-400">{question.topic}</span>
              </div>
              <h3 className="font-arcade text-xs text-rose-400 tracking-wide mt-0.5">
                {isBossBreach ? '⚡ BẺ KHÓA LÁ CHẮN TRÙM CUỐI' : '⚔️ TIÊU DIỆT KẺ ĐỊCH! BẺ KHÓA TRI THỨC NÂNG CẤP SÚNG'}
              </h3>
            </div>
          </div>

          {/* Reward Preview */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-tech">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Phần thưởng:</span>
            <span className="font-bold text-amber-400">{rewardWeaponInfo.name} + Khiên</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Question Text */}
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
            <p className="text-base md:text-lg font-medium leading-relaxed text-slate-100 font-sans-custom">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2.5">
            {question.options.map((opt, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isSelected = selectedIdx === idx;
              const isCorrect = idx === question.correctIndex;

              let btnStyle = 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-200';
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-2 ring-emerald-500/50';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200 ring-2 ring-rose-500/50';
                } else {
                  btnStyle = 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 text-sm md:text-base font-sans-custom ${btnStyle} ${
                    !isAnswered ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'
                  }`}
                >
                  <span className={`w-7 h-7 rounded flex items-center justify-center font-tech font-bold text-xs shrink-0 ${
                    isAnswered && isCorrect ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {letter}
                  </span>
                  <span className="flex-1 pt-0.5">{opt}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Hint Trigger before answering */}
          {!isAnswered && (
            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-tech font-medium transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>{showHint ? 'Ẩn gợi ý chiến thuật' : 'Hiện gợi ý chiến thuật'}</span>
              </button>
              <span className="font-tech text-slate-500">Mức độ: {question.difficulty === 'hard' ? 'Vận dụng cao' : question.difficulty === 'medium' ? 'Vận dụng' : 'Cơ bản'}</span>
            </div>
          )}

          {showHint && !isAnswered && (
            <div className="p-3 bg-amber-950/30 border border-amber-800/60 rounded text-xs text-amber-200/90 font-sans-custom">
              <span className="font-bold">Gợi ý từ SGK 11: </span>
              {question.hint}
            </div>
          )}

          {/* After Answer: Explanation & Reward Notification */}
          {isAnswered && (
            <div className="space-y-3 pt-2">
              <div className={`p-4 rounded-lg border ${
                selectedIdx === question.correctIndex 
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-100'
                  : 'bg-rose-950/40 border-rose-800 text-rose-100'
              }`}>
                <div className="flex items-center gap-2 mb-1.5">
                  {selectedIdx === question.correctIndex ? (
                    <>
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <h4 className="font-arcade text-xs text-emerald-400">CHÍNH XÁC! KÍCH HOẠT VŨ KHÍ MỚI</h4>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-rose-400" />
                      <h4 className="font-arcade text-xs text-rose-400">CHƯA CHÍNH XÁC! ĐÃ LƯU VÀO SỔ TAY</h4>
                    </>
                  )}
                </div>
                <p className="text-xs md:text-sm text-slate-300 font-sans-custom leading-relaxed">
                  <span className="font-semibold text-slate-200">Giải thích: </span>
                  {question.explanation}
                </p>
              </div>

              {/* AI Deep Explanation toggle */}
              {!aiDetail ? (
                <button
                  onClick={fetchAiExplanation}
                  disabled={isLoadingAi}
                  className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-tech text-amber-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isLoadingAi ? 'AI đang phân tích kiến thức SGK 11...' : 'Hỏi AI: Phân tích sâu & Mẹo nhớ nhanh'}</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-lg bg-slate-900 border border-amber-900/60 text-xs space-y-2 text-slate-300">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold font-tech">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MẸO GHI NHỚ TỪ CHUYÊN GIA AI:</span>
                  </div>
                  <p className="italic text-amber-200/90">{aiDetail.mnemonicTip}</p>
                  <p className="text-slate-300">{aiDetail.detailedExplanation}</p>
                  <div className="text-[11px] text-slate-400">
                    <span className="font-medium text-slate-300">Ôn tập thêm: </span>
                    {aiDetail.relatedConcept}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-tech">
            {isAnswered && (
              <span className="text-emerald-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Khiên bảo vệ sẵn sàng
              </span>
            )}
          </div>

          {isAnswered && (
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-arcade text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-rose-900/40 transition-colors"
            >
              <span>QUAY LẠI CHIẾN ĐẤU</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
