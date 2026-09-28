import React from 'react';
import { Volume2, VolumeX, Shield, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface TopBarProps {
  currentTab: 'game' | 'practice' | 'ai_hub' | 'mistakes' | 'stats';
  onSelectTab: (tab: 'game' | 'practice' | 'ai_hub' | 'mistakes' | 'stats') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentTab,
  onSelectTab,
  isMuted,
  onToggleMute,
  scanlinesEnabled,
  onToggleScanlines
}) => {
  return (
    <header className="w-full bg-[#0a0f1d]/95 backdrop-blur border-b border-slate-800/80 px-4 md:px-8 py-3 flex items-center justify-between z-30 sticky top-0">
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-2.5">
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); onSelectTab('game'); }}
          className="font-arcade text-xs md:text-sm tracking-wider text-rose-500 hover:text-rose-400 transition-colors flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-rose-500 animate-pulse rounded-xs inline-block"></span>
          CONTRA 11: TRI THỨC
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs md:text-sm font-tech">
        <button
          onClick={() => onSelectTab('game')}
          className={`transition-colors font-medium whitespace-nowrap ${
            currentTab === 'game' ? 'text-rose-400 underline underline-offset-8 decoration-2' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Chiến Dịch Arcade
        </button>

        <button
          onClick={() => onSelectTab('practice')}
          className={`transition-colors font-medium whitespace-nowrap ${
            currentTab === 'practice' ? 'text-sky-400 underline underline-offset-8 decoration-2' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Luyện Tập 6 Môn
        </button>

        <button
          onClick={() => onSelectTab('ai_hub')}
          className={`transition-colors font-medium whitespace-nowrap flex items-center gap-1.5 ${
            currentTab === 'ai_hub' ? 'text-amber-400 underline underline-offset-8 decoration-2' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          AI Huấn Luyện
        </button>

        <button
          onClick={() => onSelectTab('mistakes')}
          className={`transition-colors font-medium whitespace-nowrap ${
            currentTab === 'mistakes' ? 'text-rose-400 underline underline-offset-8 decoration-2' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Sổ Tay Khắc Phục
        </button>

        <button
          onClick={() => onSelectTab('stats')}
          className={`transition-colors font-medium whitespace-nowrap ${
            currentTab === 'stats' ? 'text-emerald-400 underline underline-offset-8 decoration-2' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hồ Sơ Năng Lực
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleScanlines}
          title={scanlinesEnabled ? 'Tắt hiệu ứng quét CRT' : 'Bật hiệu ứng quét CRT retro'}
          className={`px-2.5 py-1.5 rounded text-xs font-tech font-semibold transition-colors flex items-center gap-1 border ${
            scanlinesEnabled 
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/40' 
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">CRT SCAN</span>
        </button>

        <button
          onClick={onToggleMute}
          title={isMuted ? 'Bật âm thanh 8-bit' : 'Tắt âm thanh'}
          className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          aria-label={isMuted ? 'Bật âm thanh' : 'Tắt âm thanh'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
        </button>
      </div>
    </header>
  );
};
