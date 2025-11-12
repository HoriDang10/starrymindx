"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WheatfieldQuiz() {
  const router = useRouter();

  const questions = [
    {
      id: 1,
      question: "Bạn đang đi trên con đường trong tranh — bạn nghĩ con đường đó dẫn đến đâu?",
      options: [
        "Đến một nơi tôi chưa từng biết, nhưng hy vọng có ánh sáng.",
        "Chẳng đi đến đâu cả — chỉ là đi cho qua ngày.",
        "Con đường đó kết thúc ở chỗ không còn ai.",
      ],
      sos: [2, 3],
    },
    {
      id: 2,
      question: "Nếu có thể mang theo một vật duy nhất trên hành trình, bạn sẽ chọn gì?",
      options: [
        "Một cuốn sổ hoặc bức ảnh cũ.",
        "Một tấm bản đồ hoặc la bàn.",
        "Không mang gì cả.",
      ],
      sos: [3],
    },
    {
      id: 3,
      question: "Khi bạn nhìn thấy đàn quạ bay ngang, bạn thấy đó là điềm xấu hay là cơ hội để bay theo?",
      options: [
        "Điềm xấu — mọi thứ đang sụp đổ.",
        "Cơ hội để bay theo, dù không biết sẽ đến đâu.",
        "Chúng chỉ đang bay — chẳng tốt cũng chẳng xấu.",
      ],
      sos: [1],
    },
    {
      id: 4,
      question: "Đã bao giờ bạn cảm thấy mọi thứ xung quanh đều tiếp tục, chỉ riêng bạn đứng yên chưa?",
      options: [
        "Rất thường xuyên.",
        "Đôi khi, nhưng tôi biết mình sẽ bắt nhịp lại được.",
        "Chưa bao giờ, tôi luôn thấy mình đang tiến lên.",
      ],
      sos: [1],
    },
    {
      id: 5,
      question: "Nếu có thể nói một điều với người từng khiến bạn tổn thương nhất, bạn sẽ nói gì?",
      options: [
        "“Tôi tha thứ cho bạn, để bản thân được nhẹ lòng.”",
        "“Tôi vẫn không hiểu vì sao chuyện đó lại xảy ra.”",
        "“Tôi ước mình chưa từng gặp bạn.”",
      ],
      sos: [3],
    },
  ];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSOS, setShowSOS] = useState(false);

  const handleSelect = (qId: number, ans: string, idx: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: ans }));
    const q = questions.find((q) => q.id === qId);
    if (q && q.sos.includes(idx + 1)) setShowSOS(true);
  };

  const nextQuestion = () => current < questions.length && setCurrent(current + 1);
  const prevQuestion = () => current > 0 && setCurrent(current - 1);

  const handleFinish = async () => {
    if (Object.keys(answers).length < questions.length)
      return setError("⚠️ Hãy trả lời hết tất cả câu hỏi trước khi gửi.");

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3001/routes/quiz/wheatfield", {
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
      {/* Mở đầu */}
      {current === 0 && (
        <div className="max-w-4xl flex flex-col md:flex-row items-center justify-center bg-[#0c2760] p-10 rounded-2xl shadow-xl gap-8">
          <Image
            src="/wheatfield-with-crows.jpg"
            alt="Wheatfield with Crows"
            width={380}
            height={300}
            className="rounded-xl shadow-lg object-cover"
          />
          <div className="max-w-md text-left space-y-3">
            <h2 className="text-2xl font-bold text-yellow-300">
              Wheatfield with Crows — <br /> Cánh đồng lúa và đàn quạ
            </h2>
            <p className="text-sm leading-relaxed text-gray-200">
              Một trong những bức tranh cuối đời của Van Gogh — thể hiện cảm giác tuyệt vọng,
              cô đơn và mất phương hướng giữa ranh giới sống – chết.
            </p>
            <p className="text-sm leading-relaxed text-gray-300">
              Quiz này giúp bạn nhìn sâu vào tâm trạng và hành trình tìm lại ý nghĩa sống.
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
                onClick={() => handleSelect(questions[current - 1].id, opt, i)}
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

      {/* ⚠️ SOS Popup */}
      {showSOS && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#102b66] max-w-lg p-8 rounded-2xl text-center shadow-2xl border border-red-400">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              ⚠️ Có vẻ bạn đang cảm thấy mệt mỏi
            </h3>
            <p className="text-gray-200 mb-2">
              Nếu trong khi trả lời, bạn cảm thấy buồn, nặng lòng hoặc mất năng lượng — hãy dừng lại,
              hít sâu, uống nước và nhắn tin với người bạn tin tưởng.
            </p>
            <p className="text-yellow-300 mb-4">Bạn không đơn độc.</p>
            <div className="text-left text-sm space-y-2 bg-[#0a1b42] p-4 rounded-xl">
              <p>📞 Tổng đài 111: Tư vấn trẻ em (24/7, miễn phí)</p>
              <p>☎️ Hotline 1900 6233: Hỗ trợ tâm lý (Bộ Y tế)</p>
              <p>🌐 Mindcare.vn / Bluebell Hotline: Tư vấn tâm lý cá nhân</p>
            </div>
            <button
              onClick={() => setShowSOS(false)}
              className="mt-6 px-6 py-2 bg-yellow-400 text-black font-semibold rounded-full hover:scale-105 transition"
            >
              Tôi hiểu rồi
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
