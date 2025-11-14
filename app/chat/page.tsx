"use client";

import { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<
    { id: number; from: "user" | "bot"; text: string }[]
  >([
    {
      id: 0,
      from: "bot",
      text: "Mình ở đây để lắng nghe bạn 💛. Hôm nay bạn cảm thấy thế nào?",
    },
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  // 🔄 Auto scroll xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // 🚀 Gửi tin nhắn đến backend
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;

    // Thêm tin nhắn người dùng
    setMessages((prev) => [...prev, { id: idRef.current++, from: "user", text }]);
    setInput("");
    setIsTyping(true);

    try {
      // 🧠 Tạo context ngắn gồm 3 cặp hội thoại gần nhất (user + bot)
      const context = messages
        .slice(-6)
        .map((m) => `${m.from === "user" ? "Người dùng" : "Bot"}: ${m.text}`);

      const res = await fetch("https://starrymindx-production.up.railway.app/routes/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, context }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      const aiReply =
        data.reply ||
        "Xin lỗi 😔, hiện tại mình chưa thể phản hồi. Hãy thử lại sau nhé.";

      // Thêm phản hồi từ bot
      setMessages((prev) => [
        ...prev,
        { id: idRef.current++, from: "bot", text: aiReply },
      ]);
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: idRef.current++,
          from: "bot",
          text: "⚠️ Lỗi kết nối máy chủ. Hãy kiểm tra lại backend (port 3001).",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[1200px] h-[640px] flex flex-col rounded-2xl border border-primary/20 shadow-xl bg-background overflow-hidden">
        {/* Header */}
        <div className="bg-primary/10 py-4 text-center text-lg font-semibold text-yellow-400">
          StarryMind Chatbot 💫
        </div>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                  msg.from === "user"
                    ? "bg-yellow-400 text-black rounded-br-none"
                    : "bg-blue-900 text-white rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {/* Typing dots */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-start"
              >
                <TypingDots />
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
        <form
          onSubmit={handleSend}
          className="border-t border-primary/30 p-4 flex items-center gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nhập cảm xúc hoặc câu hỏi của bạn..."
            className="flex-1 p-3 rounded-full bg-transparent border border-yellow-400 text-white focus:outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="bg-yellow-400 p-3 rounded-full hover:scale-105 transition-transform"
          >
            <Send className="w-5 h-5 text-black" />
          </button>
        </form>
      </div>
    </main>
  );
}

/* 🎬 Hiệu ứng 3 chấm đang gõ */
function TypingDots() {
  return (
    <div className="flex gap-1 px-4 py-2 bg-blue-900 rounded-2xl">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-yellow-400 rounded-full"
          animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
