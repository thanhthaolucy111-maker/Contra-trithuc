import React, { useState } from 'react';
import { SubjectId, SUBJECTS, Question, DifficultyLevel, MistakeRecord, PlayerStats } from '../types/game';
import { GRADE_11_QUESTION_BANK, getRandomQuestions } from '../data/grade11Bank';
import { soundManager } from '../utils/audio';
import { 
  Sparkles, 
  BrainCircuit, 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  Play, 
  RefreshCw, 
  RotateCcw, 
  Award,
  Zap,
  TrendingUp,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface KnowledgeHubProps {
  initialTab?: 'ai_hub' | 'practice' | 'mistakes' | 'stats';
  mistakes: MistakeRecord[];
  onClearMistake: (questionId: string) => void;
  playerStats: PlayerStats;
  onLoadCustomQuestionsIntoGame: (questions: Question[]) => void;
  onSwitchToGame: () => void;
}

export const KnowledgeHub: React.FC<KnowledgeHubProps> = ({
  initialTab = 'ai_hub',
  mistakes,
  onClearMistake,
  playerStats,
  onLoadCustomQuestionsIntoGame,
  onSwitchToGame
}) => {
  const [activeTab, setActiveTab] = useState<'ai_hub' | 'practice' | 'mistakes' | 'stats'>(initialTab);

  // AI Generator state
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [aiError, setAiError] = useState<string | null>(null);

  // Practice Mode state
  const [practiceSubject, setPracticeSubject] = useState<SubjectId>('toan');
  const [practiceIdx, setPracticeIdx] = useState<number>(0);
  const [practiceSelected, setPracticeSelected] = useState<number | null>(null);
  const [practiceShowHint, setPracticeShowHint] = useState<boolean>(false);

  // Deep AI explanation state in Mistakes
  const [analyzingMistakeId, setAnalyzingMistakeId] = useState<string | null>(null);
  const [aiMistakeExplanations, setAiMistakeExplanations] = useState<Record<string, any>>({});

  // HQ Briefing state
  const [hqBriefing, setHqBriefing] = useState<string | null>(null);
  const [isLoadingHq, setIsLoadingHq] = useState<boolean>(false);

  // Filter practice questions for chosen subject
  const currentSubjectQuestions = GRADE_11_QUESTION_BANK.filter(q => q.subject === practiceSubject);
  const currentPracticeQ = currentSubjectQuestions[practiceIdx % currentSubjectQuestions.length];

  // 1. Generate Questions via Gemini API
  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    setAiError(null);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: selectedSubject,
          topic: customTopic,
          count: questionCount,
          difficulty
        })
      });
      const data = await res.json();
      if (data.success && data.questions && data.questions.length > 0) {
        setGeneratedQuestions(data.questions);
        soundManager.playCorrect();
        confetti({ particleCount: 40, spread: 50 });
      } else {
        // Fallback to curriculum bank if offline or API key pending
        const local = getRandomQuestions(questionCount, selectedSubject === 'all' ? undefined : selectedSubject);
        setGeneratedQuestions(local);
        setAiError('Hệ thống đã nạp bộ câu hỏi chọn lọc từ Ngân hàng SGK Lớp 11.');
      }
    } catch {
      const local = getRandomQuestions(questionCount, selectedSubject === 'all' ? undefined : selectedSubject);
      setGeneratedQuestions(local);
      setAiError('Đã tải bộ câu hỏi chuẩn từ dữ liệu SGK Lớp 11.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 2. Fetch AI Tactical Briefing
  const handleFetchHqBriefing = async () => {
    setIsLoadingHq(true);
    try {
      // Find weakest subject
      let lowestRate = 100;
      let weakest: SubjectId = 'toan';
      Object.entries(playerStats.subjectPerformance).forEach(([subKey, val]) => {
        if (val.answered > 0) {
          const rate = (val.correct / val.answered) * 100;
          if (rate < lowestRate) {
            lowestRate = rate;
            weakest = subKey as SubjectId;
          }
        }
      });

      const accuracy = playerStats.quizzesAnswered > 0
        ? Math.round((playerStats.quizzesCorrect / playerStats.quizzesAnswered) * 100)
        : 100;

      const res = await fetch('/api/tactical-hq-briefing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: playerStats.score,
          accuracy,
          performanceBySubject: playerStats.subjectPerformance,
          weakestSubject: SUBJECTS[weakest].name
        })
      });
      const data = await res.json();
      if (data.success) {
        setHqBriefing(data.briefing);
      }
    } catch {
      setHqBriefing('Báo cáo Chỉ huy: Tinh thần chiến đấu rất cao! Đề nghị duy trì nhịp độ tác chiến và tăng cường giải các bài toán giới hạn và lượng giác để hoàn thiện kỹ năng.');
    } finally {
      setIsLoadingHq(false);
    }
  };

  // 3. Explain mistake via AI
  const handleDeepExplainMistake = async (mistake: MistakeRecord) => {
    setAnalyzingMistakeId(mistake.question.id);
    try {
      const res = await fetch('/api/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: mistake.question,
          userOptionIndex: mistake.selectedOption
        })
      });
      const data = await res.json();
      if (data.success) {
        setAiMistakeExplanations(prev => ({ ...prev, [mistake.question.id]: data }));
      }
    } catch {
      setAiMistakeExplanations(prev => ({
        ...prev,
        [mistake.question.id]: {
          detailedExplanation: mistake.question.explanation,
          mnemonicTip: mistake.question.hint,
          relatedConcept: `SGK Lớp 11: ${mistake.question.topic}`
        }
      }));
    } finally {
      setAnalyzingMistakeId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Navigation Tabs Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('ai_hub')}
            className={`px-3 py-1.5 text-xs font-tech font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'ai_hub' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            AI Cá Nhân Hóa
          </button>

          <button
            onClick={() => setActiveTab('practice')}
            className={`px-3 py-1.5 text-xs font-tech font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'practice' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-sky-400" />
            Luyện Tập 6 Môn
          </button>

          <button
            onClick={() => setActiveTab('mistakes')}
            className={`px-3 py-1.5 text-xs font-tech font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'mistakes' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            Sổ Tay Sai Sót ({mistakes.length})
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 text-xs font-tech font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
              activeTab === 'stats' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            Hồ Sơ Năng Lực
          </button>
        </div>

        <button
          onClick={onSwitchToGame}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-arcade text-xs flex items-center gap-2 shadow-lg shadow-rose-950/50 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          <span>VÀO CHIẾN ĐẤU ARCADE</span>
        </button>
      </div>

      {/* ================= TAB 1: AI PERSONALIZATION GENERATOR ================= */}
      {activeTab === 'ai_hub' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-xl space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 mb-1">
                <BrainCircuit className="w-5 h-5" />
                <h3 className="font-arcade text-sm">TRỢ LÝ TẠO ĐỀ CÁ NHÂN HÓA LỚP 11</h3>
              </div>
              <p className="text-xs text-slate-400 font-sans-custom">
                Nhập bất kì chủ đề hoặc lỗ hổng kiến thức bạn muốn ôn luyện. Trí tuệ nhân tạo sẽ tự động tạo bộ câu hỏi trắc nghiệm tương thích với chương trình Lớp 11 để nạp thẳng vào chiến trường Contra!
              </p>
            </div>

            {/* Subject Selector */}
            <div>
              <label className="block text-xs font-tech text-slate-300 mb-2">Chọn môn học mục tiêu:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                <button
                  onClick={() => setSelectedSubject('all')}
                  className={`p-2 rounded border text-xs font-tech font-semibold transition-all ${
                    selectedSubject === 'all'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  ⚡ Tất Cả 6 Môn
                </button>
                {Object.values(SUBJECTS).map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubject(s.id)}
                    className={`p-2 rounded border text-xs font-tech font-semibold transition-all flex items-center justify-center gap-1.5 ${
                      selectedSubject === s.id
                        ? 'border-sky-500 text-sky-200 shadow'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                    style={selectedSubject === s.id ? { backgroundColor: s.badgeBg, borderColor: s.color } : {}}
                  >
                    <span>{s.icon}</span>
                    <span>{s.shortName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Focus Prompt Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-tech text-slate-300 mb-1.5">
                  Chủ đề / Chuyên đề Lớp 11 cần khắc sâu (tùy chọn):
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Ví dụ: Đạo hàm hàm số lượng giác, Tác phẩm Chí Phèo, Câu điều kiện loại 3, Sóng dừng..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans-custom"
                />
              </div>

              {/* Difficulty & Count */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-tech text-slate-300 mb-1.5">Mức độ:</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-tech"
                  >
                    <option value="basic">Nhận biết</option>
                    <option value="medium">Vận dụng</option>
                    <option value="hard">Vận dụng cao</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-tech text-slate-300 mb-1.5">Số lượng câu:</label>
                  <select
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-400 font-tech"
                  >
                    <option value={3}>3 câu</option>
                    <option value={5}>5 câu</option>
                    <option value={8}>8 câu</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generate Action Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 font-sans-custom">
                {aiError && <span className="text-amber-400">{aiError}</span>}
              </span>

              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-arcade text-xs tracking-wider flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'AI ĐANG BIÊN SOẠN...' : 'TẠO ĐỀ CÁ NHÂN HÓA'}</span>
              </button>
            </div>
          </div>

          {/* Generated Questions Showcase */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="font-tech font-bold text-sm text-slate-200 uppercase tracking-wide">
                    Đề Thi Vừa Được Biên Soạn ({generatedQuestions.length} câu)
                  </h4>
                </div>

                <button
                  onClick={() => {
                    onLoadCustomQuestionsIntoGame(generatedQuestions);
                    onSwitchToGame();
                  }}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-arcade text-xs flex items-center gap-2 shadow"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>NẠP VÀO CONTRA ARCADE</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {generatedQuestions.map((q, idx) => {
                  const sMeta = SUBJECTS[q.subject] || SUBJECTS.toan;
                  return (
                    <div key={q.id || idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-tech font-bold" style={{ color: sMeta.color }}>
                            {sMeta.name}
                          </span>
                          <span className="text-slate-500">·</span>
                          <span className="text-slate-400 font-sans-custom">{q.topic}</span>
                        </div>
                        <span className="text-[11px] font-tech text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          Đáp án: {String.fromCharCode(65 + q.correctIndex)}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-slate-200 font-sans-custom">{q.question}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2 rounded border font-sans-custom ${
                              oIdx === q.correctIndex
                                ? 'bg-emerald-950/60 border-emerald-600 text-emerald-200 font-medium'
                                : 'bg-slate-950/60 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="font-bold mr-1.5">{String.fromCharCode(65 + oIdx)}.</span>
                            {opt}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs text-slate-400 bg-slate-950/80 p-2.5 rounded border border-slate-800/80 font-sans-custom">
                        <span className="font-semibold text-slate-300">Giải thích SGK: </span>
                        {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: PRACTICE MODE 6 SUBJECTS ================= */}
      {activeTab === 'practice' && (
        <div className="space-y-6 animate-fade-in">
          {/* Subject Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Object.values(SUBJECTS).map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setPracticeSubject(s.id);
                  setPracticeIdx(0);
                  setPracticeSelected(null);
                  setPracticeShowHint(false);
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  practiceSubject === s.id
                    ? 'border-sky-400 shadow-md ring-1 ring-sky-400/40'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
                style={practiceSubject === s.id ? { backgroundColor: s.badgeBg } : {}}
              >
                <div className="text-xl mb-1">{s.icon}</div>
                <div className="text-xs font-tech font-bold text-slate-200">{s.shortName}</div>
                <div className="text-[10px] text-slate-400 truncate">{s.name}</div>
              </button>
            ))}
          </div>

          {/* Interactive Question Card */}
          {currentPracticeQ && (
            <div className="bg-slate-900/90 border-2 border-slate-700 rounded-xl p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-tech font-bold text-sky-400 uppercase tracking-wider">
                    {SUBJECTS[practiceSubject].name}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-xs font-tech text-slate-400">{currentPracticeQ.topic}</span>
                </div>

                <div className="text-xs font-tech text-slate-400">
                  Câu {(practiceIdx % currentSubjectQuestions.length) + 1} / {currentSubjectQuestions.length}
                </div>
              </div>

              <p className="text-base font-medium text-slate-100 font-sans-custom leading-relaxed">
                {currentPracticeQ.question}
              </p>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentPracticeQ.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isAnswered = practiceSelected !== null;
                  const isCorrect = idx === currentPracticeQ.correctIndex;
                  const isSelected = practiceSelected === idx;

                  let style = 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-200';
                  if (isAnswered) {
                    if (isCorrect) {
                      style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200';
                    } else if (isSelected) {
                      style = 'bg-rose-950/80 border-rose-500 text-rose-200';
                    } else {
                      style = 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (isAnswered) return;
                        setPracticeSelected(idx);
                        if (idx === currentPracticeQ.correctIndex) {
                          soundManager.playCorrect();
                        } else {
                          soundManager.playWrong();
                        }
                      }}
                      className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start gap-3 font-sans-custom text-sm ${style}`}
                    >
                      <span className="w-7 h-7 rounded bg-slate-700 flex items-center justify-center font-tech font-bold text-xs shrink-0">
                        {letter}
                      </span>
                      <span className="flex-1 pt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation & Hint */}
              {practiceSelected !== null && (
                <div className={`p-4 rounded-lg border text-xs md:text-sm font-sans-custom ${
                  practiceSelected === currentPracticeQ.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800 text-rose-200'
                }`}>
                  <span className="font-bold">Lời giải SGK Lớp 11: </span>
                  {currentPracticeQ.explanation}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => setPracticeShowHint(!practiceShowHint)}
                  className="text-xs font-tech text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>{practiceShowHint ? 'Ẩn gợi ý' : 'Xem gợi ý SGK'}</span>
                </button>

                <button
                  onClick={() => {
                    setPracticeIdx(prev => prev + 1);
                    setPracticeSelected(null);
                    setPracticeShowHint(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-tech text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <span>Câu kế tiếp</span>
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {practiceShowHint && (
                <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded text-xs text-amber-200 font-sans-custom">
                  {currentPracticeQ.hint}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: MISTAKES NOTEBOOK ================= */}
      {activeTab === 'mistakes' && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-arcade text-xs md:text-sm text-rose-400">SỔ TAY CỨU THƯƠNG TRI THỨC</h3>
              <p className="text-xs text-slate-400 font-sans-custom">
                Lưu trữ các câu hỏi bạn từng bắn trượt. Hãy ôn tập lại để củng cố điểm số thi cử!
              </p>
            </div>
            <div className="font-tech text-xs text-slate-400">
              Tổng số điểm yếu: <span className="text-rose-400 font-bold">{mistakes.length}</span>
            </div>
          </div>

          {mistakes.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="font-tech font-bold text-sm text-slate-200">Sổ tay trống!</h4>
              <p className="text-xs text-slate-400 font-sans-custom">
                Bạn chưa có câu trả lời sai nào. Hãy tiếp tục duy trì phong độ trên chiến trường Contra!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mistakes.map(m => {
                const q = m.question;
                const subMeta = SUBJECTS[q.subject] || SUBJECTS.toan;
                const aiExpl = aiMistakeExplanations[q.id];

                return (
                  <div key={q.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-tech font-bold" style={{ color: subMeta.color }}>
                          {subMeta.name}
                        </span>
                        <span className="text-slate-500">·</span>
                        <span className="text-slate-400 font-sans-custom">{q.topic}</span>
                      </div>

                      <button
                        onClick={() => onClearMistake(q.id)}
                        className="text-xs font-tech text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Đã hiểu & Gỡ bỏ</span>
                      </button>
                    </div>

                    <p className="text-sm font-medium text-slate-200 font-sans-custom">{q.question}</p>

                    <div className="p-3 bg-rose-950/30 border border-rose-900/40 rounded text-xs space-y-1 font-sans-custom">
                      <div className="text-rose-300">
                        <span className="font-bold">Lựa chọn bạn từng chọn: </span>
                        {q.options[m.selectedOption] || 'Chưa trả lời'}
                      </div>
                      <div className="text-emerald-300">
                        <span className="font-bold">Đáp án chính xác: </span>
                        {q.options[q.correctIndex]}
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded border border-slate-800 font-sans-custom">
                      <span className="font-semibold text-slate-200">Phương pháp giải SGK: </span>
                      {q.explanation}
                    </div>

                    {/* AI Deep Analysis Button & Result */}
                    {!aiExpl ? (
                      <button
                        onClick={() => handleDeepExplainMistake(m)}
                        disabled={analyzingMistakeId === q.id}
                        className="py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-tech text-amber-300 flex items-center gap-1.5 transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{analyzingMistakeId === q.id ? 'AI đang phân tích...' : 'Hỏi AI: Mẹo ghi nhớ & Khái niệm liên quan'}</span>
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-950/20 border border-amber-900/50 rounded text-xs space-y-1.5 text-amber-200/90 font-sans-custom">
                        <div className="font-bold flex items-center gap-1 text-amber-400 font-tech">
                          <Sparkles className="w-3.5 h-3.5" /> MẸO NHỚ NHANH:
                        </div>
                        <p>{aiExpl.mnemonicTip}</p>
                        <p className="text-slate-300">{aiExpl.detailedExplanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: PERFORMANCE DOSSIER & AI HQ BRIEFING ================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade-in">
          {/* Tactical HQ AI Debriefing Banner */}
          <div className="bg-slate-900 border-2 border-amber-500/40 rounded-xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-400">
                <Award className="w-5 h-5" />
                <h4 className="font-arcade text-xs tracking-wide">ĐIỆN ĐÀM TỔNG CHỈ HUY BỘ TƯ LỆNH</h4>
              </div>

              <button
                onClick={handleFetchHqBriefing}
                disabled={isLoadingHq}
                className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-tech border border-amber-500/50 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingHq ? 'Đang giải mã...' : 'Nhận Báo Cáo Chiến Lược AI'}</span>
              </button>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 text-xs md:text-sm text-slate-300 font-sans-custom leading-relaxed">
              {hqBriefing || 'Nhấn nút "Nhận Báo Cáo Chiến Lược AI" bên trên để Tổng chỉ huy phân tích tỷ lệ bắn trúng từng môn học và đề xuất phương án tác chiến tối ưu cho bạn!'}
            </div>
          </div>

          {/* Subject Mastery Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h4 className="font-tech font-bold text-sm text-slate-200 uppercase tracking-wide">
              Độ Thuần Thục 6 Môn Học Lớp 11
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.values(SUBJECTS).map(s => {
                const stat = playerStats.subjectPerformance[s.id] || { answered: 0, correct: 0 };
                const pct = stat.answered > 0 ? Math.round((stat.correct / stat.answered) * 100) : 0;

                return (
                  <div key={s.id} className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{s.icon}</span>
                        <span className="font-tech font-bold text-slate-200">{s.name}</span>
                      </div>
                      <span className="font-tech font-bold" style={{ color: s.color }}>
                        {stat.correct}/{stat.answered} đúng ({pct}%)
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: s.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
