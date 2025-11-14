"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EternityGateQuiz() {
  const router = useRouter();

  const questions = [
    {
      id: 1,
      question:
        "Nếu tâm hồn bạn là một căn phòng, hiện tại nó đang sáng đèn hay chìm trong bóng tối?",
      options: [
        "Ánh đèn vẫn sáng, dù hơi yếu.",
        "Bóng tối bao trùm, tôi không rõ ánh sáng ở đâu.",
        "Tôi chưa bật đèn, chỉ đang ngồi trong yên lặng.",
      ],
    },
    {
      id: 2,
      question:
        "Khi bạn đứng giữa một đám đông, bạn cảm thấy mình đang cùng họ — hay chỉ đang quan sát họ từ xa?",
      options: [
        "Tôi cảm thấy mình hòa cùng họ, dù không thân thiết lắm.",
        "Tôi chỉ đang đứng ngoài, như người quan sát.",
        "Tôi thấy mọi người ở đó, nhưng như một thế giới khác hẳn.",
      ],
    },
    {
      id: 3,
      question:
        "Nếu có một cánh cửa dẫn đến nơi bạn từng cảm thấy thật sự bình yên, bạn có muốn bước vào lại không — hay sợ rằng mọi thứ đã đổi khác?",
      options: [
        "Tôi sẽ bước vào ngay, chỉ để được yên bình lại.",
        "Tôi sợ rằng nơi đó không còn như xưa.",
        "Tôi sẽ gõ cửa, nhưng nếu không ai trả lời, tôi vẫn sẽ đi tiếp.",
      ],
    },
    {
      id: 4,
      question:
        "Giả sử trong lòng bạn là một dòng sông, nước đang chảy êm đềm, dâng tràn, hay đã cạn khô từ lâu?",
      options: [
        "Nước vẫn chảy, dù đôi khi đục ngầu.",
        "Nước đang dâng tràn, sắp vỡ bờ.",
        "Dòng sông đã khô, tôi chẳng còn cảm xúc gì nữa.",
      ],
    },
    {
      id: 5,
      question:
        "Khi nhìn vào cánh cổng trong tranh, bạn nghĩ điều gì đang chờ phía sau?",
      options: [
        "Một khởi đầu mới, dù còn mơ hồ.",
        "Sự tĩnh lặng mà tôi từng tìm kiếm.",
        "Không gì cả — chỉ là hư vô.",
      ],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSelect = (qId: number, ans: string) =>
    setAnswers((prev) => ({ ...prev, [qId]: ans }));

  const nextQuestion = () =>
    current < questions.length && setCurrent(current + 1);
  const prevQuestion = () =>
    current > 0 && setCurrent(current - 1);

  const handleFinish = async () => {
    if (Object.keys(answers).length < questions.length)
      return setError("⚠️ Hãy trả lời hết tất cả câu hỏi trước khi gửi.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://starrymindx-production.up.railway.app/routes/quiz/eternity-gate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      const data = await res.json();
      console.log("✅ Quiz result:", data);
      router.push("/chat");
    } catch (err) {
      console.error("🚨 Quiz submission error:", err);
      setError("Không thể gửi dữ liệu đến server. Kiểm tra backend nhé!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#081c48] text-white flex flex-col items-center justify-center p-8">
      {current === 0 && (
        <div className="max-w-4xl flex flex-col md:flex-row items-center justify-center bg-[#0c2760] p-10 rounded-2xl shadow-xl gap-8">
          <Image
            src="/At_Eternity's_Gate.jpg"
            alt="Eternity Gate"
            width={380}
            height={300}
            className="rounded-xl shadow-lg object-cover"
          />
          <div className="max-w-md text-left space-y-3">
            <h2 className="text-2xl font-bold text-yellow-300">
              Eternity’s Gate — <br /> Cánh cổng Vĩnh Hằng
            </h2>
            <p className="text-sm leading-relaxed text-gray-200">
              Bức tranh được Van Gogh vẽ trong những ngày cuối đời — một biểu tượng
              về ranh giới giữa thế giới sống và cái chết, giữa tuyệt vọng và niềm tin.
            </p>
            <p className="text-sm leading-relaxed text-gray-300">
              Quiz này khám phá cảm giác trống rỗng, cô đơn, và hành trình tìm lại ý nghĩa sống.
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
