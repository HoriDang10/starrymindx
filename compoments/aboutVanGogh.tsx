import Image from "next/image";

export default function AboutVanGogh() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-20 px-6 text-[#ffe9a3]">
      <div className="max-w-6xl w-full bg-[#102a56] rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row text-left border border-[#ffd46b]/30">
        {/* 🖼️ Ảnh Van Gogh */}
        <div className="w-full md:w-1/2">
          <Image
            src="/VanGogh.jpg"
            alt="Vincent van Gogh self portrait"
            width={600}
            height={800}
            className="object-cover w-full h-full"
            priority
          />
        </div>

        {/* 📖 Nội dung bên phải */}
        <div className="w-full md:w-1/2 flex flex-col justify-between p-8 md:p-12 space-y-6">
          <div>
            <p className="text-sm leading-relaxed text-justify">
              <span className="font-bold text-[#ffd46b]">Vincent Van Gogh</span> (1853–1890) là một trong những họa sĩ vĩ đại
              và có sức ảnh hưởng nhất trong lịch sử nghệ thuật phương Tây. Cuộc đời ông là hành trình của nỗi cô đơn,
              khát vọng tự do và đấu tranh với những cơn đau tinh thần không dứt. Dù sống trong nghèo khó và bị xem là
              “điên”, Van Gogh vẫn miệt mài vẽ – như thể từng nét cọ là cách ông giữ lại sự tỉnh táo cuối cùng cho tâm hồn mình.
            </p>

            <p className="text-sm leading-relaxed text-justify mt-4">
              Trong <span className="italic text-[#ffd46b]">“The Starry Night”</span>, bức tranh nổi tiếng nhất của ông, Van Gogh
              đã gửi gắm cả những xoáy cuộn cảm xúc tận tâm, niềm tin mong manh vào ánh sáng giữa bóng tối. Bầu trời trong tranh
              không chỉ là khung cảnh, mà là <span className="font-bold text-[#ffd46b]">
              trái tim của một con người đang khao khát được yêu thương và thấu hiểu.</span>
            </p>
          </div>

          {/* 🖼️ Tranh The Starry Night */}
          <div className="flex flex-col items-center mt-6">
            <Image
              src="/Starry_Night.jpg"
              alt="The Starry Night painting by Van Gogh"
              width={400}
              height={300}
              className="rounded-lg shadow-lg border border-[#ffd46b]/40"
            />
            <p className="text-sm italic text-[#ffe9a3]/90 mt-2">Vincent van Gogh — The Starry Night, 1889</p>
          </div>
        </div>
      </div>
    </section>
  );
}
