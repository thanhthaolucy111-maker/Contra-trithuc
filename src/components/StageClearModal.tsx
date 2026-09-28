import React, { useEffect } from 'react';
import { Award, ArrowRight, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';

interface StageClearModalProps {
  score: number;
  isOpen: boolean;
  onNextStage: () => void;
  onReviewStats: () => void;
}

export const StageClearModal: React.FC<StageClearModalProps> = ({
  score,
  isOpen,
  onNextStage,
  onReviewStats
}) => {
  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0f172a] border-2 border-emerald-500 rounded-xl shadow-2xl p-6 text-center space-y-5">
        <div className="space-y-1">
          <Award className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
          <h2 className="font-arcade text-xl text-emerald-400 tracking-wider">
            STAGE CLEAR!
          </h2>
          <p className="text-xs font-tech text-slate-300">
            Trùm Biomechanical Core đã bị tiêu diệt hoàn toàn!
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="text-xs font-tech text-slate-400">TỔNG ĐIỂM CHIẾN DỊCH</div>
          <div className="font-arcade text-3xl text-amber-400 font-mono tabular-nums">
            {score.toLocaleString('vi-VN')}
          </div>
          <p className="text-xs font-sans-custom text-emerald-300">
            Bạn đã xuất sắc làm chủ các kiến thức Lớp 11 trên mặt trận Contra!
          </p>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onNextStage}
            className="w-full py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-arcade text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-colors cursor-pointer"
          >
            <span>TIẾP TỤC ĐỢT TÁC CHIẾN MỚI</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onReviewStats}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-tech text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Xem Báo Cáo Năng Lực Học Tập</span>
          </button>
        </div>
      </div>
    </div>
  );
};
