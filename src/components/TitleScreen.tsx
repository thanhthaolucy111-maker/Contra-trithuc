import React from 'react';
import { SubjectId, SUBJECTS, WeaponType, WEAPONS } from '../types/game';
import { Play, Sparkles, BookOpen, Shield, HelpCircle, Target } from 'lucide-react';
import { GAME_ASSETS } from '../assets/gameAssets';

interface TitleScreenProps {
  onStartCampaign: (subject?: SubjectId) => void;
  onOpenAiHub: () => void;
  onOpenPractice: () => void;
  selectedSubject?: SubjectId;
  onSelectSubject: (sub?: SubjectId) => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartCampaign,
  onOpenAiHub,
  onOpenPractice,
  selectedSubject,
  onSelectSubject
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-fade-in text-slate-100">
      {/* Title Hero Lockup */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 font-tech text-xs tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          Hệ Thống Ôn Thi Lớp 11 2D Retro Arcade
        </div>

        <h1 className="font-arcade text-3xl sm:text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-b from-rose-400 via-amber-300 to-rose-600 tracking-wider filter drop-shadow-[0_4px_12px_rgba(225,29,72,0.4)]">
          CONTRA: TRI THỨC 11
        </h1>

        <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto font-sans-custom leading-relaxed">
          Đánh bại đạo quân máy tính cơ giới hóa bằng sức mạnh tri thức Lớp 11! Giải mã nhanh các bài toán, tác phẩm văn học kinh điển, ngữ pháp tiếng Anh, định luật vật lí, địa lí thế giới và chiến tích lịch sử để nâng cấp hỏa lực hủy diệt!
        </p>
      </div>

      {/* Hero Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: 6 Subjects Arsenal */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-tech font-bold text-sm">
            <BookOpen className="w-4 h-4" />
            <span>KHO TRI THỨC 6 MÔN 11</span>
          </div>
          <p className="text-xs text-slate-400 font-sans-custom leading-relaxed">
            Ngân hàng câu hỏi chuẩn SGK bao gồm: <strong className="text-slate-200">Toán học</strong> (Lượng giác, Đạo hàm), <strong className="text-slate-200">Ngữ văn</strong> (Chí Phèo, Vội vàng), <strong className="text-slate-200">Tiếng Anh</strong>, <strong className="text-slate-200">Vật lí</strong> (Dao động, Sóng), <strong className="text-slate-200">Địa lí</strong> & <strong className="text-slate-200">Lịch sử</strong>.
          </p>
        </div>

        {/* Card 2: Contra Weapons */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-tech font-bold text-sm">
            <Target className="w-4 h-4" />
            <span>KHO VŨ KHÍ ARCADE</span>
          </div>
          <p className="text-xs text-slate-400 font-sans-custom leading-relaxed">
            Bắn trúng các con tàu tiếp tế và trả lời đúng câu hỏi để sở hữu: <strong className="text-rose-400">Súng Đạn Chùm S</strong>, <strong className="text-sky-400">Tia Laser L</strong>, <strong className="text-amber-400">Cầu Lửa F</strong> và Lá chắn năng lượng!
          </p>
        </div>

        {/* Card 3: AI Personalization */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-tech font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>CÁ NHÂN HÓA BẰNG AI</span>
          </div>
          <p className="text-xs text-slate-400 font-sans-custom leading-relaxed">
            Tự do yêu cầu AI tạo bộ câu hỏi tập trung vào đúng bài học bạn đang muốn ôn tập, phân tích lỗi sai và nhận điện đàm chiến lược từ Tổng chỉ huy!
          </p>
        </div>
      </div>

      {/* Campaign Mode Subject Selection */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="font-tech font-bold text-sm text-slate-200 uppercase tracking-wide">
          Chọn Chuyên Đề Tác Chiến:
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
          <button
            onClick={() => onSelectSubject(undefined)}
            className={`p-3 rounded-lg border text-xs font-tech font-semibold transition-all cursor-pointer ${
              !selectedSubject
                ? 'bg-rose-500/20 text-rose-300 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <div className="text-base mb-1">⚡</div>
            <div>Toàn Diện 6 Môn</div>
          </button>

          {Object.values(SUBJECTS).map(s => (
            <button
              key={s.id}
              onClick={() => onSelectSubject(s.id)}
              className={`p-3 rounded-lg border text-xs font-tech font-semibold transition-all cursor-pointer ${
                selectedSubject === s.id
                  ? 'border-sky-400 text-sky-200 shadow-md ring-1 ring-sky-400/50'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
              style={selectedSubject === s.id ? { backgroundColor: s.badgeBg, borderColor: s.color } : {}}
            >
              <div className="text-base mb-1">{s.icon}</div>
              <div>{s.shortName}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Start CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={() => onStartCampaign(selectedSubject)}
          className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 active:from-rose-700 active:to-rose-800 text-white font-arcade text-sm tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-rose-950/70 border border-rose-400/50 transition-all hover:scale-105 cursor-pointer"
        >
          <Play className="w-5 h-5" />
          <span>BẮT ĐẦU CHIẾN DỊCH (PLAY)</span>
        </button>

        <button
          onClick={onOpenAiHub}
          className="w-full sm:w-auto px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-amber-300 font-tech text-sm font-bold flex items-center justify-center gap-2.5 border border-amber-500/40 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Tạo Đề Cá Nhân Hóa Với AI</span>
        </button>
      </div>

      {/* Control Instruction Guide */}
      <div className="border-t border-slate-800 pt-6 text-center text-xs font-tech text-slate-400 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">A / D</kbd> hoặc <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">← →</kbd> Di chuyển</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">W / ↑</kbd> Ngắm lên</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">S / ↓</kbd> Cúi xuống</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">K / Space</kbd> Nhảy</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">J / F</kbd> Bắn</span>
          <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 font-mono text-slate-200">L / Q</kbd> Đổi súng</span>
        </div>
        <p className="text-slate-500 text-[11px]">Hỗ trợ hoàn hảo tay cầm ảo trên màn hình cảm ứng cho điện thoại và máy tính bảng!</p>
      </div>
    </div>
  );
};
