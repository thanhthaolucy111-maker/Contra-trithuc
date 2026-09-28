import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target, Repeat, Play, Pause } from 'lucide-react';

interface ArcadeControlsProps {
  onDirectionDown: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onDirectionUp: (dir: 'up' | 'down' | 'left' | 'right') => void;
  onJumpStart: () => void;
  onJumpEnd: () => void;
  onShootStart: () => void;
  onShootEnd: () => void;
  onSwitchWeapon: () => void;
  onTogglePause: () => void;
  isPaused: boolean;
}

export const ArcadeControls: React.FC<ArcadeControlsProps> = ({
  onDirectionDown,
  onDirectionUp,
  onJumpStart,
  onJumpEnd,
  onShootStart,
  onShootEnd,
  onSwitchWeapon,
  onTogglePause,
  isPaused
}) => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2 select-none">
      {/* Mobile/Touch Arcade Pad */}
      <div className="flex items-center justify-between gap-4">
        {/* D-PAD Left */}
        <div className="relative w-36 h-36 bg-slate-900/90 rounded-full border border-slate-700/80 p-2 shadow-inner flex items-center justify-center">
          {/* UP */}
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionDown('up'); }}
            onTouchEnd={(e) => { e.preventDefault(); onDirectionUp('up'); }}
            onMouseDown={() => onDirectionDown('up')}
            onMouseUp={() => onDirectionUp('up')}
            className="absolute top-1 left-12 w-12 h-11 bg-slate-800 active:bg-rose-600 rounded-t border-t border-x border-slate-600 flex items-center justify-center text-slate-300 active:text-white"
            aria-label="Aim Up"
          >
            <ArrowUp className="w-5 h-5" />
          </button>

          {/* DOWN */}
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionDown('down'); }}
            onTouchEnd={(e) => { e.preventDefault(); onDirectionUp('down'); }}
            onMouseDown={() => onDirectionDown('down')}
            onMouseUp={() => onDirectionUp('down')}
            className="absolute bottom-1 left-12 w-12 h-11 bg-slate-800 active:bg-rose-600 rounded-b border-b border-x border-slate-600 flex items-center justify-center text-slate-300 active:text-white"
            aria-label="Crouch / Aim Down"
          >
            <ArrowDown className="w-5 h-5" />
          </button>

          {/* LEFT */}
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionDown('left'); }}
            onTouchEnd={(e) => { e.preventDefault(); onDirectionUp('left'); }}
            onMouseDown={() => onDirectionDown('left')}
            onMouseUp={() => onDirectionUp('left')}
            className="absolute left-1 top-12 w-11 h-12 bg-slate-800 active:bg-rose-600 rounded-l border-l border-y border-slate-600 flex items-center justify-center text-slate-300 active:text-white"
            aria-label="Move Left"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* RIGHT */}
          <button
            onTouchStart={(e) => { e.preventDefault(); onDirectionDown('right'); }}
            onTouchEnd={(e) => { e.preventDefault(); onDirectionUp('right'); }}
            onMouseDown={() => onDirectionDown('right')}
            onMouseUp={() => onDirectionUp('right')}
            className="absolute right-1 top-12 w-11 h-12 bg-slate-800 active:bg-rose-600 rounded-r border-r border-y border-slate-600 flex items-center justify-center text-slate-300 active:text-white"
            aria-label="Move Right"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Center Hub */}
          <div className="w-10 h-10 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center text-[10px] font-arcade text-slate-600">
            +
          </div>
        </div>

        {/* Center Utility Buttons (Desktop / Mobile) */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={onTogglePause}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-xs font-arcade text-amber-400 border border-slate-700 flex items-center gap-1.5 shadow"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'TIẾP TỤC' : 'TẠM DỪNG'}</span>
            </button>

            <button
              onClick={onSwitchWeapon}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 active:bg-sky-600 text-xs font-arcade text-sky-400 border border-slate-700 flex items-center gap-1.5 shadow"
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>ĐỔI SÚNG (L)</span>
            </button>
          </div>

          {/* Desktop Keyboard Cheatsheet */}
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-tech text-slate-400">
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">A / D / ← →</span> Di chuyển
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">W / ↑</span> Ngắm lên
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">S / ↓</span> Cúi
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">K / Space</span> Nhảy
            <span className="bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">J / F</span> Bắn
          </div>
        </div>

        {/* Action Buttons Right (B: Jump, A: Shoot) */}
        <div className="flex items-center gap-4">
          {/* JUMP BUTTON (B) */}
          <div className="flex flex-col items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); onJumpStart(); }}
              onTouchEnd={(e) => { e.preventDefault(); onJumpEnd(); }}
              onMouseDown={onJumpStart}
              onMouseUp={onJumpEnd}
              className="w-16 h-16 rounded-full bg-gradient-to-b from-sky-500 to-sky-700 active:from-sky-400 active:to-sky-600 text-white font-arcade text-lg font-bold shadow-lg shadow-sky-950/50 flex flex-col items-center justify-center border-2 border-sky-400 active:scale-95 transition-transform"
              aria-label="Jump (B Button)"
            >
              <Zap className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">NHẢY [B]</span>
            </button>
          </div>

          {/* SHOOT BUTTON (A) */}
          <div className="flex flex-col items-center">
            <button
              onTouchStart={(e) => { e.preventDefault(); onShootStart(); }}
              onTouchEnd={(e) => { e.preventDefault(); onShootEnd(); }}
              onMouseDown={onShootStart}
              onMouseUp={onShootEnd}
              className="w-18 h-18 rounded-full bg-gradient-to-b from-rose-500 to-rose-700 active:from-rose-400 active:to-rose-600 text-white font-arcade text-lg font-bold shadow-lg shadow-rose-950/60 flex flex-col items-center justify-center border-2 border-rose-400 active:scale-95 transition-transform"
              aria-label="Shoot (A Button)"
            >
              <Target className="w-6 h-6 mb-0.5 animate-pulse" />
              <span className="text-[11px]">BẮN [A]</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
