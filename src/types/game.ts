export type SubjectId = 'toan' | 'van' | 'anh' | 'ly' | 'dia' | 'su';

export interface SubjectMeta {
  id: SubjectId;
  name: string;
  shortName: string;
  color: string;
  badgeBg: string;
  icon: string;
  description: string;
}

export const SUBJECTS: Record<SubjectId, SubjectMeta> = {
  toan: {
    id: 'toan',
    name: 'Toán học 11',
    shortName: 'Toán',
    color: '#38bdf8', // sky-400
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    icon: '📐',
    description: 'Lượng giác, Dãy số, Cấp số cộng/nhân, Giới hạn, Đạo hàm & Xác suất'
  },
  van: {
    id: 'van',
    name: 'Ngữ văn 11',
    shortName: 'Văn',
    color: '#fb7185', // rose-400
    badgeBg: 'rgba(251, 113, 133, 0.15)',
    icon: '📖',
    description: 'Chí Phèo, Vội vàng, Tràng giang, Đây thôn Vĩ Dạ, Chữ người tử tù'
  },
  anh: {
    id: 'anh',
    name: 'Tiếng Anh 11',
    shortName: 'Anh',
    color: '#a78bfa', // violet-400
    badgeBg: 'rgba(167, 139, 250, 0.15)',
    icon: '🌐',
    description: 'Tenses, Conditionals, Participles, Relative Clauses & Global Topics'
  },
  ly: {
    id: 'ly',
    name: 'Vật lí 11',
    shortName: 'Vật lí',
    color: '#facc15', // yellow-400
    badgeBg: 'rgba(250, 204, 21, 0.15)',
    icon: '⚡',
    description: 'Dao động điều hòa, Sóng cơ & sóng dừng, Điện trường & Dòng điện'
  },
  dia: {
    id: 'dia',
    name: 'Địa lí 11',
    shortName: 'Địa lí',
    color: '#34d399', // emerald-400
    badgeBg: 'rgba(52, 211, 153, 0.15)',
    icon: '🌍',
    description: 'Hoa Kỳ, Liên bang Nga, Nhật Bản, Trung Quốc, Đông Nam Á & EU'
  },
  su: {
    id: 'su',
    name: 'Lịch sử 11',
    shortName: 'Lịch sử',
    color: '#f97316', // orange-400
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    icon: '🏛️',
    description: 'CM Tư sản, Liên Xô, Chiến tranh thế giới II, Phong trào GPDT Việt Nam'
  }
};

export type DifficultyLevel = 'basic' | 'medium' | 'hard';

export interface Question {
  id: string;
  subject: SubjectId;
  topic: string;
  difficulty: DifficultyLevel;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
  hint: string;
  source?: 'bank' | 'gemini_ai';
}

export type WeaponType = 'NORMAL' | 'SPREAD' | 'LASER' | 'FIRE';

export interface WeaponInfo {
  type: WeaponType;
  name: string;
  code: string;
  color: string;
  bulletSpeed: number;
  damage: number;
  fireRateMs: number;
  description: string;
}

export const WEAPONS: Record<WeaponType, WeaponInfo> = {
  NORMAL: {
    type: 'NORMAL',
    name: 'Súng Trường Hạng Nặng',
    code: 'N',
    color: '#38bdf8',
    bulletSpeed: 18,
    damage: 45,
    fireRateMs: 120,
    description: 'Nòng súng kim loại kép bắn đạn năng lượng cao liên thanh cực mạnh'
  },
  SPREAD: {
    type: 'SPREAD',
    name: 'Súng Đạn Chùm S Hủy Diệt',
    code: 'S',
    color: '#f43f5e',
    bulletSpeed: 16,
    damage: 55,
    fireRateMs: 150,
    description: 'Phát xạ 5 chùm đạn xòe quạt uy lực quét sạch chiến trường'
  },
  LASER: {
    type: 'LASER',
    name: 'Pháo Laser Hội Tụ L Xuyên Phá',
    code: 'L',
    color: '#06b6d4',
    bulletSpeed: 26,
    damage: 100,
    fireRateMs: 180,
    description: 'Chùm tia năng lượng tử quang xuyên phá toàn bộ phòng tuyến'
  },
  FIRE: {
    type: 'FIRE',
    name: 'Pháo Cầu Lửa F Thiêu Đốt',
    code: 'F',
    color: '#fb923c',
    bulletSpeed: 14,
    damage: 85,
    fireRateMs: 160,
    description: 'Cầu lửa bộc phá cực mạnh tạo vụ nổ chấn động tiêu diệt mục tiêu'
  }
};

export type GameMode = 'CAMPAIGN' | 'PRACTICE' | 'AI_GENERATED';

export type GameState =
  | 'TITLE_MENU'
  | 'PLAYING'
  | 'QUIZ_INTERCEPTION'
  | 'PAUSED'
  | 'BOSS_BATTLE'
  | 'STAGE_CLEAR'
  | 'GAME_OVER'
  | 'AI_HUB';

export interface PlayerStats {
  score: number;
  kills: number;
  quizzesAnswered: number;
  quizzesCorrect: number;
  subjectPerformance: Record<SubjectId, { answered: number; correct: number }>;
  stage: number;
  streak: number;
  highestStreak: number;
}

export interface MistakeRecord {
  question: Question;
  selectedOption: number;
  timestamp: number;
}
