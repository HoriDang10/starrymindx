"use client";

import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative w-screen h-screen flex flex-col items-center justify-center text-center overflow-hidden">
      {/* 🎬 Video background */}
      <video
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* 🌌 Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10" />

      {/* ✨ Content */}
      <div className="relative z-20 text-yellow-300 px-4 mt-20 md:mt-0">
        <h2 className="text-sm uppercase tracking-widest mb-3 text-yellow-200/80">
          Một sản phẩm đến từ Team MindX Đồng Nai
        </h2>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-wider drop-shadow-[0_4px_10px_rgba(255,255,0,0.6)]">
          STARRY MIND
        </h1>

        <p className="max-w-3xl mx-auto text-gray-100 leading-relaxed mb-10">
          Khi tâm trí cuộn xoáy như bầu trời đêm của Van Gogh, hãy để ánh sáng trong bạn tự về nơi bình minh.{" "}
          <span className="italic text-yellow-200">Starry Mind</span> là nơi tâm hồn được lắng nghe — một không gian giao hòa giữa{" "}
          <span className="font-semibold">nghệ thuật</span>,{" "}
          <span className="font-semibold">cảm xúc</span> và{" "}
          <span className="font-semibold">công nghệ AI</span>.
        </p>

        <button
          onClick={() => router.push("/paintSelector")}
          className="px-6 py-3 rounded-full bg-yellow-300 text-black font-semibold shadow-md hover:bg-yellow-400 transition"
        >
          Tìm hiểu thêm
        </button>
      </div>
    </section>
  );
}
