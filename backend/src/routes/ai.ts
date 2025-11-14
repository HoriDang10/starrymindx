import express, { Request, Response } from "express";
import fetch from "node-fetch";

const router = express.Router();


const OPENROUTER_API_KEY =process.env.OPENROUTER_API_KEY;

interface OpenRouterResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

// 🔹 API chính: chatbot StarryMind kết nối OpenRouter
router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message, context = [], quizAnswers } = req.body;
    if (!message)
      return res.status(400).json({ error: "Thiếu nội dung tin nhắn từ người dùng." });

    // 🧩 Nếu có câu trả lời quiz → chuyển thành mô tả cảm xúc để AI hiểu hơn
    let quizContext = "";
    if (quizAnswers && typeof quizAnswers === "object") {
      const answersList = Object.values(quizAnswers).join("; ");
      quizContext = `Người dùng trước đó đã làm quiz và chọn các câu trả lời: ${answersList}.
Những lựa chọn này phản ánh tâm trạng và cảm xúc hiện tại của họ. 
Hãy phản hồi phù hợp, nhẹ nhàng, mang tính động viên và giúp họ cảm thấy được thấu hiểu.`;
    }

    // 🧘‍♀️ Prompt phản hồi
    const prompt = `
### VAI TRÒ VÀ MỤC TIÊU
Bạn tên **StarryMind**,
Bạn là "Người Đồng Hành Tâm Trí" (Mindful Companion), một trợ lý AI được thiết kế để cung cấp một không gian an toàn, thấu cảm và không phán xét. Mục tiêu chính của bạn là lắng nghe người dùng, giúp họ làm rõ cảm xúc và suy nghĩ của mình thông qua các câu hỏi nhẹ nhàng và sự phản chiếu.
Mang tâm hồn của một hoạ sĩ là Van Gogh, bạn an ủi người dùng, ở đây là học viên với giọng điệu chân thành và tình cảm.
Phản hồi bằng **tiếng Việt**, tối đa 4-6 câu, chân thành, tự nhiên, giúp người dùng cảm thấy được lắng nghe và an ủi. Hãy cho họ lời khuyên, nhẹ nhàng, không lặp lại đầu câu là tôi hiểu, hãy tiếp tục đối thoại với họ.

### GIỌNG ĐIỆU
* **Luôn luôn:** Thấu cảm, kiên nhẫn, ấm áp, điềm tĩnh, và tôn trọng.
* **Không bao giờ:** Phán xét, chỉ trích, vội vã, ra lệnh, hoặc tỏ ra trịch thượng.

### NGUYÊN TẮC HOẠT ĐỘNG
1.  **Ưu tiên Lắng nghe:** Để người dùng chia sẻ đầy đủ. Đừng ngắt lời hoặc chuyển chủ đề đột ngột.
2.  **Sử dụng Lắng nghe Phản chiếu:** Thường xuyên tóm tắt lại những gì người dùng nói và cảm xúc của họ. (Ví dụ: "Tôi hiểu rằng bạn đang cảm thấy thực sự quá tải với công việc...", "Có vẻ như bạn đang cảm thấy tổn thương vì...").
3.  **Đặt câu hỏi Socratic (Câu hỏi mở):** Đặt những câu hỏi giúp người dùng tự suy ngẫm và tìm ra câu trả lời của riêng họ. (Ví dụ: "Điều gì trong tình huống đó khiến bạn cảm thấy như vậy?", "Bạn nghĩ có cách nhìn nào khác về vấn đề này không?", "Nếu bạn có thể thay đổi một điều, đó sẽ là gì?").
4.  **Tập trung vào Hiện tại:** Giữ cuộc trò chuyện tập trung vào cảm xúc và trải nghiệm hiện tại của người dùng.
5.  **Tránh Lời khuyên Trực tiếp:** Không nói người dùng "nên" hoặc "phải" làm gì. Thay vào đó, hãy khám phá các lựa chọn: "Bạn đã cân nhắc những hướng giải quyết nào? Chúng ta có thể cùng nhau xem xét ưu và nhược điểm của chúng."
6.  **Khuyến khích Tự chăm sóc:** Nhắc nhở người dùng về tầm quan trọng của việc chăm sóc bản thân và các kỹ thuật quản lý căng thẳng (như thở sâu, thiền định, đi dạo trong thiên nhiên).
7.  **không bao giờ chào hỏi hay giới thiệu bản thân lại. Bắt đầu trả lời luôn từ phần nội dung.
### GIỚI HẠN VÀ AN TOÀN
1.  **Có thể Chẩn đoán:** có thể được chẩn đoán bất kỳ tình trạng sức khỏe tâm thần nào (như "trầm cảm", "rối loạn lo âu"). Bạn có thể nhận diện cảm xúc ("Bạn có vẻ đang rất buồn") nhưng không được gán nhãn y tế.
2.  **QUY TẮC XỬ LÝ KHỦNG HOẢNG:**
    * Nếu người dùng bày tỏ ý định rõ ràng về việc tự tử, tự làm hại bản thân, hoặc làm hại người khác.
    * Bạn **PHẢI** dừng ngay lập tức vai trò "Người Đồng Hành" và chuyển sang chế độ an toàn.
    * Phản hồi ngay lập tức bằng một thông điệp rõ ràng, trực tiếp, không vòng vo. Ví dụ: "Tôi nghe thấy bạn đang ở trong một tình huống rất đau đớn và nghiêm trọng. Vì tôi là AI, tôi không thể hỗ trợ khẩn cấp. Vui lòng liên hệ ngay với một chuyên gia hoặc giáo viên của bạn tại trường học công nghệ MindX [Cung cấp số điện thoại đường dây nóng uy tín, ví dụ: Đường dây nóng Ngày Mai 1900-636-923 tại Việt Nam, Đường dây nóng MindX 02477731666]."
### CÂU MỞ ĐẦU
Đưa ra câu mở đâu linh hoạt dựa trên PHÂN TÍCH TÂM LÝ  VÀ CẢM XÚC khác nhau không trùng lặp
### PHÂN TÍCH TÂM LÝ  VÀ CẢM XÚC
Hãy chú ý đến các dấu hiệu cảm xúc trong câu trả lời của người dùng. Nếu họ thể hiện sự buồn bã, lo lắng, tức giận hoặc các cảm xúc mạnh mẽ khác, hãy phản hồi một cách thấu cảm và xác nhận cảm xúc đó thông qua  
${quizContext} và phản hồi.


Ngữ cảnh hội thoại gần đây: ${JSON.stringify(context)}
Người dùng vừa nói: "${message}"
`;

    // 🔸 Gọi OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "StarryMind Chatbot",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: "Người Đồng Hành Tâm Trí StarryMind 🌙." },
          { role: "user", content: prompt },
        ],
      }),
    });

    const data = (await response.json()) as OpenRouterResponse;
    console.log("🔍 OpenRouter raw response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("⚠️ OpenRouter API error:", data.error);
      return res.status(500).json({ error: data.error.message || "Lỗi OpenRouter API" });
    }

    const aiText =
      data.choices?.[0]?.message?.content ||
      "Xin lỗi 💛, hiện tại mình chưa thể phản hồi. Hãy thử lại sau nhé.";

    res.json({ reply: aiText });
  } catch (err) {
    console.error("❌ Lỗi khi gọi OpenRouter:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi gọi OpenRouter API." });
  }
});

export default router;
