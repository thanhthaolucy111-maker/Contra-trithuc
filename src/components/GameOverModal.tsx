import React from 'react';
import { RotateCcw, BookOpen } from 'lucide-react';

interface GameOverModalProps {
  score: number;
  isOpen: boolean;
  onRestart: () => void;
  onReviewMistakes: () => void;
  mistakesCount: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  isOpen,
  onRestart,
  onReviewMistakes,
  mistakesCount
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#0f172a] border-2 border-rose-600 rounded-xl shadow-2xl p-6 text-center space-y-5">
        <div className="space-y-1">
          <h2 className="font-arcade text-2xl text-rose-500 tracking-wider animate-pulse">
            GAME OVER
          </h2>
          <p className="text-xs font-tech text-slate-400">
            Chiến dịch tạm dừng do hết sinh lực
          </p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-800 space-y-2">
          <div className="text-xs font-tech text-slate-400">ĐIỂM SỐ ĐẠT ĐƯỢC</div>
          <div className="font-arcade text-3xl text-amber-400 font-mono tabular-nums">
            {score.toLocaleString('vi-VN')}
          </div>
          {mistakesCount > 0 && (
            <div className="text-xs font-sans-custom text-rose-400 pt-1">
              Bạn có {mistakesCount} câu hỏi cần củng cố trong Sổ tay!
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-arcade text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-rose-950/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>TÁI XUẤT CHIẾN TRƯỜNG</span>
          </button>

          {mistakesCount > 0 && (
            <button
              onClick={onReviewMistakes}
              className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-tech text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-sky-400" />
              <span>Mở Sổ Tay Ôn Lại Câu Sai</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
