import { Question, SubjectId } from '../types/game';

export const GRADE_11_QUESTION_BANK: Question[] = [
  // ================= TOÁN HỌC 11 =================
  {
    id: 'toan-01',
    subject: 'toan',
    topic: 'Lượng giác',
    difficulty: 'basic',
    question: 'Nghiệm của phương trình lượng giác sin(x) = 1/2 là:',
    options: [
      'x = π/6 + k2π hoặc x = 5π/6 + k2π (k ∈ ℤ)',
      'x = π/3 + k2π hoặc x = 2π/3 + k2π (k ∈ ℤ)',
      'x = ±π/6 + k2π (k ∈ ℤ)',
      'x = π/6 + kπ (k ∈ ℤ)'
    ],
    correctIndex: 0,
    explanation: 'Ta có sin(π/6) = 1/2. Do đó công thức nghiệm của sin(x) = sin(α) là x = α + k2π hoặc x = π - α + k2π. Với α = π/6, ta được x = π/6 + k2π và x = 5π/6 + k2π (k ∈ ℤ).',
    hint: 'Nhớ lại bảng giá trị lượng giác cơ bản: góc nào có sin bằng 1/2 và quan hệ bù nhau (sin(π - α) = sin α).'
  },
  {
    id: 'toan-02',
    subject: 'toan',
    topic: 'Cấp số cộng',
    difficulty: 'medium',
    question: 'Cho cấp số cộng (uₙ) có số hạng đầu u₁ = 3 và công sai d = 4. Số hạng thứ 10 (u₁₀) bằng bao nhiêu?',
    options: ['39', '43', '36', '40'],
    correctIndex: 0,
    explanation: 'Công thức số hạng tổng quát của cấp số cộng: uₙ = u₁ + (n - 1)d. Thay n = 10, u₁ = 3, d = 4: u₁₀ = 3 + 9 × 4 = 3 + 36 = 39.',
    hint: 'Sử dụng công thức uₙ = u₁ + (n - 1)d.'
  },
  {
    id: 'toan-03',
    subject: 'toan',
    topic: 'Đạo hàm',
    difficulty: 'medium',
    question: 'Đạo hàm của hàm số y = x³ - 3x² + 2 tại điểm x = 2 là:',
    options: ['0', '1', '12', '-3'],
    correctIndex: 0,
    explanation: 'Ta có y\' = 3x² - 6x. Tại x = 2: y\'(2) = 3(2)² - 6(2) = 12 - 12 = 0.',
    hint: 'Tính đạo hàm của đa thức y\' = (x³)\' - 3(x²)\' rồi thế x = 2 vào.'
  },
  {
    id: 'toan-04',
    subject: 'toan',
    topic: 'Giới hạn',
    difficulty: 'basic',
    question: 'Tính giới hạn: L = lim(x→2) [(x² - 4)/(x - 2)]',
    options: ['4', '2', '0', 'Vô cực (∞)'],
    correctIndex: 0,
    explanation: 'Khử dạng vô định 0/0: x² - 4 = (x - 2)(x + 2). Ta có lim(x→2) (x + 2) = 2 + 2 = 4.',
    hint: 'Phân tích tử số thành hằng đẳng thức hiệu hai bình phương để triệt tiêu nhân tử (x - 2).'
  },
  {
    id: 'toan-05',
    subject: 'toan',
    topic: 'Tổ hợp - Xác suất',
    difficulty: 'hard',
    question: 'Gieo đồng thời hai con xúc xắc cân đối. Xác suất để tổng số chấm xuất hiện bằng 7 là:',
    options: ['1/6', '7/36', '1/12', '5/36'],
    correctIndex: 0,
    explanation: 'Không gian mẫu n(Ω) = 6 × 6 = 36. Các cặp có tổng bằng 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) có 6 kết quả thuận lợi. Xác suất P = 6/36 = 1/6.',
    hint: 'Liệt kê các cặp (a, b) sao cho 1 ≤ a, b ≤ 6 và a + b = 7.'
  },
  {
    id: 'toan-06',
    subject: 'toan',
    topic: 'Hình học không gian',
    difficulty: 'medium',
    question: 'Cho hình chóp S.ABCD có đáy ABCD là hình vuông tâm O, SA ⊥ (ABCD). Khẳng định nào sau đây ĐÚNG?',
    options: ['BD ⊥ (SAC)', 'AC ⊥ (SBD)', 'BC ⊥ (SAB)', 'AB ⊥ (SAD)'],
    correctIndex: 0,
    explanation: 'Vì ABCD là hình vuông nên BD ⊥ AC. Lại có SA ⊥ (ABCD) nên SA ⊥ BD. Do BD vuông góc với hai đường cắt nhau AC và SA trong mặt phẳng (SAC), suy ra BD ⊥ (SAC).',
    hint: 'Sử dụng tính chất đường chéo hình vuông vuông góc nhau và đường cao SA vuông góc với mọi đường trong đáy.'
  },
  {
    id: 'toan-07',
    subject: 'toan',
    topic: 'Cấp số nhân',
    difficulty: 'medium',
    question: 'Cấp số nhân (vₙ) có v₁ = 2 và công bội q = 3. Tổng 4 số hạng đầu tiên S₄ là:',
    options: ['80', '81', '78', '162'],
    correctIndex: 0,
    explanation: 'Công thức tính tổng n số hạng đầu: Sₙ = v₁ × (1 - qⁿ)/(1 - q). S₄ = 2 × (1 - 3⁴)/(1 - 3) = 2 × (1 - 81)/(-2) = 80.',
    hint: 'Dùng công thức tổng cấp số nhân Sₙ = v₁ × (qⁿ - 1)/(q - 1).'
  },

  // ================= NGỮ VĂN 11 =================
  {
    id: 'van-01',
    subject: 'van',
    topic: 'Chí Phèo - Nam Cao',
    difficulty: 'basic',
    question: 'Chi tiết nghệ thuật nào đã đánh thức lương tri và khao khát hoàn lương của Chí Phèo?',
    options: [
      'Bát cháo hành của Thị Nở',
      'Tiếng chửi say rượu ở đầu làng',
      'Đồng bạc của Bá Kiến ném cho',
      'Tiếng hót của đàn chim buổi sớm'
    ],
    correctIndex: 0,
    explanation: 'Bát cháo hành ấm nóng chan chứa tình người mộc mạc của Thị Nở là hương vị của tình yêu thương chân thành, đã khơi dậy men say lương tri và niềm khao khát được làm người lương thiện của Chí Phèo.',
    hint: 'Một món ăn mộc mạc, bình dị do Thị Nở mang sang cho Chí khi Chí ốm dậy.'
  },
  {
    id: 'van-02',
    subject: 'van',
    topic: 'Chữ người tử tù - Nguyễn Tuân',
    difficulty: 'medium',
    question: 'Cảnh tượng nào được nhà văn Nguyễn Tuân gọi là "một cảnh tượng xưa nay chưa từng có"?',
    options: [
      'Cảnh Huấn Cao cho chữ viên quản ngục trong đêm tối chốn buồng giam',
      'Cảnh Huấn Cao dỗ gông trước sự kính nể của lính canh',
      'Cảnh viên quản ngục cúi đầu tiễn đưa đoàn tử tù',
      'Cảnh bữa cơm rượu tươm tất trong nhà lao tỉnh Sơn'
    ],
    correctIndex: 0,
    explanation: 'Cảnh cho chữ diễn ra trong căn buồng giam ẩm mốc, bẩn thỉu; người tử tù sắp ra pháp trường lại ở tư thế chủ động, uy nghi truyền dạy cái đẹp và đạo lí sống cho viên quản ngục.',
    hint: 'Sự sáng tạo cái đẹp diễn ra ở nơi tăm tối, hôi hám nhất, đảo lộn hoàn toàn vị thế quyền lực.'
  },
  {
    id: 'van-03',
    subject: 'van',
    topic: 'Đây thôn Vĩ Dạ - Hàn Mặc Tử',
    difficulty: 'basic',
    question: 'Câu thơ mở đầu tác phẩm Đây thôn Vĩ Dạ: "Sao anh không về chơi thôn Vĩ?" mang giọng điệu gì?',
    options: [
      'Lời mời gọi tha thiết vừa có sắc thái hờn trách nhẹ nhàng, vừa là nỗi tiếc nuối tự vấn',
      'Lời trách móc giận dữ của người con gái xứ Huế',
      'Lời giục giã trở về quê hương lập nghiệp',
      'Lời hỏi han tình cờ của một người quen qua đường'
    ],
    correctIndex: 0,
    explanation: 'Câu thơ là câu hỏi tu từ mang sắc thái đa thanh: vừa như lời mời mọc ân cần, kín đáo của người thôn Vĩ, vừa như lời tự trách thầm thì, tiếc nuối khôn nguôi của chính thi nhân.',
    hint: 'Đây là câu hỏi tu từ kín đáo, dịu ngọt mang nét đặc trưng của tâm hồn người Huế.'
  },
  {
    id: 'van-04',
    subject: 'van',
    topic: 'Vội vàng - Xuân Diệu',
    difficulty: 'medium',
    question: 'Trong bài thơ "Vội vàng", Xuân Diệu đo đếm thời gian theo quan niệm hiện đại như thế nào?',
    options: [
      'Thời gian tuyến tính một đi không trở lại, gắn liền với tuổi trẻ ngắn ngủi của đời người',
      'Thời gian tuần hoàn bất tận theo bốn mùa xuân - hạ - thu - đông',
      'Thời gian vô nghĩa, hư ảo không cần bận tâm',
      'Thời gian thuộc về cõi vĩnh hằng bất biến của trời đất'
    ],
    correctIndex: 0,
    explanation: 'Khác với quan niệm tuần hoàn của người xưa, Xuân Diệu cảm nhận thời gian theo chiều tuyến tính một chiều: "Lòng tôi rộng nhưng lượng trời cứ chật / Không cho dài thời trẻ của nhân gian".',
    hint: 'Mỗi phút giây trôi qua là tuổi trẻ mất đi, thôi thúc thi nhân phải sống cuống quýt, vội vàng.'
  },
  {
    id: 'van-05',
    subject: 'van',
    topic: 'Tràng giang - Huy Cận',
    difficulty: 'medium',
    question: 'Hai câu thơ: "Lòng quê dợn dợn vời con nước / Không khói hoàng hôn cũng nhớ nhà" gợi nhớ đến ý thơ của thi nhân cổ điển nào?',
    options: ['Thôi Hiệu trong bài "Hoàng Hạc Lâu"', 'Lý Bạch trong "Tĩnh dạ tứ"', 'Đỗ Phủ trong "Đăng cao"', 'Bạch Cư Dị trong "Tỳ bà hành"'],
    correctIndex: 0,
    explanation: 'Thơ Thôi Hiệu: "Nhật mộ hương quan hà xứ thị? / Yên ba giang thượng sử nhân sầu" (Khói sóng trên sông khiến nhớ nhà). Huy Cận kế thừa nhưng đẩy lên tầm cao mới: không cần khói hoàng hôn mà nỗi nhớ quê hương vẫn dâng trào da diết.',
    hint: 'Nhà thơ thời Đường gắn liền với địa danh Lầu Hoàng Hạc và câu "Yên ba giang thượng sử nhân sầu".'
  },
  {
    id: 'van-06',
    subject: 'van',
    topic: 'Người trong bao - Sê-khốp',
    difficulty: 'hard',
    question: 'Hình tượng nhân vật Bê-li-cốp trong truyện ngắn "Người trong bao" biểu trưng cho:',
    options: [
      'Kiểu người hèn nhát, sợ hãi thực tại, tự giam mình trong những quy tắc bảo thủ của xã hội Nga chuyên chế',
      'Người trí thức tiến bộ đang kiên trì đấu tranh cho tự do',
      'Mẫu người nông dân chất phác bị tha hóa bởi đồng tiền',
      'Người quân nhân kỷ luật mẫu mực trung thành với Sa hoàng'
    ],
    correctIndex: 0,
    explanation: 'Bê-li-cốp luôn mang ô, đi giày cao su, đeo kính râm, sợ hãi cuộc sống và luôn lẩm bẩm "nhỡ lại xảy ra chuyện gì thì sao", là biểu tượng sinh động cho lối sống thu mình trong bao của một bộ phận trí thức Nga cuối thế kỉ XIX.',
    hint: 'Nhân vật lúc nào cũng giấu mình trong các lớp vỏ bọc và luôn sợ "nhỡ lại xảy ra chuyện gì".'
  },

  // ================= TIẾNG ANH 11 =================
  {
    id: 'anh-01',
    subject: 'anh',
    topic: 'Conditional Sentences',
    difficulty: 'basic',
    question: 'Choose the correct form: "If I _______ earlier, I wouldn\'t have missed the morning train."',
    options: [
      'had woken up',
      'woke up',
      'have woken up',
      'would wake up'
    ],
    correctIndex: 0,
    explanation: 'Đây là câu điều kiện loại 3 (diễn tả sự việc trái với quá khứ). Cấu trúc: If + S + had + V3/ed, S + would/could + have + V3/ed.',
    hint: 'Mệnh đề chính dùng "wouldn\'t have missed" -> Mệnh đề IF phải ở thì Quá khứ hoàn thành.'
  },
  {
    id: 'anh-02',
    subject: 'anh',
    topic: 'Relative Clauses',
    difficulty: 'medium',
    question: 'Fill in the blank: "The scientist _______ theory revolutionized modern physics was born in Germany."',
    options: ['whose', 'whom', 'which', 'who'],
    correctIndex: 0,
    explanation: 'Dùng đại từ quan hệ sở hữu "whose" để thay thế cho danh từ chỉ người sở hữu (the scientist\'s theory).',
    hint: 'Từ đứng sau chỗ trống là danh từ "theory" thuộc quyền sở hữu của "The scientist".'
  },
  {
    id: 'anh-03',
    subject: 'anh',
    topic: 'Participle Clauses',
    difficulty: 'hard',
    question: 'Reduce the clause: "Because he had finished all his homework, he went out to play football."',
    options: [
      'Having finished all his homework, he went out to play football.',
      'Finishing all his homework, he went out to play football.',
      'Finished all his homework, he went out to play football.',
      'To finish all his homework, he went out to play football.'
    ],
    correctIndex: 0,
    explanation: 'Hành động "làm xong bài tập" hoàn thành trước hành động "đi đá bóng" trong quá khứ nên rút gọn bằng hoàn thành phân từ (Perfect Participle): "Having + V3/ed".',
    hint: 'Hành động xảy ra trước hành động trong quá khứ -> dùng Having + Past Participle.'
  },
  {
    id: 'anh-04',
    subject: 'anh',
    topic: 'Vocabulary - Global Warming',
    difficulty: 'medium',
    question: 'What is the term for gases such as carbon dioxide and methane that trap heat in the atmosphere?',
    options: [
      'Greenhouse gases',
      'Fossil minerals',
      'Renewable emissions',
      'Ozone filters'
    ],
    correctIndex: 0,
    explanation: '"Greenhouse gases" (khí nhà kính) là các chất khí giữ nhiệt trong khí quyển gây ra hiệu ứng nhà kính và biến đổi khí hậu toàn cầu.',
    hint: 'Thuật ngữ liên quan đến "hiệu ứng nhà kính" (greenhouse effect).'
  },
  {
    id: 'anh-05',
    subject: 'anh',
    topic: 'Modal Verbs',
    difficulty: 'medium',
    question: 'Identify the sentence expressing a logical deduction about a past event:',
    options: [
      'He must have been very tired after walking 20 kilometers.',
      'He should do his homework immediately.',
      'You can borrow my pen if you need one.',
      'She will probably visit us next Sunday.'
    ],
    correctIndex: 0,
    explanation: '"must have + V3/ed" dùng để suy đoán chắc chắn về một sự việc xảy ra trong quá khứ dựa trên bằng chứng rõ ràng.',
    hint: 'Cấu trúc "must have + V3/ed" biểu thị suy đoán logic về sự việc trong quá khứ.'
  },
  {
    id: 'anh-06',
    subject: 'anh',
    topic: 'Gerunds vs Infinitives',
    difficulty: 'basic',
    question: 'Complete the sentence: "She avoided _______ about the stressful examination results."',
    options: ['talking', 'to talk', 'talk', 'talked'],
    correctIndex: 0,
    explanation: 'Động từ "avoid" luôn đi kèm với Danh động từ (Gerund: V-ing): avoid doing something (tránh làm gì).',
    hint: 'Sau động từ "avoid" là dạng V-ing.'
  },

  // ================= VẬT LÍ 11 =================
  {
    id: 'ly-01',
    subject: 'ly',
    topic: 'Dao động điều hòa',
    difficulty: 'basic',
    question: 'Phương trình dao động điều hòa của một vật là x = 5 cos(4πt + π/3) (cm). Tần số góc ω của dao động là:',
    options: ['4π rad/s', '2π rad/s', '5 rad/s', '2 Hz'],
    correctIndex: 0,
    explanation: 'Phương trình chuẩn x = A cos(ωt + φ). So sánh phương trình, ta có A = 5 cm, tần số góc ω = 4π rad/s, pha ban đầu φ = π/3 rad.',
    hint: 'Hệ số đứng trước biến t trong hàm cos chính là tần số góc ω.'
  },
  {
    id: 'ly-02',
    subject: 'ly',
    topic: 'Con lắc lò xo',
    difficulty: 'medium',
    question: 'Một con lắc lò xo có độ cứng k = 100 N/m mang vật nặng khối lượng m = 0,25 kg. Chu kì dao động riêng T là (lấy π² = 10):',
    options: ['0,314 s (hoặc 0,1π s)', '0,628 s', '1,57 s', '2,0 s'],
    correctIndex: 0,
    explanation: 'Công thức chu kì con lắc lò xo: T = 2π√(m/k) = 2π√(0,25/100) = 2π × (0,5/10) = 0,1π ≈ 0,314 s.',
    hint: 'Dùng công thức T = 2π√(m/k).'
  },
  {
    id: 'ly-03',
    subject: 'ly',
    topic: 'Sóng cơ học',
    difficulty: 'basic',
    question: 'Một sóng cơ lan truyền với tần số f = 50 Hz và vận tốc v = 20 m/s. Bước sóng λ của sóng đó bằng:',
    options: ['0,4 m', '2,5 m', '1000 m', '20 m'],
    correctIndex: 0,
    explanation: 'Bước sóng là quãng đường sóng truyền trong một chu kì: λ = v/f = 20/50 = 0,4 m = 40 cm.',
    hint: 'Sử dụng công thức liên hệ giữa bước sóng, vận tốc và tần số: λ = v / f.'
  },
  {
    id: 'ly-04',
    subject: 'ly',
    topic: 'Điện trường',
    difficulty: 'medium',
    question: 'Đơn vị đo cường độ điện trường trong hệ SI là:',
    options: ['V/m (Vôn trên mét)', 'N/m (Niu-tơn trên mét)', 'C/m (Cu-lông trên mét)', 'J (Jun)'],
    correctIndex: 0,
    explanation: 'Cường độ điện trường E = U/d hoặc E = F/q, có đơn vị là Vôn trên mét (V/m) hoặc N/C.',
    hint: 'Liên hệ giữa hiệu điện thế U và khoảng cách d: U = E.d.'
  },
  {
    id: 'ly-05',
    subject: 'ly',
    topic: 'Sóng dừng',
    difficulty: 'hard',
    question: 'Trên một sợi dây đàn hồi dài L có hai đầu cố định đang có sóng dừng với 4 bụng sóng. Chiều dài dây liên hệ với bước sóng λ theo công thức:',
    options: ['L = 2λ', 'L = 4λ', 'L = 1,5λ', 'L = 0,5λ'],
    correctIndex: 0,
    explanation: 'Điều kiện sóng dừng trên dây hai đầu cố định: L = k(λ/2) với k là số bó sóng (số bụng sóng). Với k = 4 bụng sóng: L = 4(λ/2) = 2λ.',
    hint: 'Mỗi bó sóng tương ứng nửa bước sóng (λ/2). Với 4 bụng thì có 4 bó sóng.'
  },
  {
    id: 'ly-06',
    subject: 'ly',
    topic: 'Định luật Ôm mạch kín',
    difficulty: 'medium',
    question: 'Một nguồn điện có suất điện động E = 12 V, điện trở trong r = 1 Ω mắc với điện trở mạch ngoài R = 5 Ω. Cường độ dòng điện trong mạch là:',
    options: ['2 A', '2,4 A', '12 A', '1,71 A'],
    correctIndex: 0,
    explanation: 'Theo định luật Ôm toàn mạch: I = E / (R + r) = 12 / (5 + 1) = 12 / 6 = 2 A.',
    hint: 'Áp dụng công thức I = E / (R_ngoài + r_trong).'
  },

  // ================= ĐỊA LÍ 11 =================
  {
    id: 'dia-01',
    subject: 'dia',
    topic: 'Hợp chúng quốc Hoa Kỳ',
    difficulty: 'basic',
    question: 'Vùng lãnh thổ phía Tây (Cooc-đi-e) của phần lãnh thổ Hoa Kỳ ở trung tâm Bắc Mĩ có đặc điểm địa hình chủ yếu là:',
    options: [
      'Gồm các dãy núi trẻ cao, hiểm trở đồ sộ chạy song song hướng Bắc - Nam xen kẽ các bồn địa và cao nguyên',
      'Đồng bằng phù sa màu mỡ trải dài phẳng lặng',
      'Đồi núi già thấp bị bào mòn lâu đời với thung lũng rộng',
      'Vùng đầm lầy trũng thấp ven biển nhiệt đới'
    ],
    correctIndex: 0,
    explanation: 'Vùng núi Cooc-đi-e ở phía Tây Hoa Kỳ là hệ thống núi trẻ cao trung bình trên 2000m, hiểm trở, gồm các dãy ven Thái Bình Dương xen kẽ các bồn địa và cao nguyên khô hạn.',
    hint: 'Hệ thống núi trẻ đồ sộ bậc nhất Bắc Mĩ chạy dọc bờ biển Thái Bình Dương.'
  },
  {
    id: 'dia-02',
    subject: 'dia',
    topic: 'Nhật Bản',
    difficulty: 'medium',
    question: 'Đặc điểm tự nhiên nổi bật gây nhiều khó khăn lớn nhất cho sản xuất và sinh hoạt của Nhật Bản là:',
    options: [
      'Nghèo tài nguyên khoáng sản và thường xuyên chịu ảnh hưởng nặng nề của động đất, núi lửa, sóng thần',
      'Khí hậu khô hạn sa mạc hóa khắc nghiệt quanh năm',
      'Mạng lưới sông ngòi quá dài nhưng thường xuyên cạn kiệt đáy',
      'Đồng bằng quá rộng lớn chiếm 80% diện tích làm ngập úng'
    ],
    correctIndex: 0,
    explanation: 'Nhật Bản nằm trên "Vành đai lửa Thái Bình Dương", địa hình 80% là đồi núi, nghèo khoáng sản, bình quân mỗi năm có hàng nghìn trận động đất lớn nhỏ kèm sóng thần và núi lửa.',
    hint: 'Nhật Bản nằm trên Vành đai lửa Thái Bình Dương và thiếu nguyên liệu tự nhiên cho công nghiệp.'
  },
  {
    id: 'dia-03',
    subject: 'dia',
    topic: 'Liên bang Nga',
    difficulty: 'basic',
    question: 'Dãy núi nào được coi là ranh giới tự nhiên phân chia phần lãnh thổ phía Tây và phía Đông của Liên bang Nga?',
    options: ['Dãy U-ran', 'Dãy Cáp-ca', 'Dãy An-tai', 'Dãy Xai-an'],
    correctIndex: 0,
    explanation: 'Dãy U-ran là dãy núi già cổ xưa, chạy dài theo hướng bắc - nam, là ranh giới tự nhiên phân chia đồng bằng Đông Âu (phía Tây) và vùng Tây Xi-bia rộng lớn (phía Đông).',
    hint: 'Dãy núi già giàu khoáng sản phân chia châu Âu và châu Á trên lãnh thổ Nga.'
  },
  {
    id: 'dia-04',
    subject: 'dia',
    topic: 'Liên minh châu Âu (EU)',
    difficulty: 'medium',
    question: 'Bốn mặt tự do lưu thông then chốt của thị trường chung châu Âu (EU) bao gồm:',
    options: [
      'Tự do di chuyển con người, hàng hóa, dịch vụ và tiền vốn',
      'Tự do quân sự, chính trị, ngoại giao và giáo dục',
      'Tự do văn hóa, tôn giáo, ngôn ngữ và thể thao',
      'Tự do khai thác tài nguyên, bảo hiểm, y tế và bầu cử'
    ],
    correctIndex: 0,
    explanation: 'Thị trường chung châu Âu dựa trên 4 trụ cột tự do căn bản: Tự do di chuyển (người), tự do lưu thông hàng hóa, tự do dịch vụ và tự do lưu chuyển tiền vốn.',
    hint: 'Nhớ cụm từ: Người, Hàng, Dịch vụ, Tiền vốn.'
  },
  {
    id: 'dia-05',
    subject: 'dia',
    topic: 'Khu vực Đông Nam Á (ASEAN)',
    difficulty: 'medium',
    question: 'Cây công nghiệp lâu năm được trồng phổ biến nhất ở khu vực Đông Nam Á nhờ khí hậu nhiệt đới ẩm gió mùa là:',
    options: [
      'Cao su, cà phê, cọ dầu, hồ tiêu',
      'Lúa mì, củ cải đường, nho, ô liu',
      'Bông, đậu tương, ngô ôn đới',
      'Chà là, dừa xiêm sa mạc, lúa mạch'
    ],
    correctIndex: 0,
    explanation: 'Đông Nam Á có khí hậu nhiệt đới ẩm gió mùa, đất đỏ badan màu mỡ rất thuận lợi cho các cây công nghiệp nhiệt đới có giá trị xuất khẩu lớn: cao su, cà phê, cọ dầu, tiêu.',
    hint: 'Những cây ưa khí hậu nóng ẩm, đất đỏ badan màu mỡ.'
  },
  {
    id: 'dia-06',
    subject: 'dia',
    topic: 'Cộng hòa Nhân dân Trung Hoa',
    difficulty: 'hard',
    question: 'Sự phân hóa lãnh thổ kinh tế Trung Quốc thể hiện rõ rệt nhất ở điểm nào?',
    options: [
      'Miền Đông phát triển kinh tế vượt trội, tập trung phần lớn các đặc khu kinh tế, đô thị và khu chế xuất so với miền Tây',
      'Miền Tây phát triển công nghiệp nặng và cảng biển sầm uất hơn miền Đông',
      'Kinh tế phân bố đồng đều hoàn hảo giữa miền Đông và miền Tây',
      'Miền Bắc phát triển dịch vụ tài chính, miền Nam chỉ thuần nông nghiệp tự cấp'
    ],
    correctIndex: 0,
    explanation: 'Miền Đông Trung Quốc có vị trí giáp biển, đồng bằng phì nhiêu, giao thông thuận lợi, chính sách mở cửa ưu tiên lập các đặc khu (Thâm Quyến, Chu Hải...) nên chiếm tỉ trọng áp đảo trong GDP cả nước.',
    hint: 'Vùng ven biển giáp Thái Bình Dương với các thành phố Thượng Hải, Thâm Quyến, Bắc Kinh.'
  },

  // ================= LỊCH SỬ 11 =================
  {
    id: 'su-01',
    subject: 'su',
    topic: 'Cách mạng tư sản',
    difficulty: 'basic',
    question: 'Tuyên ngôn Độc lập năm 1776 của Hợp chúng quốc Hoa Kỳ do ai soạn thảo chủ yếu?',
    options: ['Thomas Jefferson', 'George Washington', 'Benjamin Franklin', 'Abraham Lincoln'],
    correctIndex: 0,
    explanation: 'Thomas Jefferson là người chấp bút chính bản Tuyên ngôn Độc lập nước Mĩ được Đại hội 13 thuộc địa thông qua ngày 4-7-1776, khẳng định quyền bình đẳng và quyền mưu cầu hạnh phúc.',
    hint: 'Vị tổng thống thứ 3 của Hoa Kỳ, người có tư tưởng dân chủ khai sáng sâu sắc.'
  },
  {
    id: 'su-02',
    subject: 'su',
    topic: 'Liên Xô (1918 - 1945)',
    difficulty: 'medium',
    question: 'Chính sách kinh tế mới (NEP) được V.I. Lê-nin đề xướng và thông qua vào năm 1921 ở nước Nga Xô Viết nhằm mục đích chủ yếu là gì?',
    options: [
      'Khôi phục kinh tế bị tàn phá sau chiến tranh và xây dựng cơ sở bước đầu cho CNXH',
      'Tập trung toàn bộ của cải để cung cấp cho cuộc nội chiến chống ngoại bang',
      'Xóa bỏ hoàn toàn kinh tế tư nhân và thị trường tự do ngay lập tức',
      'Kêu gọi các nước đế quốc phương Tây sang cai quản nông nghiệp'
    ],
    correctIndex: 0,
    explanation: 'Chính sách kinh tế mới (NEP) thay thế cho chính sách Cộng sản thời chiến, cho phép tự do buôn bán nhỏ, thay chế độ trưng thu lương thực thừa bằng thuế lương thực, giúp hồi sinh nền kinh tế sau nội chiến.',
    hint: 'Thay thế cho chính sách Cộng sản thời chiến bằng cách sử dụng quan hệ hàng hóa - tiền tệ để khôi phục kinh tế.'
  },
  {
    id: 'su-03',
    subject: 'su',
    topic: 'Chiến tranh thế giới thứ hai (1939 - 1945)',
    difficulty: 'medium',
    question: 'Trận đánh nào được coi là bước ngoặt quyết định làm thay đổi cục diện Chiến tranh thế giới thứ hai, bắt đầu giai đoạn Hồng quân Liên Xô phản công tiêu diệt phát xít?',
    options: [
      'Trận phản công bảo vệ thành phố Xta-lin-grát (1942 - 1943)',
      'Trận đột kích Trân Châu Cảng (1941)',
      'Cuộc đổ bộ Noóc-măng-đi của quân Đồng minh (1944)',
      'Trận Mạc-tư-khoa (1941)'
    ],
    correctIndex: 0,
    explanation: 'Chiến thắng Xta-lin-grát đã đập tan tập đoàn quân số 6 thiện chiến của Đức, xoay chuyển hoàn toàn cục diện chiến tranh từ thế phòng ngự sang thế tổng phản công chiến lược của phe Đồng minh.',
    hint: 'Trận đánh mang tên vị lãnh tụ Liên Xô bên bờ sông Vôn-ga.'
  },
  {
    id: 'su-04',
    subject: 'su',
    topic: 'Phong trào Cần Vương ở Việt Nam',
    difficulty: 'basic',
    question: 'Chiếu Cần Vương kêu gọi văn thân, sĩ phu và nhân dân cả nước đứng lên phò vua giúp nước đánh giặc Pháp được ban bố dưới danh nghĩa của vị vua yêu nước nào?',
    options: ['Vua Hàm Nghi', 'Vua Duy Tân', 'Vua Thành Thái', 'Vua Đồng Khánh'],
    correctIndex: 0,
    explanation: 'Đêm ngày 4 rạng sáng 5-7-1885, Tôn Thất Thuyết tổ chức cuộc phản công quân Pháp tại kinh thành Huế. Sau đó đưa vua Hàm Nghi lên sơn phòng Tân Sở (Quảng Trị) và hạ Chiếu Cần Vương.',
    hint: 'Vị vua trẻ tuổi được Tôn Thất Thuyết phò tá lên căn cứ Tân Sở (Quảng Trị).'
  },
  {
    id: 'su-05',
    subject: 'su',
    topic: 'Cách mạng tháng Tám 1945',
    difficulty: 'medium',
    question: 'Hội nghị toàn quốc của Đảng họp tại Tân Trào (Tuyên Quang) từ ngày 14 đến 15-8-1945 đã đưa ra quyết định lịch sử nào?',
    options: [
      'Phát động toàn dân tiến hành Tổng khởi nghĩa giành chính quyền trên phạm vi cả nước',
      'Thành lập Mặt trận Việt Minh',
      'Ký Hiệp định Sơ bộ với thực dân Pháp',
      'Phát động phong trào Đông Du sang Nhật Bản học tập'
    ],
    correctIndex: 0,
    explanation: 'Khi nhận được tin Nhật Bản đầu hàng Đồng minh không điều kiện, Hội nghị toàn quốc họp tại Tân Trào đã kịp thời ra quyết định phát động Tổng khởi nghĩa trước khi quân Đồng minh vào Đông Dương.',
    hint: 'Thời cơ "ngàn năm có một" xuất hiện khi phát xít Nhật đầu hàng Đồng minh.'
  },
  {
    id: 'su-06',
    subject: 'su',
    topic: 'Khởi nghĩa Hương Khê (1885 - 1896)',
    difficulty: 'hard',
    question: 'Khởi nghĩa Hương Khê trong phong trào Cần Vương do ai lãnh đạo và được đánh giá là đỉnh cao nhất vì lý do gì?',
    options: [
      'Phan Đình Phùng lãnh đạo; có quy mô rộng lớn, tổ chức chặt chẽ, chế tạo được súng trường kiểu Pháp',
      'Đề Thám lãnh đạo; hoạt động du kích kiên cường tại căn cứ Yên Thế',
      'Nguyễn Thiện Thuật lãnh đạo; chiến đấu giỏi ở vùng lau sậy Bãi Sậy',
      'Tôn Thất Thuyết trực tiếp chỉ huy; giành lại toàn bộ kinh thành Huế'
    ],
    correctIndex: 0,
    explanation: 'Khởi nghĩa Hương Khê do Phan Đình Phùng và Cao Thắng lãnh đạo kéo dài hơn 10 năm, địa bàn qua 4 tỉnh (Thanh Hóa, Nghệ An, Hà Tĩnh, Quảng Bình), có vũ khí tự chế tạo tinh xảo theo mẫu súng Pháp 1874.',
    hint: 'Gắn liền với tên tuổi nhà nho Phan Đình Phùng và tướng tài Cao Thắng.'
  }
];

export function getRandomQuestions(count: number, subject?: SubjectId): Question[] {
  let pool = subject
    ? GRADE_11_QUESTION_BANK.filter(q => q.subject === subject)
    : [...GRADE_11_QUESTION_BANK];

  if (pool.length === 0) pool = [...GRADE_11_QUESTION_BANK];

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
