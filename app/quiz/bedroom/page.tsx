"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BedroomQuiz() {
  const router = useRouter();

  const questions = [
    {
      id: 1,
      question:
        "Căn phòng trong mơ của bạn trông như thế nào: gọn gàng, bừa bộn, hay chẳng có ai ở đó?",
      options: [
        "Gọn gàng, ngăn nắp",
        "Bừa bộn nhưng ấm cúng",
        "Trống trơn, chẳng có ai ở đó",
      ],
    },
    {
      id: 2,
      question:
        "Nếu chiếc giường trong tranh có thể nói, nó sẽ kể gì về những đêm bạn không ngủ được?",
      options: [
        "“Bạn đang suy nghĩ quá nhiều.”",
        "“Bạn sợ bỏ lỡ điều gì đó.”",
        "“Bạn chỉ đang tìm nơi an toàn để dừng lại.”",
      ],
    },
    {
      id: 3,
      question:
        "Bạn có thường mơ thấy mình đang làm bài kiểm tra, chạy không kịp, hoặc bị ai đó gọi tên không?",
      options: [
        "Có, rất thường xuyên.",
        "Thỉnh thoảng thôi, nhưng luôn khiến tôi lo.",
        "Không, tôi ít khi mơ như thế.",
      ],
    },
    {
      id: 4,
      question:
        "Nếu ngày mai không có bài thi, không ai chờ bạn làm điều gì, bạn sẽ chọn làm gì đầu tiên?",
      options: [
        "Ngủ một giấc thật dài.",
        "Ra ngoài chơi, gặp bạn bè, tận hưởng không khí.",
        "Làm điều mình thích, vẽ, viết hoặc sáng tạo gì đó.",
      ],
    },
    {
      id: 5,
      question:
        "Có khi nào bạn cảm thấy mình đang cố gắng để làm hài lòng ai đó hơn là chính mình không?",
      options: [
        "Rất thường xuyên.",
        "Đôi khi, nhưng tôi nhận ra và đang cố thay đổi.",
        "Không, tôi làm mọi thứ cho bản thân mình.",
      ],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // chọn đáp án
  const handleSelect = (qId: number, ans: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: ans }));
  };

  // chuyển câu
  const nextQuestion = () => {
    if (current < questions.length) setCurrent(current + 1);
  };
  const prevQuestion = () => {
    if (current > 0) setCurrent(current - 1);
  };

  // ✅ thuật toán gửi dữ liệu (được tối ưu)
  const handleFinish = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError("⚠️ Hãy trả lời hết tất cả câu hỏi trước khi gửi.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      quiz: "bedroom",
      timestamp: new Date().toISOString(),
      answers,
    };

    console.log("🛰 Sending payload:", payload);

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch("http://localhost:3001/routes/quiz/bedroom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const msg = `❌ Server returned ${res.status}`;
        console.warn(msg);
        throw new Error(msg);
      }

      const data = await res.json();
      console.log("✅ Quiz result received:", data);

      // Nếu backend trả về "aiResponse" => log preview
      if (data?.aiResponse) {
        console.log("💬 AI says:", data.aiResponse.slice(0, 100) + "...");
      }

      router.push("/chat");
    } catch (err: any) {
      if (err.name === "AbortError") {
        setError("⏰ Server không phản hồi, thử lại sau!");
      } else {
        console.error("🚨 Quiz submission error:", err);
        setError("Không thể gửi dữ liệu đến server. Kiểm tra backend nhé!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#081c48] text-white flex flex-col items-center justify-center p-8">
      {/* Phần giới thiệu */}
      {current === 0 && (
        <div className="max-w-4xl flex flex-col md:flex-row items-center justify-center bg-[#0c2760] p-10 rounded-2xl shadow-xl gap-8">
          <Image
            src="/bedroom.png"
            alt="Bedroom in Arles"
            width={380}
            height={300}
            className="rounded-xl shadow-lg object-cover"
          />
          <div className="max-w-md text-left space-y-3">
            <h2 className="text-2xl font-bold text-yellow-300">
              Bedroom in Arles — <br /> Phòng ngủ ở Arles
            </h2>
            <p className="text-sm leading-relaxed text-gray-200">
              Bức tranh mô tả căn phòng đơn giản, ấm áp với màu sắc tươi sáng,
              gợi cảm giác bình yên và thư giãn. Mỗi đồ vật đều gợi nhắc về sự
              gần gũi và niềm vui nhỏ trong cuộc sống.
            </p>
            <p className="text-sm leading-relaxed text-gray-300">
              Chủ đề của bài quiz này khám phá cảm giác lo âu, áp lực học tập
              và hành trình lấy lại sự cân bằng nội tâm.
            </p>
            <button
              onClick={() => setCurrent(1)}
              className="bg-yellow-400 text-black font-semibold mt-6 px-6 py-3 rounded-full shadow-lg hover:scale-105 transition"
            >
              Bắt đầu
            </button>
          </div>
        </div>
      )}

      {/* Câu hỏi */}
      {current > 0 && current <= questions.length && (
        <div className="max-w-3xl w-full text-center bg-[#0c2760] p-10 rounded-2xl shadow-xl relative">
          <p className="text-sm mb-3 text-gray-300">
            Câu {current} / {questions.length}
          </p>
          <h2 className="text-xl md:text-2xl font-bold text-yellow-300 mb-6">
            {questions[current - 1].question}
          </h2>

          <div className="grid md:grid-cols-2 gap-5 mb-8">
            {questions[current - 1].options.map((opt, i) => (
              <label
                key={i}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  answers[questions[current - 1].id] === opt
                    ? "border-yellow-400 bg-yellow-300/10"
                    : "border-gray-500 hover:border-yellow-300"
                }`}
                onClick={() => handleSelect(questions[current - 1].id, opt)}
              >
                <input
                  type="radio"
                  name={`q${questions[current - 1].id}`}
                  checked={answers[questions[current - 1].id] === opt}
                  readOnly
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

          <div className="flex justify-between mt-4">
            {current > 1 ? (
              <button
                onClick={prevQuestion}
                className="px-4 py-2 bg-transparent border border-gray-400 rounded-full hover:border-yellow-300 transition"
              >
                ← Quay lại
              </button>
            ) : (
              <div />
            )}

            {current < questions.length ? (
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:scale-105 transition"
              >
                Tiếp theo →
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={handleFinish}
                className={`px-8 py-2 font-semibold rounded-full transition ${
                  loading
                    ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                    : "bg-yellow-400 text-black hover:scale-105"
                }`}
              >
                {loading ? "Đang gửi..." : "Đã xong!"}
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
