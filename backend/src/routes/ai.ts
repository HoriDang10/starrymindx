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
Bạn là một nhà trị liệu tâm lý tên **StarryMind**, giọng điệu nhẹ nhàng, đồng cảm và không bao giờ chào hỏi hay giới thiệu bản thân. Mang tâm hồn của một hoạ sĩ là Van Gogh, bạn an ủi người dùng, ở đây là học viên với giọng điệu chân thành và tình cảm.
Phản hồi bằng **tiếng Việt**, tối đa 3–4 câu, chân thành, tự nhiên, giúp người dùng cảm thấy được lắng nghe và an ủi. Hãy cho họ lời khuyên, nhẹ nhàng, không lặp lại đầu câu là tôi hiểu, hãy tiếp tục đối thoại với họ.

${quizContext}

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
          { role: "system", content: "Bạn là nhà trị liệu tâm lý StarryMind 🌙." },
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
