import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Google GenAI with GEMINI_API_KEY from environment
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper: Ensure valid response even if API key is not present or offline
const subjectNameMap: Record<string, string> = {
  toan: 'Toán học lớp 11',
  van: 'Ngữ văn lớp 11',
  anh: 'Tiếng Anh lớp 11',
  ly: 'Vật lí lớp 11',
  dia: 'Địa lí lớp 11',
  su: 'Lịch sử lớp 11',
  all: 'Tổng hợp 6 môn lớp 11 (Toán, Văn, Anh, Vật lí, Địa lí, Lịch sử)'
};

// 1. Live AI Question Generator
app.post('/api/generate-questions', async (req: Request, res: Response) => {
  try {
    const { subject = 'all', topic = '', count = 3, difficulty = 'medium' } = req.body;

    if (!apiKey) {
      return res.status(200).json({
        success: false,
        message: 'No GEMINI_API_KEY configured. Using local curriculum database.',
        questions: []
      });
    }

    const subName = subjectNameMap[subject] || 'Kiến thức lớp 11';
    const prompt = `Bạn là chuyên gia giáo dục và tác giả đề thi tốt nghiệp THPT, chuyên môn Chương trình Giáo dục Phổ thông Lớp 11 tại Việt Nam.
Hãy tạo ra ${count} câu hỏi trắc nghiệm chất lượng cao, chuẩn kiến thức SGK Lớp 11:
- Môn: ${subName}
- Chủ đề/Trọng tâm yêu cầu: ${topic || 'Các trọng tâm hay gặp trong kì thi giữa kỳ và học kỳ'}
- Mức độ: ${difficulty} (basic: Nhận biết - Thông hiểu, medium: Vận dụng, hard: Vận dụng cao)

Yêu cầu định dạng JSON CHÍNH XÁC theo cấu trúc mảng các object với các trường:
[
  {
    "id": "ai-q-1",
    "subject": "${subject === 'all' ? 'toan' : subject}",
    "topic": "Chủ đề cụ thể",
    "difficulty": "${difficulty}",
    "question": "Nội dung câu hỏi rõ ràng, chính xác",
    "options": ["Phương án A", "Phương án B", "Phương án C", "Phương án D"],
    "correctIndex": 0,
    "explanation": "Lời giải chi tiết từng bước, nêu rõ công thức/dẫn chứng SGK",
    "hint": "Gợi ý chiến thuật ngắn gọn giúp ghi nhớ"
  }
]
Chú ý: options phải có chính xác 4 phần tử. correctIndex là số nguyên từ 0 đến 3 chỉ đúng phương án chính xác.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              question: { type: Type.STRING },
              options: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              correctIndex: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING }
            },
            required: ['id', 'subject', 'topic', 'difficulty', 'question', 'options', 'correctIndex', 'explanation', 'hint']
          }
        },
        temperature: 0.7
      }
    });

    const text = response.text || '[]';
    const parsed = JSON.parse(text);

    // Ensure subject is valid subject ID
    const validSubjects = ['toan', 'van', 'anh', 'ly', 'dia', 'su'];
    const formatted = parsed.map((q: any, idx: number) => ({
      ...q,
      id: `ai-${Date.now()}-${idx}`,
      subject: validSubjects.includes(q.subject) ? q.subject : (subject === 'all' ? 'toan' : subject),
      source: 'gemini_ai'
    }));

    return res.json({ success: true, questions: formatted });
  } catch (error: any) {
    console.error('Error generating questions via Gemini:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi kết nối với máy chủ AI'
    });
  }
});

// 2. In-Depth AI Explanation & Study Breakdown
app.post('/api/explain-question', async (req: Request, res: Response) => {
  try {
    const { question, userOptionIndex } = req.body;

    if (!apiKey) {
      return res.json({
        success: true,
        detailedExplanation: question.explanation || 'Xem lại kiến thức trọng tâm trong sách giáo khoa.',
        mnemonicTip: question.hint || 'Hãy chú ý phân tích kỹ dữ kiện câu hỏi.'
      });
    }

    const prompt = `Bạn là Trợ lý Sư phạm Trí tuệ Nhân tạo cho học sinh Lớp 11 tại Việt Nam.
Một học sinh vừa làm câu hỏi sau:
Môn: ${question.subject} - Chủ đề: ${question.topic}
Câu hỏi: ${question.question}
Các lựa chọn:
A. ${question.options[0]}
B. ${question.options[1]}
C. ${question.options[2]}
D. ${question.options[3]}
Đáp án đúng là: ${question.options[question.correctIndex]}
Học sinh đã chọn: ${userOptionIndex !== undefined ? question.options[userOptionIndex] : 'Chưa chọn'}

Hãy cung cấp:
1. "detailedExplanation": Phân tích cặn kẽ vì sao đáp án đúng lại đúng, và vì sao các phương án khác lại là bẫy thường gặp.
2. "mnemonicTip": Mẹo ghi nhớ thần tốc (công thức mẹo, câu thơ ghi nhớ, quy tắc nhớ nhanh).
3. "relatedConcept": Khái niệm liên quan cần ôn lại trong SGK Lớp 11.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detailedExplanation: { type: Type.STRING },
            mnemonicTip: { type: Type.STRING },
            relatedConcept: { type: Type.STRING }
          },
          required: ['detailedExplanation', 'mnemonicTip', 'relatedConcept']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, ...parsed });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Tactical HQ Debriefing / Commando Commander
app.post('/api/tactical-hq-briefing', async (req: Request, res: Response) => {
  try {
    const { score, accuracy, performanceBySubject, weakestSubject } = req.body;

    if (!apiKey) {
      return res.json({
        success: true,
        briefing: `Báo cáo Chỉ huy: Bạn đã hoàn thành đợt tác chiến với điểm số ${score}! Hãy củng cố thêm môn ${weakestSubject || 'Toán học'} để tăng cường uy lực chiến đấu!`
      });
    }

    const prompt = `Bạn là "Tổng Chỉ Huy Bộ Tư Lệnh Tri Thức Lớp 11" trong game Contra Retro Arcade.
Hãy viết một bản tin điện đàm ngắn gọn, hào hùng, phong cách chỉ huy quân sự Contra kết hợp sư phạm:
- Điểm chiến dịch: ${score}
- Tỉ lệ bắn trúng tri thức: ${accuracy}%
- Môn đang cần tăng cường vũ trang: ${weakestSubject || 'Toán'}
- Tóm tắt dữ liệu: ${JSON.stringify(performanceBySubject || {})}

Viết lời động viên, khen ngợi và 2 chiến thuật thực chiến cụ thể để nâng điểm thi Lớp 11 cho người chiến binh này. Văn phong súc tích, ngầu, đầy nhiệt huyết (dưới 150 từ).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt
    });

    return res.json({ success: true, briefing: response.text });
  } catch (err: any) {
    return res.json({
      success: true,
      briefing: 'Báo cáo Chiến binh: Bộ chỉ huy ghi nhận nỗ lực xuất sắc! Hãy tiếp tục nạp đạn tri thức và chinh phục các thử thách lớp 11 tiếp theo!'
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Contra 11 Arcade Server running on port ${PORT}`);
  });
}

startServer();
