import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SubjectId, WeaponType, Question, MistakeRecord, PlayerStats, WEAPONS } from './types/game';
import { getRandomQuestions, GRADE_11_QUESTION_BANK } from './data/grade11Bank';
import { soundManager } from './utils/audio';
import { TopBar } from './components/TopBar';
import { ArcadeGame, ArcadeGameHandle } from './components/ArcadeGame';
import { ArcadeControls } from './components/ArcadeControls';
import { QuizModal } from './components/QuizModal';
import { KnowledgeHub } from './components/KnowledgeHub';
import { TitleScreen } from './components/TitleScreen';
import { GameOverModal } from './components/GameOverModal';
import { StageClearModal } from './components/StageClearModal';

export default function App() {
  const arcadeGameRef = useRef<ArcadeGameHandle | null>(null);

  // Navigation & App Tab
  const [currentTab, setCurrentTab] = useState<'game' | 'practice' | 'ai_hub' | 'mistakes' | 'stats'>('game');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Game gameplay state
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [activeWeapon, setActiveWeapon] = useState<WeaponType>('NORMAL');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | undefined>(undefined);
  const [stage, setStage] = useState<number>(1);

  // Custom question queue (e.g. from AI generator)
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  // Modals state
  const [activeQuiz, setActiveQuiz] = useState<{
    question: Question;
    bonusWeapon: WeaponType;
    isBoss: boolean;
  } | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isStageClear, setIsStageClear] = useState<boolean>(false);

  // Stats & Mistakes
  const [mistakes, setMistakes] = useState<MistakeRecord[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats>({
    score: 0,
    kills: 0,
    quizzesAnswered: 0,
    quizzesCorrect: 0,
    subjectPerformance: {
      toan: { answered: 0, correct: 0 },
      van: { answered: 0, correct: 0 },
      anh: { answered: 0, correct: 0 },
      ly: { answered: 0, correct: 0 },
      dia: { answered: 0, correct: 0 },
      su: { answered: 0, correct: 0 }
    },
    stage: 1,
    streak: 0,
    highestStreak: 0
  });

  // Sound & BGM toggles
  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundManager.setMute(next);
  };

  const handleToggleScanlines = () => {
    setScanlinesEnabled(prev => !prev);
  };

  // Start campaign
  const handleStartCampaign = (subject?: SubjectId) => {
    setSelectedSubject(subject);
    setScore(0);
    setLives(3);
    setActiveWeapon('NORMAL');
    setIsPlaying(true);
    setIsPaused(false);
    setIsGameOver(false);
    setIsStageClear(false);
    setCurrentTab('game');
    soundManager.startBgm();
  };

  // Restart after game over
  const handleRestartGame = () => {
    setScore(0);
    setLives(3);
    setActiveWeapon('NORMAL');
    setIsGameOver(false);
    setIsPaused(false);
    setIsPlaying(true);
    soundManager.startBgm();
  };

  // Next stage after clearing boss
  const handleNextStage = () => {
    setStage(prev => prev + 1);
    setLives(prev => Math.min(5, prev + 1));
    setIsStageClear(false);
    setIsPaused(false);
    setIsPlaying(true);
    soundManager.startBgm();
  };

  // Trigger Knowledge Quiz in-game
  const handleTriggerQuiz = useCallback((bonusWeapon: WeaponType, isBoss: boolean) => {
    setIsPaused(true);

    let chosenQuestion: Question;
    if (customQuestions.length > 0) {
      chosenQuestion = customQuestions[Math.floor(Math.random() * customQuestions.length)];
    } else {
      const qList = getRandomQuestions(1, selectedSubject);
      chosenQuestion = qList[0];
    }

    setActiveQuiz({
      question: chosenQuestion,
      bonusWeapon,
      isBoss
    });
  }, [customQuestions, selectedSubject]);

  // Handle player answer in Knowledge Quiz
  const handleQuizAnswer = (isCorrect: boolean, selectedOption: number) => {
    if (!activeQuiz) return;
    const q = activeQuiz.question;

    setPlayerStats(prev => {
      const subPerf = { ...prev.subjectPerformance };
      const currentSub = subPerf[q.subject] || { answered: 0, correct: 0 };
      subPerf[q.subject] = {
        answered: currentSub.answered + 1,
        correct: currentSub.correct + (isCorrect ? 1 : 0)
      };

      const newStreak = isCorrect ? prev.streak + 1 : 0;
      return {
        ...prev,
        quizzesAnswered: prev.quizzesAnswered + 1,
        quizzesCorrect: prev.quizzesCorrect + (isCorrect ? 1 : 0),
        streak: newStreak,
        highestStreak: Math.max(prev.highestStreak, newStreak),
        subjectPerformance: subPerf
      };
    });

    if (isCorrect) {
      setScore(prev => prev + 1000);
      setActiveWeapon(activeQuiz.bonusWeapon);
    } else {
      // Record mistake
      setMistakes(prev => {
        if (prev.some(m => m.question.id === q.id)) return prev;
        return [...prev, { question: q, selectedOption, timestamp: Date.now() }];
      });
    }
  };

  const handleCloseQuiz = () => {
    setActiveQuiz(null);
    setIsPaused(false);
  };

  const handleClearMistake = (qId: string) => {
    setMistakes(prev => prev.filter(m => m.question.id !== qId));
  };

  const handleLoadCustomQuestions = (qs: Question[]) => {
    setCustomQuestions(qs);
  };

  // Virtual arcade key simulators
  const simulateKey = (key: string, isDown: boolean) => {
    const event = new KeyboardEvent(isDown ? 'keydown' : 'keyup', { key });
    window.dispatchEvent(event);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans-custom">
      {/* 1. Universal Top Navigation Bar */}
      <TopBar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'game') {
            setIsPaused(true);
          }
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={handleToggleScanlines}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start py-4 px-2 md:px-6 w-full max-w-7xl mx-auto">
        {currentTab === 'game' ? (
          !isPlaying ? (
            <TitleScreen
              onStartCampaign={handleStartCampaign}
              onOpenAiHub={() => setCurrentTab('ai_hub')}
              onOpenPractice={() => setCurrentTab('practice')}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
            />
          ) : (
            <div className="w-full flex flex-col items-center space-y-4 animate-fade-in">
              {/* Active Arcade Canvas */}
              <ArcadeGame
                ref={arcadeGameRef}
                onTriggerQuiz={handleTriggerQuiz}
                onGameOver={(finalScore) => {
                  setIsGameOver(true);
                  setIsPaused(true);
                  soundManager.stopBgm();
                }}
                onStageClear={(finalScore) => {
                  setIsStageClear(true);
                  setIsPaused(true);
                  soundManager.stopBgm();
                }}
                activeWeapon={activeWeapon}
                onChangeWeapon={setActiveWeapon}
                lives={lives}
                onUpdateLives={setLives}
                score={score}
                onUpdateScore={setScore}
                isPaused={isPaused}
                scanlinesEnabled={scanlinesEnabled}
                selectedSubject={selectedSubject}
              />

              {/* Responsive Virtual Controls */}
              <ArcadeControls
                onDirectionDown={(dir) => {
                  arcadeGameRef.current?.setDirection(dir, true);
                  simulateKey(dir === 'up' ? 'w' : dir === 'down' ? 's' : dir === 'left' ? 'a' : 'd', true);
                }}
                onDirectionUp={(dir) => {
                  arcadeGameRef.current?.setDirection(dir, false);
                  simulateKey(dir === 'up' ? 'w' : dir === 'down' ? 's' : dir === 'left' ? 'a' : 'd', false);
                }}
                onJumpStart={() => {
                  arcadeGameRef.current?.triggerJump();
                }}
                onJumpEnd={() => {}}
                onShootStart={() => {
                  arcadeGameRef.current?.setShooting(true);
                }}
                onShootEnd={() => {
                  arcadeGameRef.current?.setShooting(false);
                }}
                onSwitchWeapon={() => {
                  arcadeGameRef.current?.switchWeapon();
                }}
                onTogglePause={() => setIsPaused(prev => !prev)}
                isPaused={isPaused}
              />
            </div>
          )
        ) : (
          <KnowledgeHub
            initialTab={currentTab}
            mistakes={mistakes}
            onClearMistake={handleClearMistake}
            playerStats={playerStats}
            onLoadCustomQuestionsIntoGame={handleLoadCustomQuestions}
            onSwitchToGame={() => {
              setCurrentTab('game');
              setIsPlaying(true);
              setIsPaused(false);
              soundManager.startBgm();
            }}
          />
        )}
      </main>

      {/* 3. Knowledge Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          question={activeQuiz.question}
          isOpen={true}
          onAnswer={handleQuizAnswer}
          onClose={handleCloseQuiz}
          bonusWeapon={activeQuiz.bonusWeapon}
          isBossBreach={activeQuiz.isBoss}
        />
      )}

      {/* 4. Game Over Modal */}
      <GameOverModal
        score={score}
        isOpen={isGameOver}
        onRestart={handleRestartGame}
        onReviewMistakes={() => {
          setIsGameOver(false);
          setCurrentTab('mistakes');
        }}
        mistakesCount={mistakes.length}
      />

      {/* 5. Stage Clear Modal */}
      <StageClearModal
        score={score}
        isOpen={isStageClear}
        onNextStage={handleNextStage}
        onReviewStats={() => {
          setIsStageClear(false);
          setCurrentTab('stats');
        }}
      />
    </div>
  );
}
